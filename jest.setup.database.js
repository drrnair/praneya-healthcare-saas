// Simple database test setup
const { config } = require('dotenv');

// Load environment variables
config();

// Test environment settings
process.env.NODE_ENV = 'test';

// Setup for database tests
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
