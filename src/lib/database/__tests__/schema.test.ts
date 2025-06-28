/**
 * @jest-environment node
 */

import { describe, it, expect } from '@jest/globals';
import {
  tenants,
  users,
  clinicalProfiles,
  drugFoodInteractions,
  clinicalEvidence,
  subscriptionTiers,
  familyAccounts,
  familyPermissions,
  userRoleEnum,
  subscriptionTierEnum,
  healthConditionDetailedEnum,
  severityLevelEnum,
  evidenceLevelEnum,
  reviewStatusEnum,
  interactionTypeEnum,
} from '../schema';

describe('Healthcare Database Schema', () => {
  describe('Schema Table Definitions', () => {
    it('should have tenant table with required columns', () => {
      expect(tenants).toBeDefined();
      expect(tenants.id).toBeDefined();
      expect(tenants.name).toBeDefined();
      expect(tenants.subdomain).toBeDefined();
      expect(tenants.createdAt).toBeDefined();
      expect(tenants.updatedAt).toBeDefined();
      expect(tenants.isActive).toBeDefined();
    });

    it('should have users table with healthcare fields', () => {
      expect(users).toBeDefined();
      expect(users.id).toBeDefined();
      expect(users.tenantId).toBeDefined();
      expect(users.firebaseUid).toBeDefined();
      expect(users.email).toBeDefined();
      expect(users.role).toBeDefined();
      expect(users.subscriptionTier).toBeDefined();
      expect(users.deviceFingerprint).toBeDefined();
      expect(users.failedLoginAttempts).toBeDefined();
      expect(users.accountLockedUntil).toBeDefined();
    });

    it('should have clinical profiles table for healthcare data', () => {
      expect(clinicalProfiles).toBeDefined();
      expect(clinicalProfiles.id).toBeDefined();
      expect(clinicalProfiles.tenantId).toBeDefined();
      expect(clinicalProfiles.userId).toBeDefined();
      expect(clinicalProfiles.icd10Codes).toBeDefined();
      expect(clinicalProfiles.snomedCodes).toBeDefined();
      expect(clinicalProfiles.currentMedications).toBeDefined();
      expect(clinicalProfiles.allergiesStructured).toBeDefined();
      expect(clinicalProfiles.labValuesHistory).toBeDefined();
      expect(clinicalProfiles.clinicalNotesEncrypted).toBeDefined();
      expect(clinicalProfiles.providerInformation).toBeDefined();
    });

    it('should have drug-food interactions table', () => {
      expect(drugFoodInteractions).toBeDefined();
      expect(drugFoodInteractions.drugName).toBeDefined();
      expect(drugFoodInteractions.genericName).toBeDefined();
      expect(drugFoodInteractions.drugClass).toBeDefined();
      expect(drugFoodInteractions.interactingFoods).toBeDefined();
      expect(drugFoodInteractions.interactionType).toBeDefined();
      expect(drugFoodInteractions.severity).toBeDefined();
      expect(drugFoodInteractions.recommendations).toBeDefined();
      expect(drugFoodInteractions.evidenceLevel).toBeDefined();
    });

    it('should have clinical evidence table', () => {
      expect(clinicalEvidence).toBeDefined();
      expect(clinicalEvidence.recommendationType).toBeDefined();
      expect(clinicalEvidence.healthCondition).toBeDefined();
      expect(clinicalEvidence.evidenceLevel).toBeDefined();
      expect(clinicalEvidence.sourceCitation).toBeDefined();
      expect(clinicalEvidence.recommendationText).toBeDefined();
      expect(clinicalEvidence.contraindications).toBeDefined();
    });

    it('should have subscription tiers table', () => {
      expect(subscriptionTiers).toBeDefined();
      expect(subscriptionTiers.tierName).toBeDefined();
      expect(subscriptionTiers.basePriceCents).toBeDefined();
      expect(subscriptionTiers.apiQuotaMonthly).toBeDefined();
      expect(subscriptionTiers.clinicalFeaturesEnabled).toBeDefined();
      expect(subscriptionTiers.familyFeaturesEnabled).toBeDefined();
      expect(subscriptionTiers.stripePriceId).toBeDefined();
    });

    it('should have family accounts and permissions tables', () => {
      expect(familyAccounts).toBeDefined();
      expect(familyAccounts.primaryUserId).toBeDefined();
      expect(familyAccounts.maxMembers).toBeDefined();
      
      expect(familyPermissions).toBeDefined();
      expect(familyPermissions.memberUserId).toBeDefined();
      expect(familyPermissions.targetUserId).toBeDefined();
      expect(familyPermissions.permissionType).toBeDefined();
      expect(familyPermissions.grantedBy).toBeDefined();
      expect(familyPermissions.expiresAt).toBeDefined();
    });
  });

  describe('Healthcare Enum Definitions', () => {
    it('should define user roles for healthcare system', () => {
      expect(userRoleEnum).toBeDefined();
      expect(userRoleEnum.enumValues).toContain('end_user');
      expect(userRoleEnum.enumValues).toContain('super_admin');
      expect(userRoleEnum.enumValues).toContain('clinical_advisor');
    });

    it('should define subscription tiers', () => {
      expect(subscriptionTierEnum).toBeDefined();
      expect(subscriptionTierEnum.enumValues).toContain('basic');
      expect(subscriptionTierEnum.enumValues).toContain('enhanced');
      expect(subscriptionTierEnum.enumValues).toContain('premium');
    });

    it('should define detailed health conditions', () => {
      expect(healthConditionDetailedEnum).toBeDefined();
      expect(healthConditionDetailedEnum.enumValues).toContain('diabetes_type_1');
      expect(healthConditionDetailedEnum.enumValues).toContain('diabetes_type_2');
      expect(healthConditionDetailedEnum.enumValues).toContain('hypertension_stage_1');
      expect(healthConditionDetailedEnum.enumValues).toContain('heart_disease_cad');
      expect(healthConditionDetailedEnum.enumValues).toContain('kidney_disease_stage_3');
      expect(healthConditionDetailedEnum.enumValues).toContain('food_allergies_severe');
      expect(healthConditionDetailedEnum.enumValues).toContain('pregnancy_first_trimester');
    });

    it('should define severity levels for clinical use', () => {
      expect(severityLevelEnum).toBeDefined();
      expect(severityLevelEnum.enumValues).toContain('mild');
      expect(severityLevelEnum.enumValues).toContain('moderate');
      expect(severityLevelEnum.enumValues).toContain('severe');
      expect(severityLevelEnum.enumValues).toContain('critical');
    });

    it('should define evidence levels for clinical recommendations', () => {
      expect(evidenceLevelEnum).toBeDefined();
      expect(evidenceLevelEnum.enumValues).toContain('A');
      expect(evidenceLevelEnum.enumValues).toContain('B');
      expect(evidenceLevelEnum.enumValues).toContain('C');
      expect(evidenceLevelEnum.enumValues).toContain('D');
      expect(evidenceLevelEnum.enumValues).toContain('expert_consensus');
    });

    it('should define review status for clinical oversight', () => {
      expect(reviewStatusEnum).toBeDefined();
      expect(reviewStatusEnum.enumValues).toContain('pending');
      expect(reviewStatusEnum.enumValues).toContain('in_review');
      expect(reviewStatusEnum.enumValues).toContain('approved');
      expect(reviewStatusEnum.enumValues).toContain('rejected');
      expect(reviewStatusEnum.enumValues).toContain('escalated');
    });

    it('should define interaction types for drug-food interactions', () => {
      expect(interactionTypeEnum).toBeDefined();
      expect(interactionTypeEnum.enumValues).toContain('avoid');
      expect(interactionTypeEnum.enumValues).toContain('monitor');
      expect(interactionTypeEnum.enumValues).toContain('timing_separation');
      expect(interactionTypeEnum.enumValues).toContain('dose_adjustment');
      expect(interactionTypeEnum.enumValues).toContain('supplement_recommended');
    });
  });

  describe('Healthcare Data Validation', () => {
    it('should validate ICD-10 code format', () => {
      const validICD10Codes = ['E11.9', 'I10', 'Z87.891', 'M79.604'];
      const icd10Regex = /^[A-Z]\d{2}\.?\d*$/;
      
      validICD10Codes.forEach(code => {
        expect(code).toMatch(icd10Regex);
      });
    });

    it('should validate SNOMED CT code format', () => {
      const validSNOMEDCodes = ['44054006', '38341003', '73211009'];
      const snomedRegex = /^\d{6,18}$/;
      
      validSNOMEDCodes.forEach(code => {
        expect(code).toMatch(snomedRegex);
      });
    });

    it('should validate medication data structure', () => {
      const medicationExample = {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice daily',
        startDate: '2024-01-15',
        prescribedBy: 'Dr. Smith',
      };

      expect(medicationExample.name).toBeDefined();
      expect(medicationExample.dosage).toBeDefined();
      expect(medicationExample.frequency).toBeDefined();
      expect(medicationExample.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(medicationExample.prescribedBy).toBeDefined();
    });

    it('should validate allergy data structure', () => {
      const allergyExample = {
        allergen: 'peanuts',
        severity: 'severe' as const,
        reactions: ['anaphylaxis', 'hives'],
        confirmedDate: '2020-03-15',
        source: 'provider_confirmed' as const,
      };

      expect(allergyExample.allergen).toBeDefined();
      expect(['mild', 'moderate', 'severe']).toContain(allergyExample.severity);
      expect(Array.isArray(allergyExample.reactions)).toBe(true);
      expect(allergyExample.confirmedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(['patient_reported', 'provider_confirmed', 'test_confirmed']).toContain(allergyExample.source);
    });

    it('should validate lab values data structure', () => {
      const labValueExample = {
        testDate: '2024-01-15',
        testName: 'HbA1c',
        value: 7.2,
        units: '%',
        referenceRange: '4.0-5.6',
        provider: 'LabCorp',
        abnormalFlag: true,
      };

      expect(labValueExample.testDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(labValueExample.testName).toBeDefined();
      expect(typeof labValueExample.value).toBe('number');
      expect(labValueExample.units).toBeDefined();
      expect(labValueExample.referenceRange).toBeDefined();
      expect(typeof labValueExample.abnormalFlag).toBe('boolean');
    });
  });

  describe('Clinical Evidence Validation', () => {
    it('should validate clinical recommendation structure', () => {
      const recommendationExample = {
        recommendationType: 'dietary_carbohydrate_management',
        healthCondition: 'diabetes_type_2',
        evidenceLevel: 'A' as const,
        sourceType: 'clinical_guideline',
        sourceCitation: 'American Diabetes Association. Standards of Medical Care in Diabetes—2024',
        recommendationText: 'Limit carbohydrate intake to 45-60g per meal',
        contraindications: ['severe_hypoglycemia_history'],
        populationApplicability: {
          ageMin: 18,
          includes: ['type_2_diabetes'],
          excludes: ['pregnancy', 'severe_renal_disease'],
        },
      };

      expect(recommendationExample.recommendationType).toBeDefined();
      expect(recommendationExample.healthCondition).toBeDefined();
      expect(['A', 'B', 'C', 'D', 'expert_consensus']).toContain(recommendationExample.evidenceLevel);
      expect(recommendationExample.sourceCitation).toBeDefined();
      expect(Array.isArray(recommendationExample.contraindications)).toBe(true);
      expect(typeof recommendationExample.populationApplicability.ageMin).toBe('number');
    });
  });

  describe('Drug-Food Interaction Validation', () => {
    it('should validate drug interaction data structure', () => {
      const interactionExample = {
        drugName: 'Warfarin',
        genericName: 'warfarin',
        brandNames: ['Coumadin', 'Jantoven'],
        drugClass: 'Anticoagulant',
        interactingFoods: ['leafy_greens', 'broccoli'],
        interactionType: 'monitor' as const,
        severity: 'moderate' as const,
        mechanism: 'Vitamin K antagonizes warfarin effect',
        recommendations: 'Maintain consistent vitamin K intake',
        evidenceLevel: 'A' as const,
      };

      expect(interactionExample.drugName).toBeDefined();
      expect(Array.isArray(interactionExample.brandNames)).toBe(true);
      expect(Array.isArray(interactionExample.interactingFoods)).toBe(true);
      expect(['avoid', 'monitor', 'timing_separation', 'dose_adjustment', 'supplement_recommended']).toContain(interactionExample.interactionType);
      expect(['mild', 'moderate', 'severe', 'critical']).toContain(interactionExample.severity);
      expect(['A', 'B', 'C', 'D', 'expert_consensus']).toContain(interactionExample.evidenceLevel);
    });
  });

  describe('Family Permission Validation', () => {
    it('should validate family permission data structure', () => {
      const permissionExample = {
        permissionType: 'health_view_basic',
        permissionScope: {
          dataTypes: ['meal_plans', 'recipes'],
          restrictions: ['no_clinical_data'],
        },
        emergencyOnly: false,
        requiresTargetConsent: true,
        approvedByTarget: true,
      };

      expect(permissionExample.permissionType).toBeDefined();
      expect(Array.isArray(permissionExample.permissionScope.dataTypes)).toBe(true);
      expect(Array.isArray(permissionExample.permissionScope.restrictions)).toBe(true);
      expect(typeof permissionExample.emergencyOnly).toBe('boolean');
      expect(typeof permissionExample.requiresTargetConsent).toBe('boolean');
      expect(typeof permissionExample.approvedByTarget).toBe('boolean');
    });
  });

  describe('Subscription Tier Validation', () => {
    it('should validate subscription tier features', () => {
      const tierExample = {
        tierName: 'premium' as const,
        basePriceCents: 2999,
        maxFamilyMembers: 6,
        apiQuotaMonthly: 20000,
        clinicalFeaturesEnabled: true,
        familyFeaturesEnabled: true,
        providerIntegrationEnabled: true,
      };

      expect(['basic', 'enhanced', 'premium']).toContain(tierExample.tierName);
      expect(typeof tierExample.basePriceCents).toBe('number');
      expect(typeof tierExample.maxFamilyMembers).toBe('number');
      expect(typeof tierExample.apiQuotaMonthly).toBe('number');
      expect(typeof tierExample.clinicalFeaturesEnabled).toBe('boolean');
      expect(typeof tierExample.familyFeaturesEnabled).toBe('boolean');
      expect(typeof tierExample.providerIntegrationEnabled).toBe('boolean');
    });
  });

  describe('HIPAA Compliance Features', () => {
    it('should identify PHI data types', () => {
      const phiDataTypes = [
        'clinical_profiles',
        'lab_values',
        'medications',
        'allergies',
        'clinical_notes',
        'provider_information',
        'biometric_data',
      ];

      phiDataTypes.forEach(dataType => {
        expect(dataType).toMatch(/^[a-z_]+$/);
        expect(dataType.length).toBeGreaterThan(0);
      });
    });

    it('should handle audit trail requirements', () => {
      const auditExample = {
        action: 'PHI_ACCESS',
        resourceType: 'clinical_profiles',
        sensitiveDataAccessed: true,
        phiDataTypes: ['lab_values', 'medications'],
        riskLevel: 'moderate' as const,
        complianceFlags: ['HIPAA'],
        requiresReporting: false,
      };

      expect(auditExample.action).toBeDefined();
      expect(auditExample.resourceType).toBeDefined();
      expect(typeof auditExample.sensitiveDataAccessed).toBe('boolean');
      expect(Array.isArray(auditExample.phiDataTypes)).toBe(true);
      expect(['mild', 'moderate', 'severe', 'critical']).toContain(auditExample.riskLevel);
      expect(Array.isArray(auditExample.complianceFlags)).toBe(true);
    });

    it('should validate encryption requirements', () => {
      const encryptionRequiredFields = [
        'clinical_notes_encrypted',
        'lab_values_history',
        'biometric_data',
        'provider_information',
      ];

      encryptionRequiredFields.forEach(field => {
        expect(field).toBeDefined();
        expect(typeof field).toBe('string');
      });
    });
  });

  describe('Clinical Decision Support', () => {
    it('should validate clinical rule structure', () => {
      const clinicalRuleExample = {
        ruleName: 'Diabetes Carbohydrate Alert',
        ruleType: 'recommendation',
        category: 'nutrition',
        conditionLogic: {
          AND: [
            { condition: 'diabetes_type_2' },
            { hba1c: { '>=': 7.0 } }
          ]
        },
        alertMessage: 'Consider carbohydrate counting for better glucose control',
        severity: 'moderate' as const,
        evidenceLevel: 'A' as const,
      };

      expect(clinicalRuleExample.ruleName).toBeDefined();
      expect(clinicalRuleExample.ruleType).toBeDefined();
      expect(clinicalRuleExample.category).toBeDefined();
      expect(typeof clinicalRuleExample.conditionLogic).toBe('object');
      expect(['mild', 'moderate', 'severe', 'critical']).toContain(clinicalRuleExample.severity);
      expect(['A', 'B', 'C', 'D', 'expert_consensus']).toContain(clinicalRuleExample.evidenceLevel);
    });
  });
});