/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/server', '<rootDir>/tests/integration'],
  testMatch: [
    '<rootDir>/src/server/**/__tests__/**/*.{js,ts}',
    '<rootDir>/src/server/**/*.(test|spec).{js,ts}',
    '<rootDir>/tests/integration/**/*.{js,ts}'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.server.json'
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.api.js'],
  collectCoverageFrom: [
    'src/server/**/*.{js,ts}',
    '!src/server/**/*.d.ts',
    '!src/server/**/index.ts',
    '!src/server/**/*.test.{js,ts}',
    '!src/server/**/*.spec.{js,ts}'
  ],
  coverageDirectory: 'coverage/api',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/server/(.*)$': '<rootDir>/src/server/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  // Global setup and teardown for database connections
  globalSetup: '<rootDir>/tests/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts'
};

module.exports = config;