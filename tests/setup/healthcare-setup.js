/**
 * Healthcare Testing Setup
 * Comprehensive setup for healthcare compliance, clinical safety, and accessibility testing
 */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';

// Setup global text encoding for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Healthcare-specific global test configuration
global.HEALTHCARE_TEST_CONFIG = {
  COMPLIANCE_MODE: true,
  CLINICAL_SAFETY_ENABLED: true,
  HIPAA_AUDIT_ENABLED: true,
  ACCESSIBILITY_TESTING: true,
  PERFORMANCE_MONITORING: true
};

// Mock healthcare environment variables
process.env.HEALTHCARE_MODE = 'true';
process.env.HIPAA_COMPLIANCE_ENABLED = 'true';
process.env.CLINICAL_SAFETY_ENABLED = 'true';
process.env.AUDIT_LOG_RETENTION_DAYS = '2555';
process.env.PHI_ACCESS_LOGGING = 'true';
process.env.DEVICE_FINGERPRINTING = 'true';

// Healthcare data encryption mocks
global.mockHealthcareEncryption = {
  encrypt: jest.fn((data) => `encrypted_${data}`),
  decrypt: jest.fn((encryptedData) => encryptedData.replace('encrypted_', '')),
  hash: jest.fn((data) => `hash_${data}`),
  verifyHash: jest.fn(() => true)
};

// Clinical safety mocks
global.mockClinicalSafety = {
  validateDrugInteraction: jest.fn(() => ({ safe: true, warnings: [] })),
  checkAllergenConflict: jest.fn(() => ({ conflict: false, allergens: [] })),
  validateMedicalAdvice: jest.fn(() => ({ containsAdvice: false, flags: [] })),
  auditClinicalAccess: jest.fn(() => ({ logged: true, auditId: 'test-audit-123' }))
};

// HIPAA compliance mocks
global.mockHIPAACompliance = {
  auditAccess: jest.fn(() => ({ auditId: 'hipaa-audit-123', timestamp: new Date() })),
  validateDataMinimization: jest.fn(() => ({ compliant: true, issues: [] })),
  checkAccessPermissions: jest.fn(() => ({ authorized: true, permissions: ['read', 'write'] })),
  logPHIAccess: jest.fn(() => ({ logged: true, logId: 'phi-log-123' }))
};

// Family privacy mocks
global.mockFamilyPrivacy = {
  validateFamilyAccess: jest.fn(() => ({ authorized: true, permissions: [] })),
  checkMinorProtection: jest.fn(() => ({ protected: true, restrictions: [] })),
  auditFamilyInteraction: jest.fn(() => ({ logged: true, interactionId: 'family-123' })),
  validateConsentManagement: jest.fn(() => ({ valid: true, consents: [] }))
};

// Accessibility testing mocks
global.mockAccessibility = {
  checkAriaCompliance: jest.fn(() => ({ compliant: true, violations: [] })),
  validateKeyboardNavigation: jest.fn(() => ({ navigable: true, issues: [] })),
  checkColorContrast: jest.fn(() => ({ adequate: true, ratio: 4.5 })),
  validateScreenReaderSupport: jest.fn(() => ({ supported: true, warnings: [] }))
};

// Performance monitoring mocks
global.mockPerformanceMonitoring = {
  startTimer: jest.fn(() => ({ id: 'perf-timer-123', start: Date.now() })),
  endTimer: jest.fn(() => ({ duration: 150, performant: true })),
  measureRenderTime: jest.fn(() => ({ renderTime: 16, efficient: true })),
  trackHealthcareDataLoad: jest.fn(() => ({ loadTime: 300, acceptable: true }))
};

