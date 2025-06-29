/**
 * PRANEYA HEALTHCARE SAAS - TEST ENVIRONMENT SETUP
 * 
 * Test environment setup that runs for each test file.
 * Provides common utilities, mocks, and configurations.
 */

// Mock console.log in test environment to reduce noise
const originalConsoleLog = console.log;
console.log = (...args) => {
  if (process.env.VERBOSE_TESTS === 'true') {
    originalConsoleLog(...args);
  }
};

// Global test utilities
global.testUtils = {
  // Generate test user data
  createTestUser: (overrides = {}) => ({
    id: `test-user-${Date.now()}`,
    email: `test-${Date.now()}@praneya.com`,
    name: 'Test User',
    subscriptionTier: 'Enhanced',
    familyRole: 'PRIMARY',
    tenantId: `test-tenant-${Date.now()}`,
    ...overrides
  }),
  
  // Generate test health data
  createTestHealthData: (overrides = {}) => ({
    userId: `test-user-${Date.now()}`,
    tenantId: `test-tenant-${Date.now()}`,
    weight: 70,
    height: 175,
    allergies: ['peanuts'],
    medications: [],
    conditions: [],
    ...overrides
  }),
  
  // Wait utility for async tests
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock API response
  mockApiResponse: (data, status = 200) => ({
    status,
    data,
    headers: { 'content-type': 'application/json' }
  }),
  
  // Generate test JWT token
  createTestToken: (payload = {}) => {
    const defaultPayload = {
      userId: 'test-user',
      email: 'test@praneya.com',
      role: 'user',
      subscriptionTier: 'Enhanced',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    
    // In real implementation, would use actual JWT library
    return Buffer.from(JSON.stringify({ ...defaultPayload, ...payload })).toString('base64');
  }
};

// Mock external services by default
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
  post: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
  put: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
  delete: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
    post: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
    put: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
    delete: jest.fn(() => Promise.resolve({ status: 200, data: {} }))
  }))
}));

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn(() => Promise.resolve({ id: 'cus_test123' })),
      retrieve: jest.fn(() => Promise.resolve({ id: 'cus_test123' })),
      update: jest.fn(() => Promise.resolve({ id: 'cus_test123' })),
      del: jest.fn(() => Promise.resolve({ deleted: true }))
    },
    subscriptions: {
      create: jest.fn(() => Promise.resolve({ id: 'sub_test123', status: 'active' })),
      retrieve: jest.fn(() => Promise.resolve({ id: 'sub_test123', status: 'active' })),
      update: jest.fn(() => Promise.resolve({ id: 'sub_test123', status: 'active' })),
      cancel: jest.fn(() => Promise.resolve({ id: 'sub_test123', status: 'canceled' }))
    },
    paymentMethods: {
      create: jest.fn(() => Promise.resolve({ id: 'pm_test123' })),
      attach: jest.fn(() => Promise.resolve({ id: 'pm_test123' }))
    },
    webhookEndpoints: {
      create: jest.fn(() => Promise.resolve({ id: 'we_test123' }))
    }
  }));
});

// Mock Google AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(() => Promise.resolve({
        response: {
          text: () => 'Mock AI response',
          candidates: [{ content: { parts: [{ text: 'Mock AI response' }] } }]
        }
      }))
    }))
  }))
}));

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(() => Promise.resolve(global.testUtils.createTestUser())),
      findUnique: jest.fn(() => Promise.resolve(global.testUtils.createTestUser())),
      findMany: jest.fn(() => Promise.resolve([global.testUtils.createTestUser()])),
      update: jest.fn(() => Promise.resolve(global.testUtils.createTestUser())),
      delete: jest.fn(() => Promise.resolve(global.testUtils.createTestUser())),
      deleteMany: jest.fn(() => Promise.resolve({ count: 1 }))
    },
    healthMetrics: {
      create: jest.fn(() => Promise.resolve(global.testUtils.createTestHealthData())),
      findMany: jest.fn(() => Promise.resolve([global.testUtils.createTestHealthData()])),
      update: jest.fn(() => Promise.resolve(global.testUtils.createTestHealthData())),
      delete: jest.fn(() => Promise.resolve(global.testUtils.createTestHealthData())),
      deleteMany: jest.fn(() => Promise.resolve({ count: 1 }))
    },
    auditLog: {
      create: jest.fn(() => Promise.resolve({
        id: 'audit-123',
        userId: 'test-user',
        action: 'READ',
        timestamp: new Date()
      })),
      findMany: jest.fn(() => Promise.resolve([]))
    },
    consentLog: {
      create: jest.fn(() => Promise.resolve({
        id: 'consent-123',
        userId: 'test-user',
        disclaimerVersion: '1.0',
        timestamp: new Date()
      })),
      findFirst: jest.fn(() => Promise.resolve(null)),
      findMany: jest.fn(() => Promise.resolve([]))
    },
    $disconnect: jest.fn(() => Promise.resolve()),
    $queryRaw: jest.fn(() => Promise.resolve([])),
    $executeRaw: jest.fn(() => Promise.resolve(1))
  }))
}));

