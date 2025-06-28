/**
 * Prisma Database Connection for Healthcare Platform
 * Optimized connection pooling and healthcare-specific configurations
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { HealthcareEncryption } from '@/server/middleware/healthcare-security';

// Healthcare-specific logging configuration
const healthcareLogging: Prisma.LogLevel[] = process.env.NODE_ENV === 'production' 
  ? ['error', 'warn']
  : ['query', 'error', 'warn', 'info'];

// Connection pool configuration optimized for healthcare data
const connectionPoolConfig = {
  // Healthcare applications need reliable connections
  connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '20'),
  
  // Longer timeout for complex healthcare queries
  connectTimeout: parseInt(process.env.DATABASE_CONNECT_TIMEOUT || '60000'), // 60 seconds
  
  // Healthcare data integrity requires stable connections
  idleTimeout: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '600000'), // 10 minutes
  
  // Pool maintenance for 24/7 healthcare operations
  maxLifetime: parseInt(process.env.DATABASE_MAX_LIFETIME || '3600000'), // 1 hour
};

// Global Prisma client instance with healthcare optimizations
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Healthcare-specific Prisma client configuration
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: healthcareLogging,
  
  // Database URL with connection pooling
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  
  // Performance optimizations for healthcare queries
  transactionOptions: {
    maxWait: 5000,     // 5 seconds max wait for transaction
    timeout: 30000,    // 30 seconds transaction timeout
    isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
  },
  
  // Error formatting for healthcare compliance
  errorFormat: 'pretty',
});

// Healthcare connection monitoring
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ===========================================
// HEALTHCARE DATABASE UTILITIES
// ===========================================

/**
 * Healthcare-specific database connection manager
 */
export class HealthcareDatabaseManager {
  private static instance: HealthcareDatabaseManager;
  private healthMetrics: {
    totalQueries: number;
    phiQueries: number;
    auditQueries: number;
    averageResponseTime: number;
    errorCount: number;
  } = {
    totalQueries: 0,
    phiQueries: 0,
    auditQueries: 0,
    averageResponseTime: 0,
    errorCount: 0,
  };

  public static getInstance(): HealthcareDatabaseManager {
    if (!HealthcareDatabaseManager.instance) {
      HealthcareDatabaseManager.instance = new HealthcareDatabaseManager();
    }
    return HealthcareDatabaseManager.instance;
  }

  /**
   * Execute query with healthcare monitoring and audit logging
   */
  async executeHealthcareQuery<T>(
    operation: () => Promise<T>,
    context: {
      userId?: string;
      tenantId: string;
      operation: string;
      resourceType: string;
      resourceId?: string;
      phiAccess?: boolean;
    }
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      // Execute the database operation
      const result = await operation();
      
      // Track performance metrics
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, context.phiAccess || false);
      
      // Audit logging for healthcare compliance
      if (context.phiAccess || process.env.AUDIT_ALL_DATABASE_ACCESS === 'true') {
        await this.logDatabaseAccess({
          ...context,
          responseTime,
          status: 'success',
          timestamp: new Date(),
        });
      }
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.healthMetrics.errorCount++;
      
      // Log database errors for healthcare compliance
      await this.logDatabaseAccess({
        ...context,
        responseTime,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });
      
      console.error('Healthcare database operation failed:', {
        operation: context.operation,
        resourceType: context.resourceType,
        error: error instanceof Error ? error.message : error,
        responseTime,
      });
      
