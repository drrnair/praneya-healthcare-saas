/**
 * Healthcare Workflows End-to-End Testing
 * Comprehensive testing of critical healthcare user journeys
 */

import { test, expect } from '@playwright/test';
import { HealthcareTestUtils } from '../../utils/healthcare-test-helpers';

test.describe('Healthcare Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Setup healthcare testing environment
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.setItem('healthcare_test_mode', 'true');
      window.localStorage.setItem('subscription_tier', 'premium');
    });
  });

  test('Complete health profile setup workflow', async ({ page }) => {
    await page.goto('/onboarding-demo');
    
    // Step 1: Personal Information
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="email"]', 'john.doe@test.com');
    await page.fill('[data-testid="date-of-birth"]', '1980-01-15');
    await page.click('[data-testid="continue-personal"]');

    // Step 2: Health Assessment
    await page.waitForSelector('[data-testid="health-assessment"]');
    
    // Add allergies
    await page.click('[data-testid="add-allergy"]');
    await page.fill('[data-testid="allergy-input-0"]', 'peanuts');
    await page.selectOption('[data-testid="allergy-severity-0"]', 'severe');
    
    // Add medications
    await page.click('[data-testid="add-medication"]');
    await page.fill('[data-testid="medication-input-0"]', 'lisinopril');
    await page.fill('[data-testid="medication-dosage-0"]', '10mg');
    
    // Add dietary restrictions
    await page.click('[data-testid="add-dietary-restriction"]');
    await page.selectOption('[data-testid="dietary-restriction-0"]', 'low-sodium');
    
    await page.click('[data-testid="continue-health"]');

    // Step 3: Consent Management
    await page.waitForSelector('[data-testid="consent-step"]');
    await page.check('[data-testid="hipaa-consent"]');
    await page.check('[data-testid="data-sharing-consent"]');
    await page.check('[data-testid="clinical-oversight-consent"]');
    await page.click('[data-testid="complete-onboarding"]');

    // Verify successful completion
    await page.waitForSelector('[data-testid="onboarding-complete"]');
    expect(await page.locator('[data-testid="welcome-message"]')).toContainText('Welcome to Praneya');
  });

  test('Family account creation and member management', async ({ page }) => {
    await page.goto('/family-demo');
    
    // Create family account
    await page.click('[data-testid="create-family-account"]');
    await page.fill('[data-testid="family-name"]', 'Test Family');
    await page.selectOption('[data-testid="subscription-tier"]', 'enhanced');
    await page.click('[data-testid="create-family"]');

    await page.waitForSelector('[data-testid="family-created"]');

    // Add family member
    await page.click('[data-testid="add-family-member"]');
    await page.fill('[data-testid="member-name"]', 'Jane Doe');
    await page.fill('[data-testid="member-email"]', 'jane.doe@test.com');
    await page.selectOption('[data-testid="member-relationship"]', 'spouse');
    
    // Set privacy permissions
    await page.check('[data-testid="health-data-sharing"]');
    await page.uncheck('[data-testid="medical-history-sharing"]'); // Explicit consent required
    
    await page.click('[data-testid="invite-member"]');

    // Verify member invitation
    await page.waitForSelector('[data-testid="member-invited"]');
    const memberCount = await page.locator('[data-testid="family-member"]').count();
    expect(memberCount).toBe(2); // Primary user + invited member
  });

  test('Clinical data entry and validation workflow', async ({ page }) => {
    await page.goto('/clinical-interfaces-demo');
    
    // Access clinical data entry (Premium feature)
    await page.click('[data-testid="clinical-data-entry"]');
    await page.waitForSelector('[data-testid="clinical-entry-form"]');

    // Enter clinical observation
    await page.fill('[data-testid="clinical-note"]', 'Blood pressure reading: 140/90 mmHg');
    await page.selectOption('[data-testid="observation-type"]', 'vital_signs');
    await page.fill('[data-testid="observation-value"]', '140/90');
    await page.fill('[data-testid="measurement-unit"]', 'mmHg');
    
    // Set confidentiality level
    await page.selectOption('[data-testid="confidentiality-level"]', 'restricted');
    
    // Add clinical context
    await page.fill('[data-testid="clinical-context"]', 'Routine check-up');
    await page.fill('[data-testid="provider-notes"]', 'Patient reports occasional headaches');
    
    await page.click('[data-testid="submit-clinical-data"]');

    // Verify clinical safety checks
    await page.waitForSelector('[data-testid="safety-validation-complete"]');
    
    // Check for drug interaction warnings (if applicable)
    const warningCount = await page.locator('[data-testid="clinical-warning"]').count();
    if (warningCount > 0) {
      await page.click('[data-testid="acknowledge-warnings"]');
    }

    // Verify audit logging
    const auditEntry = await page.locator('[data-testid="audit-log-entry"]').first();
    expect(auditEntry).toContainText('Clinical data entered');
  });

  test('Emergency access workflow', async ({ page }) => {
    // Simulate emergency scenario
    await page.goto('/health/dashboard');
    
    // Trigger emergency access
    const emergencyStartTime = Date.now();
    await page.click('[data-testid="emergency-access-button"]');
    
    // Verify rapid access (< 2 seconds critical requirement)
    await page.waitForSelector('[data-testid="emergency-data-accessible"]', { timeout: 2000 });
    const accessTime = Date.now() - emergencyStartTime;
    expect(accessTime).toBeLessThan(2000);

    // Verify critical information is immediately visible
    await expect(page.locator('[data-testid="critical-health-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="emergency-contacts"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-medications"]')).toBeVisible();
    await expect(page.locator('[data-testid="severe-allergies"]')).toBeVisible();

    // Verify emergency override audit
    const auditTrail = await page.locator('[data-testid="emergency-audit-trail"]');
    expect(auditTrail).toContainText('Emergency access granted');
  });

  test('Drug interaction detection workflow', async ({ page }) => {
    await page.goto('/clinical-interfaces-demo');
    
    // Navigate to drug interaction dashboard
    await page.click('[data-testid="drug-interaction-dashboard"]');
    await page.waitForSelector('[data-testid="interaction-checker"]');

    // Add multiple medications
    const medications = ['warfarin', 'aspirin', 'ibuprofen'];
    for (let i = 0; i < medications.length; i++) {
      await page.click('[data-testid="add-medication-check"]');
      await page.fill(`[data-testid="medication-input-${i}"]`, medications[i]);
    }

    await page.click('[data-testid="check-interactions"]');

    // Verify interaction detection
    await page.waitForSelector('[data-testid="interaction-results"]');
    
    // Should detect warfarin-aspirin and aspirin-ibuprofen interactions
    const interactions = await page.locator('[data-testid="drug-interaction"]').count();
    expect(interactions).toBeGreaterThan(0);

    // Verify severity classification
    const severeInteractions = await page.locator('[data-testid="severe-interaction"]').count();
    expect(severeInteractions).toBeGreaterThan(0);

    // Check clinical guidance
    const clinicalGuidance = await page.locator('[data-testid="clinical-guidance"]');
    expect(clinicalGuidance).toContainText('Consult healthcare provider');
  });

  test('AI healthcare response with safety filtering', async ({ page }) => {
    await page.goto('/gemini-demo');
    
    // Test healthcare chat with safety filtering
    await page.click('[data-testid="chat-tab"]');
    
    // Attempt medical advice request (should be filtered)
    await page.fill('[data-testid="chat-input"]', 'Should I stop taking my blood pressure medication?');
    await page.click('[data-testid="send-chat"]');
    
    await page.waitForSelector('[data-testid="chat-response-complete"]');
    
    // Verify safety filtering worked
    const response = await page.locator('[data-testid="ai-response"]').textContent();
    expect(response).toContain('consult with your healthcare provider');
    expect(response).not.toContain('you should stop');
    
    // Verify medical disclaimer is shown
    await expect(page.locator('[data-testid="medical-disclaimer"]')).toBeVisible();
    
    // Test appropriate healthcare information request
    await page.fill('[data-testid="chat-input"]', 'What are heart-healthy foods?');
    await page.click('[data-testid="send-chat"]');
    
    await page.waitForSelector('[data-testid="chat-response-complete"]');
    
    // Verify appropriate response
    const infoResponse = await page.locator('[data-testid="ai-response"]').last().textContent();
    expect(infoResponse).toContain('heart-healthy');
    expect(infoResponse).not.toContain('prescribe');
  });

  test('Subscription tier feature access validation', async ({ page }) => {
    // Test Basic tier limitations
    await page.evaluate(() => {
      window.localStorage.setItem('subscription_tier', 'basic');
    });
    
    await page.goto('/clinical-interfaces-demo');
    
    // Clinical features should be disabled/hidden for basic tier
    const clinicalFeatures = await page.locator('[data-testid="clinical-data-entry"]').count();
    expect(clinicalFeatures).toBe(0);
    
    // Provider integration should show upgrade prompt
    await page.click('[data-testid="healthcare-provider-panel"]');
    await expect(page.locator('[data-testid="upgrade-required"]')).toBeVisible();
    
    // Test Enhanced tier features
    await page.evaluate(() => {
      window.localStorage.setItem('subscription_tier', 'enhanced');
    });
    
    await page.reload();
    
    // Family features should be available
    await page.goto('/family-demo');
    const familyFeatures = await page.locator('[data-testid="family-dashboard"]').count();
    expect(familyFeatures).toBe(1);
    
    // Test Premium tier full access
    await page.evaluate(() => {
      window.localStorage.setItem('subscription_tier', 'premium');
    });
    
    await page.goto('/clinical-interfaces-demo');
    
    // All clinical features should be available
    await expect(page.locator('[data-testid="clinical-data-entry"]')).toBeVisible();
    await expect(page.locator('[data-testid="drug-interaction-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="advanced-health-analytics"]')).toBeVisible();
  });

  test('HIPAA compliance audit trail verification', async ({ page }) => {
    await page.goto('/health/dashboard');
    
    // Perform actions that should generate audit logs
    await page.click('[data-testid="view-health-profile"]');
    await page.click('[data-testid="edit-medications"]');
    await page.fill('[data-testid="medication-notes"]', 'Updated dosage per doctor');
    await page.click('[data-testid="save-medication-changes"]');
    
    // Navigate to audit logs (admin/compliance view)
    await page.goto('/admin/audit-logs');
    
    // Verify audit entries exist
    const auditEntries = await page.locator('[data-testid="audit-entry"]').count();
    expect(auditEntries).toBeGreaterThan(0);
    
    // Verify required audit information
    const firstEntry = page.locator('[data-testid="audit-entry"]').first();
    await expect(firstEntry).toContainText('PHI_ACCESS');
    await expect(firstEntry).toContainText(new Date().toISOString().split('T')[0]); // Today's date
    
    // Verify data integrity hash
    const integrityHash = await page.locator('[data-testid="data-integrity-hash"]').first();
    expect(integrityHash).toBeVisible();
  });
}); 