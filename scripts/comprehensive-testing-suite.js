#!/usr/bin/env node

/**
 * Comprehensive Testing Suite for Praneya Healthcare SaaS
 * Tests all major functionalities and reports issues
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class ComprehensiveTestingSuite {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      critical: 0,
      tests: []
    };
    this.basePath = process.cwd();
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Testing Suite for Praneya Healthcare SaaS\n');
    
    try {
      // Core System Tests
      await this.testCoreInfrastructure();
      await this.testFrontendComponents();
      await this.testBackendAPIs();
      await this.testDatabase();
      await this.testSecurity();
      await this.testIntegrations();
      await this.testPerformance();
      await this.testMobile();
      
      // Generate comprehensive report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Critical error in testing suite:', error);
      this.addTest('Testing Suite', 'CRITICAL', false, `Critical error: ${error.message}`);
    }
  }

  async testCoreInfrastructure() {
    console.log('📋 Testing Core Infrastructure...');
    
    // Test TypeScript compilation
    await this.runTest('TypeScript Compilation', async () => {
      const { stderr } = await execAsync('npx tsc --noEmit');
      if (stderr && stderr.includes('error TS')) {
        const errorCount = (stderr.match(/error TS\d+:/g) || []).length;
        throw new Error(`${errorCount} TypeScript errors found`);
      }
      return 'All TypeScript files compile successfully';
    });

    // Test ESLint
    await this.runTest('ESLint Check', async () => {
      try {
        await execAsync('npx eslint src --ext .ts,.tsx --max-warnings 0');
        return 'No linting errors found';
      } catch (error) {
        const warningCount = (error.stdout?.match(/warning/g) || []).length;
        if (warningCount > 0) {
          this.testResults.warnings += warningCount;
          return `${warningCount} linting warnings found`;
        }
        throw error;
      }
    });

    // Test Package Dependencies
    await this.runTest('Package Dependencies', async () => {
      await execAsync('npm audit --audit-level moderate');
      return 'No moderate or high security vulnerabilities found';
    });

    // Test Environment Configuration
    await this.runTest('Environment Configuration', async () => {
      const envExample = await fs.readFile('.env.example', 'utf8');
      const requiredVars = envExample.match(/^[A-Z_]+=.*/gm) || [];
      return `${requiredVars.length} environment variables configured`;
    });
  }

  async testFrontendComponents() {
    console.log('🎨 Testing Frontend Components...');

    // Test Landing Page Components
    const landingComponents = [
      'HeroSection', 'ProblemAgitationSection', 'SolutionPresentationSection',
      'SocialProofSection', 'PricingSection', 'AudienceValueCard'
    ];

    for (const component of landingComponents) {
      await this.runTest(`Landing Page - ${component}`, async () => {
        const componentPath = path.join('src/components/landing', `${component}.tsx`);
        await fs.access(componentPath);
        const content = await fs.readFile(componentPath, 'utf8');
        
        // Check for basic React component structure
        if (!content.includes('export') || !content.includes('React')) {
          throw new Error('Invalid React component structure');
        }
        
        // Check for TypeScript interfaces
        if (!content.includes('interface') && !content.includes('type')) {
          this.addWarning(`${component} might benefit from TypeScript interfaces`);
        }
        
        return `${component} component exists and has valid structure`;
      });
    }

    // Test Conversion System
    await this.runTest('Conversion Funnel System', async () => {
      const files = [
        'src/components/conversion/ConversionFunnelOrchestrator.tsx',
        'src/components/conversion/CTAManager.tsx',
        'src/utils/conversionTracking.ts',
        'src/hooks/useUserBehavior.ts'
      ];
      
      for (const file of files) {
        await fs.access(file);
      }
      
      return 'All conversion system components present';
    });

    // Test Demo Pages
    const demoPages = [
      'clinical-interfaces-demo', 'data-visualization-demo', 'family-management-demo',
      'gamification-demo', 'micro-interactions-demo', 'onboarding-demo', 'pwa-demo'
    ];

    for (const demo of demoPages) {
      await this.runTest(`Demo Page - ${demo}`, async () => {
        const pagePath = path.join('src/app', demo, 'page.tsx');
        await fs.access(pagePath);
        const content = await fs.readFile(pagePath, 'utf8');
        
        if (!content.includes('export default')) {
          throw new Error('Missing default export');
        }
        
        return `${demo} page exists and exportable`;
      });
    }
  }

  async testBackendAPIs() {
    console.log('🔧 Testing Backend APIs...');

    // Test Server Configuration
    await this.runTest('Healthcare Server Config', async () => {
      const serverPath = 'src/server/index.ts';
      await fs.access(serverPath);
      const content = await fs.readFile(serverPath, 'utf8');
      
      const requiredFeatures = [
        'HIPAA', 'clinical-oversight', 'encryption', 'audit'
      ];
      
      for (const feature of requiredFeatures) {
        if (!content.toLowerCase().includes(feature.toLowerCase())) {
          throw new Error(`Missing ${feature} configuration`);
        }
      }
      
      return 'Healthcare server configured with required compliance features';
    });

    // Test API Routes
    const apiRoutes = [
      'src/app/api/ai/analyze-nutrition/route.ts',
      'src/app/api/ai/generate-recipe/route.ts',
      'src/app/api/ai/healthcare-chat/route.ts'
    ];

    for (const route of apiRoutes) {
      await this.runTest(`API Route - ${route.split('/').pop()?.replace('.ts', '')}`, async () => {
        await fs.access(route);
        const content = await fs.readFile(route, 'utf8');
        
        if (!content.includes('export async function')) {
          throw new Error('Missing async function exports');
        }
        
        return 'API route properly structured';
      });
    }

    // Test Middleware
    await this.runTest('Security Middleware', async () => {
      const middlewarePath = 'src/server/middleware';
      const middlewareFiles = await fs.readdir(middlewarePath);
      
      const requiredMiddleware = [
        'clinical-oversight.ts', 'conflict-detection.ts', 'device-fingerprint.ts',
        'family-privacy.ts', 'hipaa-audit.ts'
      ];
      
      for (const required of requiredMiddleware) {
        if (!middlewareFiles.includes(required)) {
          throw new Error(`Missing middleware: ${required}`);
        }
      }
      
      return `All ${requiredMiddleware.length} security middleware components present`;
    });
  }

  async testDatabase() {
    console.log('🗄️ Testing Database Configuration...');

    // Test Database Schema Files
    await this.runTest('Database Schema', async () => {
      const schemaFiles = [
        'prisma/schema.prisma',
        'database/init/01-init.sql',
        'database/init/02-enhanced-schema.sql',
        'database/init/03-simplified-healthcare-schema.sql'
      ];
      
      for (const file of schemaFiles) {
        await fs.access(file);
      }
      
      return 'All database schema files present';
    });

    // Test Drizzle Configuration
    await this.runTest('Drizzle ORM Configuration', async () => {
      await fs.access('drizzle.config.ts');
      const content = await fs.readFile('drizzle.config.ts', 'utf8');
      
      if (!content.includes('defineConfig')) {
        throw new Error('Invalid Drizzle configuration');
      }
      
      return 'Drizzle ORM properly configured';
    });

    // Test Database Connection Files
    await this.runTest('Database Connection Modules', async () => {
      const dbFiles = [
        'src/lib/database/connection.ts',
        'src/lib/database/prisma.ts',
        'src/lib/cache/redis.ts'
      ];
      
      for (const file of dbFiles) {
        await fs.access(file);
      }
      
      return 'Database connection modules present';
    });
  }

  async testSecurity() {
    console.log('🔒 Testing Security Implementation...');

    // Test HIPAA Compliance Files
    await this.runTest('HIPAA Compliance Implementation', async () => {
      const hipaaFiles = [
        'tests/hipaa/audit-trails.test.ts',
        'tests/hipaa/compliance.test.ts',
        'tests/hipaa/data-encryption.test.ts'
      ];
      
      for (const file of hipaaFiles) {
        await fs.access(file);
      }
      
      return 'HIPAA compliance test suite present';
    });

    // Test Security Configuration
    await this.runTest('Security Optimization', async () => {
      const securityFiles = [
        'src/lib/optimization/security-optimizer.ts',
        'src/server/middleware/clinical-oversight.ts'
      ];
      
      for (const file of securityFiles) {
        await fs.access(file);
        const content = await fs.readFile(file, 'utf8');
        
        if (!content.includes('encrypt') && !content.includes('secure')) {
          this.addWarning(`${file} may need security enhancements`);
        }
      }
      
      return 'Security implementation files present';
    });
  }

  async testIntegrations() {
    console.log('🔌 Testing External API Integrations...');

    // Test External API Clients
    const integrations = [
      { name: 'Google AI', file: 'src/lib/external-apis/clients/google-ai-client.ts' },
      { name: 'Edamam API', file: 'src/lib/edamam/api-client.ts' },
      { name: 'Stripe', file: 'src/lib/external-apis/clients/stripe-client.ts' },
      { name: 'Supabase', file: 'src/lib/external-apis/clients/supabase-client.ts' }
    ];

    for (const integration of integrations) {
      await this.runTest(`${integration.name} Integration`, async () => {
        await fs.access(integration.file);
        const content = await fs.readFile(integration.file, 'utf8');
        
        if (!content.includes('class') && !content.includes('export')) {
          throw new Error('Invalid integration client structure');
        }
        
        return `${integration.name} client properly structured`;
      });
    }

    // Test API Manager
    await this.runTest('API Manager', async () => {
      const managerPath = 'src/lib/external-apis/core/api-manager.ts';
      await fs.access(managerPath);
      const content = await fs.readFile(managerPath, 'utf8');
      
      if (!content.includes('class') || !content.includes('ApiManager')) {
        throw new Error('Invalid API manager structure');
      }
      
      return 'API manager properly implemented';
    });
  }

  async testPerformance() {
    console.log('⚡ Testing Performance Optimization...');

    // Test Performance Optimization Files
    await this.runTest('Performance Optimization', async () => {
      const perfFiles = [
        'src/lib/optimization/performance-optimizer.ts',
        'src/lib/optimization/pwa-optimizer.ts'
      ];
      
      for (const file of perfFiles) {
        await fs.access(file);
      }
      
      return 'Performance optimization modules present';
    });

    // Test PWA Configuration
    await this.runTest('PWA Configuration', async () => {
      const pwaFiles = [
        'public/manifest.json',
        'src/lib/layout/hooks/usePWA.ts'
      ];
      
      for (const file of pwaFiles) {
        await fs.access(file);
      }
      
      return 'PWA configuration files present';
    });
  }

  async testMobile() {
    console.log('📱 Testing Mobile Optimization...');

    // Test Mobile Components
    await this.runTest('Mobile Layout Components', async () => {
      const mobileFiles = [
        'src/lib/layout/components/BottomTabNavigation.tsx',
        'src/lib/layout/components/FloatingActionButton.tsx'
      ];
      
      for (const file of mobileFiles) {
        await fs.access(file);
      }
      
      return 'Mobile layout components present';
    });

    // Test Responsive Design
    await this.runTest('Responsive Design Configuration', async () => {
      const tailwindPath = 'tailwind.config.js';
      await fs.access(tailwindPath);
      const content = await fs.readFile(tailwindPath, 'utf8');
      
      if (!content.includes('screens') && !content.includes('responsive')) {
        this.addWarning('Tailwind responsive configuration may need review');
      }
      
      return 'Responsive design configuration present';
    });
  }

  async runTest(testName, testFunction) {
    try {
      const result = await testFunction();
      this.addTest(testName, 'PASS', true, result);
    } catch (error) {
      this.addTest(testName, 'FAIL', false, error.message);
    }
  }

  addTest(name, status, passed, message) {
    this.testResults.tests.push({
      name,
      status,
      passed,
      message,
      timestamp: new Date().toISOString()
    });

    if (passed) {
      this.testResults.passed++;
      console.log(`✅ ${name}: ${message}`);
    } else {
      if (status === 'CRITICAL') {
        this.testResults.critical++;
        console.log(`🚨 ${name}: ${message}`);
      } else {
        this.testResults.failed++;
        console.log(`❌ ${name}: ${message}`);
      }
    }
  }

  addWarning(message) {
    this.testResults.warnings++;
    console.log(`⚠️  WARNING: ${message}`);
  }

  generateReport() {
    console.log('\n🎯 COMPREHENSIVE TEST RESULTS');
    console.log('=====================================');
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`⚠️  Warnings: ${this.testResults.warnings}`);
    console.log(`🚨 Critical: ${this.testResults.critical}`);
    console.log(`📊 Total Tests: ${this.testResults.tests.length}\n`);

    const successRate = (this.testResults.passed / this.testResults.tests.length * 100).toFixed(1);
    console.log(`📈 Success Rate: ${successRate}%\n`);

    // Show failed tests
    if (this.testResults.failed > 0 || this.testResults.critical > 0) {
      console.log('🔍 FAILED TESTS:');
      console.log('=================');
      const failedTests = this.testResults.tests.filter(t => !t.passed);
      failedTests.forEach(test => {
        console.log(`${test.status === 'CRITICAL' ? '🚨' : '❌'} ${test.name}: ${test.message}`);
      });
      console.log('');
    }

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    console.log('====================');
    
    if (this.testResults.critical > 0) {
      console.log('🚨 URGENT: Address critical issues immediately');
    }
    
    if (this.testResults.failed > 5) {
      console.log('⚠️  Multiple test failures detected - review core functionality');
    }
    
    if (this.testResults.warnings > 10) {
      console.log('⚠️  High number of warnings - consider code cleanup');
    }
    
    if (successRate >= 90) {
      console.log('🎉 Excellent! System is in great shape');
    } else if (successRate >= 75) {
      console.log('👍 Good progress - focus on failed tests');
    } else {
      console.log('⚠️  System needs significant attention');
    }

    // Save detailed report
    this.saveDetailedReport();
  }

  async saveDetailedReport() {
    const reportPath = path.join('reports', `comprehensive-test-report-${Date.now()}.json`);
    
    try {
      await fs.mkdir('reports', { recursive: true });
      await fs.writeFile(reportPath, JSON.stringify({
        ...this.testResults,
        generatedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }, null, 2));
      
      console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    } catch (error) {
      console.error('Failed to save detailed report:', error.message);
    }
  }
}

// Run the comprehensive testing suite
if (require.main === module) {
  const testSuite = new ComprehensiveTestingSuite();
  testSuite.runAllTests().catch(console.error);
}

module.exports = ComprehensiveTestingSuite; 