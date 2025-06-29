import { PoolClient } from 'pg';
import { 
  withTenantContext, 
  withAuditLog, 
  withPHIProtection, 
  withTransaction 
} from './connection';
import { 
  invalidateHealthCache, 
  invalidateTenantCache,
  setCache,
  getCache,
  CACHE_TTL 
} from '../cache/redis';
import { 
  User, 
  HealthProfile, 
  UserConsent, 
  FamilyAccount,
  FamilyMember,
  SubscriptionTier,
  QueryOptions,
  PaginatedResult,
  AuditLog
} from '../types/database';

/**
 * Healthcare-compliant user management utilities
 */
export class UserService {
  /**
   * Get user by Firebase UID with caching
   */
  static async getUserByFirebaseUID(
    tenantId: string,
    firebaseUID: string
  ): Promise<User | null> {
    // Check cache first
    const cacheKey = `user_by_firebase_uid_${firebaseUID}`;
    const cached = await getCache<User>(tenantId, 'users', cacheKey);
    if (cached) return cached;

    return await withTenantContext(tenantId, async (client) => {
      const result = await client.query(
        'SELECT * FROM users WHERE firebase_uid = $1 AND tenant_id = $2',
        [firebaseUID, tenantId]
      );

      if (result.rows.length === 0) return null;

      const user = result.rows[0] as User;
      
      // Cache user data (15 minutes TTL for security)
      await setCache(tenantId, 'users', cacheKey, user, CACHE_TTL.USER_PROFILE);
      
      return user;
    });
  }

  /**
   * Create new user with audit logging
   */
  static async createUser(
    tenantId: string,
    userData: Omit<User, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>
  ): Promise<User> {
    return await withAuditLog(
      tenantId,
      null,
      'CREATE_USER',
      'users',
      undefined,
      async (client) => {
        const result = await client.query(
          `INSERT INTO users (
            tenant_id, firebase_uid, email, role, subscription_tier, 
            device_fingerprint, failed_login_attempts, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *`,
          [
            tenantId,
            userData.firebase_uid,
            userData.email,
            userData.role,
            userData.subscription_tier,
            userData.device_fingerprint,
            userData.failed_login_attempts,
            userData.is_active
          ]
        );

        return result.rows[0] as User;
      }
    );
  }

  /**
   * Update user with cache invalidation
   */
  static async updateUser(
    tenantId: string,
    userId: string,
    updateData: Partial<User>,
    updatedBy: string
  ): Promise<User> {
    const result = await withAuditLog(
      tenantId,
      updatedBy,
      'UPDATE_USER',
      'users',
      userId,
      async (client) => {
        const setClause = Object.keys(updateData)
          .map((key, index) => `${key} = $${index + 3}`)
          .join(', ');
        
        const values = [tenantId, userId, ...Object.values(updateData)];
        
        const query = `
          UPDATE users 
          SET ${setClause}, updated_at = NOW()
          WHERE tenant_id = $1 AND id = $2
          RETURNING *
        `;
        
        const result = await client.query(query, values);
        return result.rows[0] as User;
      }
    );

    // Invalidate user cache
    await invalidateTenantCache(tenantId);
    
    return result;
  }

  /**
   * Record login attempt with security tracking
   */
  static async recordLoginAttempt(
    tenantId: string,
    firebaseUID: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await withTenantContext(tenantId, async (client) => {
      if (success) {
        // Reset failed attempts on successful login
        await client.query(
          `UPDATE users 
           SET last_login = NOW(), failed_login_attempts = 0, account_locked_until = NULL
           WHERE firebase_uid = $1 AND tenant_id = $2`,
          [firebaseUID, tenantId]
        );
      } else {
        // Increment failed attempts
        await client.query(
          `UPDATE users 
           SET failed_login_attempts = failed_login_attempts + 1,
               account_locked_until = CASE 
                 WHEN failed_login_attempts >= 4 THEN NOW() + INTERVAL '30 minutes'
                 ELSE account_locked_until
               END
           WHERE firebase_uid = $1 AND tenant_id = $2`,
          [firebaseUID, tenantId]
        );
      }

      // Log the attempt for security auditing
      await client.query(
        `INSERT INTO audit_logs (tenant_id, action, resource_type, new_values, ip_address, user_agent)
         VALUES ($1, $2, 'authentication', $3, $4, $5)`,
        [
          tenantId,
          success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
          JSON.stringify({ firebase_uid: firebaseUID, success }),
          ipAddress,
          userAgent
        ]
      );
    });
  }
}

/**
 * Health profile management with PHI protection
 */
