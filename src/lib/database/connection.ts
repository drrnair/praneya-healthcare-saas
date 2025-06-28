import { Pool, PoolClient } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Global connection pool
let pool: Pool | null = null;

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

/**
 * Initialize database connection pool
 * Healthcare-grade configuration with proper timeouts and SSL
 */
export function initializeDatabase(config?: Partial<DatabaseConfig>) {
  if (pool) {
    return pool;
  }

  const dbConfig: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'praneya_dev',
    user: process.env.DB_USER || 'application_user',
    password: process.env.DB_PASSWORD || 'app_user_password_2024',
    ssl: process.env.NODE_ENV === 'production',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Timeout connection attempts after 10 seconds
    ...config,
  };

  pool = new Pool(dbConfig);

  // Healthcare compliance: Log connection events
  pool.on('connect', (client) => {
    console.log('Database connection established:', {
      timestamp: new Date().toISOString(),
      processId: client.processID,
      database: dbConfig.database,
    });
  });

  pool.on('error', (err) => {
    console.error('Database connection error:', {
      timestamp: new Date().toISOString(),
      error: err.message,
      stack: err.stack,
    });
  });

  return pool;
}

/**
 * Get database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    return initializeDatabase();
  }
  return pool;
}

/**
 * Get Drizzle instance for query building
 */
export function getDatabase() {
  return drizzle(getPool());
}

/**
 * Execute query with automatic tenant context
 */
export async function withTenantContext<T>(
  tenantId: string,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  
  try {
    // Set tenant context for row-level security
    await client.query('SELECT set_tenant_context($1)', [tenantId]);
    
    // Execute the callback with the tenant-aware client
    const result = await callback(client);
    
    return result;
  } catch (error) {
    // Healthcare compliance: Log all errors with context
    console.error('Database error with tenant context:', {
      timestamp: new Date().toISOString(),
      tenantId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  } finally {
    // Always release the client back to the pool
    client.release();
  }
}

/**
 * Execute query with audit logging
 */
export async function withAuditLog<T>(
  tenantId: string,
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId?: string,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  return await withTenantContext(tenantId, async (client) => {
    try {
      const result = await callback(client);
      
      // Log successful action
      await client.query(
        `INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, new_values)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [tenantId, userId, action, resourceType, resourceId, JSON.stringify(result)]
      );
      
      return result;
    } catch (error) {
      // Log failed action
      await client.query(
        `INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, old_values)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [tenantId, userId, `FAILED_${action}`, resourceType, resourceId, JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })]
      );
      
      throw error;
    }
  });
}

/**
 * Healthcare-specific query execution with PHI protection
 */
export async function withPHIProtection<T>(
  tenantId: string,
  userId: string,
  subscriptionTier: 'basic' | 'enhanced' | 'premium',
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  return await withTenantContext(tenantId, async (client) => {
    // Set subscription tier context for data filtering
    await client.query('SET LOCAL app.subscription_tier = $1', [subscriptionTier]);
    
    // Execute callback with PHI protection
    const result = await callback(client);
    
    // Healthcare compliance: Log PHI access
    await client.query(
      `INSERT INTO audit_logs (tenant_id, user_id, action, resource_type)
       VALUES ($1, $2, 'PHI_ACCESS', 'health_data')`,
      [tenantId, userId]
    );
    
    return result;
  });
}

/**
 * Transaction wrapper with tenant context
 */
export async function withTransaction<T>(
  tenantId: string,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  return await withTenantContext(tenantId, async (client) => {
    await client.query('BEGIN');
    
    try {
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  });
}

/**
 * Health check for database connection
 */
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy';
  details: any;
}> {
  try {
    const client = await getPool().connect();
    
    try {
      const result = await client.query('SELECT NOW() as timestamp, version() as version');
      const poolInfo = {
        totalCount: getPool().totalCount,
        idleCount: getPool().idleCount,
        waitingCount: getPool().waitingCount,
      };
      
      return {
        status: 'healthy',
        details: {
          timestamp: result.rows[0].timestamp,
          version: result.rows[0].version,
          pool: poolInfo,
        },
      };
    } finally {
      client.release();
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Close database pool (for graceful shutdown)
 */
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database pool closed');
  }
}