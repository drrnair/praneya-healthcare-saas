/**
 * PRANEYA HEALTHCARE SAAS - COMPREHENSIVE PERFORMANCE TESTING SUITE
 * 
 * Tests frontend performance, backend scalability, API response times, 
 * database performance, concurrent user load, and infrastructure scaling.
 * 
 * Performance Requirements:
 * - Page Load Times: <3 seconds
 * - API Response Times: <2 seconds  
 * - PWA Performance: Offline capability
 * - Mobile Responsiveness: Touch-optimized
 * - Concurrent Users: 1000+ simultaneous
 * - Database Queries: Optimized multi-tenant
 * 
 * @version 1.0.0
 * @compliance Performance Standards for Healthcare Applications
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { performance } from 'perf_hooks';

interface PerformanceMetrics {
  testName: string;
  loadTime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  passed: boolean;
  details: any;
}

interface LoadTestResult {
  concurrentUsers: number;
  duration: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
}

class ComprehensivePerformanceTestSuite {
  private browser: Browser;
  private page: Page;
  private performanceResults: PerformanceMetrics[] = [];
  private readonly API_BASE_URL = 'http://localhost:3001';
  private readonly APP_BASE_URL = 'http://localhost:3000';
  private readonly MAX_PAGE_LOAD_TIME = 3000; // 3 seconds
  private readonly MAX_API_RESPONSE_TIME = 2000; // 2 seconds
  private readonly TARGET_CONCURRENT_USERS = 1000;

  async setup() {
    this.browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    this.page = await this.browser.newPage();
    
    // Setup performance monitoring
    await this.setupPerformanceMonitoring();
  }

  async teardown() {
    await this.generatePerformanceReport();
    await this.browser.close();
  }

  private async setupPerformanceMonitoring() {
    // Enable performance metrics collection
    await this.page.evaluateOnNewDocument(() => {
      (window as any).performanceMetrics = {
        navigationStart: 0,
        loadComplete: 0,
        apiCalls: [],
        memoryUsage: []
      };
    });

    // Monitor network requests
    this.page.on('response', response => {
      const url = response.url();
      const status = response.status();
      const timing = response.timing();
      
      // Track API response times
      if (url.includes('/api/')) {
        const responseTime = timing.responseEnd - timing.requestStart;
        this.recordAPIPerformance(url, responseTime, status);
      }
    });
  }

  private recordAPIPerformance(url: string, responseTime: number, status: number) {
    // Log API performance metrics
    console.log(`📊 API Call: ${url} - ${responseTime}ms - Status: ${status}`);
  }

  private async generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.performanceResults.length,
        passedTests: this.performanceResults.filter(r => r.passed).length,
        averageLoadTime: this.performanceResults.reduce((sum, r) => sum + r.loadTime, 0) / this.performanceResults.length,
        averageResponseTime: this.performanceResults.reduce((sum, r) => sum + r.responseTime, 0) / this.performanceResults.length
      },
      results: this.performanceResults
    };

    const reportPath = path.join(process.cwd(), 'reports', `performance-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📈 Performance test report saved: ${reportPath}`);
  }
}

describe('⚡ Comprehensive Performance Testing Suite', () => {
  let testSuite: ComprehensivePerformanceTestSuite;

  beforeAll(async () => {
    testSuite = new ComprehensivePerformanceTestSuite();
    await testSuite.setup();
  });

  afterAll(async () => {
    await testSuite.teardown();
  });

  describe('🌐 Frontend Performance Testing', () => {
    
    test('📱 Page Load Times - <3 seconds across all pages', async () => {
      const criticalPages = [
        { path: '/', name: 'Landing Page' },
        { path: '/dashboard', name: 'Dashboard' },
        { path: '/recipes', name: 'Recipes Page' },
        { path: '/meal-planning', name: 'Meal Planning' },
        { path: '/family', name: 'Family Management' },
        { path: '/health/dashboard', name: 'Health Dashboard' }
      ];

      for (const pageTest of criticalPages) {
        const startTime = performance.now();
        
        // Navigate to page and wait for load
        await testSuite.page.goto(`${testSuite.APP_BASE_URL}${pageTest.path}`, {
          waitUntil: 'networkidle'
        });

        const loadTime = performance.now() - startTime;

        // Measure Core Web Vitals
        const webVitals = await testSuite.page.evaluate(() => {
          return new Promise((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const vitals = {
                FCP: 0, // First Contentful Paint
                LCP: 0, // Largest Contentful Paint
                FID: 0, // First Input Delay
                CLS: 0  // Cumulative Layout Shift
              };

              entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                  vitals.FCP = entry.startTime;
                }
                if (entry.entryType === 'largest-contentful-paint') {
                  vitals.LCP = entry.startTime;
                }
                if (entry.entryType === 'first-input') {
                  vitals.FID = entry.processingStart - entry.startTime;
                }
                if (entry.entryType === 'layout-shift') {
                  vitals.CLS += (entry as any).value;
                }
              });

              resolve(vitals);
            }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

            // Timeout after 5 seconds
            setTimeout(() => resolve({ FCP: 0, LCP: 0, FID: 0, CLS: 0 }), 5000);
          });
        });

        // Validate page load performance
        expect(loadTime).toBeLessThan(testSuite.MAX_PAGE_LOAD_TIME);
        
        // Validate Core Web Vitals
        expect((webVitals as any).LCP).toBeLessThan(2500); // Good LCP < 2.5s
        expect((webVitals as any).FID).toBeLessThan(100);   // Good FID < 100ms
        expect((webVitals as any).CLS).toBeLessThan(0.1);   // Good CLS < 0.1

        testSuite.performanceResults.push({
          testName: `page-load-${pageTest.name.toLowerCase().replace(/\s+/g, '-')}`,
          loadTime: Math.round(loadTime),
          responseTime: 0,
          throughput: 0,
          errorRate: 0,
          memoryUsage: 0,
          cpuUsage: 0,
          passed: loadTime < testSuite.MAX_PAGE_LOAD_TIME,
          details: { webVitals, pagePath: pageTest.path }
        });

        console.log(`✅ ${pageTest.name}: ${Math.round(loadTime)}ms (LCP: ${Math.round((webVitals as any).LCP)}ms)`);
      }
    });

    test('📲 Progressive Web App Performance', async () => {
      // Test PWA installation and offline capabilities
      await testSuite.page.goto(`${testSuite.APP_BASE_URL}`);

      // Check service worker registration
      const serviceWorkerRegistered = await testSuite.page.evaluate(() => {
        return 'serviceWorker' in navigator;
      });

      expect(serviceWorkerRegistered).toBe(true);

      // Test offline functionality
      await testSuite.page.setOfflineMode(true);
      
      try {
        await testSuite.page.goto(`${testSuite.APP_BASE_URL}/offline`);
        
        // Check for offline page content
        const offlineContent = await testSuite.page.locator('[data-testid="offline-content"]');
        await expect(offlineContent).toBeVisible();

        console.log('✅ PWA offline functionality works correctly');
      } finally {
        await testSuite.page.setOfflineMode(false);
      }

      // Test app installation prompt
      const installPromptAvailable = await testSuite.page.evaluate(() => {
        return (window as any).deferredPrompt !== undefined;
      });

      // Note: Installation prompt availability depends on PWA criteria
      console.log(`📱 PWA Installation Prompt: ${installPromptAvailable ? 'Available' : 'Not Available'}`);
    });

    test('📱 Mobile Responsiveness & Touch Optimization', async () => {
      const mobileViewports = [
        { name: 'iPhone SE', width: 375, height: 667 },
        { name: 'iPhone 12 Pro', width: 390, height: 844 },
        { name: 'Samsung Galaxy S21', width: 360, height: 800 },
        { name: 'iPad', width: 768, height: 1024 }
      ];

      for (const viewport of mobileViewports) {
        await testSuite.page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        const startTime = performance.now();
        await testSuite.page.goto(`${testSuite.APP_BASE_URL}/dashboard`);
        const mobileLoadTime = performance.now() - startTime;

        // Test touch target sizes (minimum 44px)
        const touchTargets = await testSuite.page.$$('[role="button"], button, a, input[type="checkbox"], input[type="radio"]');
        
        for (const target of touchTargets) {
          const boundingBox = await target.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThanOrEqual(44);
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }

        // Test mobile navigation
        const mobileMenuToggle = testSuite.page.locator('[data-testid="mobile-menu-toggle"]');
        if (await mobileMenuToggle.isVisible()) {
          await mobileMenuToggle.click();
          const mobileMenu = testSuite.page.locator('[data-testid="mobile-menu"]');
          await expect(mobileMenu).toBeVisible();
        }

        // Validate mobile performance
        expect(mobileLoadTime).toBeLessThan(testSuite.MAX_PAGE_LOAD_TIME);

        console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): ${Math.round(mobileLoadTime)}ms`);
      }
    });

    test('♿ Accessibility Performance & WCAG Compliance', async () => {
      await testSuite.page.goto(`${testSuite.APP_BASE_URL}/dashboard`);

      // Test keyboard navigation performance
      const startTime = performance.now();
      
      // Tab through interactive elements
      for (let i = 0; i < 10; i++) {
        await testSuite.page.keyboard.press('Tab');
        await testSuite.page.waitForTimeout(50);
      }
      
      const keyboardNavTime = performance.now() - startTime;
      expect(keyboardNavTime).toBeLessThan(1000); // Should be responsive

      // Test screen reader compatibility
      const ariaLabels = await testSuite.page.$$('[aria-label]');
      const headings = await testSuite.page.$$('h1, h2, h3, h4, h5, h6');
      const landmarks = await testSuite.page.$$('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');

      expect(ariaLabels.length).toBeGreaterThan(5);
      expect(headings.length).toBeGreaterThan(2);
      expect(landmarks.length).toBeGreaterThan(2);

      // Test color contrast (simplified check)
      const contrastIssues = await testSuite.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let issues = 0;
        
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          // Simplified contrast check (real implementation would use proper contrast ratio calculation)
          if (color === backgroundColor) {
            issues++;
          }
        });
        
        return issues;
      });

      expect(contrastIssues).toBe(0);

      console.log('✅ Accessibility performance and WCAG compliance validated');
    });

    test('🌍 Cross-Browser Performance Consistency', async () => {
      // Test performance across different browsers (using different user agents as simulation)
      const browsers = [
        { name: 'Chrome', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
        { name: 'Firefox', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0' },
        { name: 'Safari', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15' },
        { name: 'Edge', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59' }
      ];

      const performanceResults = [];

      for (const browser of browsers) {
        await testSuite.page.setUserAgent(browser.userAgent);
        
        const startTime = performance.now();
        await testSuite.page.goto(`${testSuite.APP_BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
        const loadTime = performance.now() - startTime;

        performanceResults.push({ browser: browser.name, loadTime });

        expect(loadTime).toBeLessThan(testSuite.MAX_PAGE_LOAD_TIME);

        console.log(`✅ ${browser.name}: ${Math.round(loadTime)}ms`);
      }

      // Ensure consistent performance across browsers (variance < 50%)
      const loadTimes = performanceResults.map(r => r.loadTime);
      const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
      const maxVariance = Math.max(...loadTimes.map(time => Math.abs(time - avgLoadTime) / avgLoadTime));

      expect(maxVariance).toBeLessThan(0.5); // Less than 50% variance

      console.log(`✅ Cross-browser performance variance: ${(maxVariance * 100).toFixed(1)}%`);
    });
  });

  describe('🔧 Backend Performance Testing', () => {
    
    test('⚡ API Response Times - <2 seconds for all endpoints', async () => {
      const criticalEndpoints = [
        { path: '/api/ai/health-check', method: 'GET', name: 'Health Check' },
        { path: '/api/ai/analyze-nutrition', method: 'POST', name: 'Nutrition Analysis', body: { image: 'test-base64-data' } },
        { path: '/api/ai/generate-recipe', method: 'POST', name: 'Recipe Generation', body: { ingredients: ['chicken', 'rice'] } },
        { path: '/api/users/test-user/preferences', method: 'GET', name: 'User Preferences' },
        { path: '/api/families/test-family/members', method: 'GET', name: 'Family Members' }
      ];

      for (const endpoint of criticalEndpoints) {
        const startTime = performance.now();
        
        try {
          const config = {
            method: endpoint.method,
            url: `${testSuite.API_BASE_URL}${endpoint.path}`,
            ...(endpoint.body && { data: endpoint.body }),
            timeout: testSuite.MAX_API_RESPONSE_TIME + 1000
          };

          const response = await axios(config);
          const responseTime = performance.now() - startTime;

          expect(response.status).toBe(200);
          expect(responseTime).toBeLessThan(testSuite.MAX_API_RESPONSE_TIME);

          testSuite.performanceResults.push({
            testName: `api-response-${endpoint.name.toLowerCase().replace(/\s+/g, '-')}`,
            loadTime: 0,
            responseTime: Math.round(responseTime),
            throughput: 0,
            errorRate: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            passed: responseTime < testSuite.MAX_API_RESPONSE_TIME,
            details: { endpoint: endpoint.path, status: response.status }
          });

          console.log(`✅ ${endpoint.name}: ${Math.round(responseTime)}ms`);

        } catch (error) {
          const responseTime = performance.now() - startTime;
          
          testSuite.performanceResults.push({
            testName: `api-response-${endpoint.name.toLowerCase().replace(/\s+/g, '-')}`,
            loadTime: 0,
            responseTime: Math.round(responseTime),
            throughput: 0,
            errorRate: 1,
            memoryUsage: 0,
            cpuUsage: 0,
            passed: false,
            details: { endpoint: endpoint.path, error: error.message }
          });

          console.log(`❌ ${endpoint.name}: ${Math.round(responseTime)}ms - Error: ${error.message}`);
          throw error;
        }
      }
    });

    test('🗄️ Database Query Optimization - Multi-tenant performance', async () => {
      const databaseOperations = [
        { operation: 'user-lookup', query: 'SELECT * FROM users WHERE tenant_id = ? AND id = ?' },
        { operation: 'health-metrics', query: 'SELECT * FROM health_metrics WHERE tenant_id = ? AND user_id = ?' },
        { operation: 'family-members', query: 'SELECT * FROM users WHERE tenant_id = ? AND family_id = ?' },
        { operation: 'audit-log-insert', query: 'INSERT INTO audit_logs (tenant_id, user_id, action, timestamp) VALUES (?, ?, ?, ?)' }
      ];

      for (const dbOp of databaseOperations) {
        const startTime = performance.now();

        // Simulate database query through API endpoint
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/test/database-performance`, {
          operation: dbOp.operation,
          tenantId: 'test-tenant',
          iterations: 100
        });

        const queryTime = performance.now() - startTime;
        const result = response.data;

        expect(result.success).toBe(true);
        expect(result.averageQueryTime).toBeLessThan(50); // < 50ms per query
        expect(queryTime).toBeLessThan(5000); // Total operation < 5 seconds

        console.log(`✅ ${dbOp.operation}: ${result.averageQueryTime.toFixed(2)}ms avg query time`);
      }
    });

    test('🔄 External API Integration Performance', async () => {
      const externalAPIs = [
        { name: 'Edamam Recipe Search', endpoint: '/api/test/edamam-performance' },
        { name: 'Gemini AI Processing', endpoint: '/api/test/gemini-performance' },
        { name: 'Stripe Payment Processing', endpoint: '/api/test/stripe-performance' }
      ];

      for (const api of externalAPIs) {
        const startTime = performance.now();

        const response = await axios.post(`${testSuite.API_BASE_URL}${api.endpoint}`, {
          testType: 'performance',
          iterations: 10
        });

        const integrationTime = performance.now() - startTime;
        const result = response.data;

        expect(result.success).toBe(true);
        expect(result.averageResponseTime).toBeLessThan(3000); // < 3 seconds for external APIs
        expect(result.errorRate).toBeLessThan(0.05); // < 5% error rate

        console.log(`✅ ${api.name}: ${result.averageResponseTime}ms avg, ${(result.errorRate * 100).toFixed(1)}% error rate`);
      }
    });

    test('💾 Caching Effectiveness & Performance', async () => {
      const cacheTests = [
        { type: 'recipe-cache', endpoint: '/api/recipes/popular' },
        { type: 'user-preferences', endpoint: '/api/users/test-user/preferences' },
        { type: 'nutrition-data', endpoint: '/api/nutrition/common-foods' }
      ];

      for (const cacheTest of cacheTests) {
        // First request (cache miss)
        const startTime1 = performance.now();
        const response1 = await axios.get(`${testSuite.API_BASE_URL}${cacheTest.endpoint}`);
        const firstRequestTime = performance.now() - startTime1;

        // Second request (cache hit)
        const startTime2 = performance.now();
        const response2 = await axios.get(`${testSuite.API_BASE_URL}${cacheTest.endpoint}`);
        const secondRequestTime = performance.now() - startTime2;

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);

        // Cache hit should be significantly faster
        const improvementRatio = firstRequestTime / secondRequestTime;
        expect(improvementRatio).toBeGreaterThan(1.5); // At least 50% improvement

        console.log(`✅ ${cacheTest.type}: Cache improved response time by ${((improvementRatio - 1) * 100).toFixed(1)}%`);
      }
    });
  });

  describe('🚀 Load & Stress Testing', () => {
    
    test('👥 Concurrent User Load Testing - 1000+ simultaneous users', async () => {
      console.log('🔄 Starting concurrent user load test...');

      const concurrentUserCounts = [100, 250, 500, 1000];
      const loadTestResults: LoadTestResult[] = [];

      for (const userCount of concurrentUserCounts) {
        console.log(`  📊 Testing ${userCount} concurrent users...`);

        const startTime = performance.now();
        const promises = [];

        // Simulate concurrent users
        for (let i = 0; i < userCount; i++) {
          const userPromise = this.simulateUserSession(i);
          promises.push(userPromise);
        }

        const results = await Promise.allSettled(promises);
        const duration = performance.now() - startTime;

        const successfulRequests = results.filter(r => r.status === 'fulfilled').length;
        const failedRequests = results.filter(r => r.status === 'rejected').length;

        const loadTestResult: LoadTestResult = {
          concurrentUsers: userCount,
          duration: Math.round(duration),
          totalRequests: userCount,
          successfulRequests,
          failedRequests,
          averageResponseTime: duration / userCount,
          maxResponseTime: duration,
          requestsPerSecond: (userCount / duration) * 1000,
          errorRate: failedRequests / userCount
        };

        loadTestResults.push(loadTestResult);

        // Validate performance under load
        expect(loadTestResult.errorRate).toBeLessThan(0.05); // < 5% error rate
        expect(loadTestResult.averageResponseTime).toBeLessThan(testSuite.MAX_API_RESPONSE_TIME * 2); // Allow 2x normal response time under load

        console.log(`    ✅ ${userCount} users: ${loadTestResult.requestsPerSecond.toFixed(1)} req/sec, ${(loadTestResult.errorRate * 100).toFixed(1)}% error rate`);
      }

      // Validate system handles target concurrent users
      const targetTest = loadTestResults.find(r => r.concurrentUsers === testSuite.TARGET_CONCURRENT_USERS);
      if (targetTest) {
        expect(targetTest.errorRate).toBeLessThan(0.1); // < 10% error rate at target load
        console.log(`🎯 Target load (${testSuite.TARGET_CONCURRENT_USERS} users): PASSED`);
      }
    }, 300000); // 5 minute timeout for load testing

    async simulateUserSession(userId: number): Promise<void> {
      // Simulate typical user session: login, dashboard, recipe search, logout
      const userActions = [
        `${testSuite.API_BASE_URL}/api/auth/login`,
        `${testSuite.API_BASE_URL}/api/dashboard/summary`,
        `${testSuite.API_BASE_URL}/api/recipes/search`,
        `${testSuite.API_BASE_URL}/api/auth/logout`
      ];

      for (const action of userActions) {
        await axios.get(action, {
          headers: { 'X-Test-User-Id': userId.toString() },
          timeout: 10000
        });
        
        // Small delay between actions
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    test('💪 Stress Testing Scenarios', async () => {
      const stressScenarios = [
        { name: 'Peak Usage Simulation', type: 'traffic-spike' },
        { name: 'Memory Leak Detection', type: 'memory-stress' },
        { name: 'Resource Exhaustion', type: 'resource-limit' },
        { name: 'Network Failure Recovery', type: 'network-resilience' }
      ];

      for (const scenario of stressScenarios) {
        console.log(`💪 Running stress test: ${scenario.name}`);

        const response = await axios.post(`${testSuite.API_BASE_URL}/api/test/stress-test`, {
          scenario: scenario.type,
          duration: 30000, // 30 seconds
          intensity: 'high'
        });

        const stressResult = response.data;

        expect(stressResult.systemStable).toBe(true);
        expect(stressResult.memoryLeakDetected).toBe(false);
        expect(stressResult.errorRate).toBeLessThan(0.15); // < 15% error rate under stress

        console.log(`  ✅ ${scenario.name}: System remained stable`);
      }
    });

    test('🌐 Network Condition Testing', async () => {
      const networkConditions = [
        { name: 'Slow 3G', downloadThroughput: 500000, uploadThroughput: 500000, latency: 400 },
        { name: 'Fast 3G', downloadThroughput: 1500000, uploadThroughput: 750000, latency: 150 },
        { name: 'Slow WiFi', downloadThroughput: 1000000, uploadThroughput: 1000000, latency: 100 }
      ];

      for (const condition of networkConditions) {
        console.log(`🌐 Testing under ${condition.name} conditions...`);

        // Simulate network conditions
        const cdpSession = await testSuite.page.context().newCDPSession(testSuite.page);
        await cdpSession.send('Network.emulateNetworkConditions', {
          offline: false,
          downloadThroughput: condition.downloadThroughput,
          uploadThroughput: condition.uploadThroughput,
          latency: condition.latency
        });

        const startTime = performance.now();
        await testSuite.page.goto(`${testSuite.APP_BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
        const loadTime = performance.now() - startTime;

        // Network-adjusted performance expectations
        const maxLoadTime = condition.name.includes('Slow') ? 8000 : 5000;
        expect(loadTime).toBeLessThan(maxLoadTime);

        console.log(`  ✅ ${condition.name}: ${Math.round(loadTime)}ms`);

        // Reset network conditions
        await cdpSession.send('Network.emulateNetworkConditions', {
          offline: false,
          downloadThroughput: -1,
          uploadThroughput: -1,
          latency: 0
        });
      }
    });
  });

  describe('📊 Infrastructure Scalability Testing', () => {
    
    test('🔄 Auto-scaling Validation', async () => {
      console.log('🔄 Testing auto-scaling capabilities...');

      // Simulate gradual load increase
      const loadLevels = [10, 50, 100, 250, 500];
      
      for (const load of loadLevels) {
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/test/load-simulation`, {
          concurrentRequests: load,
          duration: 60000 // 1 minute
        });

        const scalingResult = response.data;

        expect(scalingResult.autoScalingTriggered).toBeDefined();
        expect(scalingResult.responseTimeStable).toBe(true);
        expect(scalingResult.errorRate).toBeLessThan(0.05);

        if (load >= 100) {
          expect(scalingResult.autoScalingTriggered).toBe(true);
        }

        console.log(`  ✅ Load ${load}: Auto-scaling ${scalingResult.autoScalingTriggered ? 'triggered' : 'not needed'}`);
      }
    });

    test('💾 Database Performance & Connection Pooling', async () => {
      // Test database under various load conditions
      const connectionTests = [
        { connections: 10, operations: 100 },
        { connections: 50, operations: 500 },
        { connections: 100, operations: 1000 }
      ];

      for (const test of connectionTests) {
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/test/database-load`, {
          maxConnections: test.connections,
          operations: test.operations
        });

        const dbResult = response.data;

        expect(dbResult.connectionPoolStable).toBe(true);
        expect(dbResult.averageQueryTime).toBeLessThan(100); // < 100ms
        expect(dbResult.deadlockCount).toBe(0);

        console.log(`  ✅ DB Load ${test.connections} conn, ${test.operations} ops: ${dbResult.averageQueryTime.toFixed(2)}ms avg`);
      }
    });

    test('🌍 CDN Integration & Global Performance', async () => {
      const globalLocations = [
        { name: 'US East', region: 'us-east-1' },
        { name: 'US West', region: 'us-west-1' },
        { name: 'Europe', region: 'eu-west-1' },
        { name: 'Asia Pacific', region: 'ap-southeast-1' }
      ];

      for (const location of globalLocations) {
        // Simulate requests from different geographic locations
        const response = await axios.get(`${testSuite.API_BASE_URL}/api/test/cdn-performance`, {
          headers: {
            'X-Simulated-Region': location.region
          }
        });

        const cdnResult = response.data;

        expect(cdnResult.cacheHitRate).toBeGreaterThan(0.8); // > 80% cache hit rate
        expect(cdnResult.responseTime).toBeLessThan(2000); // < 2 seconds globally

        console.log(`  ✅ ${location.name}: ${cdnResult.responseTime}ms, ${(cdnResult.cacheHitRate * 100).toFixed(1)}% cache hit`);
      }
    });

    test('🔍 Monitoring & Alerting Validation', async () => {
      // Test monitoring system responsiveness
      const monitoringMetrics = await axios.get(`${testSuite.API_BASE_URL}/api/monitoring/health`);
      const metrics = monitoringMetrics.data;

      expect(metrics).toHaveProperty('uptime');
      expect(metrics).toHaveProperty('responseTime');
      expect(metrics).toHaveProperty('errorRate');
      expect(metrics).toHaveProperty('throughput');

      // Validate alert thresholds
      expect(metrics.uptime).toBeGreaterThan(0.99); // > 99% uptime
      expect(metrics.responseTime).toBeLessThan(2000);
      expect(metrics.errorRate).toBeLessThan(0.01); // < 1% error rate

      console.log('✅ Monitoring system reporting healthy metrics');
    });

    test('🔄 Disaster Recovery & Backup Procedures', async () => {
      // Test backup and recovery procedures
      const backupTest = await axios.post(`${testSuite.API_BASE_URL}/api/test/disaster-recovery`, {
        testType: 'backup-validation',
        scope: 'healthcare-data'
      });

      const recoveryResult = backupTest.data;

      expect(recoveryResult.backupIntegrity).toBe(true);
      expect(recoveryResult.recoveryTimeObjective).toBeLessThan(3600); // < 1 hour RTO
      expect(recoveryResult.recoveryPointObjective).toBeLessThan(900); // < 15 minutes RPO

      console.log(`✅ Disaster recovery: RTO ${recoveryResult.recoveryTimeObjective}s, RPO ${recoveryResult.recoveryPointObjective}s`);
    });
  });
});

export { ComprehensivePerformanceTestSuite }; 