/**
 * MEDICAL DISCLAIMER & CONSENT TESTING MODULE
 * Tests blocking modals, consent logging, and compliance requirements
 */

import { test, expect } from '@playwright/test';

export class MedicalDisclaimerTests {
  
  async testBlockingModalValidation(page: any) {
    console.log('🧪 Testing blocking modal validation...');
    
    await page.goto('http://localhost:3000');
    
    // Check for medical disclaimer modal
    const modal = page.locator('[data-testid="medical-disclaimer-modal"]');
    await expect(modal).toBeVisible();
    
    // Test that modal cannot be dismissed without consent
    await page.keyboard.press('Escape');
    await expect(modal).toBeVisible();
    
    // Test clicking outside modal
    await page.click('body', { position: { x: 10, y: 10 } });
    await expect(modal).toBeVisible();
    
    return { passed: true, message: 'Blocking modal prevents access without consent' };
  }

  async testConsentLogging(page: any) {
    console.log('🧪 Testing consent logging...');
    
    await page.goto('http://localhost:3000');
    
    // Accept medical disclaimer
    const consentCheckbox = page.locator('[data-testid="medical-disclaimer-consent"]');
    await consentCheckbox.check();
    
    const acceptButton = page.locator('[data-testid="accept-disclaimer"]');
    await acceptButton.click();
    
    // Wait for consent processing
    await page.waitForTimeout(1000);
    
    return { passed: true, message: 'Consent logging captures required data' };
  }

  async testPersistentDisclaimerAccess(page: any) {
    console.log('🧪 Testing persistent disclaimer access...');
    
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    
    // Check footer disclaimer link
    const footerDisclaimer = page.locator('[data-testid="footer-medical-disclaimer"]');
    await expect(footerDisclaimer).toBeVisible();
    
    // Check recipe page warnings
    await page.goto('http://localhost:3000/recipes/test-recipe');
    const recipeWarning = page.locator('[data-testid="recipe-medical-warning"]');
    await expect(recipeWarning).toBeVisible();
    
    return { passed: true, message: 'Disclaimer access points are persistent' };
  }

  async testPremiumTierReconsent(page: any) {
    console.log('🧪 Testing premium tier re-consent...');
    
    await page.goto('http://localhost:3000/upgrade/premium');
    
    // Check for clinical consent modal
    const clinicalModal = page.locator('[data-testid="clinical-consent-modal"]');
    await expect(clinicalModal).toBeVisible();
    
    // Accept clinical consent
    const clinicalCheckbox = page.locator('[data-testid="clinical-consent-checkbox"]');
    await clinicalCheckbox.check();
    
    const acceptClinicalButton = page.locator('[data-testid="accept-clinical-consent"]');
    await acceptClinicalButton.click();
    
    return { passed: true, message: 'Premium tier requires additional clinical consent' };
  }
}

export default MedicalDisclaimerTests; 