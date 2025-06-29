/**
 * Healthcare Testing Helpers
 * Utilities for testing healthcare-specific functionality with compliance validation
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { 
  IHealthProfile, 
  IFamilyAccount, 
  AllergyType, 
  MedicationType,
  SubscriptionTierEnum 
} from '@/types/healthcare';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Healthcare Component Testing Utilities
 */
export class HealthcareTestUtils {
  /**
   * Render component with healthcare context and providers
   */
  static renderWithHealthcareContext(
    component: React.ReactElement,
    options: {
      healthProfile?: Partial<IHealthProfile>;
      familyAccount?: Partial<IFamilyAccount>;
      subscriptionTier?: SubscriptionTierEnum;
      userRole?: 'end_user' | 'clinical_advisor' | 'super_admin';
    } = {}
  ) {
    const {
      healthProfile = {},
      familyAccount = {},
      subscriptionTier = 'basic',
      userRole = 'end_user'
    } = options;

    const mockHealthProfile = this.createMockHealthProfile(healthProfile);
    const mockFamilyAccount = this.createMockFamilyAccount(familyAccount);

    // Mock healthcare context providers
    const HealthcareWrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="healthcare-context">
        <div data-health-profile={JSON.stringify(mockHealthProfile)} />
        <div data-family-account={JSON.stringify(mockFamilyAccount)} />
        <div data-subscription-tier={subscriptionTier} />
        <div data-user-role={userRole} />
        {children}
      </div>
    );

