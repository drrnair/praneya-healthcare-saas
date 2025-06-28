// Praneya Healthcare SaaS - Database Layer Exports
// Centralized exports for all database utilities

// Core connection utilities
export {
  initializeDatabase,
  getPool,
  getDatabase,
  withTenantContext,
  withAuditLog,
  withPHIProtection,
  withTransaction,
  healthCheck,
  closeDatabase,
} from './connection';

// Service classes for business logic
export {
  UserService,
  HealthProfileService,
  FamilyService,
  ConsentService,
  AuditService,
  DatabaseMaintenanceService,
} from './utils';

// Cache utilities
export {
  initializeRedis,
  getRedis,
  generateCacheKey,
  setCache,
  getCache,
  deleteCache,
  invalidateTenantCache,
  invalidateHealthCache,
  checkRateLimit,
  healthCheckRedis,
  closeRedis,
  CACHE_TTL,
} from '../cache/redis';

// Type definitions
export * from '../types/database';

// Healthcare compliance helpers
export const HEALTHCARE_COMPLIANCE = {
  // PHI data retention periods (in days)
  DATA_RETENTION: {
    AUDIT_LOGS: 2555, // 7 years for HIPAA compliance
    USER_DATA: 2555, // 7 years
    HEALTH_PROFILES: 2555, // 7 years
    CONSENT_RECORDS: 2555, // 7 years
    CACHE_DATA: 1, // 24 hours max for sensitive data
  },
  
  // Security timeouts (in minutes)
  TIMEOUTS: {
    SESSION: 30, // 30 minutes idle timeout
    AUTH_TOKEN: 15, // 15 minutes for sensitive operations
    FAILED_LOGIN_LOCKOUT: 30, // 30 minutes after 5 failed attempts
    PASSWORD_RESET: 15, // 15 minutes for password reset tokens
  },
  
  // Rate limits (requests per minute)
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: 5,
    API_CALLS: 100,
    HEALTH_DATA_ACCESS: 20,
    EXPORT_REQUESTS: 3,
  },
  
  // Required audit events
  AUDIT_EVENTS: [
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'LOGOUT',
    'PASSWORD_CHANGE',
    'HEALTH_DATA_ACCESS',
    'HEALTH_DATA_MODIFICATION',
    'PHI_EXPORT',
    'CONSENT_GRANTED',
    'CONSENT_REVOKED',
    'FAMILY_MEMBER_ADDED',
    'FAMILY_MEMBER_REMOVED',
    'SUBSCRIPTION_CHANGE',
    'ACCOUNT_DELETED',
  ],
} as const;

// Utility functions for healthcare compliance
export const HealthcareUtils = {
  /**
   * Check if data is considered PHI (Protected Health Information)
   */
  isPHI(dataType: string): boolean {
    const phiTypes = [
      'health_profiles',
      'lab_values',
      'biometric_data',
      'clinical_notes',
      'medications',
      'medical_conditions',
      'family_health_history',
    ];
    return phiTypes.includes(dataType);
  },

  /**
   * Get required audit level for operation
   */
  getAuditLevel(operation: string, dataType: string): 'low' | 'medium' | 'high' {
    if (this.isPHI(dataType)) return 'high';
    if (operation.includes('DELETE') || operation.includes('EXPORT')) return 'high';
    if (operation.includes('UPDATE') || operation.includes('CREATE')) return 'medium';
    return 'low';
  },

  /**
   * Generate compliance-safe error message
   */
  sanitizeErrorMessage(error: Error, userRole: string): string {
    // Don't expose technical details to end users
    if (userRole === 'end_user') {
      return 'An error occurred while processing your request. Please contact support if this continues.';
    }
    
    // Provide more details for admins and clinical advisors
    if (userRole === 'super_admin' || userRole === 'clinical_advisor') {
      return error.message;
    }
    
    return 'An unexpected error occurred.';
  },

  /**
   * Validate subscription tier access to features
   */
  validateSubscriptionAccess(
    subscriptionTier: string,
    requestedFeature: string
  ): boolean {
    const featureMap = {
      basic: ['recipe_search', 'nutrition_analysis', 'basic_meal_planning'],
      enhanced: ['family_accounts', 'advanced_meal_planning', 'shopping_lists'],
      premium: ['clinical_ai', 'drug_interactions', 'lab_integration', 'provider_sharing'],
    };

    const allowedFeatures = [
      ...(featureMap.basic || []),
      ...(subscriptionTier === 'enhanced' || subscriptionTier === 'premium' ? featureMap.enhanced || [] : []),
      ...(subscriptionTier === 'premium' ? featureMap.premium || [] : []),
    ];

    return allowedFeatures.includes(requestedFeature);
  },

  /**
   * Generate secure audit trail ID
   */
  generateAuditTrailId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `audit_${timestamp}_${randomPart}`;
  },

  /**
   * Mask sensitive data for logging
   */
  maskSensitiveData(data: any): any {
    const sensitiveFields = [
      'password',
      'ssn',
      'social_security',
      'medical_record_number',
      'patient_id',
      'lab_values',
      'biometric_data',
      'clinical_notes',
    ];

    if (typeof data !== 'object' || data === null) return data;

    const masked = { ...data };
    for (const field of sensitiveFields) {
      if (field in masked) {
        masked[field] = '[REDACTED]';
      }
    }

    return masked;
  },
};

// Database initialization helper for Next.js apps
export async function initializePraneyaDatabase() {
  try {
    // Initialize database connection
    const pool = initializeDatabase();
    
    // Initialize Redis cache
    const redis = initializeRedis();
    
    // Test connections
    const [dbHealth, cacheHealth] = await Promise.all([
      healthCheck(),
      healthCheckRedis(),
    ]);
    
    if (dbHealth.status === 'unhealthy') {
      throw new Error(`Database unhealthy: ${dbHealth.details.error}`);
    }
    
    if (cacheHealth.status === 'unhealthy') {
      console.warn('Redis cache unavailable, continuing without cache:', cacheHealth.details.error);
    }
    
    console.log('Praneya database layer initialized successfully:', {
      database: dbHealth.status,
      cache: cacheHealth.status,
      timestamp: new Date().toISOString(),
    });
    
    return { pool, redis, dbHealth, cacheHealth };
  } catch (error) {
    console.error('Failed to initialize Praneya database layer:', error);
    throw error;
  }
}

// Graceful shutdown helper
export async function shutdownPraneyaDatabase() {
  try {
    await Promise.all([
      closeDatabase(),
      closeRedis(),
    ]);
    
    console.log('Praneya database layer shutdown complete');
  } catch (error) {
    console.error('Error during database shutdown:', error);
    throw error;
  }
}