import { defineConfig, devices } from '@playwright/test';

/**
 * Healthcare-focused Playwright configuration
 * Enhanced E2E testing for medical workflows, compliance, and accessibility
 */
export default defineConfig({
  testDir: './tests/e2e/healthcare',
  
  // Healthcare workflows require longer timeouts
  timeout: 45000,
  expect: { timeout: 10000 },
  
  // Run tests in parallel but limit for healthcare data consistency
  fullyParallel: false,
  workers: process.env.CI ? 1 : 2,
  
  // Retry configuration for healthcare-critical tests
  retries: process.env.CI ? 3 : 1,
  
  // Fail the build on CI if test.only is found
  forbidOnly: !!process.env.CI,
  
  // Healthcare-specific reporter configuration
  reporter: [
    ['html', { 
      outputFolder: 'test-results/healthcare-e2e',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-results/healthcare-e2e/results.json' 
    }],
    ['junit', { 
      outputFile: 'test-results/healthcare-e2e/junit.xml' 
    }],
    // Custom healthcare compliance reporter
    ['./tests/reporters/healthcare-compliance-reporter.ts']
  ],

  // Global test configuration
  use: {
    baseURL: 'http://localhost:3000',
    
    // Healthcare testing requires more detailed tracing
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Extended timeouts for healthcare data processing
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Healthcare-specific context options
    contextOptions: {
      // Simulate healthcare environment
      permissions: ['clipboard-read', 'clipboard-write'],
      // Stricter security for healthcare testing
      ignoreHTTPSErrors: false,
    },

    // Custom test annotations for healthcare compliance
    extraHTTPHeaders: {
      'X-Healthcare-Test': 'true',
      'X-HIPAA-Test-Mode': 'enabled'
    }
  },

  // Healthcare testing projects across devices and scenarios
  projects: [
    // Setup project for healthcare data
    {
      name: 'healthcare-setup',
      testMatch: /healthcare-setup\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },

    // Desktop healthcare workflows
    {
      name: 'desktop-healthcare',
      dependencies: ['healthcare-setup'],
      use: { 
        ...devices['Desktop Chrome'],
        // Healthcare-specific viewport
        viewport: { width: 1440, height: 900 }
      },
      testMatch: /healthcare.*desktop\.spec\.ts/
    },

    // Mobile healthcare workflows (critical for emergency access)
    {
      name: 'mobile-healthcare',
      dependencies: ['healthcare-setup'],
      use: { 
        ...devices['iPhone 12'],
        // Test emergency access on mobile
        geolocation: { latitude: 37.7749, longitude: -122.4194 }
      },
      testMatch: /healthcare.*mobile\.spec\.ts/
    },

    // Tablet healthcare workflows (family account management)
    {
      name: 'tablet-healthcare',
      dependencies: ['healthcare-setup'],
      use: { 
        ...devices['iPad Pro'],
        // Family sharing context
        permissions: ['camera', 'microphone']
      },
      testMatch: /healthcare.*tablet\.spec\.ts/
    },

    // Accessibility testing across all devices
    {
      name: 'accessibility-testing',
      dependencies: ['healthcare-setup'],
             use: { 
         ...devices['Desktop Chrome'],
         // Accessibility testing configuration
         contextOptions: {
           reducedMotion: 'reduce',
           forcedColors: 'active'
         }
       },
      testMatch: /accessibility\.spec\.ts/
    },

    // Clinical advisor workflows (Premium tier)
    {
      name: 'clinical-workflows',
      dependencies: ['healthcare-setup'],
      use: { 
        ...devices['Desktop Chrome'],
        // Clinical context with extended permissions
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write', 'camera']
        }
      },
      testMatch: /clinical.*\.spec\.ts/
    },

    // Family account testing
    {
      name: 'family-workflows',
      dependencies: ['healthcare-setup'],
      use: { 
        ...devices['Desktop Chrome']
      },
      testMatch: /family.*\.spec\.ts/
    },

    // Emergency access testing
    {
      name: 'emergency-access',
      dependencies: ['healthcare-setup'],
      use: { 
        ...devices['iPhone 12'],
        geolocation: { latitude: 37.7749, longitude: -122.4194 },
        // Emergency context
        contextOptions: {
          permissions: ['geolocation', 'camera', 'microphone']
        }
      },
      testMatch: /emergency.*\.spec\.ts/
    },

    // Cross-browser healthcare compatibility
    {
      name: 'firefox-healthcare',
      dependencies: ['healthcare-setup'],
      use: { ...devices['Desktop Firefox'] },
      testMatch: /healthcare.*cross-browser\.spec\.ts/
    },

    {
      name: 'safari-healthcare',
      dependencies: ['healthcare-setup'],
      use: { ...devices['Desktop Safari'] },
      testMatch: /healthcare.*cross-browser\.spec\.ts/
    },

    // Performance testing with healthcare data
    {
      name: 'healthcare-performance',
      dependencies: ['healthcare-setup'],
      use: { 
        ...devices['Desktop Chrome'],
        // Performance testing configuration
        contextOptions: {
          // Simulate slower connection for performance testing
          offline: false
        }
      },
      testMatch: /performance.*\.spec\.ts/
    }
  ],

  // Development server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // Extended timeout for healthcare app startup
    env: {
      // Healthcare testing environment variables
      HEALTHCARE_MODE: 'true',
      HIPAA_COMPLIANCE_ENABLED: 'true',
      CLINICAL_SAFETY_ENABLED: 'true',
      TEST_MODE: 'healthcare_e2e'
    }
  },

  // Global setup and teardown for healthcare testing
  globalSetup: './tests/setup/healthcare-global-setup.ts',
  globalTeardown: './tests/setup/healthcare-global-teardown.ts'
}); 