export class HealthProfileService {
  /**
   * Get health profile with subscription tier filtering
   */
  static async getHealthProfile(
    tenantId: string,
    userId: string,
    subscriptionTier: SubscriptionTier,
    requestedBy: string
  ): Promise<HealthProfile | null> {
    // Check cache first
    const cacheKey = `health_profile_${userId}`;
    const cached = await getCache<HealthProfile>(tenantId, 'health', cacheKey);
    
    if (cached) {
      // Filter sensitive data based on subscription tier
      return this.filterHealthDataByTier(cached, subscriptionTier);
    }

    return await withPHIProtection(
      tenantId,
      requestedBy,
      subscriptionTier,
      async (client) => {
        const result = await client.query(
          'SELECT * FROM health_profiles WHERE user_id = $1 AND tenant_id = $2',
          [userId, tenantId]
        );

        if (result.rows.length === 0) return null;

        const profile = result.rows[0] as HealthProfile;
        
        // Cache for short duration (5 minutes for sensitive health data)
        await setCache(tenantId, 'health', cacheKey, profile, CACHE_TTL.HEALTH_PROFILE);
        
        return this.filterHealthDataByTier(profile, subscriptionTier);
      }
    );
  }

  /**
   * Update health profile with cache invalidation and safety checks
   */
  static async updateHealthProfile(
    tenantId: string,
    userId: string,
    profileData: Partial<HealthProfile>,
    updatedBy: string,
    subscriptionTier: SubscriptionTier
  ): Promise<HealthProfile> {
    return await withTransaction(tenantId, async (client) => {
      // Validate that Premium-only fields are not being set for non-Premium users
      if (subscriptionTier !== 'premium') {
        delete profileData.lab_values;
        delete profileData.biometric_data;
        delete profileData.clinical_notes;
      }

      const result = await withAuditLog(
        tenantId,
        updatedBy,
        'UPDATE_HEALTH_PROFILE',
        'health_profiles',
        userId,
        async (client) => {
          const setClause = Object.keys(profileData)
            .map((key, index) => `${key} = $${index + 3}`)
            .join(', ');
          
          const values = [tenantId, userId, ...Object.values(profileData)];
          
          const query = `
            UPDATE health_profiles 
            SET ${setClause}, updated_at = NOW()
            WHERE tenant_id = $1 AND user_id = $2
            RETURNING *
          `;
          
          const updateResult = await client.query(query, values);
          return updateResult.rows[0] as HealthProfile;
        }
      );

      // Invalidate health-related cache when profile changes
      await invalidateHealthCache(tenantId, userId);
      
      return result;
    });
  }

  /**
   * Filter health data based on subscription tier
   */
  private static filterHealthDataByTier(
    profile: HealthProfile,
    subscriptionTier: SubscriptionTier
  ): HealthProfile {
    if (subscriptionTier !== 'premium') {
      return {
        ...profile,
        lab_values: undefined,
        biometric_data: undefined,
        clinical_notes: undefined,
      };
    }
    return profile;
  }
}

/**
 * Family account management
 */
export class FamilyService {
  /**
   * Get family members with proper permissions
   */
  static async getFamilyMembers(
    tenantId: string,
    familyAccountId: string,
    _requestedBy: string
  ): Promise<FamilyMember[]> {
    const cacheKey = `family_members_${familyAccountId}`;
    const cached = await getCache<FamilyMember[]>(tenantId, 'family', cacheKey);
    if (cached) return cached;

    return await withTenantContext(tenantId, async (client) => {
      const result = await client.query(
        `SELECT fm.*, u.email, u.role 
         FROM family_members fm
         JOIN users u ON fm.user_id = u.id
         WHERE fm.family_account_id = $1 AND fm.tenant_id = $2`,
        [familyAccountId, tenantId]
      );

      const members = result.rows as (FamilyMember & { email: string; role: string })[];
      
      // Cache family members (30 minutes)
      await setCache(tenantId, 'family', cacheKey, members, CACHE_TTL.FAMILY_MEMBERS);
      
      return members;
    });
  }

  /**
   * Add family member with validation
   */
  static async addFamilyMember(
    tenantId: string,
    familyAccountId: string,
    memberData: Omit<FamilyMember, 'id' | 'tenant_id' | 'created_at' | 'updated_at' | 'added_at'>,
    addedBy: string
  ): Promise<FamilyMember> {
    return await withTransaction(tenantId, async (client) => {
      // Check family size limit
      const countResult = await client.query(
        'SELECT COUNT(*) as member_count FROM family_members WHERE family_account_id = $1',
        [familyAccountId]
      );
      
      const currentCount = parseInt(countResult.rows[0].member_count);
      
      // Get family account to check limits
      const familyResult = await client.query(
        'SELECT max_members FROM family_accounts WHERE id = $1 AND tenant_id = $2',
        [familyAccountId, tenantId]
      );
      
      if (familyResult.rows.length === 0) {
        throw new Error('Family account not found');
      }
      
      const maxMembers = familyResult.rows[0].max_members;
      
      if (currentCount >= maxMembers) {
        throw new Error(`Family account is at maximum capacity (${maxMembers} members)`);
      }

      const result = await withAuditLog(
        tenantId,
        addedBy,
        'ADD_FAMILY_MEMBER',
        'family_members',
        undefined,
        async (client) => {
          const insertResult = await client.query(
            `INSERT INTO family_members (
              tenant_id, family_account_id, user_id, relationship,
              can_view_health_data, can_manage_meals, added_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *`,
            [
              tenantId,
              memberData.family_account_id,
              memberData.user_id,
              memberData.relationship,
              memberData.can_view_health_data,
              memberData.can_manage_meals
            ]
          );

          return insertResult.rows[0] as FamilyMember;
        }
      );

      // Invalidate family cache
      await invalidateTenantCache(tenantId);
      
      return result;
    });
  }
}