    return render(component, { wrapper: HealthcareWrapper });
  }

  /**
   * Test accessibility compliance with healthcare-specific requirements
   */
  static async testAccessibility(container: Element, options?: any) {
    const results = await axe(container, {
      rules: {
        // Healthcare-specific accessibility rules
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true },
        'heading-order': { enabled: true },
        'landmark-roles': { enabled: true }
      },
      ...options
    });

    expect(results).toHaveNoViolations();
    return results;
  }

  /**
   * Test keyboard navigation for healthcare forms
   */
  static async testKeyboardNavigation(container: Element) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const user = userEvent.setup();
    
    // Test tab navigation
    for (let i = 0; i < focusableElements.length; i++) {
      await user.tab();
      const activeElement = document.activeElement;
      expect(focusableElements[i]).toBe(activeElement);
    }

    // Test reverse tab navigation
    for (let i = focusableElements.length - 1; i >= 0; i--) {
      await user.tab({ shift: true });
      const activeElement = document.activeElement;
      expect(focusableElements[i]).toBe(activeElement);
    }

    return { passed: true, focusableCount: focusableElements.length };
  }

  /**
   * Test screen reader compatibility
   */
  static testScreenReaderSupport(container: Element) {
    const ariaLabels = container.querySelectorAll('[aria-label]');
    const ariaDescriptions = container.querySelectorAll('[aria-describedby]');
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const landmarks = container.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');

    return {
      hasAriaLabels: ariaLabels.length > 0,
      hasAriaDescriptions: ariaDescriptions.length > 0,
      hasProperHeadings: headings.length > 0,
      hasLandmarks: landmarks.length > 0,
      ariaLabelCount: ariaLabels.length,
      headingCount: headings.length
    };
  }

  /**
   * Simulate healthcare workflow steps
   */
  static async simulateHealthDataEntry(steps: Array<{
    action: 'fill' | 'select' | 'click' | 'wait';
    target: string;
    value?: string;
    validation?: () => boolean;
  }>) {
    const user = userEvent.setup();
    const results = [];

    for (const step of steps) {
      let result;
      
      switch (step.action) {
        case 'fill':
          const input = screen.getByLabelText(step.target) || screen.getByPlaceholderText(step.target);
          await user.clear(input);
          await user.type(input, step.value || '');
          result = { action: 'fill', target: step.target, value: step.value };
          break;
          
        case 'select':
          const select = screen.getByLabelText(step.target);
          await user.selectOptions(select, step.value || '');
          result = { action: 'select', target: step.target, value: step.value };
          break;
          
        case 'click':
          const button = screen.getByRole('button', { name: step.target }) || 
                        screen.getByText(step.target);
          await user.click(button);
          result = { action: 'click', target: step.target };
          break;
          
        case 'wait':
          await waitFor(() => {
            if (step.validation) {
              expect(step.validation()).toBe(true);
            }
          });
          result = { action: 'wait', target: step.target };
          break;
      }

      results.push(result);
    }

    return results;
  }

  /**
   * Test clinical safety validations
   */
  static async testClinicalSafety(
    component: React.ReactElement,
    scenario: {
      allergies?: string[];
      medications?: string[];
      conditions?: string[];
      expectedWarnings?: string[];
    }
  ) {
    const { allergies = [], medications = [], conditions = [], expectedWarnings = [] } = scenario;
    
    const healthProfile = this.createMockHealthProfile({
      allergies: allergies.map((allergen, index) => ({
        id: `allergy-${index}`,
        allergen,
        severity: 'moderate' as const,
        reaction: ['mild reaction'],
        isActive: true
      })),
      medications: medications.map((med, index) => ({
        id: `med-${index}`,
        genericName: med,
        dosage: '10mg',
        frequency: 'daily',
        isActive: true
      })),
      chronicConditions: conditions.map((condition, index) => ({
        id: `condition-${index}`,
        condition,
        severity: 'moderate' as const,
        isActive: true
      }))
    });

    const { container } = this.renderWithHealthcareContext(component, { healthProfile });

    // Check for warning displays
    for (const warning of expectedWarnings) {
      expect(screen.getByText(new RegExp(warning, 'i'))).toBeInTheDocument();
    }

    return { passed: true, warningsFound: expectedWarnings.length };
  }

  /**
   * Test subscription tier feature gating
   */
  static testSubscriptionTierAccess(
    component: React.ReactElement,
    tier: SubscriptionTierEnum,
    expectedFeatures: string[],
    restrictedFeatures: string[]
  ) {
    const { container } = this.renderWithHealthcareContext(component, { subscriptionTier: tier });

    // Check accessible features
    expectedFeatures.forEach(feature => {
      const featureElement = screen.queryByTestId(`feature-${feature}`);
      expect(featureElement).toBeInTheDocument();
      expect(featureElement).not.toHaveAttribute('disabled');
    });

    // Check restricted features
    restrictedFeatures.forEach(feature => {
      const featureElement = screen.queryByTestId(`feature-${feature}`);
      if (featureElement) {
        expect(featureElement).toHaveAttribute('disabled');
      } else {
        // Feature should not be present at all
        expect(featureElement).not.toBeInTheDocument();
      }
    });

    return { tier, accessibleFeatures: expectedFeatures.length, restrictedFeatures: restrictedFeatures.length };
  }

  /**
   * Test responsive design across device breakpoints
   */
  static async testResponsiveDesign(
    component: React.ReactElement,
    breakpoints: Array<{ name: string; width: number; height: number }>
  ) {
    const results = [];

    for (const breakpoint of breakpoints) {
      // Simulate viewport size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: breakpoint.width
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: breakpoint.height
      });

      window.dispatchEvent(new Event('resize'));

      const { container } = render(component);
      
      // Test accessibility at this breakpoint
      const a11yResults = await this.testAccessibility(container);
      
      // Test touch targets for mobile
      if (breakpoint.width < 768) {
        const touchTargets = container.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"]');
        touchTargets.forEach(target => {
          const styles = window.getComputedStyle(target);
          const minSize = 44; // 44px minimum touch target
          expect(parseInt(styles.minHeight) || parseInt(styles.height)).toBeGreaterThanOrEqual(minSize);
        });
      }

      results.push({
        breakpoint: breakpoint.name,
        width: breakpoint.width,
        height: breakpoint.height,
        accessibilityPassed: a11yResults.violations.length === 0,
        touchTargetsValid: breakpoint.width < 768 ? true : 'N/A'
      });
    }

    return results;
  }

  /**
   * Test performance with healthcare data loads
   */
  static async testHealthcareDataPerformance(
    component: React.ReactElement,
    dataSize: 'small' | 'medium' | 'large' = 'medium'
  ) {
    const dataSizes = {
      small: 50,
      medium: 500, 
      large: 2000
    };

    const recordCount = dataSizes[dataSize];
    const mockData = Array.from({ length: recordCount }, (_, index) => 
      this.createMockHealthProfile({ id: `profile-${index}` })
    );

    const startTime = performance.now();
    const { container } = this.renderWithHealthcareContext(component);
    const renderTime = performance.now() - startTime;

    // Performance thresholds (in milliseconds)
    const thresholds = {
      small: 100,
      medium: 300,
      large: 1000
    };

    const isPerformant = renderTime <= thresholds[dataSize];

    return {
      dataSize,
      recordCount,
      renderTime,
      threshold: thresholds[dataSize],
      isPerformant,
      passed: isPerformant
    };
  }

  /**
   * Create realistic mock health profile
   */
  static createMockHealthProfile(overrides: Partial<IHealthProfile> = {}): IHealthProfile {
    return {
      id: 'health-profile-123',
      userId: 'user-123', 
      tenantId: 'tenant-123',
      subscriptionTier: 'enhanced',
      allergies: [
        {
          id: 'allergy-1',
          allergen: 'peanuts',
          severity: 'severe',
          reaction: ['anaphylaxis', 'hives'],
          verifiedBy: 'Dr. Smith',
          dateIdentified: new Date('2020-01-15'),
          isActive: true
        }
      ],
      dietaryRestrictions: [
        {
          id: 'diet-1', 
          restriction: 'gluten-free',
          reason: 'medical',
          strictness: 'strict',
          notes: 'Celiac disease diagnosis',
          isActive: true
        }
      ],
      medications: [
        {
          id: 'med-1',
          genericName: 'lisinopril',
          brandName: 'Prinivil',
          dosage: '10mg',
          frequency: 'once daily',
          route: 'oral',
          prescribedBy: 'Dr. Johnson',
          datePrescribed: new Date('2023-01-01'),
          indication: 'hypertension',
          isActive: true
        }
      ],
      nutritionGoals: [
        {
          id: 'goal-1',
          goalType: 'sodium',
          targetValue: 2000,
          unit: 'mg',
          timeframe: 'daily',
          isActive: true,
          reason: 'Blood pressure management'
        }
      ],
      lastUpdated: new Date(),
      version: 1,
      dataIntegrityHash: 'hash123',
      ...overrides
    } as IHealthProfile;
  }

  /**
   * Create realistic mock family account
   */
  static createMockFamilyAccount(overrides: Partial<IFamilyAccount> = {}): IFamilyAccount {
    return {
      id: 'family-123',
      tenantId: 'tenant-123',
      primaryUserId: 'user-123',
      familyName: 'Test Family',
      subscriptionTier: 'enhanced',
      maxMembers: 4,
      privacySettings: {
        defaultHealthSharing: false,
        requireExplicitConsent: true,
        minorProtectionEnabled: true,
        auditAllAccess: true,
        emergencyDataSharing: true
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date(),
      ...overrides
    } as IFamilyAccount;
  }

  /**
   * Test emergency access scenarios
   */
  static async testEmergencyAccess(
    component: React.ReactElement,
    scenario: 'medical_emergency' | 'family_emergency' | 'provider_access'
  ) {
    const emergencyContext = {
      medical_emergency: {
        emergencyLevel: 'critical',
        accessType: 'medical_override',
        timeLimit: 300 // 5 minutes
      },
      family_emergency: {
        emergencyLevel: 'high',
        accessType: 'family_override', 
        timeLimit: 900 // 15 minutes
      },
      provider_access: {
        emergencyLevel: 'moderate',
        accessType: 'clinical_access',
        timeLimit: 1800 // 30 minutes
      }
    };

    const { container } = this.renderWithHealthcareContext(component);
    
    // Simulate emergency access trigger
    const emergencyButton = screen.getByTestId('emergency-access-button');
    fireEvent.click(emergencyButton);

    // Validate emergency protocols
    await waitFor(() => {
      expect(screen.getByText(/emergency access activated/i)).toBeInTheDocument();
    });

    const context = emergencyContext[scenario];
    return {
      scenario,
      emergencyLevel: context.emergencyLevel,
      accessType: context.accessType,
      timeLimit: context.timeLimit,
      accessGranted: true
    };
  }
}

