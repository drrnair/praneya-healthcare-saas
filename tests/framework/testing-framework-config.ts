/**
 * PRANEYA HEALTHCARE SAAS - COMPREHENSIVE TESTING FRAMEWORK CONFIGURATION
 * 
 * Central configuration for all testing suites, thresholds, compliance requirements,
 * and production readiness criteria.
 * 
 * @version 2.0.0
 */

export interface TestingFrameworkConfig {
  environment: TestEnvironment;
  thresholds: TestingThresholds;
  compliance: ComplianceRequirements;
  reporting: ReportingConfig;
  security: SecurityConfig;
  performance: PerformanceConfig;
  accessibility: AccessibilityConfig;
  clinical: ClinicalConfig;
}

export interface TestEnvironment {
  name: 'development' | 'staging' | 'production-check' | 'ci';
  database: DatabaseConfig;
  apis: ApiConfig;
  logging: LoggingConfig;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  ssl: boolean;
  connectionTimeout: number;
}

export interface ApiConfig {
  edamam: {
    baseUrl: string;
    timeout: number;
    rateLimit: number;
  };
  gemini: {
    baseUrl: string;
    timeout: number;
    rateLimit: number;
  };
  stripe: {
    baseUrl: string;
    timeout: number;
    rateLimit: number;
  };
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  outputDir: string;
  retentionDays: number;
}

export interface TestingThresholds {
  production: ProductionThresholds;
  warning: WarningThresholds;
  performance: PerformanceThresholds;
}

export interface ProductionThresholds {
  minOverallScore: number;
  minClinicalSafetyScore: number;
  minSecurityScore: number;
  minComplianceScore: number;
  minAccessibilityScore: number;
  maxCriticalIssues: number;
  maxHighRiskIssues: number;
  minTestCoverage: number;
}

export interface WarningThresholds {
  minScore: number;
  maxResponseTime: number;
  maxErrorRate: number;
}

export interface PerformanceThresholds {
  maxPageLoadTime: number;
  maxApiResponseTime: number;
  maxDatabaseQueryTime: number;
  minCacheHitRatio: number;
  maxMemoryUsage: number;
  maxCpuUsage: number;
}

export interface ComplianceRequirements {
  hipaa: HIPAARequirements;
  gdpr: GDPRRequirements;
  coppa: COPPARequirements;
  pciDss: PCIDSSRequirements;
  soc2: SOC2Requirements;
  wcag: WCAGRequirements;
}

export interface HIPAARequirements {
  required: boolean;
  administrativeSafeguards: string[];
  physicalSafeguards: string[];
  technicalSafeguards: string[];
  minComplianceScore: number;
}

export interface GDPRRequirements {
  required: boolean;
  dataProtectionPrinciples: string[];
  individualRights: string[];
  minComplianceScore: number;
}

export interface COPPARequirements {
  required: boolean;
  parentalConsent: boolean;
  dataCollection: string[];
  minComplianceScore: number;
}

export interface PCIDSSRequirements {
  required: boolean;
  securityRequirements: string[];
  minComplianceScore: number;
}

export interface SOC2Requirements {
  required: boolean;
  trustPrinciples: string[];
  minComplianceScore: number;
}

export interface WCAGRequirements {
  required: boolean;
  level: 'A' | 'AA' | 'AAA';
  principles: string[];
  minComplianceScore: number;
}

export interface ReportingConfig {
  formats: ('json' | 'html' | 'pdf' | 'csv')[];
  outputDir: string;
  includeEvidence: boolean;
  includeAuditTrail: boolean;
  generateExecutiveSummary: boolean;
}

export interface SecurityConfig {
  penetrationTesting: boolean;
  vulnerabilityScanning: boolean;
  authenticationTesting: boolean;
  authorizationTesting: boolean;
  dataProtectionTesting: boolean;
  encryptionValidation: boolean;
}

export interface PerformanceConfig {
  loadTesting: boolean;
  stressTesting: boolean;
  enduranceTesting: boolean;
  spikeTesting: boolean;
  volumeTesting: boolean;
  concurrentUsers: number;
}

export interface AccessibilityConfig {
  wcagTesting: boolean;
  screenReaderTesting: boolean;
  keyboardNavigationTesting: boolean;
  colorContrastTesting: boolean;
  touchTargetTesting: boolean;
  mobileAccessibilityTesting: boolean;
}

export interface ClinicalConfig {
  drugInteractionTesting: boolean;
  allergenDetectionTesting: boolean;
  medicalContentValidation: boolean;
  clinicalDecisionSupport: boolean;
  emergencyProtocolTesting: boolean;
  safetyIncidentResponse: boolean;
}

