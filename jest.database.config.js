module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.database.js'],
  testMatch: [
    '<rootDir>/tests/database/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/healthcare/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/tenant/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/clinical/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/hipaa/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/family/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/integration/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/security/**/*.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/'
  ],
  collectCoverageFrom: [
    'src/lib/**/*.{js,jsx,ts,tsx}',
    'src/server/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage/database',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testTimeout: 30000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true
};