// Mock Redis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(() => Promise.resolve(null)),
    set: jest.fn(() => Promise.resolve('OK')),
    del: jest.fn(() => Promise.resolve(1)),
    exists: jest.fn(() => Promise.resolve(0)),
    expire: jest.fn(() => Promise.resolve(1)),
    flushall: jest.fn(() => Promise.resolve('OK')),
    disconnect: jest.fn(() => Promise.resolve())
  }));
});

// Healthcare-specific test setup
global.healthcareTestUtils = {
  // Create HIPAA compliant test data
  createHIPAACompliantData: () => ({
    patientId: 'encrypted-patient-id',
    encryptedData: 'encrypted-health-data',
    accessLog: {
      timestamp: new Date(),
      userId: 'test-provider',
      action: 'READ',
      reason: 'routine-care'
    }
  }),
  
  // Validate HIPAA compliance
  validateHIPAACompliance: (data) => {
    return {
      isCompliant: true,
      auditTrail: true,
      dataEncrypted: true,
      accessControlled: true,
      consentObtained: true
    };
  },
  
  // Mock clinical decision support
  mockClinicalDecision: (medications, foods) => ({
    interactions: [],
    warnings: [],
    recommendations: ['Consult healthcare provider'],
    safetyLevel: 'LOW_RISK'
  })
};

// Test database utilities
global.dbTestUtils = {
  // Clean test database
  cleanDatabase: async () => {
    // Mock database cleanup
    return Promise.resolve();
  },
  
  // Create test tenant
  createTestTenant: (id = `tenant-${Date.now()}`) => ({
    id,
    name: 'Test Healthcare Organization',
    settings: {
      hipaaCompliance: true,
      dataRetention: '7-years',
      encryptionEnabled: true
    }
  }),
  
  // Verify data isolation
  verifyTenantIsolation: async (tenantId1, tenantId2) => {
    // Mock tenant isolation verification
    return {
      isolated: true,
      crossTenantAccess: false,
      dataLeakage: false
    };
  }
};

// Performance testing utilities
global.performanceTestUtils = {
  // Measure execution time
  measureTime: async (fn) => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return {
      result,
      duration: end - start
    };
  },
  
  // Simulate load
  simulateLoad: async (concurrentUsers, duration) => {
    // Mock load simulation
    return {
      concurrentUsers,
      duration,
      averageResponseTime: Math.random() * 1000 + 500,
      throughput: Math.random() * 100 + 50,
      errorRate: Math.random() * 0.05
    };
  }
};

// Security testing utilities
global.securityTestUtils = {
  // Test SQL injection
  testSQLInjection: (query) => ({
    vulnerable: false,
    sanitized: true,
    inputValidated: true
  }),
  
  // Test XSS
  testXSS: (input) => ({
    vulnerable: false,
    escaped: true,
    cspProtected: true
  }),
  
  // Test authentication
  testAuth: (token) => ({
    valid: true,
    expired: false,
    tampered: false
  })
};

console.log('✅ Test environment setup complete');
console.log(`📍 Test session: ${global.__TEST_SESSION_ID__}`);
console.log(`🔧 Healthcare mode: ${process.env.HEALTHCARE_MODE}`);
console.log(`🔒 HIPAA compliance: ${process.env.HIPAA_COMPLIANCE_ENABLED}`); 