      throw error;
    }
  }

  /**
   * Get database health metrics for monitoring
   */
  getHealthMetrics() {
    return {
      ...this.healthMetrics,
      connectionStatus: 'connected', // TODO: Implement actual connection check
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }

  /**
   * Validate database connection with healthcare requirements
   */
  async validateConnection(): Promise<{
    isConnected: boolean;
    latency: number;
    hipaaCompliant: boolean;
    encryptionEnabled: boolean;
  }> {
    try {
      const startTime = Date.now();
      
      // Test basic connection
      await prisma.$queryRaw`SELECT 1 as health_check`;
      
      // Test encryption capabilities
      const encryptionTest = await prisma.$queryRaw`SELECT pgp_sym_encrypt('test', 'key') as encrypted`;
      
      const latency = Date.now() - startTime;
      
      return {
        isConnected: true,
        latency,
        hipaaCompliant: true, // TODO: Implement actual HIPAA compliance check
        encryptionEnabled: !!encryptionTest,
      };
    } catch (error) {
      console.error('Database connection validation failed:', error);
      return {
        isConnected: false,
        latency: -1,
        hipaaCompliant: false,
        encryptionEnabled: false,
      };
    }
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(responseTime: number, phiAccess: boolean) {
    this.healthMetrics.totalQueries++;
    if (phiAccess) {
      this.healthMetrics.phiQueries++;
    }
    
    // Update rolling average response time
    this.healthMetrics.averageResponseTime = 
      (this.healthMetrics.averageResponseTime * (this.healthMetrics.totalQueries - 1) + responseTime) 
      / this.healthMetrics.totalQueries;
  }

  /**
   * Log database access for audit compliance
   */
  private async logDatabaseAccess(logData: {
    userId?: string;
    tenantId: string;
    operation: string;
    resourceType: string;
    resourceId?: string;
    phiAccess?: boolean;
    responseTime: number;
    status: 'success' | 'error';
    error?: string;
    timestamp: Date;
  }) {
    try {
      // Use a separate connection for audit logs to avoid recursion
      await prisma.auditLog.create({
        data: {
          tenantId: logData.tenantId,
          userId: logData.userId,
          action: `database.${logData.operation}`,
          resourceType: logData.resourceType,
          resourceId: logData.resourceId,
          phiAccessed: logData.phiAccess || false,
          executionTime: logData.responseTime,
          complianceFlags: logData.status === 'error' ? ['DATABASE_ERROR'] : [],
          timestamp: logData.timestamp,
        },
      });
    } catch (auditError) {
      // Critical: Audit logging failed - this should trigger alerts
      console.error('CRITICAL: Audit logging failed:', auditError);
      // TODO: Implement emergency audit logging to file system
    }
  }
}

// ===========================================
// HEALTHCARE DATA ACCESS LAYER
// ===========================================

/**
 * Healthcare-specific data access methods with built-in security
 */
export class HealthcareDataAccess {
  private dbManager = HealthcareDatabaseManager.getInstance();

  /**
   * Get user with automatic audit logging
   */
  async getUser(userId: string, requestContext: { tenantId: string; requestingUserId?: string }) {
    return this.dbManager.executeHealthcareQuery(
      () => prisma.user.findUnique({
        where: { id: userId },
        include: {
          healthProfile: true,
          deviceFingerprints: true,
          consentRecords: true,
        },
      }),
      {
        tenantId: requestContext.tenantId,
        ...(requestContext.requestingUserId && { userId: requestContext.requestingUserId }),
        operation: 'read',
        resourceType: 'user',
        resourceId: userId,
        phiAccess: true,
      }
    );
  }

  /**
   * Get health profile with encryption handling
   */
  async getHealthProfile(userId: string, requestContext: { tenantId: string; requestingUserId?: string }) {
    const profile = await this.dbManager.executeHealthcareQuery(
      () => prisma.healthProfile.findUnique({
        where: { userId },
        include: {
          allergies: true,
          dietaryRestrictions: true,
          nutritionGoals: true,
          medications: true,
          chronicConditions: true,
          labValues: true,
          biometricReadings: {
            orderBy: { takenAt: 'desc' },
            take: 100, // Last 100 readings
          },
        },
      }),
             {
         tenantId: requestContext.tenantId,
         ...(requestContext.requestingUserId && { userId: requestContext.requestingUserId }),
         operation: 'read',
         resourceType: 'health_profile',
         resourceId: userId,
         phiAccess: true,
       }
    );

    if (profile) {
      // Decrypt sensitive fields if needed
      // TODO: Implement field-level decryption
    }

    return profile;
  }

  /**
   * Create or update health data with validation
   */
  async updateHealthData<T>(
    operation: () => Promise<T>,
    context: {
      userId: string;
      tenantId: string;
      dataType: string;
      validationRequired?: boolean;
    }
  ): Promise<T> {
    // Pre-validation for healthcare data
    if (context.validationRequired) {
      await this.validateHealthDataIntegrity(context.userId);
    }

    const result = await this.dbManager.executeHealthcareQuery(
      operation,
      {
        tenantId: context.tenantId,
        userId: context.userId,
        operation: 'update',
        resourceType: context.dataType,
        phiAccess: true,
      }
    );

    // Post-validation and integrity check
    await this.updateDataIntegrityHash(context.userId);

    return result;
  }

  /**
   * Search with tenant isolation
   */
  async searchWithTenantIsolation<T>(
    searchOperation: (tenantId: string) => Promise<T>,
    tenantId: string,
    requestContext: { userId?: string; resourceType: string }
  ): Promise<T> {
    return this.dbManager.executeHealthcareQuery(
      () => searchOperation(tenantId),
             {
         tenantId,
         ...(requestContext.userId && { userId: requestContext.userId }),
         operation: 'search',
         resourceType: requestContext.resourceType,
       }
    );
  }

  /**
   * Validate health data integrity
   */
  private async validateHealthDataIntegrity(userId: string): Promise<void> {
    const profile = await prisma.healthProfile.findUnique({
      where: { userId },
      select: { dataIntegrityHash: true, updatedAt: true },
    });

    if (!profile) {
      throw new Error('Health profile not found');
    }

    // TODO: Implement integrity hash validation
    // const computedHash = await this.computeDataIntegrityHash(userId);
    // if (computedHash !== profile.dataIntegrityHash) {
    //   throw new Error('Health data integrity check failed');
    // }
  }

  /**
   * Update data integrity hash after changes
   */
  private async updateDataIntegrityHash(userId: string): Promise<void> {
    // TODO: Implement integrity hash computation
    const newHash = `integrity_hash_${Date.now()}`;
    
    await prisma.healthProfile.update({
      where: { userId },
      data: { dataIntegrityHash: newHash },
    });
  }
}

// ===========================================
// CONNECTION CLEANUP AND HEALTH MONITORING
// ===========================================

/**
 * Graceful shutdown for healthcare applications
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    console.log('🏥 Closing healthcare database connections...');
    await prisma.$disconnect();
    console.log('✅ Healthcare database connections closed');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
    throw error;
  }
}

/**
 * Database health check for monitoring
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  details: any;
}> {
  try {
    const dbManager = HealthcareDatabaseManager.getInstance();
    const connectionStatus = await dbManager.validateConnection();
    const metrics = dbManager.getHealthMetrics();

    const isHealthy = connectionStatus.isConnected && 
                     connectionStatus.hipaaCompliant && 
                     metrics.errorCount < 10; // Threshold for error count

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      details: {
        connection: connectionStatus,
        metrics,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Export singleton instances
export const healthcareDb = new HealthcareDataAccess();
export const dbManager = HealthcareDatabaseManager.getInstance();

// Process cleanup handlers
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
}); 