/**
 * Healthcare Performance Testing Suite
 * Specialized performance tests for healthcare data loading, processing, and visualization
 */

import { test, expect } from '@playwright/test';

export class HealthcarePerformanceTests {
  /**
   * Test healthcare data loading performance
   */
  static async testHealthDataLoading(page: any, dataSize: 'small' | 'medium' | 'large' = 'medium') {
    const dataSizes = {
      small: 50,
      medium: 500,
      large: 2000
    };

    const recordCount = dataSizes[dataSize];
    
    // Performance thresholds (in milliseconds)
    const thresholds = {
      small: { load: 1000, render: 500 },
      medium: { load: 3000, render: 1000 },
      large: { load: 8000, render: 2000 }
    };

    const startTime = Date.now();
    
    // Navigate to healthcare data page
    await page.goto('/health/dashboard');
    
    // Wait for initial load
    await page.waitForSelector('[data-testid="health-data-loaded"]', { timeout: 30000 });
    
    const loadTime = Date.now() - startTime;
    
    // Measure rendering performance
    const renderStartTime = Date.now();
    
    // Trigger data rendering (e.g., open detailed view)
    await page.click('[data-testid="detailed-health-view"]');
    await page.waitForSelector('[data-testid="health-details-rendered"]', { timeout: 15000 });
    
    const renderTime = Date.now() - renderStartTime;
    
    // Check if data is properly loaded
    const recordsLoaded = await page.locator('[data-testid="health-record"]').count();
    
    return {
      dataSize,
      recordCount,
      loadTime,
      renderTime,
      recordsLoaded,
      thresholds: thresholds[dataSize],
      loadPerformant: loadTime <= thresholds[dataSize].load,
      renderPerformant: renderTime <= thresholds[dataSize].render,
      passed: loadTime <= thresholds[dataSize].load && renderTime <= thresholds[dataSize].render
    };
  }

  /**
   * Test clinical data visualization performance
   */
  static async testClinicalVisualizationPerformance(page: any) {
    const performanceMetrics = [];
    
    // Navigate to clinical interface
    await page.goto('/clinical-interfaces-demo');
    
    // Test different visualization components
    const visualizations = [
      { name: 'Health Analytics', selector: '[data-testid="advanced-health-analytics"]' },
      { name: 'Drug Interactions', selector: '[data-testid="drug-interaction-dashboard"]' },
      { name: 'Clinical Data Entry', selector: '[data-testid="clinical-data-entry"]' }
    ];

    for (const viz of visualizations) {
      const startTime = performance.now();
      
      await page.click(viz.selector);
      await page.waitForSelector(`${viz.selector} [data-loaded="true"]`, { timeout: 10000 });
      
      const loadTime = performance.now() - startTime;
      
      performanceMetrics.push({
        visualization: viz.name,
        loadTime,
        performant: loadTime <= 2000 // 2 second threshold
      });
    }

    const averageLoadTime = performanceMetrics.reduce((sum, m) => sum + m.loadTime, 0) / performanceMetrics.length;
    const allPerformant = performanceMetrics.every(m => m.performant);

    return {
      visualizations: performanceMetrics,
      averageLoadTime,
      allPerformant,
      passed: allPerformant && averageLoadTime <= 1500
    };
  }

  /**
   * Test family account data synchronization performance
   */
  static async testFamilyDataSyncPerformance(page: any) {
    // Navigate to family management
    await page.goto('/family-demo');
    
    const startTime = performance.now();
    
    // Trigger family data sync
    await page.click('[data-testid="sync-family-data"]');
    await page.waitForSelector('[data-testid="family-sync-complete"]', { timeout: 15000 });
    
    const syncTime = performance.now() - startTime;
    
    // Check data integrity after sync
    const familyMembers = await page.locator('[data-testid="family-member"]').count();
    const healthProfiles = await page.locator('[data-testid="member-health-profile"]').count();
    
    return {
      syncTime,
      familyMembers,
      healthProfiles,
      dataIntegrity: familyMembers === healthProfiles,
      performant: syncTime <= 5000, // 5 second threshold
      passed: syncTime <= 5000 && familyMembers === healthProfiles
    };
  }

  /**
   * Test AI healthcare response performance
   */
  static async testAIResponsePerformance(page: any) {
    await page.goto('/gemini-demo');
    
    const aiTests = [
      {
        name: 'Recipe Generation',
        action: async () => {
          await page.fill('[data-testid="recipe-prompt"]', 'Heart-healthy dinner recipe');
          await page.click('[data-testid="generate-recipe"]');
          await page.waitForSelector('[data-testid="ai-response-complete"]', { timeout: 30000 });
        }
      },
      {
        name: 'Nutrition Analysis', 
        action: async () => {
          await page.click('[data-testid="nutrition-tab"]');
          await page.click('[data-testid="analyze-nutrition"]');
          await page.waitForSelector('[data-testid="nutrition-analysis-complete"]', { timeout: 20000 });
        }
      },
      {
        name: 'Healthcare Chat',
        action: async () => {
          await page.click('[data-testid="chat-tab"]');
          await page.fill('[data-testid="chat-input"]', 'What foods help with high blood pressure?');
          await page.click('[data-testid="send-chat"]');
          await page.waitForSelector('[data-testid="chat-response-complete"]', { timeout: 25000 });
        }
      }
    ];

    const results = [];
    for (const test of aiTests) {
      const startTime = performance.now();
      await test.action();
      const responseTime = performance.now() - startTime;
      
      results.push({
        name: test.name,
        responseTime,
        performant: responseTime <= 15000 // 15 second threshold for AI
      });
    }

    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const allPerformant = results.every(r => r.performant);

    return {
      aiTests: results,
      averageResponseTime,
      allPerformant,
      passed: allPerformant && averageResponseTime <= 12000
    };
  }

