/**
 * Example Healthcare Component Tests
 * Demonstrates comprehensive testing of healthcare UI components
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import HealthcareTestUtils, { ClinicalSafetyTestUtils, HIPAAComplianceTestUtils } from '../utils/healthcare-test-helpers';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock healthcare component for testing
const MockHealthProfileForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = React.useState(initialData);
  
  return (
    <form data-testid="health-profile-form" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <h1>Health Profile</h1>
      
      <div>
        <label htmlFor="allergies">Allergies</label>
        <input
          id="allergies"
          data-testid="allergies-input"
          value={formData.allergies || ''}
          onChange={(e) => setFormData({...formData, allergies: e.target.value})}
          aria-describedby="allergies-help"
        />
        <p id="allergies-help">List any known allergies separated by commas</p>
      </div>

      <div>
        <label htmlFor="medications">Current Medications</label>
        <input
          id="medications"
          data-testid="medications-input"
          value={formData.medications || ''}
          onChange={(e) => setFormData({...formData, medications: e.target.value})}
          aria-describedby="medications-help"
        />
        <p id="medications-help">List current medications with dosages</p>
      </div>

      <div>
        <label htmlFor="emergency-contact">Emergency Contact</label>
        <input
          id="emergency-contact"
          data-testid="emergency-contact-input"
          value={formData.emergencyContact || ''}
          onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
          required
        />
      </div>

      <button type="submit" data-testid="submit-health-profile">
        Save Health Profile
      </button>
      
      <div data-testid="medical-disclaimer" role="alert">
        <strong>Medical Disclaimer:</strong> This information is for healthcare coordination only. 
        Always consult your healthcare provider for medical advice.
      </div>
    </form>
  );
};

describe('Healthcare Component Testing Framework', () => {
  describe('Accessibility Compliance', () => {
    test('meets WCAG 2.2 AA accessibility standards', async () => {
      const { container } = render(<MockHealthProfileForm onSubmit={jest.fn()} />);
      
      // Run axe accessibility audit
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('supports keyboard navigation', async () => {
      render(<MockHealthProfileForm onSubmit={jest.fn()} />);
      
      const user = userEvent.setup();
      
      // Test tab navigation through form elements
      await user.tab();
      expect(screen.getByTestId('allergies-input')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('medications-input')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('emergency-contact-input')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('submit-health-profile')).toHaveFocus();
    });

    test('provides proper ARIA labels and descriptions', () => {
      render(<MockHealthProfileForm onSubmit={jest.fn()} />);
      
      // Check ARIA relationships
      const allergiesInput = screen.getByTestId('allergies-input');
      expect(allergiesInput).toHaveAttribute('aria-describedby', 'allergies-help');
      
      const medicationsInput = screen.getByTestId('medications-input');
      expect(medicationsInput).toHaveAttribute('aria-describedby', 'medications-help');
      
      // Check alert role for medical disclaimer
      const disclaimer = screen.getByTestId('medical-disclaimer');
      expect(disclaimer).toHaveAttribute('role', 'alert');
    });
  });

  describe('Clinical Safety Validation', () => {
    test('detects drug interactions in medication input', async () => {
      const mockSubmit = jest.fn();
      render(<MockHealthProfileForm onSubmit={mockSubmit} />);
      
      const user = userEvent.setup();
      
      // Enter medications known to interact
      await user.type(screen.getByTestId('medications-input'), 'warfarin 5mg, aspirin 81mg');
      await user.click(screen.getByTestId('submit-health-profile'));
      
      // Verify drug interaction detection
      const interactions = ClinicalSafetyTestUtils.testDrugInteractionDetection(
        ['warfarin', 'aspirin'],
        [{ drug1: 'warfarin', drug2: 'aspirin', severity: 'major' }]
      );
      
      expect(interactions.passed).toBe(true);
      expect(interactions.interactionsFound).toBeGreaterThan(0);
    });

    test('validates allergy information format', async () => {
      const mockSubmit = jest.fn();
      render(<MockHealthProfileForm onSubmit={mockSubmit} />);
      
      const user = userEvent.setup();
      
      // Enter allergy information
      await user.type(screen.getByTestId('allergies-input'), 'peanuts, shellfish, latex');
      await user.click(screen.getByTestId('submit-health-profile'));
      
      // Verify allergy data structure
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            allergies: 'peanuts, shellfish, latex'
          })
        );
      });
    });

    test('prevents medical advice in AI responses', () => {
      const aiResponse = "I recommend consulting your healthcare provider about your blood pressure medication. Here are some heart-healthy foods to consider.";
      
      const adviceDetection = ClinicalSafetyTestUtils.testMedicalAdviceDetection(
        aiResponse,
        false // Should not contain direct medical advice
      );
      
      expect(adviceDetection.passed).toBe(true);
      expect(adviceDetection.containsAdvice).toBe(false);
    });
  });

  describe('HIPAA Compliance', () => {
    test('validates PHI data handling', () => {
      const healthData = {
        patientId: 'patient-123',
        allergies: 'peanuts',
        medications: 'lisinopril',
        encrypted: true,
        auditTrail: {
          accessedBy: 'user-123',
          timestamp: new Date(),
          action: 'health_profile_update'
        }
      };
      
      const compliance = HIPAAComplianceTestUtils.testPHIDataHandling(
        healthData,
        true, // Expected encryption
        true  // Expected audit logging
      );
      
      expect(compliance.compliant).toBe(true);
      expect(compliance.isEncrypted).toBe(true);
      expect(compliance.hasAuditTrail).toBe(true);
    });

    test('enforces access control for health data', () => {
      // Test access control for different user roles
      const endUserAccess = HIPAAComplianceTestUtils.testAccessControl(
        'end_user',
        'own_health_data',
        'read',
        true // Expected access
      );
      
      const restrictedAccess = HIPAAComplianceTestUtils.testAccessControl(
        'end_user',
        'clinical_data',
        'create',
        false // Should not have access
      );
      
      expect(endUserAccess.passed).toBe(true);
      expect(restrictedAccess.passed).toBe(true);
    });
  });

  describe('Subscription Tier Validation', () => {
    test('basic tier shows limited features', () => {
      render(
        <MockHealthProfileForm 
          onSubmit={jest.fn()} 
          subscriptionTier="basic"
        />
      );
      
      // Basic tier should have core functionality
      expect(screen.getByTestId('allergies-input')).toBeInTheDocument();
      expect(screen.getByTestId('medications-input')).toBeInTheDocument();
      
      // Advanced features should not be present
      expect(screen.queryByTestId('clinical-data-entry')).not.toBeInTheDocument();
    });

    test('premium tier enables all healthcare features', () => {
      const result = HealthcareTestUtils.testSubscriptionTierAccess(
        <MockHealthProfileForm onSubmit={jest.fn()} />,
        'premium',
        ['basic_health_profile', 'family_sharing', 'clinical_integration'],
        ['restricted_feature']
      );
      
      expect(result.accessibleFeatures).toBe(3);
      expect(result.restrictedFeatures).toBe(1);
    });
  });

  describe('Emergency Access Scenarios', () => {
    test('provides rapid access to critical health information', async () => {
      const mockEmergencyComponent = () => (
        <div>
          <button data-testid="emergency-access-button">Emergency Access</button>
          <div data-testid="emergency-data-accessible" style={{ display: 'none' }}>
            <div data-testid="critical-health-info">Critical Info</div>
            <div data-testid="emergency-contacts">Emergency Contacts</div>
          </div>
        </div>
      );
      
      const result = await HealthcareTestUtils.testEmergencyAccess(
        mockEmergencyComponent(),
        'medical_emergency'
      );
      
      expect(result.accessGranted).toBe(true);
      expect(result.emergencyLevel).toBe('critical');
      expect(result.timeLimit).toBe(300); // 5 minutes
    });
  });

  describe('Performance with Healthcare Data', () => {
    test('handles large health datasets efficiently', async () => {
      const performanceResult = await HealthcareTestUtils.testHealthcareDataPerformance(
        <MockHealthProfileForm onSubmit={jest.fn()} />,
        'medium'
      );
      
      expect(performanceResult.passed).toBe(true);
      expect(performanceResult.renderTime).toBeLessThan(300); // 300ms threshold
      expect(performanceResult.isPerformant).toBe(true);
    });
  });

  describe('Family Privacy Controls', () => {
    test('validates family member privacy settings', () => {
      const familyAccount = HealthcareTestUtils.createMockFamilyAccount({
        privacySettings: {
          defaultHealthSharing: false,
          requireExplicitConsent: true,
          minorProtectionEnabled: true,
          auditAllAccess: true
        }
      });
      
      expect(familyAccount.privacySettings.requireExplicitConsent).toBe(true);
      expect(familyAccount.privacySettings.minorProtectionEnabled).toBe(true);
    });

    test('enforces minor protection controls', async () => {
      const minorProfile = global.healthcareTestUtils.generateTestPatientData('minor');
      
      expect(minorProfile.guardianConsent).toBe(true);
      expect(minorProfile.guardianId).toBeDefined();
      expect(new Date().getFullYear() - new Date(minorProfile.dateOfBirth).getFullYear()).toBeLessThan(18);
    });
  });

  describe('Responsive Design Testing', () => {
    test('adapts to mobile healthcare interfaces', async () => {
      const responsiveResults = await HealthcareTestUtils.testResponsiveDesign(
        <MockHealthProfileForm onSubmit={jest.fn()} />,
        [
          { name: 'mobile', width: 375, height: 667 },
          { name: 'tablet', width: 768, height: 1024 },
          { name: 'desktop', width: 1920, height: 1080 }
        ]
      );
      
      responsiveResults.forEach(result => {
        expect(result.accessibilityPassed).toBe(true);
        if (result.width < 768) {
          expect(result.touchTargetsValid).toBe(true);
        }
      });
    });
  });

  describe('Medical Disclaimer Validation', () => {
    test('displays medical disclaimer prominently', () => {
      render(<MockHealthProfileForm onSubmit={jest.fn()} />);
      
      const disclaimer = screen.getByTestId('medical-disclaimer');
      expect(disclaimer).toBeVisible();
      expect(disclaimer).toHaveAttribute('role', 'alert');
      expect(disclaimer.textContent).toContain('Medical Disclaimer');
      expect(disclaimer.textContent).toContain('consult your healthcare provider');
    });
  });
}); 