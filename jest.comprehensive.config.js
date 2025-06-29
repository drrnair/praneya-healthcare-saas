/**
 * PRANEYA HEALTHCARE SAAS - COMPREHENSIVE JEST CONFIGURATION
 * 
 * Master Jest configuration for comprehensive testing framework covering:
 * - Healthcare compliance testing
 * - AI functionality testing
 * - Performance testing
 * - Security penetration testing
 * - Integration testing
 * - User experience testing
 */

const baseConfig = require('./jest.config');
const path = require('path');

module.exports = {
  ...baseConfig,
  
  // Test environment configuration
  testEnvironment: 'jsdom',
  
  // Global setup and teardown
  globalSetup: '<rootDir>/tests/setup/comprehensive-setup.js',
  globalTeardown: '<rootDir>/tests/setup/comprehensive-teardown.js',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/healthcare-setup.js',
    '<rootDir>/tests/setup/test-environment.js'
  ],
  
  // Test patterns for comprehensive testing
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,ts}',
    '<rootDir>/tests/**/*-tests.{js,ts}',
    '<rootDir>/tests/**/*-suite.{js,ts}'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/.next/',
    '/cypress/',
    '/playwright/'
  ],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '<rootDir>/reports/coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'json',
    'lcov',
    'clover'
  ],
  
  // Coverage thresholds for production readiness
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    // Healthcare-specific coverage requirements
    './src/lib/clinical-interfaces/': {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98
    },
    './src/lib/healthcare/': {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98
    },
    './src/server/middleware/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**'
  ],
  
  // Test timeout (extended for comprehensive testing)
  testTimeout: 30000,
  
  // Reporters for comprehensive test results
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './reports',
      filename: 'comprehensive-test-report.html',
      expand: true,
      hideIcon: false,
      pageTitle: 'Praneya Healthcare SaaS - Comprehensive Test Report'
    }],
    ['jest-junit', {
      outputDirectory: './reports',
      outputName: 'comprehensive-junit.xml',
      suiteName: 'Praneya Healthcare Comprehensive Tests'
    }],
    ['./tests/reporters/healthcare-compliance-reporter.js', {
      outputFile: './reports/healthcare-compliance-report.json'
    }]
  ],
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>/tests'],
  
  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  
  // Verbose output for comprehensive testing
  verbose: true,
  
  // Fail fast on first test failure in CI
  bail: process.env.CI ? 1 : 0,
  
  // Maximum worker processes
  maxWorkers: process.env.CI ? 2 : '50%',
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // Global variables for testing
  globals: {
    'process.env': {
      NODE_ENV: 'test',
      HEALTHCARE_MODE: 'true',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/praneya_test',
      REDIS_URL: 'redis://localhost:6380',
      JWT_SECRET: 'test-jwt-secret',
      ENCRYPTION_KEY: 'test-encryption-key-32-characters',
      API_BASE_URL: 'http://localhost:3001'
    }
  },
  
  // Projects for different test types
  projects: [
    {
      displayName: 'Healthcare Compliance',
      testMatch: ['<rootDir>/tests/healthcare/**/*.test.{js,ts}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/healthcare-setup.js']
    },
    {
      displayName: 'Clinical Safety',
      testMatch: ['<rootDir>/tests/clinical/**/*.test.{js,ts}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/healthcare-setup.js']
    },
    {
      displayName: 'Security',
      testMatch: ['<rootDir>/tests/security/**/*.test.{js,ts}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/security-setup.js']
    },
    {
      displayName: 'HIPAA Compliance',
      testMatch: ['<rootDir>/tests/hipaa/**/*.test.{js,ts}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/healthcare-setup.js']
    },
    {
      displayName: 'Family Privacy',
      testMatch: ['<rootDir>/tests/family/**/*.test.{js,ts}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/healthcare-setup.js']
    },
    {
      displayName: 'Database',
      testMatch: ['<rootDir>/tests/database/**/*.test.{js,ts}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/database-setup.js']
    },
    {
      displayName: 'Components',
      testMatch: ['<rootDir>/tests/components/**/*.test.{js,ts,jsx,tsx}'],
      testEnvironment: 'jsdom'
    }
  ]
}; 