// Default configuration for healthcare SaaS
export const DEFAULT_TESTING_CONFIG: TestingFrameworkConfig = {
  environment: {
    name: 'development',
    database: {
      host: 'localhost',
      port: 5432,
      database: 'praneya_test',
      ssl: false,
      connectionTimeout: 5000
    },
    apis: {
      edamam: {
        baseUrl: 'https://api.edamam.com',
        timeout: 10000,
        rateLimit: 10
      },
      gemini: {
        baseUrl: 'https://generativelanguage.googleapis.com',
        timeout: 15000,
        rateLimit: 5
      },
      stripe: {
        baseUrl: 'https://api.stripe.com',
        timeout: 8000,
        rateLimit: 20
      }
    },
    logging: {
      level: 'info',
      outputDir: './logs/test-execution',
      retentionDays: 30
    }
  },
  
  thresholds: {
    production: {
      minOverallScore: 95.0,
      minClinicalSafetyScore: 98.0,
      minSecurityScore: 95.0,
      minComplianceScore: 100.0,
      minAccessibilityScore: 100.0,
      maxCriticalIssues: 0,
      maxHighRiskIssues: 2,
      minTestCoverage: 95.0
    },
    warning: {
      minScore: 85.0,
      maxResponseTime: 3000,
      maxErrorRate: 1.0
    },
    performance: {
      maxPageLoadTime: 3000,
      maxApiResponseTime: 2000,
      maxDatabaseQueryTime: 500,
      minCacheHitRatio: 80.0,
      maxMemoryUsage: 80.0,
      maxCpuUsage: 70.0
    }
  },
  
  compliance: {
    hipaa: {
      required: true,
      administrativeSafeguards: [
        'Assigned Security Responsibility',
        'Workforce Training',
        'Information Access Management',
        'Security Awareness',
        'Security Incident Procedures',
        'Contingency Plan',
        'Evaluation'
      ],
      physicalSafeguards: [
        'Facility Access Controls',
        'Workstation Use',
        'Device and Media Controls'
      ],
      technicalSafeguards: [
        'Access Control',
        'Audit Controls',
        'Integrity',
        'Person or Entity Authentication',
        'Transmission Security'
      ],
      minComplianceScore: 100.0
    },
    gdpr: {
      required: true,
      dataProtectionPrinciples: [
        'Lawfulness, fairness and transparency',
        'Purpose limitation',
        'Data minimisation',
        'Accuracy',
        'Storage limitation',
        'Integrity and confidentiality',
        'Accountability'
      ],
      individualRights: [
        'Right to be informed',
        'Right of access',
        'Right to rectification',
        'Right to erasure',
        'Right to restrict processing',
        'Right to data portability',
        'Right to object',
        'Rights related to automated decision making'
      ],
      minComplianceScore: 98.0
    },
    coppa: {
      required: true,
      parentalConsent: true,
      dataCollection: [
        'Personal information',
        'Location information',
        'Audio/video files',
        'Photos'
      ],
      minComplianceScore: 100.0
    },
    pciDss: {
      required: true,
      securityRequirements: [
        'Install and maintain firewall configuration',
        'Do not use vendor-supplied defaults',
        'Protect stored cardholder data',
        'Encrypt transmission of cardholder data',
        'Use and regularly update anti-virus software',
        'Develop and maintain secure systems',
        'Restrict access by business need-to-know',
        'Assign unique ID to each person with computer access',
        'Restrict physical access to cardholder data',
        'Track and monitor all access to network resources',
        'Regularly test security systems and processes',
        'Maintain information security policy'
      ],
      minComplianceScore: 100.0
    },
    soc2: {
      required: true,
      trustPrinciples: [
        'Security',
        'Availability',
        'Processing Integrity',
        'Confidentiality',
        'Privacy'
      ],
      minComplianceScore: 95.0
    },
    wcag: {
      required: true,
      level: 'AA',
      principles: [
        'Perceivable',
        'Operable',
        'Understandable',
        'Robust'
      ],
      minComplianceScore: 100.0
    }
  },
  
  reporting: {
    formats: ['json', 'html'],
    outputDir: './reports',
    includeEvidence: true,
    includeAuditTrail: true,
    generateExecutiveSummary: true
  },
  
  security: {
    penetrationTesting: true,
    vulnerabilityScanning: true,
    authenticationTesting: true,
    authorizationTesting: true,
    dataProtectionTesting: true,
    encryptionValidation: true
  },
  
  performance: {
    loadTesting: true,
    stressTesting: true,
    enduranceTesting: true,
    spikeTesting: true,
    volumeTesting: true,
    concurrentUsers: 1000
  },
  
  accessibility: {
    wcagTesting: true,
    screenReaderTesting: true,
    keyboardNavigationTesting: true,
    colorContrastTesting: true,
    touchTargetTesting: true,
    mobileAccessibilityTesting: true
  },
  
  clinical: {
    drugInteractionTesting: true,
    allergenDetectionTesting: true,
    medicalContentValidation: true,
    clinicalDecisionSupport: true,
    emergencyProtocolTesting: true,
    safetyIncidentResponse: true
  }
};

// Configuration loader with environment-specific overrides
export class TestingFrameworkConfigLoader {
  static load(environment?: string): TestingFrameworkConfig {
    const config = { ...DEFAULT_TESTING_CONFIG };
    
    // Apply environment-specific overrides
    switch (environment) {
      case 'ci':
        config.environment.name = 'ci';
        config.environment.logging.level = 'warn';
        config.reporting.formats = ['json'];
        break;
        
      case 'staging':
        config.environment.name = 'staging';
        config.environment.database.ssl = true;
        config.thresholds.production.minOverallScore = 90.0;
        break;
        
      case 'production-check':
        config.environment.name = 'production-check';
        config.environment.database.ssl = true;
        config.thresholds.production.minOverallScore = 98.0;
        config.thresholds.production.maxCriticalIssues = 0;
        break;
    }
    
    return config;
  }
  
  static validate(config: TestingFrameworkConfig): string[] {
    const errors: string[] = [];
    
    // Validate thresholds
    if (config.thresholds.production.minOverallScore < 0 || config.thresholds.production.minOverallScore > 100) {
      errors.push('Production threshold minOverallScore must be between 0 and 100');
    }
    
    if (config.thresholds.performance.maxPageLoadTime <= 0) {
      errors.push('Performance threshold maxPageLoadTime must be greater than 0');
    }
    
    // Validate compliance requirements
    if (config.compliance.hipaa.required && config.compliance.hipaa.minComplianceScore < 95) {
      errors.push('HIPAA compliance score must be at least 95% when required');
    }
    
    return errors;
  }
}

export default DEFAULT_TESTING_CONFIG; 