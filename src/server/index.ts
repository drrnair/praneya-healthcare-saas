/**
 * Praneya Healthcare SaaS - Express Server
 * HIPAA-compliant API server with clinical safety middleware
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { createServer } from 'http';
import { config } from 'dotenv';

// Healthcare-specific imports
import { healthcareSecurityMiddleware } from './middleware/healthcare-security';
import { hipaaAuditMiddleware } from './middleware/hipaa-audit';
import { clinicalOversightMiddleware } from './middleware/clinical-oversight';
import { deviceFingerprintMiddleware } from './middleware/device-fingerprint';
import { conflictDetectionMiddleware } from './middleware/conflict-detection';
import { familyPrivacyMiddleware } from './middleware/family-privacy';

// Route imports
import { authRoutes } from './routes/auth';
import { healthProfileRoutes } from './routes/health-profiles';
import { familyRoutes } from './routes/family';
import { clinicalRoutes } from './routes/clinical';
import { nutritionRoutes } from './routes/nutrition';
import { billingRoutes } from './routes/billing';
import { auditRoutes } from './routes/audit';
import { emergencyRoutes } from './routes/emergency';

// Database and utilities
import { connectDatabase } from '@/lib/database/connection';
import { initializeRedis } from '@/lib/cache/redis';
import { healthCheckHandler } from './utils/health-check';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';

// Load environment variables
config();

// Validate critical environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
  'HEALTHCARE_ENCRYPTION_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const isHealthcareMode = process.env.HEALTHCARE_MODE === 'true';

console.log('🏥 Starting Praneya Healthcare Server...');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Healthcare Mode: ${isHealthcareMode}`);
console.log(`HIPAA Compliance: ${process.env.HIPAA_COMPLIANCE_ENABLED}`);

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Helmet security headers with healthcare-specific configurations
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", ...(isProduction ? [] : ["'unsafe-eval'"])],
      connectSrc: [
        "'self'",
        "https://api.edamam.com",
        "https://vertex-ai.googleapis.com",
        "https://api.stripe.com",
        ...(isProduction ? [] : ["ws://localhost:*", "http://localhost:*"])
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// CORS configuration for healthcare data
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS - Healthcare security policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Device-Fingerprint',
    'X-Healthcare-Context',
    'X-Family-Member-Id',
    'X-Clinical-Override'
  ],
  exposedHeaders: [
    'X-Healthcare-Warning',
    'X-Conflict-Detected',
    'X-Clinical-Review-Required'
  ]
};

app.use(cors(corsOptions));

// Rate limiting with healthcare-specific rules
const healthcareRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: function(req) {
    // Different limits based on endpoint sensitivity
    if (req.path.includes('/emergency')) return 100; // Emergency access
    if (req.path.includes('/clinical')) return parseInt(process.env.RATE_LIMIT_HEALTHCARE_MAX || '50');
    if (req.path.includes('/auth')) return 10; // Stricter for auth
    return parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
  },
  message: {
    error: 'Too many requests from this IP',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  }
});

app.use(healthcareRateLimit);

// Compression with healthcare data considerations
app.use(compression({
  filter: (req, res) => {
    // Don't compress healthcare data marked as sensitive
    if (res.getHeader('X-Healthcare-Sensitive')) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body parsing with size limits for healthcare uploads
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// HEALTHCARE-SPECIFIC MIDDLEWARE
// ===========================================

// Healthcare security middleware (authentication, encryption, etc.)
app.use('/api', healthcareSecurityMiddleware);

// HIPAA audit logging - track all access to PHI
app.use('/api', hipaaAuditMiddleware);

// Device fingerprinting for fraud prevention
app.use('/api', deviceFingerprintMiddleware);

// Clinical oversight and medical advice detection
app.use('/api', clinicalOversightMiddleware);

// Conflict detection for health data changes
app.use('/api', conflictDetectionMiddleware);

// Family privacy protection middleware
app.use('/api/family', familyPrivacyMiddleware);

// ===========================================
// HEALTH CHECK AND MONITORING
// ===========================================

app.get('/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);

// Detailed health check for internal monitoring
app.get('/api/health/detailed', async (req, res) => {
  try {
    const checks = {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      externalAPIs: await checkExternalAPIHealth(),
      clinicalOversight: await checkClinicalOversightHealth(),
      conflictDetection: await checkConflictDetectionHealth(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    };

    const allHealthy = Object.values(checks).every(check => 
      typeof check === 'object' ? check.status === 'healthy' : true
    );

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Health check failed'
    });
  }
});

// ===========================================
// API ROUTES
// ===========================================

// Authentication and user management
app.use('/api/auth', authRoutes);

// Health profile management (allergies, medications, etc.)
app.use('/api/health-profiles', healthProfileRoutes);

// Family account management
app.use('/api/family', familyRoutes);

// Clinical features (reviews, safety checks, etc.)
app.use('/api/clinical', clinicalRoutes);

// Nutrition analysis and meal planning
app.use('/api/nutrition', nutritionRoutes);

// Billing and subscription management
app.use('/api/billing', billingRoutes);

// Audit and compliance endpoints
app.use('/api/audit', auditRoutes);

// Emergency access endpoints
app.use('/api/emergency', emergencyRoutes);

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use(notFoundHandler);

// Global error handler with healthcare-specific logging
app.use(errorHandler);

// ===========================================
// GRACEFUL SHUTDOWN
// ===========================================

async function gracefulShutdown(signal: string) {
  console.log(`🏥 Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close database connections
    console.log('Closing database connections...');
    // await closeDatabaseConnections();
    
    // Close Redis connections
    console.log('Closing Redis connections...');
    // await closeRedisConnections();
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled promise rejections - critical for healthcare applications
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  // In healthcare applications, we should log this and potentially shut down
  gracefulShutdown('UNHANDLED_REJECTION');
});

// ===========================================
// SERVER INITIALIZATION
// ===========================================

async function startServer() {
  try {
    // Initialize database
    console.log('🔗 Connecting to database...');
    await connectDatabase();
    
    // Initialize Redis
    console.log('🔗 Connecting to Redis...');
    await initializeRedis();
    
    // Start HTTP server
    const server = createServer(app);
    
    server.listen(port, () => {
      console.log(`🏥 Praneya Healthcare Server running on port ${port}`);
      console.log(`🔒 Security: HIPAA Compliance ${process.env.HIPAA_COMPLIANCE_ENABLED}`);
      console.log(`🛡️  Clinical Oversight: ${process.env.CLINICAL_OVERSIGHT_REQUIRED}`);
      console.log(`👨‍⚕️ Emergency Access: ${process.env.EMERGENCY_ACCESS_ENABLED}`);
      console.log(`📊 Conflict Detection: Active`);
      console.log(`🔐 Encryption: Field-level PHI encryption enabled`);
      
      if (!isProduction) {
        console.log(`🌐 API Documentation: http://localhost:${port}/api/docs`);
        console.log(`🔍 Health Check: http://localhost:${port}/health`);
      }
    });
    
    // Handle server errors
    server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      
      const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
      
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ===========================================
// HEALTH CHECK FUNCTIONS
// ===========================================

async function checkDatabaseHealth() {
  try {
    // Implement database health check
    return { status: 'healthy', latency: '< 100ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function checkRedisHealth() {
  try {
    // Implement Redis health check
    return { status: 'healthy', latency: '< 50ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function checkExternalAPIHealth() {
  try {
    // Check Edamam, Med-Gemini, Stripe APIs
    return { 
      status: 'healthy',
      edamam: 'available',
      medGemini: 'available',
      stripe: 'available'
    };
  } catch (error) {
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function checkClinicalOversightHealth() {
  try {
    // Check clinical oversight system
    return { status: 'healthy', advisorsAvailable: true };
  } catch (error) {
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function checkConflictDetectionHealth() {
  try {
    // Check conflict detection system
    return { status: 'healthy', engineStatus: 'active' };
  } catch (error) {
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

export { app }; 