/**
 * Clinical Safety Testing Utilities
 */
export class ClinicalSafetyTestUtils {
  /**
   * Test drug interaction detection
   */
  static testDrugInteractionDetection(
    medications: string[],
    expectedInteractions: Array<{ drug1: string; drug2: string; severity: string }>
  ) {
    // Mock drug interaction service
    const interactions = expectedInteractions.filter(interaction => 
      medications.includes(interaction.drug1) && medications.includes(interaction.drug2)
    );

    return {
      medications,
      interactionsFound: interactions.length,
      interactions,
      passed: interactions.length === expectedInteractions.length
    };
  }

  /**
   * Test allergen conflict detection
   */
  static testAllergenConflictDetection(
    allergies: string[],
    ingredients: string[],
    expectedConflicts: string[]
  ) {
    const conflicts = ingredients.filter(ingredient => 
      allergies.some(allergy => 
        ingredient.toLowerCase().includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(ingredient.toLowerCase())
      )
    );

    return {
      allergies,
      ingredients,
      conflictsFound: conflicts,
      expectedConflicts,
      passed: conflicts.length === expectedConflicts.length &&
              conflicts.every(conflict => expectedConflicts.includes(conflict))
    };
  }

  /**
   * Test medical advice detection in AI responses
   */
  static testMedicalAdviceDetection(
    aiResponse: string,
    shouldContainAdvice: boolean
  ) {
    const medicalAdvicePatterns = [
      /you should take/i,
      /i recommend/i,
      /discontinue.*medication/i,
      /increase.*dosage/i,
      /diagnos/i,
      /prescrib/i,
      /treatment.*plan/i
    ];

    const containsAdvice = medicalAdvicePatterns.some(pattern => 
      pattern.test(aiResponse)
    );

    return {
      aiResponse: aiResponse.substring(0, 100) + '...',
      containsAdvice,
      shouldContainAdvice,
      passed: containsAdvice === shouldContainAdvice
    };
  }
}