// Healthcare-specific test utilities
global.healthcareTestUtils = {
  // Create mock health profile with realistic data
  createMockHealthProfile: (overrides = {}) => ({
    id: 'health-profile-123',
    userId: 'user-123',
    tenantId: 'tenant-123',
    subscriptionTier: 'premium',
    allergies: [
      {
        id: 'allergy-1',
        allergen: 'peanuts',
        severity: 'severe',
        reaction: ['anaphylaxis'],
        isActive: true
      }
    ],
    medications: [
      {
        id: 'med-1',
        genericName: 'lisinopril',
        dosage: '10mg',
        frequency: 'daily',
        isActive: true
      }
    ],
    dietaryRestrictions: [
      {
        id: 'diet-1',
        restriction: 'low-sodium',
        reason: 'medical',
        strictness: 'strict',
        isActive: true
      }
    ],
    chronicConditions: [
      {
        id: 'condition-1',
        condition: 'hypertension',
        severity: 'moderate',
        isActive: true
      }
    ],
    ...overrides
  }),

  // Create mock family account
  createMockFamilyAccount: (overrides = {}) => ({
    id: 'family-123',
    tenantId: 'tenant-123',
    primaryUserId: 'user-123',
    familyName: 'Test Family',
    subscriptionTier: 'premium',
    maxMembers: 6,
    privacySettings: {
      defaultHealthSharing: false,
      requireExplicitConsent: true,
      minorProtectionEnabled: true,
      auditAllAccess: true,
      emergencyDataSharing: true
    },
    ...overrides
  }),

  // Create mock clinical data
  createMockClinicalData: (overrides = {}) => ({
    patientId: 'patient-123',
    providerId: 'provider-123',
    clinicalNote: 'Test clinical note',
    timestamp: new Date(),
    dataType: 'clinical_observation',
    confidentialityLevel: 'restricted',
    ...overrides
  }),

  // Simulate healthcare workflow steps
  simulateHealthcareWorkflow: async (steps) => {
    const results = [];
    for (const step of steps) {
      const result = await step();
      results.push(result);
    }
    return results;
  },

  // Validate HIPAA compliance for test data
  validateHIPAACompliance: (data) => {
    const compliance = {
      hasAuditTrail: data.auditTrail !== undefined,
      hasEncryption: data.encrypted === true,
      hasAccessControls: data.accessControls !== undefined,
      hasDataMinimization: data.minimized === true,
      compliant: true
    };
    
    compliance.compliant = Object.values(compliance).every(v => v === true);
    return compliance;
  },

  // Generate test data with healthcare constraints
  generateTestPatientData: (patientType = 'adult') => {
    const baseData = {
      id: `patient-${Date.now()}`,
      dateOfBirth: new Date('1980-01-01'),
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+1-555-0123',
        relationship: 'spouse'
      }
    };

    if (patientType === 'minor') {
      baseData.dateOfBirth = new Date('2010-01-01');
      baseData.guardianConsent = true;
      baseData.guardianId = 'guardian-123';
    }

    return baseData;
  }
};

// Subscription tier testing utilities
global.subscriptionTestUtils = {
  BASIC_FEATURES: ['basic_nutrition', 'basic_recipes', 'basic_tracking'],
  ENHANCED_FEATURES: ['family_accounts', 'advanced_nutrition', 'meal_planning'],
  PREMIUM_FEATURES: ['clinical_data', 'provider_integration', 'ai_analysis'],

  validateFeatureAccess: (userTier, feature) => {
    const tierFeatures = {
      basic: global.subscriptionTestUtils.BASIC_FEATURES,
      enhanced: [...global.subscriptionTestUtils.BASIC_FEATURES, ...global.subscriptionTestUtils.ENHANCED_FEATURES],
      premium: [...global.subscriptionTestUtils.BASIC_FEATURES, ...global.subscriptionTestUtils.ENHANCED_FEATURES, ...global.subscriptionTestUtils.PREMIUM_FEATURES]
    };

    return tierFeatures[userTier]?.includes(feature) || false;
  },

  createMockSubscription: (tier = 'basic') => ({
    id: `sub-${Date.now()}`,
    tier,
    status: 'active',
    billingCycle: 'monthly',
    features: global.subscriptionTestUtils.validateFeatureAccess(tier, 'all'),
    limits: {
      basic: { familyMembers: 1, aiQueries: 10 },
      enhanced: { familyMembers: 4, aiQueries: 50 },
      premium: { familyMembers: 6, aiQueries: 200 }
    }[tier]
  })
};

// Device and responsive testing utilities
global.deviceTestUtils = {
  BREAKPOINTS: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
  },

  simulateDevice: (deviceType) => {
    const viewport = global.deviceTestUtils.BREAKPOINTS[deviceType];
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: viewport.width });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: viewport.height });
    window.dispatchEvent(new Event('resize'));
  },

  simulateTouchDevice: () => {
    Object.defineProperty(window.navigator, 'maxTouchPoints', { writable: true, configurable: true, value: 10 });
    Object.defineProperty(window, 'ontouchstart', { writable: true, configurable: true, value: null });
  }
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  
  // Clear healthcare-specific mocks
  global.mockHealthcareEncryption.encrypt.mockClear();
  global.mockClinicalSafety.validateDrugInteraction.mockClear();
  global.mockHIPAACompliance.auditAccess.mockClear();
  global.mockFamilyPrivacy.validateFamilyAccess.mockClear();
  global.mockAccessibility.checkAriaCompliance.mockClear();
  global.mockPerformanceMonitoring.startTimer.mockClear();
});

// Setup error handling for healthcare-critical errors
const originalError = console.error;
console.error = (...args) => {
  // Flag healthcare-critical errors
  const message = args.join(' ');
  if (message.includes('HIPAA') || message.includes('clinical') || message.includes('PHI')) {
    args.unshift('🚨 HEALTHCARE CRITICAL:');
  }
  originalError.apply(console, args);
};

// Export for use in tests
global.testSetupComplete = true; 