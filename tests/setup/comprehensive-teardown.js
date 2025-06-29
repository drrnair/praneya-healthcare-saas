/**
 * PRANEYA HEALTHCARE SAAS - COMPREHENSIVE TEST GLOBAL TEARDOWN
 * 
 * Global teardown for comprehensive testing framework.
 * Runs once after all tests across all workers.
 */

const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('🧹 Cleaning up comprehensive testing environment...');
  
  // Calculate total test duration
  const testDuration = Date.now() - global.__TEST_START_TIME__;
  const durationMinutes = (testDuration / 60000).toFixed(2);
  
  // Generate test session summary
  const sessionSummary = {
    sessionId: global.__TEST_SESSION_ID__,
    startTime: new Date(global.__TEST_START_TIME__).toISOString(),
    endTime: new Date().toISOString(),
    duration: testDuration,
    durationMinutes: parseFloat(durationMinutes)
  };
  
  // Save session summary
  const reportsDir = path.join(process.cwd(), 'reports');
  const summaryPath = path.join(reportsDir, 'test-session-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(sessionSummary, null, 2));
  
  console.log(`📊 Test session completed in ${durationMinutes} minutes`);
  console.log(`📄 Session summary saved: ${summaryPath}`);
  console.log('✅ Comprehensive testing cleanup complete');
}; 