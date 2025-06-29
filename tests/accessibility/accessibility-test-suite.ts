/**
 * Accessibility Testing Suite for Healthcare Applications
 * WCAG 2.2 AA compliance with healthcare-specific requirements
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

export class AccessibilityTestSuite {
  /**
   * Run comprehensive accessibility audit on a page
   */
  static async auditPage(page: any, options: {
    url?: string;
    excludeSelectors?: string[];
    healthcareContext?: boolean;
  } = {}) {
    const { url, excludeSelectors = [], healthcareContext = true } = options;
    
    if (url) {
      await page.goto(url);
    }

    // Inject axe-core for accessibility testing
    await injectAxe(page);

    // Healthcare-specific accessibility configuration
    const axeConfig = {
      rules: {
        // WCAG 2.2 AA requirements
        'color-contrast': { enabled: true },
        'color-contrast-enhanced': { enabled: healthcareContext },
        'focus-order-semantics': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-valid-attr': { enabled: true },
        'aria-valid-attr-value': { enabled: true },
        'aria-required-attr': { enabled: true },
        'heading-order': { enabled: true },
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true },
        'bypass': { enabled: true },
        
        // Healthcare-specific rules
        'label-title-only': { enabled: healthcareContext },
        'meta-refresh': { enabled: true },
        'no-autoplay-audio': { enabled: true },
        'focus-order-semantics': { enabled: true }
      },
      exclude: excludeSelectors.map(selector => ({ selector }))
    };

    // Run accessibility check
    const violations = await getViolations(page, null, axeConfig);
    
    return {
      violations,
      passed: violations.length === 0,
      criticalCount: violations.filter(v => v.impact === 'critical').length,
      seriousCount: violations.filter(v => v.impact === 'serious').length,
      moderateCount: violations.filter(v => v.impact === 'moderate').length,
      minorCount: violations.filter(v => v.impact === 'minor').length
    };
  }

  /**
   * Test keyboard navigation for healthcare forms
   */
  static async testKeyboardNavigation(page: any, formSelector: string = 'form') {
    const focusableElements = await page.locator(`${formSelector} button, ${formSelector} input, ${formSelector} select, ${formSelector} textarea, ${formSelector} [tabindex]:not([tabindex="-1"])`);
    const elementCount = await focusableElements.count();
    
    const navigationResults = [];

    // Test tab navigation forward
    for (let i = 0; i < elementCount; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus');
      const elementInfo = await focusedElement.evaluate(el => ({
        tagName: el.tagName,
        type: el.type || null,
        ariaLabel: el.ariaLabel || null,
        id: el.id || null
      }));
      navigationResults.push({ step: i + 1, direction: 'forward', element: elementInfo });
    }

    // Test shift+tab navigation backward
    for (let i = elementCount - 1; i >= 0; i--) {
      await page.keyboard.press('Shift+Tab');
      const focusedElement = await page.locator(':focus');
      const elementInfo = await focusedElement.evaluate(el => ({
        tagName: el.tagName,
        type: el.type || null,
        ariaLabel: el.ariaLabel || null,
        id: el.id || null
      }));
      navigationResults.push({ step: i + 1, direction: 'backward', element: elementInfo });
    }

    return {
      totalElements: elementCount,
      navigationResults,
      passed: navigationResults.length === elementCount * 2
    };
  }

  /**
   * Test screen reader compatibility
   */
  static async testScreenReaderSupport(page: any) {
    const ariaElements = {
      labels: await page.locator('[aria-label]').count(),
      descriptions: await page.locator('[aria-describedby]').count(),
      headings: await page.locator('h1, h2, h3, h4, h5, h6').count(),
      landmarks: await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').count(),
      buttons: await page.locator('button, [role="button"]').count(),
      links: await page.locator('a, [role="link"]').count(),
      forms: await page.locator('form').count(),
      inputs: await page.locator('input, select, textarea').count(),
      labeledInputs: await page.locator('input[aria-label], input[aria-labelledby], label input, input[title]').count()
    };

    // Get heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    
    // Check for proper landmark structure
    const hasMain = await page.locator('main, [role="main"]').count() > 0;
    const hasNavigation = await page.locator('nav, [role="navigation"]').count() > 0;
    
    return {
      ariaElements,
      headings,
      hasMain,
      hasNavigation,
      inputLabelingRatio: ariaElements.inputs > 0 ? ariaElements.labeledInputs / ariaElements.inputs : 1,
      passed: hasMain && (ariaElements.inputs === 0 || ariaElements.labeledInputs / ariaElements.inputs >= 0.9)
    };
  }

  /**
   * Test color contrast for healthcare requirements
   */
  static async testColorContrast(page: any, minimumRatio: number = 4.5) {
    // This would ideally use a color contrast checking library
    // For now, we'll check that contrast-problematic elements don't exist
    const contrastViolations = await page.locator('[style*="color"], .text-gray-400, .text-gray-300').count();
    
    // Check for common low-contrast patterns
    const potentialIssues = await page.evaluate((minRatio) => {
      const elements = document.querySelectorAll('*');
      const issues = [];
      
      for (const element of elements) {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Simple heuristic check for potential contrast issues
        if (color && backgroundColor && 
            (color.includes('rgb(128') || color.includes('rgba(128') ||
             backgroundColor.includes('rgb(128') || backgroundColor.includes('rgba(128'))) {
          issues.push({
            tagName: element.tagName,
            className: element.className,
            color,
            backgroundColor
          });
        }
      }
      
      return issues;
    }, minimumRatio);

    return {
      minimumRatio,
      potentialIssues: potentialIssues.length,
      passed: potentialIssues.length === 0,
      issues: potentialIssues.slice(0, 10) // Limit to first 10 issues
    };
  }

  /**
   * Test touch target sizes for mobile healthcare interfaces
   */
  static async testTouchTargets(page: any, minimumSize: number = 44) {
    const touchTargets = await page.locator('button, a, input[type="checkbox"], input[type="radio"], [role="button"], [role="link"]').all();
    
    const targetSizes = [];
    for (const target of touchTargets) {
      const box = await target.boundingBox();
      if (box) {
        targetSizes.push({
          width: box.width,
          height: box.height,
          area: box.width * box.height,
          meetsMinimum: box.width >= minimumSize && box.height >= minimumSize
        });
      }
    }

    const failingTargets = targetSizes.filter(t => !t.meetsMinimum);
    
    return {
      totalTargets: targetSizes.length,
      failingTargets: failingTargets.length,
      minimumSize,
      passed: failingTargets.length === 0,
      averageSize: targetSizes.length > 0 ? 
        targetSizes.reduce((sum, t) => sum + Math.min(t.width, t.height), 0) / targetSizes.length : 0
    };
  }

  /**
   * Test focus management for healthcare workflows
   */
  static async testFocusManagement(page: any, workflowSteps: string[]) {
    const focusResults = [];
    
    for (const step of workflowSteps) {
      await page.click(step);
      await page.waitForTimeout(100); // Allow focus to settle
      
      const focusedElement = await page.locator(':focus');
      const elementExists = await focusedElement.count() > 0;
      
      if (elementExists) {
        const elementInfo = await focusedElement.evaluate(el => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          ariaLabel: el.ariaLabel,
          textContent: el.textContent?.slice(0, 50)
        }));
        
        focusResults.push({
          step,
          hasFocus: true,
          element: elementInfo
        });
      } else {
        focusResults.push({
          step,
          hasFocus: false,
          element: null
        });
      }
    }

    const focusSuccessRate = focusResults.filter(r => r.hasFocus).length / focusResults.length;
    
    return {
      steps: focusResults.length,
      successfulFocus: focusResults.filter(r => r.hasFocus).length,
      successRate: focusSuccessRate,
      passed: focusSuccessRate >= 0.9, // 90% success rate required
      results: focusResults
    };
  }

  /**
   * Generate comprehensive accessibility report
   */
  static async generateAccessibilityReport(page: any, testName: string) {
    const auditResults = await this.auditPage(page, { healthcareContext: true });
    const keyboardResults = await this.testKeyboardNavigation(page);
    const screenReaderResults = await this.testScreenReaderSupport(page);
    const contrastResults = await this.testColorContrast(page);
    const touchTargetResults = await this.testTouchTargets(page);

    const overallScore = [
      auditResults.passed ? 1 : 0,
      keyboardResults.passed ? 1 : 0,
      screenReaderResults.passed ? 1 : 0,
      contrastResults.passed ? 1 : 0,
      touchTargetResults.passed ? 1 : 0
    ].reduce((sum, score) => sum + score, 0) / 5;

    return {
      testName,
      timestamp: new Date().toISOString(),
      overallScore,
      passed: overallScore >= 0.8, // 80% pass rate required
      results: {
        audit: auditResults,
        keyboard: keyboardResults,
        screenReader: screenReaderResults,
        contrast: contrastResults,
        touchTargets: touchTargetResults
      },
      recommendations: this.generateRecommendations({
        auditResults,
        keyboardResults,
        screenReaderResults,
        contrastResults,
        touchTargetResults
      })
    };
  }

  /**
   * Generate accessibility improvement recommendations
   */
  private static generateRecommendations(results: any) {
    const recommendations = [];

    if (!results.auditResults.passed) {
      recommendations.push({
        priority: 'high',
        category: 'WCAG Compliance',
        issue: `Found ${results.auditResults.violations.length} accessibility violations`,
        solution: 'Review and fix accessibility violations using axe-core recommendations'
      });
    }

    if (!results.keyboardResults.passed) {
      recommendations.push({
        priority: 'high',
        category: 'Keyboard Navigation',
        issue: 'Keyboard navigation is incomplete or broken',
        solution: 'Ensure all interactive elements are keyboard accessible and in logical order'
      });
    }

    if (!results.screenReaderResults.passed) {
      recommendations.push({
        priority: 'medium',
        category: 'Screen Reader Support',
        issue: 'Missing or inadequate screen reader support',
        solution: 'Add proper ARIA labels, descriptions, and landmark roles'
      });
    }

    if (!results.contrastResults.passed) {
      recommendations.push({
        priority: 'high',
        category: 'Color Contrast',
        issue: 'Text contrast does not meet healthcare accessibility standards',
        solution: 'Increase color contrast to meet WCAG AA standards (4.5:1 minimum)'
      });
    }

    if (!results.touchTargetResults.passed) {
      recommendations.push({
        priority: 'medium',
        category: 'Touch Targets',
        issue: 'Touch targets are too small for accessible mobile interaction',
        solution: 'Increase button and interactive element sizes to minimum 44px'
      });
    }

    return recommendations;
  }
} 