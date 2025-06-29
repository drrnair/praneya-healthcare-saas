const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

// Healthcare-specific Jest configuration
const healthcareJestConfig = {
  displayName: 'Healthcare Compliance Tests',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/tests/setup/healthcare-setup.js'
  ],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/tests/healthcare/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/clinical/**/*.{js,jsx,ts,tsx}', 
    '<rootDir>/tests/hipaa/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/family/privacy.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/accessibility/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/components/**/*.healthcare.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/lib/**/*.compliance.test.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/'
  ],
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx,ts,tsx}',
    'src/lib/healthcare/**/*.{js,jsx,ts,tsx}',
    'src/lib/clinical-interfaces/**/*.{js,jsx,ts,tsx}',
    'src/lib/family-management/**/*.{js,jsx,ts,tsx}',
    'src/server/middleware/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ],
  coverageDirectory: 'coverage/healthcare',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 85, // Higher threshold for healthcare
      functions: 85,
      lines: 85,
      statements: 85
    },
    // Specific thresholds for critical healthcare components
    'src/lib/healthcare/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    'src/lib/clinical-interfaces/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1'
  },
  testTimeout: 15000, // Longer timeout for healthcare workflows
  verbose: true,
  // Healthcare-specific global variables
  globals: {
    HEALTHCARE_MODE: true,
    HIPAA_COMPLIANCE_ENABLED: true,
    CLINICAL_SAFETY_ENABLED: true
  },
  // Custom reporters for healthcare compliance
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './coverage/healthcare/html-report',
      filename: 'healthcare-compliance-report.html',
      expand: true,
      hideIcon: false,
      pageTitle: 'Praneya Healthcare Compliance Test Report'
    }],
    ['jest-junit', {
      outputDirectory: './coverage/healthcare',
      outputName: 'healthcare-junit.xml',
      suiteName: 'Healthcare Compliance Tests'
    }]
  ],
  // Transform patterns for healthcare-specific modules
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@healthcare/.*|@clinical/.*))'
  ]
};

module.exports = createJestConfig(healthcareJestConfig); 