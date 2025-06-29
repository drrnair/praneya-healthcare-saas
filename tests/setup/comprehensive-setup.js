/**
 * PRANEYA HEALTHCARE SAAS - COMPREHENSIVE TEST GLOBAL SETUP
 * 
 * Global setup for comprehensive testing framework.
 * Runs once before all tests across all workers.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('🚀 Setting up comprehensive testing environment...');
  
  // Create reports directory
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Create test coverage directory
  const coverageDir = path.join(reportsDir, 'coverage');
  if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
  }
  
  // Set global test environment variables
  process.env.NODE_ENV = 'test';
  process.env.HEALTHCARE_MODE = 'true';
  process.env.HIPAA_COMPLIANCE_ENABLED = 'true';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/praneya_test';
  process.env.REDIS_URL = 'redis://localhost:6380';
  process.env.JWT_SECRET = 'test-jwt-secret-for-comprehensive-testing';
  process.env.ENCRYPTION_KEY = 'test-encryption-key-32-characters';
  
  // Create test timestamp for reporting
  global.__TEST_START_TIME__ = Date.now();
  global.__TEST_SESSION_ID__ = `comprehensive-test-${Date.now()}`;
  
  console.log('✅ Comprehensive testing environment setup complete');
}; 