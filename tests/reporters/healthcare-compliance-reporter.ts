/**
 * Healthcare Compliance Reporter
 * Custom Playwright reporter for healthcare testing compliance
 */

import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface ComplianceMetrics {
  accessibilityTests: { passed: number; failed: number; violations: any[] };
  clinicalSafetyTests: { passed: number; failed: number; risks: any[] };
  hipaaComplianceTests: { passed: number; failed: number; issues: any[] };
  performanceTests: { passed: number; failed: number; slowTests: any[] };
  emergencyAccessTests: { passed: number; failed: number; criticalFailures: any[] };
  familyPrivacyTests: { passed: number; failed: number; privacyViolations: any[] };
}

class HealthcareComplianceReporter implements Reporter {
  private startTime: number = 0;
  private compliance: ComplianceMetrics = {
    accessibilityTests: { passed: 0, failed: 0, violations: [] },
    clinicalSafetyTests: { passed: 0, failed: 0, risks: [] },
    hipaaComplianceTests: { passed: 0, failed: 0, issues: [] },
    performanceTests: { passed: 0, failed: 0, slowTests: [] },
    emergencyAccessTests: { passed: 0, failed: 0, criticalFailures: [] },
    familyPrivacyTests: { passed: 0, failed: 0, privacyViolations: [] }
  };

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    console.log('🏥 Starting Healthcare Compliance Testing...');
    console.log(`Running ${suite.allTests().length} healthcare compliance tests`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testTitle = test.title.toLowerCase();
    const passed = result.status === 'passed';

    // Categorize tests based on healthcare domains
    if (testTitle.includes('accessibility') || testTitle.includes('a11y') || testTitle.includes('wcag')) {
      if (passed) {
        this.compliance.accessibilityTests.passed++;
      } else {
        this.compliance.accessibilityTests.failed++;
        this.compliance.accessibilityTests.violations.push({
          test: test.title,
          error: result.error?.message,
          location: test.location
        });
      }
    }

    if (testTitle.includes('clinical') || testTitle.includes('drug') || testTitle.includes('allergy')) {
      if (passed) {
        this.compliance.clinicalSafetyTests.passed++;
      } else {
        this.compliance.clinicalSafetyTests.failed++;
        this.compliance.clinicalSafetyTests.risks.push({
          test: test.title,
          riskLevel: this.assessClinicalRisk(test.title),
          error: result.error?.message
        });
      }
    }

    if (testTitle.includes('hipaa') || testTitle.includes('phi') || testTitle.includes('audit')) {
      if (passed) {
        this.compliance.hipaaComplianceTests.passed++;
      } else {
        this.compliance.hipaaComplianceTests.failed++;
        this.compliance.hipaaComplianceTests.issues.push({
          test: test.title,
          complianceIssue: this.categorizeHIPAAIssue(test.title),
          error: result.error?.message
        });
      }
    }

    if (testTitle.includes('performance') || testTitle.includes('speed') || testTitle.includes('load')) {
      if (passed) {
        this.compliance.performanceTests.passed++;
      } else {
        this.compliance.performanceTests.failed++;
        this.compliance.performanceTests.slowTests.push({
          test: test.title,
          duration: result.duration,
          threshold: this.getPerformanceThreshold(test.title)
        });
      }
    }

    if (testTitle.includes('emergency') || testTitle.includes('critical access')) {
      if (passed) {
        this.compliance.emergencyAccessTests.passed++;
      } else {
        this.compliance.emergencyAccessTests.failed++;
        this.compliance.emergencyAccessTests.criticalFailures.push({
          test: test.title,
          severity: 'CRITICAL',
          impact: 'Emergency healthcare access compromised',
          error: result.error?.message
        });
      }
    }

    if (testTitle.includes('family') || testTitle.includes('privacy') || testTitle.includes('consent')) {
      if (passed) {
        this.compliance.familyPrivacyTests.passed++;
      } else {
        this.compliance.familyPrivacyTests.failed++;
        this.compliance.familyPrivacyTests.privacyViolations.push({
          test: test.title,
          violationType: this.categorizePrivacyViolation(test.title),
          error: result.error?.message
        });
      }
    }
  }

  onEnd(result: FullResult) {
    const duration = Date.now() - this.startTime;
    const totalTests = this.getTotalTests();
    const passedTests = this.getTotalPassed();
    const complianceScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    console.log('\n🏥 Healthcare Compliance Test Results');
    console.log('=====================================');
    console.log(`⏱️  Duration: ${this.formatDuration(duration)}`);
    console.log(`📊 Overall Compliance Score: ${complianceScore.toFixed(1)}%`);
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);

    this.printCategoryResults();
    this.printCriticalIssues();
    this.generateComplianceReport(result, duration, complianceScore);

    // Determine overall compliance status
    const overallStatus = this.determineComplianceStatus(complianceScore);
    console.log(`\n🎯 Healthcare Compliance Status: ${overallStatus}`);

