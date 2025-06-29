/**
 * PRANEYA HEALTHCARE SAAS - SECURITY PENETRATION TESTING SUITE
 * 
 * Comprehensive security testing including:
 * - Authentication & Authorization Testing
 * - Data Protection & Encryption Validation
 * - SQL Injection & XSS Prevention
 * - Healthcare-specific Security (PHI Protection)
 * - Session Management & Token Security
 * - Penetration Testing Scenarios
 * 
 * @version 1.0.0
 * @compliance HIPAA Security Rule, NIST Cybersecurity Framework
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';
import axios, { AxiosResponse } from 'axios';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

interface SecurityTestResult {
  testName: string;
  vulnerability: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  exploitable: boolean;
  details: any;
  remediation: string;
  complianceImpact: string[];
}

interface PenetrationTestReport {
  timestamp: string;
  totalTests: number;
  vulnerabilities: SecurityTestResult[];
  criticalCount: number;
  highCount: number;
  overallRiskScore: number;
  complianceStatus: {
    hipaa: boolean;
    gdpr: boolean;
    pci: boolean;
  };
  recommendations: string[];
}

class SecurityPenetrationTestSuite {
  private browser: Browser;
  private page: Page;
  private vulnerabilities: SecurityTestResult[] = [];
  private readonly API_BASE_URL = 'http://localhost:3001';
  private readonly APP_BASE_URL = 'http://localhost:3000';
  private testUserToken: string = '';
  private adminToken: string = '';

  async setup() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    
    // Setup test authentication tokens
    await this.setupTestTokens();
    
    console.log('🛡️ Security penetration testing environment setup complete');
  }

  async teardown() {
    await this.generateSecurityReport();
    await this.browser.close();
  }

  private async setupTestTokens() {
    // Create test user tokens for authentication testing
    const testUserPayload = {
      userId: 'test-user-security',
      email: 'security-test@praneya.com',
      role: 'user',
      subscriptionTier: 'Enhanced'
    };

    const adminPayload = {
      userId: 'admin-user-security',
      email: 'admin-test@praneya.com',
      role: 'admin',
      subscriptionTier: 'Premium'
    };

    // Mock JWT signing (in real implementation, use proper secret)
    this.testUserToken = jwt.sign(testUserPayload, 'test-secret', { expiresIn: '1h' });
    this.adminToken = jwt.sign(adminPayload, 'test-secret', { expiresIn: '1h' });
  }

  private recordVulnerability(vulnerability: SecurityTestResult) {
    this.vulnerabilities.push(vulnerability);
    
    if (vulnerability.severity === 'critical' || vulnerability.severity === 'high') {
      console.log(`🚨 ${vulnerability.severity.toUpperCase()} VULNERABILITY: ${vulnerability.testName}`);
      console.log(`   ${vulnerability.vulnerability}`);
    }
  }

  private async generateSecurityReport() {
    const criticalCount = this.vulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = this.vulnerabilities.filter(v => v.severity === 'high').length;
    
    // Calculate overall risk score (0-100, lower is better)
    const riskScore = (criticalCount * 25) + (highCount * 10) + 
                      (this.vulnerabilities.filter(v => v.severity === 'medium').length * 5) +
                      (this.vulnerabilities.filter(v => v.severity === 'low').length * 1);

    const report: PenetrationTestReport = {
      timestamp: new Date().toISOString(),
      totalTests: this.vulnerabilities.length,
      vulnerabilities: this.vulnerabilities,
      criticalCount,
      highCount,
      overallRiskScore: riskScore,
      complianceStatus: {
        hipaa: criticalCount === 0 && highCount === 0,
        gdpr: this.vulnerabilities.filter(v => v.complianceImpact.includes('GDPR')).length === 0,
        pci: this.vulnerabilities.filter(v => v.complianceImpact.includes('PCI')).length === 0
      },
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(process.cwd(), 'reports', `security-penetration-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`🔒 Security penetration test report saved: ${reportPath}`);
    console.log(`📊 Risk Score: ${riskScore}/100 (${riskScore < 10 ? 'Acceptable' : riskScore < 25 ? 'Moderate' : 'High Risk'})`);
  }

  private generateRecommendations(): string[] {
    const recommendations = [];
    
    if (this.vulnerabilities.some(v => v.severity === 'critical')) {
      recommendations.push('URGENT: Address all critical vulnerabilities before production deployment');
    }
    
    if (this.vulnerabilities.some(v => v.complianceImpact.includes('HIPAA'))) {
      recommendations.push('Review HIPAA compliance implications of identified vulnerabilities');
    }
    
    if (this.vulnerabilities.some(v => v.vulnerability.includes('injection'))) {
      recommendations.push('Implement comprehensive input validation and parameterized queries');
    }
    
    return recommendations;
  }
}

describe('🛡️ Security Penetration Testing Suite', () => {
  let testSuite: SecurityPenetrationTestSuite;

  beforeAll(async () => {
    testSuite = new SecurityPenetrationTestSuite();
    await testSuite.setup();
  });

  afterAll(async () => {
    await testSuite.teardown();
  });

  describe('🔐 Authentication & Authorization Testing', () => {
    
    test('🔑 JWT Token Security - Token manipulation and validation', async () => {
      console.log('🧪 Testing JWT token security...');

      // Test 1: Token tampering
      const tamperedToken = testSuite.testUserToken.slice(0, -10) + 'TAMPERED123';
      
      try {
        const response = await axios.get(`${testSuite.API_BASE_URL}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${tamperedToken}` }
        });
        
        // Should not reach here - tampered token should be rejected
        testSuite.recordVulnerability({
          testName: 'jwt-token-tampering',
          vulnerability: 'Application accepts tampered JWT tokens',
          severity: 'critical',
          exploitable: true,
          details: { status: response.status },
          remediation: 'Implement proper JWT signature verification',
          complianceImpact: ['HIPAA', 'GDPR']
        });
      } catch (error) {
        // Expected behavior - token should be rejected
        expect(error.response?.status).toBe(401);
        console.log('✅ Tampered JWT tokens properly rejected');
      }

      // Test 2: Expired token handling
      const expiredToken = jwt.sign(
        { userId: 'test-user', exp: Math.floor(Date.now() / 1000) - 3600 }, 
        'test-secret'
      );
      
      try {
        await axios.get(`${testSuite.API_BASE_URL}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${expiredToken}` }
        });
        
        testSuite.recordVulnerability({
          testName: 'expired-token-acceptance',
          vulnerability: 'Application accepts expired JWT tokens',
          severity: 'high',
          exploitable: true,
          details: { tokenExp: 'expired 1 hour ago' },
          remediation: 'Implement proper token expiration validation',
          complianceImpact: ['HIPAA']
        });
      } catch (error) {
        expect(error.response?.status).toBe(401);
        console.log('✅ Expired JWT tokens properly rejected');
      }

      // Test 3: Token with elevated privileges
      const privilegeEscalationToken = jwt.sign(
        { userId: 'test-user', role: 'admin' }, 
        'test-secret'
      );
      
      try {
        const response = await axios.get(`${testSuite.API_BASE_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${privilegeEscalationToken}` }
        });
        
        if (response.status === 200) {
          testSuite.recordVulnerability({
            testName: 'privilege-escalation-jwt',
            vulnerability: 'JWT privilege escalation possible through token manipulation',
            severity: 'critical',
            exploitable: true,
            details: { adminAccessGranted: true },
            remediation: 'Implement server-side role validation beyond JWT claims',
            complianceImpact: ['HIPAA', 'GDPR']
          });
        }
      } catch (error) {
        expect(error.response?.status).toBeIn([401, 403]);
        console.log('✅ Privilege escalation through JWT properly prevented');
      }
    });

    test('🔒 Password Security - Brute force protection and complexity', async () => {
      console.log('🧪 Testing password security...');

      // Test password complexity requirements
      const weakPasswords = [
        '123456',
        'password',
        'abc123',
        'qwerty',
        '12345678'
      ];

      for (const weakPassword of weakPasswords) {
        try {
          const response = await axios.post(`${testSuite.API_BASE_URL}/api/auth/register`, {
            email: `test-${Date.now()}@example.com`,
            password: weakPassword,
            confirmPassword: weakPassword
          });
          
          if (response.status === 200 || response.status === 201) {
            testSuite.recordVulnerability({
              testName: 'weak-password-acceptance',
              vulnerability: `Weak password "${weakPassword}" accepted during registration`,
              severity: 'medium',
              exploitable: true,
              details: { password: weakPassword },
              remediation: 'Implement stronger password complexity requirements',
              complianceImpact: ['HIPAA']
            });
          }
        } catch (error) {
          // Expected behavior - weak passwords should be rejected
          expect(error.response?.status).toBeIn([400, 422]);
        }
      }

      // Test brute force protection
      const loginAttempts = [];
      for (let i = 0; i < 10; i++) {
        loginAttempts.push(
          axios.post(`${testSuite.API_BASE_URL}/api/auth/login`, {
            email: 'nonexistent@example.com',
            password: 'wrongpassword'
          }).catch(err => err.response)
        );
      }

      const results = await Promise.all(loginAttempts);
      const rateLimited = results.some(r => r?.status === 429);
      
      if (!rateLimited) {
        testSuite.recordVulnerability({
          testName: 'no-brute-force-protection',
          vulnerability: 'No rate limiting or brute force protection on login endpoint',
          severity: 'high',
          exploitable: true,
          details: { attemptsMade: 10, rateLimitTriggered: false },
          remediation: 'Implement rate limiting and account lockout mechanisms',
          complianceImpact: ['HIPAA']
        });
      } else {
        console.log('✅ Brute force protection is active');
      }
    });

    test('🚪 Session Management - Session fixation and hijacking prevention', async () => {
      console.log('🧪 Testing session management security...');

      // Test session fixation
      await testSuite.page.goto(`${testSuite.APP_BASE_URL}/auth/login`);
      
      // Get session cookie before login
      const initialCookies = await testSuite.page.context().cookies();
      const initialSessionCookie = initialCookies.find(c => c.name.includes('session'));

      // Perform login
      await testSuite.page.fill('[data-testid="email-input"]', 'test@praneya.com');
      await testSuite.page.fill('[data-testid="password-input"]', 'ValidPassword123!');
      await testSuite.page.click('[data-testid="login-button"]');
      
      // Wait for login to complete
      await testSuite.page.waitForURL('**/dashboard');

      // Get session cookie after login
      const postLoginCookies = await testSuite.page.context().cookies();
      const postLoginSessionCookie = postLoginCookies.find(c => c.name.includes('session'));

      // Session ID should change after login (prevent session fixation)
      if (initialSessionCookie && postLoginSessionCookie) {
        if (initialSessionCookie.value === postLoginSessionCookie.value) {
          testSuite.recordVulnerability({
            testName: 'session-fixation',
            vulnerability: 'Session ID does not change after successful authentication',
            severity: 'medium',
            exploitable: true,
            details: { sessionIdChanged: false },
            remediation: 'Regenerate session ID after successful authentication',
            complianceImpact: ['HIPAA']
          });
        } else {
          console.log('✅ Session ID properly regenerated after login');
        }
      }

      // Test session cookie security attributes
      if (postLoginSessionCookie) {
        if (!postLoginSessionCookie.secure) {
          testSuite.recordVulnerability({
            testName: 'insecure-session-cookie',
            vulnerability: 'Session cookie does not have Secure flag',
            severity: 'medium',
            exploitable: true,
            details: { secureFlag: false },
            remediation: 'Set Secure flag on session cookies',
            complianceImpact: ['HIPAA']
          });
        }

        if (!postLoginSessionCookie.httpOnly) {
          testSuite.recordVulnerability({
            testName: 'non-httponly-session-cookie',
            vulnerability: 'Session cookie does not have HttpOnly flag',
            severity: 'medium',
            exploitable: true,
            details: { httpOnlyFlag: false },
            remediation: 'Set HttpOnly flag on session cookies to prevent XSS attacks',
            complianceImpact: ['HIPAA']
          });
        }

        if (postLoginSessionCookie.sameSite !== 'Strict' && postLoginSessionCookie.sameSite !== 'Lax') {
          testSuite.recordVulnerability({
            testName: 'missing-samesite-cookie',
            vulnerability: 'Session cookie does not have SameSite attribute',
            severity: 'low',
            exploitable: false,
            details: { sameSite: postLoginSessionCookie.sameSite },
            remediation: 'Set SameSite=Strict or SameSite=Lax on session cookies',
            complianceImpact: []
          });
        }
      }
    });

    test('🎭 OAuth Integration Security - Third-party authentication vulnerabilities', async () => {
      console.log('🧪 Testing OAuth integration security...');

      // Test OAuth state parameter validation
      const oauthTests = [
        { provider: 'google', state: null, expected: 'error' },
        { provider: 'google', state: 'predictable-state', expected: 'error' },
        { provider: 'google', state: crypto.randomBytes(32).toString('hex'), expected: 'success' }
      ];

      for (const oauthTest of oauthTests) {
        try {
          const response = await axios.get(`${testSuite.API_BASE_URL}/api/auth/oauth/callback`, {
            params: {
              provider: oauthTest.provider,
              code: 'test-auth-code',
              state: oauthTest.state
            }
          });

          if (oauthTest.expected === 'error' && response.status === 200) {
            testSuite.recordVulnerability({
              testName: 'oauth-state-validation',
              vulnerability: `OAuth callback accepts invalid state parameter: ${oauthTest.state}`,
              severity: 'high',
              exploitable: true,
              details: { state: oauthTest.state, provider: oauthTest.provider },
              remediation: 'Implement proper OAuth state parameter validation',
              complianceImpact: ['HIPAA', 'GDPR']
            });
          }
        } catch (error) {
          if (oauthTest.expected === 'error') {
            // Expected behavior - invalid states should be rejected
            expect(error.response?.status).toBeIn([400, 401, 403]);
          }
        }
      }
    });
  });

  describe('🔒 Data Protection Testing', () => {
    
    test('💉 SQL Injection Prevention - Database security validation', async () => {
      console.log('🧪 Testing SQL injection prevention...');

      const sqlInjectionPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin'/*",
        "1' AND 1=1 UNION SELECT NULL, username, password FROM users--"
      ];

      const vulnerableEndpoints = [
        '/api/users/search',
        '/api/recipes/search',
        '/api/families/members',
        '/api/health/metrics'
      ];

      for (const endpoint of vulnerableEndpoints) {
        for (const payload of sqlInjectionPayloads) {
          try {
            const response = await axios.get(`${testSuite.API_BASE_URL}${endpoint}`, {
              params: { query: payload },
              headers: { 'Authorization': `Bearer ${testSuite.testUserToken}` }
            });

            // Check response for signs of successful SQL injection
            const responseData = JSON.stringify(response.data).toLowerCase();
            const sqlErrorKeywords = ['sql', 'syntax', 'mysql', 'postgres', 'database', 'table', 'column'];
            
            const containsSqlError = sqlErrorKeywords.some(keyword => responseData.includes(keyword));
            
            if (containsSqlError || response.data?.length > 100) {
              testSuite.recordVulnerability({
                testName: 'sql-injection',
                vulnerability: `SQL injection possible at ${endpoint} with payload: ${payload}`,
                severity: 'critical',
                exploitable: true,
                details: { endpoint, payload, responseSize: JSON.stringify(response.data).length },
                remediation: 'Use parameterized queries and input validation',
                complianceImpact: ['HIPAA', 'GDPR', 'PCI']
              });
            }
          } catch (error) {
            // Expected behavior - malicious inputs should be handled gracefully
            expect(error.response?.status).toBeIn([400, 422, 500]);
          }
        }
      }

      console.log('✅ SQL injection testing completed');
    });

    test('🌐 XSS Protection - Cross-site scripting prevention', async () => {
      console.log('🧪 Testing XSS protection...');

      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(\'XSS\')">',
        'javascript:alert("XSS")',
        '<svg onload="alert(\'XSS\')">',
        '"><script>alert("XSS")</script>'
      ];

      // Test reflected XSS
      for (const payload of xssPayloads) {
        await testSuite.page.goto(`${testSuite.APP_BASE_URL}/search?q=${encodeURIComponent(payload)}`);

        const pageContent = await testSuite.page.content();
        
        // Check if payload is reflected without proper encoding
        if (pageContent.includes(payload)) {
          testSuite.recordVulnerability({
            testName: 'reflected-xss',
            vulnerability: `Reflected XSS vulnerability with payload: ${payload}`,
            severity: 'high',
            exploitable: true,
            details: { payload, location: 'search parameter' },
            remediation: 'Implement proper output encoding and Content Security Policy',
            complianceImpact: ['HIPAA', 'GDPR']
          });
        }
      }

      // Test stored XSS through user input fields
      const inputFields = [
        { selector: '[data-testid="user-bio-input"]', endpoint: '/api/user/profile' },
        { selector: '[data-testid="recipe-name-input"]', endpoint: '/api/recipes' },
        { selector: '[data-testid="family-note-input"]', endpoint: '/api/families/notes' }
      ];

      for (const field of inputFields) {
        for (const payload of xssPayloads) {
          try {
            // Navigate to form page
            await testSuite.page.goto(`${testSuite.APP_BASE_URL}/profile/edit`);
            
            // Fill form with XSS payload
            const inputElement = testSuite.page.locator(field.selector);
            if (await inputElement.isVisible()) {
              await inputElement.fill(payload);
              await testSuite.page.click('[data-testid="save-button"]');
              
              // Check if payload is stored and reflected
              await testSuite.page.reload();
              const storedValue = await inputElement.inputValue();
              
              if (storedValue === payload) {
                testSuite.recordVulnerability({
                  testName: 'stored-xss',
                  vulnerability: `Stored XSS vulnerability in ${field.selector}`,
                  severity: 'critical',
                  exploitable: true,
                  details: { payload, field: field.selector },
                  remediation: 'Sanitize user input before storage and implement CSP',
                  complianceImpact: ['HIPAA', 'GDPR']
                });
              }
            }
          } catch (error) {
            // Form validation should prevent malicious input
            console.log(`XSS payload blocked in ${field.selector}`);
          }
        }
      }
    });

    test('🔐 CSRF Protection - Cross-site request forgery prevention', async () => {
      console.log('🧪 Testing CSRF protection...');

      // Test state-changing operations without CSRF token
      const csrfTests = [
        { method: 'POST', endpoint: '/api/user/profile', data: { bio: 'Changed via CSRF' } },
        { method: 'DELETE', endpoint: '/api/recipes/test-recipe', data: {} },
        { method: 'PUT', endpoint: '/api/families/members', data: { memberId: 'test' } }
      ];

      for (const csrfTest of csrfTests) {
        try {
          // Attempt request without CSRF token
          const response = await axios({
            method: csrfTest.method.toLowerCase(),
            url: `${testSuite.API_BASE_URL}${csrfTest.endpoint}`,
            data: csrfTest.data,
            headers: { 
              'Authorization': `Bearer ${testSuite.testUserToken}`,
              'Origin': 'https://malicious-site.com'
            }
          });

          if (response.status >= 200 && response.status < 300) {
            testSuite.recordVulnerability({
              testName: 'csrf-vulnerability',
              vulnerability: `CSRF vulnerability at ${csrfTest.method} ${csrfTest.endpoint}`,
              severity: 'high',
              exploitable: true,
              details: { method: csrfTest.method, endpoint: csrfTest.endpoint },
              remediation: 'Implement CSRF tokens for state-changing operations',
              complianceImpact: ['HIPAA']
            });
          }
        } catch (error) {
          // Expected behavior - CSRF protection should block the request
          expect(error.response?.status).toBeIn([403, 401]);
        }
      }
    });

    test('🔒 Data Transmission Security - HTTPS and secure headers', async () => {
      console.log('🧪 Testing data transmission security...');

      // Test HTTP Strict Transport Security (HSTS)
      const response = await axios.get(`${testSuite.APP_BASE_URL}`);
      
      if (!response.headers['strict-transport-security']) {
        testSuite.recordVulnerability({
          testName: 'missing-hsts-header',
          vulnerability: 'Missing HTTP Strict Transport Security (HSTS) header',
          severity: 'medium',
          exploitable: false,
          details: { headers: response.headers },
          remediation: 'Add HSTS header to enforce HTTPS connections',
          complianceImpact: ['HIPAA']
        });
      }

      // Test Content Security Policy
      if (!response.headers['content-security-policy']) {
        testSuite.recordVulnerability({
          testName: 'missing-csp-header',
          vulnerability: 'Missing Content Security Policy (CSP) header',
          severity: 'medium',
          exploitable: false,
          details: { headers: response.headers },
          remediation: 'Implement Content Security Policy to prevent XSS attacks',
          complianceImpact: ['HIPAA']
        });
      }

      // Test X-Frame-Options
      if (!response.headers['x-frame-options']) {
        testSuite.recordVulnerability({
          testName: 'missing-frame-options',
          vulnerability: 'Missing X-Frame-Options header (clickjacking protection)',
          severity: 'low',
          exploitable: false,
          details: { headers: response.headers },
          remediation: 'Add X-Frame-Options: DENY or SAMEORIGIN header',
          complianceImpact: []
        });
      }

      // Test X-Content-Type-Options
      if (!response.headers['x-content-type-options']) {
        testSuite.recordVulnerability({
          testName: 'missing-content-type-options',
          vulnerability: 'Missing X-Content-Type-Options header',
          severity: 'low',
          exploitable: false,
          details: { headers: response.headers },
          remediation: 'Add X-Content-Type-Options: nosniff header',
          complianceImpact: []
        });
      }
    });

    test('📁 File Upload Security - Malware and file type validation', async () => {
      console.log('🧪 Testing file upload security...');

      const maliciousFiles = [
        { name: 'test.php', content: '<?php system($_GET["cmd"]); ?>', type: 'application/x-php' },
        { name: 'test.exe', content: 'MZ\x90\x00\x03\x00\x00\x00', type: 'application/x-msdownload' },
        { name: 'test.js', content: 'eval(atob("YWxlcnQoIlhTUyIp"))', type: 'application/javascript' },
        { name: 'test.html', content: '<script>alert("XSS")</script>', type: 'text/html' }
      ];

      for (const maliciousFile of maliciousFiles) {
        try {
          const formData = new FormData();
          const blob = new Blob([maliciousFile.content], { type: maliciousFile.type });
          formData.append('file', blob, maliciousFile.name);

          const response = await axios.post(`${testSuite.API_BASE_URL}/api/upload/profile-image`, formData, {
            headers: {
              'Authorization': `Bearer ${testSuite.testUserToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.status >= 200 && response.status < 300) {
            testSuite.recordVulnerability({
              testName: 'malicious-file-upload',
              vulnerability: `Malicious file upload accepted: ${maliciousFile.name}`,
              severity: 'critical',
              exploitable: true,
              details: { fileName: maliciousFile.name, fileType: maliciousFile.type },
              remediation: 'Implement strict file type validation and malware scanning',
              complianceImpact: ['HIPAA', 'GDPR']
            });
          }
        } catch (error) {
          // Expected behavior - malicious files should be rejected
          expect(error.response?.status).toBeIn([400, 413, 415]);
        }
      }
    });
  });

  describe('🏥 Healthcare-Specific Security Testing', () => {
    
    test('🔐 PHI Data Handling - Protected Health Information security', async () => {
      console.log('🧪 Testing PHI data handling security...');

      // Test PHI data exposure in logs
      const phiTestData = {
        ssn: '123-45-6789',
        medicalRecordNumber: 'MRN123456',
        diagnosis: 'Type 2 Diabetes',
        medication: 'Metformin 500mg'
      };

      try {
        await axios.post(`${testSuite.API_BASE_URL}/api/health/metrics`, phiTestData, {
          headers: { 'Authorization': `Bearer ${testSuite.testUserToken}` }
        });

        // Check if PHI appears in error logs or responses
        const logsResponse = await axios.get(`${testSuite.API_BASE_URL}/api/admin/logs`, {
          headers: { 'Authorization': `Bearer ${testSuite.adminToken}` }
        });

        const logsContent = JSON.stringify(logsResponse.data).toLowerCase();
        
        if (logsContent.includes(phiTestData.ssn) || 
            logsContent.includes(phiTestData.medicalRecordNumber)) {
          testSuite.recordVulnerability({
            testName: 'phi-data-exposure-logs',
            vulnerability: 'PHI data exposed in application logs',
            severity: 'critical',
            exploitable: true,
            details: { phiFound: 'SSN or Medical Record Number in logs' },
            remediation: 'Implement PHI data masking in logs and error messages',
            complianceImpact: ['HIPAA']
          });
        }
      } catch (error) {
        // Error handling should not expose PHI
        const errorMessage = error.response?.data?.message || '';
        if (errorMessage.includes(phiTestData.ssn)) {
          testSuite.recordVulnerability({
            testName: 'phi-data-exposure-errors',
            vulnerability: 'PHI data exposed in error messages',
            severity: 'critical',
            exploitable: true,
            details: { errorMessage },
            remediation: 'Sanitize error messages to remove PHI data',
            complianceImpact: ['HIPAA']
          });
        }
      }
    });

    test('🔍 Clinical Data Integrity - Health information validation', async () => {
      console.log('🧪 Testing clinical data integrity...');

      const maliciousHealthData = [
        { field: 'bloodPressure', value: '<script>alert("XSS")</script>' },
        { field: 'weight', value: 'DROP TABLE health_metrics;' },
        { field: 'medication', value: '${7*7}' }, // Template injection
        { field: 'allergies', value: '../../../etc/passwd' } // Path traversal
      ];

      for (const testData of maliciousHealthData) {
        try {
          const payload = { [testData.field]: testData.value };
          
          const response = await axios.post(`${testSuite.API_BASE_URL}/api/health/metrics`, payload, {
            headers: { 'Authorization': `Bearer ${testSuite.testUserToken}` }
          });

          // Check if malicious data was stored without sanitization
          const storedData = await axios.get(`${testSuite.API_BASE_URL}/api/health/metrics`, {
            headers: { 'Authorization': `Bearer ${testSuite.testUserToken}` }
          });

          const storedValue = storedData.data?.[testData.field];
          
          if (storedValue === testData.value) {
            testSuite.recordVulnerability({
              testName: 'clinical-data-injection',
              vulnerability: `Malicious data stored in clinical field: ${testData.field}`,
              severity: 'high',
              exploitable: true,
              details: { field: testData.field, value: testData.value },
              remediation: 'Implement input validation and sanitization for health data',
              complianceImpact: ['HIPAA']
            });
          }
        } catch (error) {
          // Expected behavior - malicious health data should be rejected
          expect(error.response?.status).toBeIn([400, 422]);
        }
      }
    });

    test('🚨 Emergency Access Security - Critical health information protection', async () => {
      console.log('🧪 Testing emergency access security...');

      // Test unauthorized emergency access
      try {
        const response = await axios.get(`${testSuite.API_BASE_URL}/api/emergency/health-summary/test-user`);
        
        if (response.status === 200) {
          testSuite.recordVulnerability({
            testName: 'unauthorized-emergency-access',
            vulnerability: 'Emergency health information accessible without authentication',
            severity: 'critical',
            exploitable: true,
            details: { endpoint: '/api/emergency/health-summary' },
            remediation: 'Implement proper authentication for emergency access endpoints',
            complianceImpact: ['HIPAA']
          });
        }
      } catch (error) {
        // Expected behavior - should require authentication
        expect(error.response?.status).toBeIn([401, 403]);
      }

      // Test emergency access audit logging
      try {
        await axios.get(`${testSuite.API_BASE_URL}/api/emergency/health-summary/test-user`, {
          headers: { 'Authorization': `Bearer ${testSuite.adminToken}` }
        });

        // Verify emergency access is logged
        const auditLogs = await axios.get(`${testSuite.API_BASE_URL}/api/audit/emergency-access`, {
          headers: { 'Authorization': `Bearer ${testSuite.adminToken}` }
        });

        if (!auditLogs.data || auditLogs.data.length === 0) {
          testSuite.recordVulnerability({
            testName: 'emergency-access-not-logged',
            vulnerability: 'Emergency access to health data not properly audited',
            severity: 'high',
            exploitable: false,
            details: { auditLogCount: 0 },
            remediation: 'Implement comprehensive audit logging for emergency access',
            complianceImpact: ['HIPAA']
          });
        }
      } catch (error) {
        console.log('Emergency access testing requires proper setup');
      }
    });

    test('👨‍⚕️ Provider Integration Security - Healthcare provider data sharing', async () => {
      console.log('🧪 Testing healthcare provider integration security...');

      // Test provider authentication
      const providerEndpoints = [
        '/api/providers/patient-summary',
        '/api/providers/medication-history',
        '/api/providers/lab-results'
      ];

      for (const endpoint of providerEndpoints) {
        // Test without provider credentials
        try {
          const response = await axios.get(`${testSuite.API_BASE_URL}${endpoint}/test-patient`);
          
          if (response.status === 200) {
            testSuite.recordVulnerability({
              testName: 'provider-endpoint-no-auth',
              vulnerability: `Provider endpoint accessible without authentication: ${endpoint}`,
              severity: 'critical',
              exploitable: true,
              details: { endpoint },
              remediation: 'Implement strong authentication for provider endpoints',
              complianceImpact: ['HIPAA']
            });
          }
        } catch (error) {
          // Expected behavior - should require provider authentication
          expect(error.response?.status).toBeIn([401, 403]);
        }

        // Test with invalid provider token
        try {
          const response = await axios.get(`${testSuite.API_BASE_URL}${endpoint}/test-patient`, {
            headers: { 'Authorization': 'Bearer invalid-provider-token' }
          });
          
          if (response.status === 200) {
            testSuite.recordVulnerability({
              testName: 'provider-invalid-token-accepted',
              vulnerability: `Provider endpoint accepts invalid tokens: ${endpoint}`,
              severity: 'critical',
              exploitable: true,
              details: { endpoint },
              remediation: 'Implement proper provider token validation',
              complianceImpact: ['HIPAA']
            });
          }
        } catch (error) {
          // Expected behavior - invalid tokens should be rejected
          expect(error.response?.status).toBeIn([401, 403]);
        }
      }
    });

    test('🔒 Compliance Monitoring - Automated security compliance checking', async () => {
      console.log('🧪 Testing compliance monitoring systems...');

      // Test compliance monitoring endpoints
      try {
        const complianceResponse = await axios.get(`${testSuite.API_BASE_URL}/api/compliance/hipaa-status`, {
          headers: { 'Authorization': `Bearer ${testSuite.adminToken}` }
        });

        const complianceData = complianceResponse.data;

        // Validate compliance monitoring structure
        expect(complianceData).toHaveProperty('auditTrailComplete');
        expect(complianceData).toHaveProperty('encryptionStatus');
        expect(complianceData).toHaveProperty('accessControlsValid');
        expect(complianceData).toHaveProperty('lastComplianceCheck');

        // Check for compliance violations
        if (complianceData.complianceViolations && complianceData.complianceViolations.length > 0) {
          testSuite.recordVulnerability({
            testName: 'hipaa-compliance-violations',
            vulnerability: 'HIPAA compliance violations detected by monitoring system',
            severity: 'high',
            exploitable: false,
            details: { violations: complianceData.complianceViolations },
            remediation: 'Address identified HIPAA compliance violations',
            complianceImpact: ['HIPAA']
          });
        }

        console.log('✅ Compliance monitoring system operational');
      } catch (error) {
        testSuite.recordVulnerability({
          testName: 'compliance-monitoring-unavailable',
          vulnerability: 'HIPAA compliance monitoring system not accessible',
          severity: 'medium',
          exploitable: false,
          details: { error: error.message },
          remediation: 'Ensure compliance monitoring system is operational',
          complianceImpact: ['HIPAA']
        });
      }
    });
  });
});

export { SecurityPenetrationTestSuite }; 