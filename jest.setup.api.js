// API Test Setup for Healthcare SaaS
const { config } = require('dotenv');

// Load test environment variables
config({ path: '.env.test' });

// Mock console for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock Redis for testing
jest.mock('ioredis', () => {
  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    flushdb: jest.fn(),
    quit: jest.fn(),
    disconnect: jest.fn(),
    // Healthcare-specific cache methods
    hget: jest.fn(),
    hset: jest.fn(),
    hdel: jest.fn(),
    hgetall: jest.fn(),
    // For audit logging
    lpush: jest.fn(),
    lrange: jest.fn(),
    llen: jest.fn(),
  };

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockRedis),
    Redis: jest.fn().mockImplementation(() => mockRedis),
  };
});

// Mock database connection
jest.mock('@/lib/database/connection', () => ({
  db: {
    query: jest.fn(),
    transaction: jest.fn(),
    destroy: jest.fn(),
  },
  withTransaction: jest.fn(),
  getDBConnection: jest.fn(),
}));

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
    createCustomToken: jest.fn(),
    setCustomUserClaims: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  })),
}));

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn(),
      retrieve: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    subscriptions: {
      create: jest.fn(),
      retrieve: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
    },
    paymentMethods: {
      attach: jest.fn(),
      detach: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
    invoices: {
      retrieve: jest.fn(),
      pay: jest.fn(),
    },
  }));
});

// Mock external APIs
jest.mock('@/lib/external-apis/edamam', () => ({
  EdamamClient: jest.fn().mockImplementation(() => ({
    searchRecipes: jest.fn(),
    analyzeNutrition: jest.fn(),
    searchFood: jest.fn(),
  })),
}));

jest.mock('@/lib/external-apis/gemini', () => ({
  GeminiClient: jest.fn().mockImplementation(() => ({
    generateContent: jest.fn(),
    generateRecipe: jest.fn(),
    analyzeContent: jest.fn(),
  })),
}));

// Mock encryption utilities for PHI data
jest.mock('@/lib/utils/encryption', () => ({
  encrypt: jest.fn().mockReturnValue('encrypted_data'),
  decrypt: jest.fn().mockReturnValue('decrypted_data'),
  hash: jest.fn().mockReturnValue('hashed_data'),
  generateKey: jest.fn().mockReturnValue('generated_key'),
}));

// Mock audit logging
jest.mock('@/lib/utils/audit-logger', () => ({
  auditLogger: {
    log: jest.fn(),
    logPHIAccess: jest.fn(),
    logSecurityEvent: jest.fn(),
    logUserAction: jest.fn(),
  },
}));

// Mock email service
jest.mock('@/lib/utils/email', () => ({
  emailService: {
    sendEmail: jest.fn(),
    sendWelcomeEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    sendSecurityAlert: jest.fn(),
  },
}));

// Test environment setup
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/praneya_test';
process.env.REDIS_URL = 'redis://localhost:6379/1';
process.env.JWT_SECRET = 'test-jwt-secret-for-healthcare-app-testing';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-long';
process.env.PHI_ENCRYPTION_KEY = 'test-phi-encryption-key-32-chars';

// Healthcare compliance test settings
process.env.ENABLE_AUDIT_LOGGING = 'true';
process.env.ENABLE_DATA_ENCRYPTION = 'true';
process.env.CLINICAL_REVIEW_REQUIRED = 'false'; // Disable for testing

// Mock external API keys
process.env.EDAMAM_APP_ID = 'test-edamam-app-id';
process.env.EDAMAM_APP_KEY = 'test-edamam-app-key';
process.env.GEMINI_API_KEY = 'test-gemini-api-key';
process.env.STRIPE_SECRET_KEY = 'sk_test_test_key';

// Setup and teardown
beforeAll(async () => {
  // Setup test database if needed
  console.log('🧪 Setting up API test environment...');
});

afterAll(async () => {
  // Cleanup test database
  console.log('🧹 Cleaning up API test environment...');
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Restore mocks after each test
  jest.restoreAllMocks();
});

// Global error handler for unhandled promises in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Custom matchers for healthcare testing
expect.extend({
  toBeValidPHIData(received) {
    const pass = typeof received === 'string' && received.length > 0;
    if (pass) {
      return {
        message: () => `expected ${received} not to be valid PHI data`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be valid PHI data`,
        pass: false,
      };
    }
  },
  toBeHIPAACompliant(received) {
    // Mock HIPAA compliance check
    const hasEncryption = received.encrypted === true;
    const hasAuditLog = received.auditLogged === true;
    const pass = hasEncryption && hasAuditLog;
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be HIPAA compliant`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be HIPAA compliant (encrypted: ${hasEncryption}, audit logged: ${hasAuditLog})`,
        pass: false,
      };
    }
  },
});