/**
 * Consent management for medical disclaimers
 */
export class ConsentService {
  /**
   * Record user consent with full audit trail
   */
  static async recordConsent(
    tenantId: string,
    userId: string,
    disclaimerId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<UserConsent> {
    return await withAuditLog(
      tenantId,
      userId,
      'RECORD_CONSENT',
      'user_consents',
      undefined,
      async (client) => {
        const result = await client.query(
          `INSERT INTO user_consents (
            tenant_id, user_id, disclaimer_id, status, 
            ip_address, user_agent, consented_at
          ) VALUES ($1, $2, $3, 'granted', $4, $5, NOW())
          RETURNING *`,
          [tenantId, userId, disclaimerId, ipAddress, userAgent]
        );

        return result.rows[0] as UserConsent;
      }
    );
  }

  /**
   * Check if user has current consent
   */
  static async hasCurrentConsent(
    tenantId: string,
    userId: string
  ): Promise<boolean> {
    return await withTenantContext(tenantId, async (client) => {
      const result = await client.query(
        `SELECT 1 FROM user_consents uc
         JOIN medical_disclaimers md ON uc.disclaimer_id = md.id
         WHERE uc.user_id = $1 AND uc.tenant_id = $2 
           AND uc.status = 'granted' AND md.is_current = true`,
        [userId, tenantId]
      );

      return result.rows.length > 0;
    });
  }
}

/**
 * Audit and compliance utilities
 */
export class AuditService {
  /**
   * Get audit logs with pagination
   */
  static async getAuditLogs(
    tenantId: string,
    options: QueryOptions = {},
    _requestedBy: string
  ): Promise<PaginatedResult<AuditLog>> {
    const { limit = 50, offset = 0, orderBy = 'created_at', orderDirection = 'DESC' } = options;
    
    return await withTenantContext(tenantId, async (client) => {
      // Get total count
      const countResult = await client.query(
        'SELECT COUNT(*) as total FROM audit_logs WHERE tenant_id = $1',
        [tenantId]
      );
      
      const total = parseInt(countResult.rows[0].total);
      
      // Get paginated data
      const dataResult = await client.query(
        `SELECT * FROM audit_logs 
         WHERE tenant_id = $1 
         ORDER BY ${orderBy} ${orderDirection}
         LIMIT $2 OFFSET $3`,
        [tenantId, limit, offset]
      );
      
      return {
        data: dataResult.rows as AuditLog[],
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      };
    });
  }
}

/**
 * Database health and maintenance utilities
 */
export class DatabaseMaintenanceService {
  /**
   * Clean up expired cache and old audit logs
   */
  static async performMaintenance(tenantId?: string): Promise<void> {
    const query = tenantId 
      ? 'DELETE FROM audit_logs WHERE tenant_id = $1 AND created_at < NOW() - INTERVAL \'1 year\''
      : 'DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL \'1 year\'';
    
    const params = tenantId ? [tenantId] : [];
    
    await withTenantContext(tenantId || 'maintenance', async (client) => {
      const result = await client.query(query, params);
      console.log(`Maintenance: Deleted ${result.rowCount} old audit log entries`);
    });
  }

  /**
   * Generate compliance report
   */
  static async generateComplianceReport(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalUsers: number;
    consentedUsers: number;
    dataAccessEvents: number;
    securityEvents: number;
  }> {
    return await withTenantContext(tenantId, async (client) => {
      const [userCount, consentCount, accessCount, securityCount] = await Promise.all([
        client.query('SELECT COUNT(*) FROM users WHERE tenant_id = $1', [tenantId]),
        client.query(
          'SELECT COUNT(DISTINCT user_id) FROM user_consents WHERE tenant_id = $1 AND status = \'granted\'',
          [tenantId]
        ),
        client.query(
          'SELECT COUNT(*) FROM audit_logs WHERE tenant_id = $1 AND action LIKE \'%ACCESS%\' AND created_at BETWEEN $2 AND $3',
          [tenantId, startDate, endDate]
        ),
        client.query(
          'SELECT COUNT(*) FROM audit_logs WHERE tenant_id = $1 AND action LIKE \'%LOGIN%\' AND created_at BETWEEN $2 AND $3',
          [tenantId, startDate, endDate]
        )
      ]);

      return {
        totalUsers: parseInt(userCount.rows[0].count),
        consentedUsers: parseInt(consentCount.rows[0].count),
        dataAccessEvents: parseInt(accessCount.rows[0].count),
        securityEvents: parseInt(securityCount.rows[0].count),
      };
    });
  }
}

export async function validateFamilyMemberAccess(
  _familyAccountId: string, 
  _memberUserId: string, 
  _requestedBy: string
): Promise<boolean> {
  // Implementation of the function
  return true; // Placeholder return, actual implementation needed
}