    if (complianceScore < 85) {
      console.log('⚠️  WARNING: Healthcare compliance below acceptable threshold (85%)');
      process.exitCode = 1;
    }
  }

  private printCategoryResults() {
    console.log('\n📋 Compliance Category Breakdown:');
    
    const categories = [
      { name: 'Accessibility (WCAG 2.2 AA)', data: this.compliance.accessibilityTests },
      { name: 'Clinical Safety', data: this.compliance.clinicalSafetyTests },
      { name: 'HIPAA Compliance', data: this.compliance.hipaaComplianceTests },
      { name: 'Performance Standards', data: this.compliance.performanceTests },
      { name: 'Emergency Access', data: this.compliance.emergencyAccessTests },
      { name: 'Family Privacy', data: this.compliance.familyPrivacyTests }
    ];

    categories.forEach(category => {
      const total = category.data.passed + category.data.failed;
      const percentage = total > 0 ? (category.data.passed / total) * 100 : 100;
      const status = percentage >= 85 ? '✅' : percentage >= 70 ? '⚠️' : '❌';
      
      console.log(`  ${status} ${category.name}: ${category.data.passed}/${total} (${percentage.toFixed(1)}%)`);
    });
  }

  private printCriticalIssues() {
    console.log('\n🚨 Critical Healthcare Issues:');
    
    // Emergency access failures (highest priority)
    if (this.compliance.emergencyAccessTests.criticalFailures.length > 0) {
      console.log('  🆘 CRITICAL: Emergency Access Failures');
      this.compliance.emergencyAccessTests.criticalFailures.forEach(failure => {
        console.log(`    - ${failure.test}: ${failure.impact}`);
      });
    }

    // Clinical safety risks
    if (this.compliance.clinicalSafetyTests.risks.length > 0) {
      console.log('  ⚕️  CLINICAL SAFETY RISKS:');
      this.compliance.clinicalSafetyTests.risks.forEach(risk => {
        console.log(`    - ${risk.test} (${risk.riskLevel} risk)`);
      });
    }

    // HIPAA compliance issues
    if (this.compliance.hipaaComplianceTests.issues.length > 0) {
      console.log('  🔒 HIPAA COMPLIANCE ISSUES:');
      this.compliance.hipaaComplianceTests.issues.forEach(issue => {
        console.log(`    - ${issue.test}: ${issue.complianceIssue}`);
      });
    }

    // Privacy violations
    if (this.compliance.familyPrivacyTests.privacyViolations.length > 0) {
      console.log('  👨‍👩‍👧‍👦 FAMILY PRIVACY VIOLATIONS:');
      this.compliance.familyPrivacyTests.privacyViolations.forEach(violation => {
        console.log(`    - ${violation.test}: ${violation.violationType}`);
      });
    }
  }

  private generateComplianceReport(result: FullResult, duration: number, complianceScore: number) {
    const reportDir = 'test-results/healthcare-compliance';
    
    try {
      mkdirSync(reportDir, { recursive: true });
    } catch (error) {
      console.warn('Could not create report directory:', error);
      return;
    }

    const report = {
      timestamp: new Date().toISOString(),
      duration: duration,
      overallComplianceScore: complianceScore,
      status: this.determineComplianceStatus(complianceScore),
      categories: this.compliance,
      summary: {
        totalTests: this.getTotalTests(),
        passedTests: this.getTotalPassed(),
        failedTests: this.getTotalFailed(),
        criticalIssues: this.getCriticalIssueCount()
      },
      recommendations: this.generateRecommendations()
    };

    // Write JSON report
    const jsonReportPath = join(reportDir, 'compliance-report.json');
    writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));

    // Write HTML report
    const htmlReportPath = join(reportDir, 'compliance-report.html');
    writeFileSync(htmlReportPath, this.generateHTMLReport(report));

    console.log(`\n📄 Compliance reports generated:`);
    console.log(`   JSON: ${jsonReportPath}`);
    console.log(`   HTML: ${htmlReportPath}`);
  }

  private generateHTMLReport(report: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Praneya Healthcare Compliance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .score { font-size: 24px; font-weight: bold; color: ${report.overallComplianceScore >= 85 ? '#28a745' : '#dc3545'}; }
        .category { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .critical { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .recommendations { background: #d4edda; border-color: #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Praneya Healthcare Compliance Report</h1>
        <p><strong>Generated:</strong> ${report.timestamp}</p>
        <p><strong>Duration:</strong> ${this.formatDuration(report.duration)}</p>
        <p class="score">Overall Compliance Score: ${report.overallComplianceScore.toFixed(1)}%</p>
        <p><strong>Status:</strong> ${report.status}</p>
    </div>

    <div class="category">
        <h2>Test Summary</h2>
        <p><span class="passed">✅ Passed: ${report.summary.passedTests}</span></p>
        <p><span class="failed">❌ Failed: ${report.summary.failedTests}</span></p>
        <p><strong>Total Tests: ${report.summary.totalTests}</strong></p>
    </div>

    ${report.summary.criticalIssues > 0 ? `
    <div class="category critical">
        <h2>🚨 Critical Issues (${report.summary.criticalIssues})</h2>
        <p>Immediate attention required for healthcare safety and compliance.</p>
    </div>
    ` : ''}

    <div class="category">
        <h2>📋 Compliance Categories</h2>
        ${Object.entries(report.categories).map(([key, data]: [string, any]) => {
          const total = data.passed + data.failed;
          const percentage = total > 0 ? (data.passed / total) * 100 : 100;
          const status = percentage >= 85 ? '✅' : percentage >= 70 ? '⚠️' : '❌';
          return `
            <div style="margin: 10px 0;">
                ${status} <strong>${this.formatCategoryName(key)}:</strong> 
                ${data.passed}/${total} (${percentage.toFixed(1)}%)
            </div>
          `;
        }).join('')}
    </div>

    <div class="recommendations">
        <h2>💡 Recommendations</h2>
        <ul>
            ${report.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
    </div>

    <div class="category">
        <h2>📊 Detailed Results</h2>
        <pre>${JSON.stringify(report.categories, null, 2)}</pre>
    </div>
</body>
</html>
    `;
  }

  private generateRecommendations(): string[] {
    const recommendations = [];

    if (this.compliance.emergencyAccessTests.failed > 0) {
      recommendations.push('🆘 CRITICAL: Fix emergency access failures immediately - patient safety at risk');
    }

    if (this.compliance.accessibilityTests.failed > 0) {
      recommendations.push('♿ Resolve accessibility violations to meet WCAG 2.2 AA healthcare standards');
    }

    if (this.compliance.clinicalSafetyTests.failed > 0) {
      recommendations.push('⚕️ Address clinical safety issues - validate drug interactions and allergy detection');
    }

    if (this.compliance.hipaaComplianceTests.failed > 0) {
      recommendations.push('🔒 Fix HIPAA compliance violations - ensure PHI protection and audit logging');
    }

    if (this.compliance.performanceTests.failed > 0) {
      recommendations.push('⚡ Optimize performance - healthcare interfaces must be responsive');
    }

    if (this.compliance.familyPrivacyTests.failed > 0) {
      recommendations.push('👨‍👩‍👧‍👦 Strengthen family privacy controls and consent management');
    }

    if (recommendations.length === 0) {
      recommendations.push('🎉 Excellent! All healthcare compliance tests passing');
    }

    return recommendations;
  }

  // Helper methods
  private getTotalTests(): number {
    return Object.values(this.compliance).reduce((sum, category) => sum + category.passed + category.failed, 0);
  }

  private getTotalPassed(): number {
    return Object.values(this.compliance).reduce((sum, category) => sum + category.passed, 0);
  }

  private getTotalFailed(): number {
    return Object.values(this.compliance).reduce((sum, category) => sum + category.failed, 0);
  }

  private getCriticalIssueCount(): number {
    return this.compliance.emergencyAccessTests.criticalFailures.length +
           this.compliance.clinicalSafetyTests.risks.filter(r => r.riskLevel === 'HIGH').length +
           this.compliance.hipaaComplianceTests.issues.length;
  }

  private determineComplianceStatus(score: number): string {
    if (score >= 95) return '🏆 EXCELLENT COMPLIANCE';
    if (score >= 85) return '✅ COMPLIANT';
    if (score >= 70) return '⚠️ NEEDS IMPROVEMENT';
    return '❌ NON-COMPLIANT';
  }

  private assessClinicalRisk(testTitle: string): string {
    if (testTitle.includes('drug') && testTitle.includes('interaction')) return 'HIGH';
    if (testTitle.includes('allergy') && testTitle.includes('severe')) return 'HIGH';
    if (testTitle.includes('emergency')) return 'CRITICAL';
    return 'MEDIUM';
  }

  private categorizeHIPAAIssue(testTitle: string): string {
    if (testTitle.includes('encryption')) return 'Data encryption failure';
    if (testTitle.includes('audit')) return 'Audit trail incomplete';
    if (testTitle.includes('access')) return 'Unauthorized access risk';
    return 'General HIPAA compliance issue';
  }

  private categorizePrivacyViolation(testTitle: string): string {
    if (testTitle.includes('minor')) return 'Minor protection violation';
    if (testTitle.includes('consent')) return 'Consent management failure';
    if (testTitle.includes('sharing')) return 'Unauthorized data sharing';
    return 'General privacy violation';
  }

  private getPerformanceThreshold(testTitle: string): string {
    if (testTitle.includes('emergency')) return '< 2 seconds';
    if (testTitle.includes('load')) return '< 3 seconds';
    if (testTitle.includes('ai')) return '< 15 seconds';
    return '< 5 seconds';
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  }

  private formatCategoryName(key: string): string {
    const names = {
      accessibilityTests: 'Accessibility (WCAG 2.2 AA)',
      clinicalSafetyTests: 'Clinical Safety',
      hipaaComplianceTests: 'HIPAA Compliance',
      performanceTests: 'Performance Standards',
      emergencyAccessTests: 'Emergency Access',
      familyPrivacyTests: 'Family Privacy'
    };
    return names[key] || key;
  }
}

export default HealthcareComplianceReporter; 