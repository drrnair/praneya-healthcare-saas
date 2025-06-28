import Redis from 'ioredis';

// Global Redis instance
let redis: Redis | null = null;

interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

/**
 * Initialize Redis connection
 * Healthcare-optimized with proper error handling and security
 */
export function initializeRedis(config?: Partial<CacheConfig>) {
  if (redis) {
    return redis;
  }

  const redisConfig: CacheConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    ...config,
  };

  redis = new Redis(redisConfig);

  // Healthcare compliance: Log connection events
  redis.on('connect', () => {
    console.log('Redis connection established:', {
      timestamp: new Date().toISOString(),
      host: redisConfig.host,
      port: redisConfig.port,
    });
  });

  redis.on('error', (error) => {
    console.error('Redis connection error:', {
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  });

  redis.on('ready', () => {
    console.log('Redis is ready for commands');
  });

  return redis;
}

/**
 * Get Redis instance
 */
export function getRedis(): Redis {
  if (!redis) {
    return initializeRedis();
  }
  return redis;
}

/**
 * Cache key generation with tenant isolation
 */
export function generateCacheKey(
  tenantId: string,
  namespace: string,
  identifier: string
): string {
  return `tenant:${tenantId}:${namespace}:${identifier}`;
}

/**
 * Healthcare-specific cache TTL values (in seconds)
 */
export const CACHE_TTL = {
  // API responses from external services
  EDAMAM_RECIPE: 24 * 60 * 60, // 24 hours
  EDAMAM_NUTRITION: 24 * 60 * 60, // 24 hours
  EDAMAM_FOOD_DB: 7 * 24 * 60 * 60, // 7 days
  
  // User data (shorter TTL for healthcare compliance)
  USER_PROFILE: 15 * 60, // 15 minutes
  HEALTH_PROFILE: 5 * 60, // 5 minutes (sensitive data)
  FAMILY_MEMBERS: 30 * 60, // 30 minutes
  
  // Generated content
  AI_RECIPE: 2 * 60 * 60, // 2 hours
  MEAL_PLAN: 1 * 60 * 60, // 1 hour
  
  // Session and auth
  USER_SESSION: 30 * 60, // 30 minutes
  AUTH_TOKEN: 15 * 60, // 15 minutes
  
  // Rate limiting
  RATE_LIMIT: 60, // 1 minute
} as const;

/**
 * Set cache with tenant isolation and audit logging
 */
export async function setCache(
  tenantId: string,
  namespace: string,
  identifier: string,
  value: any,
  ttl: number = CACHE_TTL.USER_PROFILE
): Promise<void> {
  try {
    const cacheKey = generateCacheKey(tenantId, namespace, identifier);
    const serializedValue = JSON.stringify({
      data: value,
      timestamp: new Date().toISOString(),
      tenantId,
    });
    
    await getRedis().setex(cacheKey, ttl, serializedValue);
    
    // Healthcare compliance: Log cache operations for sensitive data
    if (namespace.includes('health') || namespace.includes('medical')) {
      console.log('Cache set for sensitive data:', {
        timestamp: new Date().toISOString(),
        tenantId,
        namespace,
        ttl,
      });
    }
  } catch (error) {
    console.error('Cache set error:', {
      timestamp: new Date().toISOString(),
      tenantId,
      namespace,
      identifier,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Get cache with tenant isolation
 */
export async function getCache<T>(
  tenantId: string,
  namespace: string,
  identifier: string
): Promise<T | null> {
  try {
    const cacheKey = generateCacheKey(tenantId, namespace, identifier);
    const cachedValue = await getRedis().get(cacheKey);
    
    if (!cachedValue) {
      return null;
    }
    
    const parsed = JSON.parse(cachedValue);
    
    // Verify tenant isolation
    if (parsed.tenantId !== tenantId) {
      console.error('Tenant isolation violation in cache:', {
        timestamp: new Date().toISOString(),
        requestedTenant: tenantId,
        cachedTenant: parsed.tenantId,
        namespace,
        identifier,
      });
      return null;
    }
    
    return parsed.data as T;
  } catch (error) {
    console.error('Cache get error:', {
      timestamp: new Date().toISOString(),
      tenantId,
      namespace,
      identifier,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return null;
  }
}

/**
 * Delete cache with tenant isolation
 */
export async function deleteCache(
  tenantId: string,
  namespace: string,
  identifier: string
): Promise<void> {
  try {
    const cacheKey = generateCacheKey(tenantId, namespace, identifier);
    await getRedis().del(cacheKey);
    
    // Healthcare compliance: Log cache deletions for audit
    console.log('Cache deleted:', {
      timestamp: new Date().toISOString(),
      tenantId,
      namespace,
      identifier,
    });
  } catch (error) {
    console.error('Cache delete error:', {
      timestamp: new Date().toISOString(),
      tenantId,
      namespace,
      identifier,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Clear all cache for specific patterns
 */
export async function clearCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await getRedis().keys(pattern);
    if (keys.length > 0) {
      await getRedis().del(...keys);
    }
    
    console.log('Cache pattern cleared:', {
      timestamp: new Date().toISOString(),
      pattern,
      keysCleared: keys.length,
    });
  } catch (error) {
    console.error('Cache pattern clear error:', {
      timestamp: new Date().toISOString(),
      pattern,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Invalidate all cache for a tenant
 */
export async function invalidateTenantCache(tenantId: string): Promise<void> {
  const pattern = `tenant:${tenantId}:*`;
  await clearCachePattern(pattern);
  
  console.log('Tenant cache invalidated:', {
    timestamp: new Date().toISOString(),
    tenantId,
  });
}

/**
 * Invalidate health-related cache for specific user
 */
export async function invalidateHealthCache(tenantId: string, userId: string): Promise<void> {
  const patterns = [
    `tenant:${tenantId}:health:${userId}:*`,
    `tenant:${tenantId}:medical:${userId}:*`,
    `tenant:${tenantId}:profile:${userId}:*`,
  ];
  
  for (const pattern of patterns) {
    await clearCachePattern(pattern);
  }
  
  console.log('Health cache invalidated:', {
    timestamp: new Date().toISOString(),
    tenantId,
    userId,
  });
}

/**
 * Rate limiting implementation
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  try {
    const key = `rate_limit:${identifier}`;
    const current = await getRedis().get(key);
    const resetTime = Date.now() + (windowSeconds * 1000);
    
    if (!current) {
      await getRedis().setex(key, windowSeconds, '1');
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime,
      };
    }
    
    const count = parseInt(current);
    if (count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }
    
    await getRedis().incr(key);
    return {
      allowed: true,
      remaining: limit - count - 1,
      resetTime,
    };
  } catch (error) {
    console.error('Rate limit check error:', {
      timestamp: new Date().toISOString(),
      identifier,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Fail open for healthcare applications
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: Date.now() + (windowSeconds * 1000),
    };
  }
}

/**
 * Health check for Redis
 */
export async function healthCheckRedis(): Promise<{
  status: 'healthy' | 'unhealthy';
  details: any;
}> {
  try {
    const start = Date.now();
    await getRedis().ping();
    const latency = Date.now() - start;
    
    return {
      status: 'healthy',
      details: {
        latency: `${latency}ms`,
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

/**
 * Gracefully close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log('Redis connection closed');
  }
}