  /**
   * Test emergency access performance (critical timing)
   */
  static async testEmergencyAccessPerformance(page: any) {
    await page.goto('/health/dashboard');
    
    const startTime = performance.now();
    
    // Trigger emergency access
    await page.click('[data-testid="emergency-access-button"]');
    await page.waitForSelector('[data-testid="emergency-data-accessible"]', { timeout: 5000 });
    
    const emergencyAccessTime = performance.now() - startTime;
    
    // Verify emergency data is immediately available
    const criticalDataVisible = await page.locator('[data-testid="critical-health-info"]').count() > 0;
    const emergencyContactsVisible = await page.locator('[data-testid="emergency-contacts"]').count() > 0;
    
    return {
      emergencyAccessTime,
      criticalDataVisible,
      emergencyContactsVisible,
      performant: emergencyAccessTime <= 2000, // 2 second maximum for emergencies
      dataComplete: criticalDataVisible && emergencyContactsVisible,
      passed: emergencyAccessTime <= 2000 && criticalDataVisible && emergencyContactsVisible
    };
  }

  /**
   * Test mobile performance on healthcare interfaces
   */
  static async testMobilePerformance(page: any) {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileTests = [
      { name: 'Health Dashboard', url: '/health/dashboard' },
      { name: 'Family Management', url: '/family-demo' },
      { name: 'Emergency Access', url: '/health/emergency' },
      { name: 'Clinical Interface', url: '/clinical-interfaces-demo' }
    ];

    const results = [];
    for (const test of mobileTests) {
      const startTime = performance.now();
      
      await page.goto(test.url);
      await page.waitForLoadState('networkidle');
      
      const loadTime = performance.now() - startTime;
      
      // Check mobile-specific optimizations
      const touchTargetsCount = await page.locator('button, [role="button"]').count();
      const properTouchTargets = await page.locator('button[style*="min-height"], [role="button"][style*="min-height"]').count();
      
      results.push({
        name: test.name,
        loadTime,
        touchTargetsCount,
        properTouchTargets,
        touchTargetOptimization: touchTargetsCount > 0 ? properTouchTargets / touchTargetsCount : 1,
        performant: loadTime <= 3000 // 3 second threshold for mobile
      });
    }

    const averageLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    const averageTouchOptimization = results.reduce((sum, r) => sum + r.touchTargetOptimization, 0) / results.length;
    const allPerformant = results.every(r => r.performant);

    return {
      mobileTests: results,
      averageLoadTime,
      averageTouchOptimization,
      allPerformant,
      touchOptimized: averageTouchOptimization >= 0.8,
      passed: allPerformant && averageTouchOptimization >= 0.8
    };
  }

  /**
   * Comprehensive performance report
   */
  static async generatePerformanceReport(page: any) {
    const healthDataPerf = await this.testHealthDataLoading(page, 'medium');
    const clinicalVizPerf = await this.testClinicalVisualizationPerformance(page);
    const familySyncPerf = await this.testFamilyDataSyncPerformance(page);
    const aiResponsePerf = await this.testAIResponsePerformance(page);
    const emergencyPerf = await this.testEmergencyAccessPerformance(page);
    const mobilePerf = await this.testMobilePerformance(page);

    const overallScore = [
      healthDataPerf.passed ? 1 : 0,
      clinicalVizPerf.passed ? 1 : 0,
      familySyncPerf.passed ? 1 : 0,
      aiResponsePerf.passed ? 1 : 0,
      emergencyPerf.passed ? 1 : 0,
      mobilePerf.passed ? 1 : 0
    ].reduce((sum, score) => sum + score, 0) / 6;

    return {
      timestamp: new Date().toISOString(),
      overallScore,
      passed: overallScore >= 0.8,
      results: {
        healthDataLoading: healthDataPerf,
        clinicalVisualization: clinicalVizPerf,
        familyDataSync: familySyncPerf,
        aiResponse: aiResponsePerf,
        emergencyAccess: emergencyPerf,
        mobilePerformance: mobilePerf
      },
      recommendations: this.generatePerformanceRecommendations({
        healthDataPerf,
        clinicalVizPerf,
        familySyncPerf,
        aiResponsePerf,
        emergencyPerf,
        mobilePerf
      })
    };
  }

  /**
   * Generate performance improvement recommendations
   */
  private static generatePerformanceRecommendations(results: any) {
    const recommendations = [];

    if (!results.healthDataPerf.passed) {
      recommendations.push({
        priority: 'high',
        category: 'Data Loading',
        issue: 'Healthcare data loading exceeds performance thresholds',
        solution: 'Implement data pagination, lazy loading, and optimize database queries'
      });
    }

    if (!results.emergencyPerf.passed) {
      recommendations.push({
        priority: 'critical',
        category: 'Emergency Access',
        issue: 'Emergency access is too slow for critical healthcare scenarios',
        solution: 'Cache critical data locally and optimize emergency data retrieval'
      });
    }

    if (!results.mobilePerf.passed) {
      recommendations.push({
        priority: 'medium',
        category: 'Mobile Performance',
        issue: 'Mobile performance does not meet healthcare accessibility standards',
        solution: 'Optimize mobile interfaces and implement progressive loading'
      });
    }

    if (!results.aiResponsePerf.passed) {
      recommendations.push({
        priority: 'medium',
        category: 'AI Performance',
        issue: 'AI response times exceed user experience expectations',
        solution: 'Implement response streaming and caching for common queries'
      });
    }

    return recommendations;
  }
} 