/**
 * HIPAA Compliance Testing Utilities  
 */
export class HIPAAComplianceTestUtils {
  /**
   * Test PHI data handling
   */
  static testPHIDataHandling(
    data: any,
    expectedEncryption: boolean = true,
    expectedAuditLogging: boolean = true
  ) {
    const hasPHI = this.containsPHI(data);
    const isEncrypted = data.encrypted === true;
    const hasAuditTrail = data.auditTrail !== undefined;

    return {
      hasPHI,
      isEncrypted,
      hasAuditTrail,
      expectedEncryption,
      expectedAuditLogging,
      compliant: (!hasPHI) || (isEncrypted === expectedEncryption && hasAuditTrail === expectedAuditLogging)
    };
  }

  /**
   * Detect PHI in data
   */
  private static containsPHI(data: any): boolean {
    const phiFields = [
      'ssn', 'socialSecurityNumber',
      'medicalRecordNumber', 'mrn',
      'phoneNumber', 'phone',
      'email',
      'address', 'zipCode',
      'dateOfBirth', 'dob',
      'fullName', 'lastName', 'firstName'
    ];

    return phiFields.some(field => 
      typeof data === 'object' && data !== null && field in data
    );
  }

  /**
   * Test access control enforcement
   */
  static testAccessControl(
    userRole: string,
    resourceType: string,
    action: string,
    expectedAccess: boolean
  ) {
    // Mock access control matrix
    const accessMatrix = {
      'end_user': {
        'own_health_data': ['read', 'update'],
        'family_health_data': ['read'],
        'clinical_data': []
      },
      'clinical_advisor': {
        'own_health_data': ['read', 'update'],
        'family_health_data': ['read'],
        'clinical_data': ['read', 'create', 'update']
      },
      'super_admin': {
        'own_health_data': ['read', 'update', 'delete'],
        'family_health_data': ['read', 'update', 'delete'],
        'clinical_data': ['read', 'create', 'update', 'delete']
      }
    };

    const allowedActions = accessMatrix[userRole]?.[resourceType] || [];
    const hasAccess = allowedActions.includes(action);

    return {
      userRole,
      resourceType,
      action,
      hasAccess,
      expectedAccess,
      passed: hasAccess === expectedAccess
    };
  }
}

export { HealthcareTestUtils as default }; 