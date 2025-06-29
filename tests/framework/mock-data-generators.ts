/**
 * PRANEYA HEALTHCARE SAAS - MOCK DATA GENERATORS
 * 
 * Comprehensive mock data generation for healthcare testing scenarios
 * including user profiles, medical data, family structures, and compliance scenarios.
 * 
 * @version 2.0.0
 * @author Praneya Healthcare Team
 * @compliance HIPAA-compliant test data (synthetic only)
 */

import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';

// Core interfaces for mock data
export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  emergencyContact: EmergencyContact;
  subscriptionTier: SubscriptionTier;
  healthProfile: HealthProfile;
  preferences: UserPreferences;
  consentHistory: ConsentRecord[];
  deviceFingerprint: string;
  auditTrail: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MockFamilyAccount {
  id: string;
  primaryUserId: string;
  members: FamilyMember[];
  sharedPreferences: SharedPreferences;
  emergencyAccess: EmergencyAccessConfig;
  privacySettings: PrivacySettings;
  subscriptionDetails: FamilySubscription;
  createdAt: Date;
}

export interface MockHealthProfile {
  userId: string;
  conditions: HealthCondition[];
  medications: Medication[];
  allergies: Allergy[];
  dietaryRestrictions: DietaryRestriction[];
  nutritionalGoals: NutritionalGoal[];
  activityLevel: ActivityLevel;
  biometrics: Biometric[];
  healthGoals: HealthGoal[];
  riskFactors: RiskFactor[];
  lastUpdated: Date;
}

export interface MockClinicalData {
  patientId: string;
  providerId: string;
  clinicalNotes: ClinicalNote[];
  labResults: LabResult[];
  vitalSigns: VitalSign[];
  assessments: ClinicalAssessment[];
  treatmentPlans: TreatmentPlan[];
  auditLog: ClinicalAuditEntry[];
  lastReviewed: Date;
}

// Enums and supporting types
export enum SubscriptionTier {
  BASIC = 'basic',
  ENHANCED = 'enhanced',
  PREMIUM = 'premium'
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHTLY_ACTIVE = 'lightly_active',
  MODERATELY_ACTIVE = 'moderately_active',
  VERY_ACTIVE = 'very_active',
  EXTREMELY_ACTIVE = 'extremely_active'
}

export enum FamilyRole {
  PRIMARY = 'primary',
  SPOUSE = 'spouse',
  CHILD = 'child',
  DEPENDENT = 'dependent'
}

export enum HealthCondition {
  DIABETES_TYPE_1 = 'diabetes_type_1',
  DIABETES_TYPE_2 = 'diabetes_type_2',
  HYPERTENSION = 'hypertension',
  HEART_DISEASE = 'heart_disease',
  OBESITY = 'obesity',
  CELIAC_DISEASE = 'celiac_disease',
  CROHNS_DISEASE = 'crohns_disease',
  KIDNEY_DISEASE = 'kidney_disease',
  FOOD_ALLERGIES = 'food_allergies',
  EATING_DISORDER = 'eating_disorder'
}

export class MockDataGenerator {
  private static instance: MockDataGenerator;
  private readonly ENCRYPTION_KEY = 'test-encryption-key-32-characters';

  private constructor() {}

  public static getInstance(): MockDataGenerator {
    if (!MockDataGenerator.instance) {
      MockDataGenerator.instance = new MockDataGenerator();
    }
    return MockDataGenerator.instance;
  }

  /**
   * Generate comprehensive mock user data for testing
   */
  generateMockUser(options: {
    subscriptionTier?: SubscriptionTier;
    healthConditions?: HealthCondition[];
    familyRole?: FamilyRole;
    consentCompliant?: boolean;
  } = {}): MockUser {
    const userId = this.generateSecureId();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    return {
      id: userId,
      email: faker.internet.email({ firstName, lastName }),
      firstName,
      lastName,
      dateOfBirth: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }),
      phoneNumber: faker.phone.number(),
      emergencyContact: this.generateEmergencyContact(),
      subscriptionTier: options.subscriptionTier || faker.helpers.enumValue(SubscriptionTier),
      healthProfile: this.generateHealthProfile(userId, options.healthConditions),
      preferences: this.generateUserPreferences(),
      consentHistory: this.generateConsentHistory(options.consentCompliant),
      deviceFingerprint: this.generateDeviceFingerprint(),
      auditTrail: this.generateAuditTrail(userId),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent()
    };
  }

  /**
   * Generate mock family account with proper hierarchy and permissions
   */
  generateMockFamilyAccount(memberCount: number = 4): MockFamilyAccount {
    const familyId = this.generateSecureId();
    const primaryUser = this.generateMockUser({ 
      subscriptionTier: SubscriptionTier.ENHANCED,
      familyRole: FamilyRole.PRIMARY 
    });

    const members: FamilyMember[] = [
      {
        userId: primaryUser.id,
        role: FamilyRole.PRIMARY,
        permissions: this.generatePermissions(FamilyRole.PRIMARY),
        joinedAt: primaryUser.createdAt
      }
    ];

    // Generate additional family members
    for (let i = 1; i < memberCount; i++) {
      const role = i === 1 ? FamilyRole.SPOUSE : FamilyRole.CHILD;
      const member = this.generateMockUser({ familyRole: role });
      
      members.push({
        userId: member.id,
        role,
        permissions: this.generatePermissions(role),
        joinedAt: faker.date.between({ 
          from: primaryUser.createdAt, 
          to: new Date() 
        })
      });
    }

    return {
      id: familyId,
      primaryUserId: primaryUser.id,
      members,
      sharedPreferences: this.generateSharedPreferences(),
      emergencyAccess: this.generateEmergencyAccessConfig(),
      privacySettings: this.generatePrivacySettings(),
      subscriptionDetails: this.generateFamilySubscription(),
      createdAt: primaryUser.createdAt
    };
  }

  /**
   * Generate mock clinical data for Premium tier testing
   */
  generateMockClinicalData(patientId: string): MockClinicalData {
    return {
      patientId,
      providerId: this.generateSecureId(),
      clinicalNotes: this.generateClinicalNotes(),
      labResults: this.generateLabResults(),
      vitalSigns: this.generateVitalSigns(),
      assessments: this.generateClinicalAssessments(),
      treatmentPlans: this.generateTreatmentPlans(),
      auditLog: this.generateClinicalAuditLog(patientId),
      lastReviewed: faker.date.recent()
    };
  }

  /**
   * Generate mock drug-food interaction scenarios
   */
  generateDrugFoodInteractions(): DrugFoodInteraction[] {
    return [
      {
        id: this.generateSecureId(),
        drugName: 'Warfarin',
        foodItem: 'Spinach',
        interactionType: 'antagonistic',
        severity: 'high',
        description: 'High vitamin K content may reduce anticoagulant effectiveness',
        recommendation: 'Maintain consistent vitamin K intake',
        evidence: 'clinical_study',
        lastUpdated: new Date()
      },
      {
        id: this.generateSecureId(),
        drugName: 'Metformin',
        foodItem: 'Alcohol',
        interactionType: 'potentiating',
        severity: 'critical',
        description: 'Increased risk of lactic acidosis',
        recommendation: 'Avoid alcohol consumption',
        evidence: 'fda_warning',
        lastUpdated: new Date()
      },
      {
        id: this.generateSecureId(),
        drugName: 'Lisinopril',
        foodItem: 'Bananas',
        interactionType: 'additive',
        severity: 'medium',
        description: 'High potassium content may cause hyperkalemia',
        recommendation: 'Monitor potassium levels',
        evidence: 'clinical_study',
        lastUpdated: new Date()
      }
    ];
  }

  /**
   * Generate mock allergy scenarios for testing
   */
  generateAllergyScenarios(): AllergyScenario[] {
    return [
      {
        id: this.generateSecureId(),
        allergen: 'Peanuts',
        severity: 'anaphylaxis',
        symptoms: ['difficulty breathing', 'swelling', 'hives'],
        onsetTime: '5-30 minutes',
        crossReactivity: ['Tree nuts', 'Legumes'],
        emergencyAction: 'Use EpiPen and call 911',
        lastReaction: faker.date.past({ years: 1 })
      },
      {
        id: this.generateSecureId(),
        allergen: 'Shellfish',
        severity: 'severe',
        symptoms: ['nausea', 'vomiting', 'diarrhea', 'hives'],
        onsetTime: '2-6 hours',
        crossReactivity: ['Crustaceans', 'Mollusks'],
        emergencyAction: 'Seek immediate medical attention',
        lastReaction: faker.date.past({ years: 2 })
      },
      {
        id: this.generateSecureId(),
        allergen: 'Gluten',
        severity: 'moderate',
        symptoms: ['bloating', 'abdominal pain', 'fatigue'],
        onsetTime: '1-3 hours',
        crossReactivity: ['Wheat', 'Barley', 'Rye'],
        emergencyAction: 'Avoid gluten-containing foods',
        lastReaction: faker.date.past({ months: 6 })
      }
    ];
  }

  /**
   * Generate mock compliance scenarios for testing
   */
  generateComplianceScenarios(): ComplianceScenario[] {
    return [
      {
        id: this.generateSecureId(),
        scenarioType: 'hipaa_breach',
        description: 'Unauthorized access to patient health information',
        severity: 'critical',
        affectedUsers: this.generateSecureIds(50),
        detectionTime: faker.date.recent(),
        responseTime: faker.date.recent(),
        mitigationSteps: [
          'Immediately disable affected accounts',
          'Notify affected patients within 60 days',
          'Conduct security audit',
          'Implement additional access controls'
        ],
        complianceRequirements: ['HIPAA', 'State privacy laws'],
        documentationRequired: true,
        resolved: false
      },
      {
        id: this.generateSecureId(),
        scenarioType: 'consent_violation',
        description: 'User data processed without proper consent',
        severity: 'high',
        affectedUsers: this.generateSecureIds(5),
        detectionTime: faker.date.recent(),
        responseTime: faker.date.recent(),
        mitigationSteps: [
          'Stop data processing immediately',
          'Obtain proper consent',
          'Delete improperly processed data',
          'Update consent management system'
        ],
        complianceRequirements: ['GDPR', 'CCPA'],
        documentationRequired: true,
        resolved: true
      }
    ];
  }

  /**
   * Generate mock performance test data
   */
  generatePerformanceTestData(): PerformanceTestData {
    return {
      concurrentUsers: faker.number.int({ min: 100, max: 2000 }),
      testDuration: faker.number.int({ min: 300, max: 3600 }), // 5 minutes to 1 hour
      endpoints: [
        {
          endpoint: '/api/ai/generate-recipe',
          avgResponseTime: faker.number.int({ min: 500, max: 2500 }),
          maxResponseTime: faker.number.int({ min: 1000, max: 5000 }),
          throughput: faker.number.int({ min: 10, max: 100 }),
          errorRate: faker.number.float({ min: 0, max: 5, precision: 0.01 })
        },
        {
          endpoint: '/api/family/members',
          avgResponseTime: faker.number.int({ min: 100, max: 500 }),
          maxResponseTime: faker.number.int({ min: 200, max: 1000 }),
          throughput: faker.number.int({ min: 50, max: 200 }),
          errorRate: faker.number.float({ min: 0, max: 2, precision: 0.01 })
        },
        {
          endpoint: '/api/health/drug-interactions',
          avgResponseTime: faker.number.int({ min: 200, max: 800 }),
          maxResponseTime: faker.number.int({ min: 400, max: 1500 }),
          throughput: faker.number.int({ min: 20, max: 80 }),
          errorRate: faker.number.float({ min: 0, max: 1, precision: 0.01 })
        }
      ],
      databaseMetrics: {
        connectionPoolUsage: faker.number.int({ min: 10, max: 90 }),
        queryExecutionTime: faker.number.int({ min: 50, max: 500 }),
        lockWaitTime: faker.number.int({ min: 0, max: 100 }),
        deadlocks: faker.number.int({ min: 0, max: 5 })
      },
      systemMetrics: {
        cpuUsage: faker.number.int({ min: 10, max: 85 }),
        memoryUsage: faker.number.int({ min: 20, max: 80 }),
        diskUsage: faker.number.int({ min: 30, max: 70 }),
        networkLatency: faker.number.int({ min: 10, max: 200 })
      }
    };
  }

  /**
   * Generate mock accessibility test scenarios
   */
  generateAccessibilityTestScenarios(): AccessibilityTestScenario[] {
    return [
      {
        id: this.generateSecureId(),
        testType: 'screen_reader',
        component: 'Recipe Generation Form',
        wcagLevel: 'AA',
        successCriteria: '4.1.2',
        issue: 'Form fields missing proper labels',
        severity: 'high',
        recommendation: 'Add aria-label attributes to all form inputs',
        affectedUsers: ['blind', 'visually_impaired'],
        testResult: 'fail'
      },
      {
        id: this.generateSecureId(),
        testType: 'color_contrast',
        component: 'Emergency Access Button',
        wcagLevel: 'AA',
        successCriteria: '1.4.3',
        issue: 'Insufficient color contrast ratio (3.2:1)',
        severity: 'critical',
        recommendation: 'Increase contrast ratio to minimum 4.5:1',
        affectedUsers: ['color_blind', 'low_vision'],
        testResult: 'fail'
      },
      {
        id: this.generateSecureId(),
        testType: 'keyboard_navigation',
        component: 'Family Member Management',
        wcagLevel: 'AA',
        successCriteria: '2.1.1',
        issue: 'All interactive elements accessible via keyboard',
        severity: 'low',
        recommendation: 'Continue following keyboard navigation best practices',
        affectedUsers: ['mobility_impaired'],
        testResult: 'pass'
      }
    ];
  }

  // Private helper methods
  private generateSecureId(): string {
    return crypto.randomUUID();
  }

  private generateSecureIds(count: number): string[] {
    return Array.from({ length: count }, () => this.generateSecureId());
  }

  private generateDeviceFingerprint(): string {
    return crypto.createHash('sha256')
      .update(`${faker.internet.userAgent()}${faker.internet.ip()}${Date.now()}`)
      .digest('hex');
  }

  private generateEmergencyContact(): EmergencyContact {
    return {
      name: faker.person.fullName(),
      relationship: faker.helpers.arrayElement(['spouse', 'parent', 'sibling', 'child', 'friend']),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      isPrimary: true
    };
  }

  private generateHealthProfile(userId: string, conditions?: HealthCondition[]): HealthProfile {
    return {
      userId,
      conditions: conditions || faker.helpers.arrayElements(Object.values(HealthCondition), { min: 0, max: 3 }),
      medications: this.generateMedications(),
      allergies: this.generateAllergies(),
      dietaryRestrictions: this.generateDietaryRestrictions(),
      nutritionalGoals: this.generateNutritionalGoals(),
      activityLevel: faker.helpers.enumValue(ActivityLevel),
      biometrics: this.generateBiometrics(),
      healthGoals: this.generateHealthGoals(),
      riskFactors: this.generateRiskFactors(),
      lastUpdated: faker.date.recent()
    };
  }

  private generateUserPreferences(): UserPreferences {
    return {
      language: faker.helpers.arrayElement(['en', 'es', 'fr']),
      timezone: faker.location.timeZone(),
      notificationSettings: {
        email: faker.datatype.boolean(),
        push: faker.datatype.boolean(),
        sms: faker.datatype.boolean()
      },
      privacySettings: {
        shareWithFamily: faker.datatype.boolean(),
        shareWithProviders: faker.datatype.boolean(),
        allowResearch: faker.datatype.boolean()
      },
      cuisinePreferences: faker.helpers.arrayElements(['italian', 'mexican', 'asian', 'mediterranean', 'american'], { min: 1, max: 3 })
    };
  }

  private generateConsentHistory(compliant: boolean = true): ConsentRecord[] {
    const records: ConsentRecord[] = [];
    
    if (compliant) {
      records.push({
        id: this.generateSecureId(),
        consentType: 'medical_disclaimer',
        version: '2.0',
        consentedAt: faker.date.past({ years: 1 }),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        documentUrl: '/legal/medical-disclaimer-v2.pdf'
      });
    }

    return records;
  }

  private generateAuditTrail(userId: string): AuditEntry[] {
    return Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => ({
      id: this.generateSecureId(),
      userId,
      action: faker.helpers.arrayElement(['login', 'logout', 'profile_update', 'recipe_generate', 'family_access']),
      resource: faker.helpers.arrayElement(['user_profile', 'health_data', 'family_account', 'recipe_data']),
      timestamp: faker.date.recent(),
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      result: faker.helpers.arrayElement(['success', 'failure', 'warning'])
    }));
  }

  private generateMedications(): Medication[] {
    return Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
      id: this.generateSecureId(),
      name: faker.helpers.arrayElement(['Metformin', 'Lisinopril', 'Atorvastatin', 'Levothyroxine', 'Amlodipine']),
      dosage: `${faker.number.int({ min: 5, max: 100 })}mg`,
      frequency: faker.helpers.arrayElement(['once daily', 'twice daily', 'three times daily', 'as needed']),
      prescribedBy: faker.person.fullName(),
      startDate: faker.date.past({ years: 2 }),
      endDate: faker.datatype.boolean() ? faker.date.future() : null,
      notes: faker.lorem.sentence()
    }));
  }

  private generateAllergies(): Allergy[] {
    return Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      id: this.generateSecureId(),
      allergen: faker.helpers.arrayElement(['Peanuts', 'Shellfish', 'Dairy', 'Gluten', 'Soy']),
      severity: faker.helpers.arrayElement(['mild', 'moderate', 'severe', 'anaphylaxis']),
      symptoms: faker.helpers.arrayElements(['hives', 'swelling', 'difficulty breathing', 'nausea', 'vomiting'], { min: 1, max: 3 }),
      diagnosedDate: faker.date.past({ years: 5 }),
      lastReaction: faker.date.past({ years: 1 })
    }));
  }

  private generateDietaryRestrictions(): DietaryRestriction[] {
    return faker.helpers.arrayElements([
      'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-sodium', 'low-sugar', 'keto', 'paleo'
    ], { min: 0, max: 3 }).map(restriction => ({
      id: this.generateSecureId(),
      type: restriction,
      reason: faker.helpers.arrayElement(['medical', 'personal', 'religious', 'ethical']),
      since: faker.date.past({ years: 2 }),
      strictness: faker.helpers.arrayElement(['strict', 'moderate', 'flexible'])
    }));
  }

  private generateNutritionalGoals(): NutritionalGoal[] {
    return [
      {
        id: this.generateSecureId(),
        type: 'calories',
        target: faker.number.int({ min: 1500, max: 3000 }),
        unit: 'kcal',
        period: 'daily'
      },
      {
        id: this.generateSecureId(),
        type: 'protein',
        target: faker.number.int({ min: 50, max: 150 }),
        unit: 'g',
        period: 'daily'
      }
    ];
  }

  private generateBiometrics(): Biometric[] {
    return [
      {
        id: this.generateSecureId(),
        type: 'weight',
        value: faker.number.int({ min: 100, max: 300 }),
        unit: 'lbs',
        recordedAt: faker.date.recent()
      },
      {
        id: this.generateSecureId(),
        type: 'height',
        value: faker.number.int({ min: 60, max: 80 }),
        unit: 'inches',
        recordedAt: faker.date.past({ years: 1 })
      }
    ];
  }

  private generateHealthGoals(): HealthGoal[] {
    return faker.helpers.arrayElements([
      'weight_loss', 'weight_gain', 'muscle_building', 'heart_health', 'diabetes_management', 'blood_pressure_control'
    ], { min: 1, max: 3 }).map(goal => ({
      id: this.generateSecureId(),
      type: goal,
      target: faker.lorem.sentence(),
      targetDate: faker.date.future(),
      progress: faker.number.int({ min: 0, max: 100 }),
      priority: faker.helpers.arrayElement(['low', 'medium', 'high'])
    }));
  }

  private generateRiskFactors(): RiskFactor[] {
    return faker.helpers.arrayElements([
      'smoking', 'alcohol', 'sedentary_lifestyle', 'family_history', 'stress', 'obesity'
    ], { min: 0, max: 3 }).map(factor => ({
      id: this.generateSecureId(),
      type: factor,
      severity: faker.helpers.arrayElement(['low', 'medium', 'high']),
      assessedDate: faker.date.recent(),
      notes: faker.lorem.sentence()
    }));
  }

  private generatePermissions(role: FamilyRole): FamilyPermissions {
    const basePermissions = {
      viewProfile: true,
      editProfile: false,
      viewHealthData: false,
      editHealthData: false,
      manageMembers: false,
      billing: false,
      emergencyAccess: false
    };

    switch (role) {
      case FamilyRole.PRIMARY:
        return {
          ...basePermissions,
          editProfile: true,
          viewHealthData: true,
          editHealthData: true,
          manageMembers: true,
          billing: true,
          emergencyAccess: true
        };
      case FamilyRole.SPOUSE:
        return {
          ...basePermissions,
          editProfile: true,
          viewHealthData: true,
          editHealthData: true,
          emergencyAccess: true
        };
      case FamilyRole.CHILD:
        return {
          ...basePermissions,
          editProfile: true,
          viewHealthData: true,
          editHealthData: true
        };
      default:
        return basePermissions;
    }
  }

  private generateSharedPreferences(): SharedPreferences {
    return {
      mealPlanningStyle: faker.helpers.arrayElement(['collaborative', 'democratic', 'primary_decides']),
      shoppingListAccess: faker.helpers.arrayElement(['all_members', 'adults_only', 'primary_only']),
      recipeSharing: faker.datatype.boolean(),
      nutritionGoalAlignment: faker.datatype.boolean()
    };
  }

  private generateEmergencyAccessConfig(): EmergencyAccessConfig {
    return {
      enabled: true,
      authorizedMembers: faker.helpers.arrayElements(['spouse', 'adult_children'], { min: 1, max: 2 }),
      accessLevel: faker.helpers.arrayElement(['basic_info', 'health_summary', 'full_access']),
      notificationSettings: {
        immediateNotification: true,
        delayedNotification: false,
        delayHours: 0
      }
    };
  }

  private generatePrivacySettings(): PrivacySettings {
    return {
      profileVisibility: faker.helpers.arrayElement(['family_only', 'providers_only', 'restricted']),
      healthDataSharing: faker.helpers.arrayElement(['none', 'family', 'providers', 'research']),
      communicationPreferences: {
        email: faker.datatype.boolean(),
        sms: faker.datatype.boolean(),
        push: faker.datatype.boolean()
      },
      dataRetention: faker.helpers.arrayElement(['standard', 'extended', 'minimal'])
    };
  }

  private generateFamilySubscription(): FamilySubscription {
    return {
      tier: faker.helpers.arrayElement([SubscriptionTier.ENHANCED, SubscriptionTier.PREMIUM]),
      billingCycle: faker.helpers.arrayElement(['monthly', 'annual']),
      maxMembers: faker.number.int({ min: 4, max: 6 }),
      currentMembers: faker.number.int({ min: 2, max: 4 }),
      nextBillingDate: faker.date.future(),
      autoRenew: faker.datatype.boolean()
    };
  }

  private generateClinicalNotes(): ClinicalNote[] {
    return Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: this.generateSecureId(),
      providerId: this.generateSecureId(),
      noteType: faker.helpers.arrayElement(['consultation', 'follow_up', 'assessment', 'treatment_plan']),
      content: faker.lorem.paragraphs(2),
      createdAt: faker.date.past({ years: 1 }),
      lastModified: faker.date.recent(),
      confidentiality: faker.helpers.arrayElement(['standard', 'restricted', 'confidential'])
    }));
  }

  private generateLabResults(): LabResult[] {
    return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: this.generateSecureId(),
      testName: faker.helpers.arrayElement(['HbA1c', 'Cholesterol Panel', 'Vitamin D', 'Thyroid Panel']),
      value: faker.number.float({ min: 5.0, max: 15.0, precision: 0.1 }),
      unit: faker.helpers.arrayElement(['mg/dL', '%', 'ng/mL', 'mIU/L']),
      referenceRange: '5.0-10.0',
      status: faker.helpers.arrayElement(['normal', 'abnormal', 'critical']),
      testDate: faker.date.past({ months: 6 }),
      providerId: this.generateSecureId()
    }));
  }

  private generateVitalSigns(): VitalSign[] {
    return [
      {
        id: this.generateSecureId(),
        type: 'blood_pressure',
        systolic: faker.number.int({ min: 110, max: 140 }),
        diastolic: faker.number.int({ min: 70, max: 90 }),
        recordedAt: faker.date.recent(),
        recordedBy: 'patient'
      },
      {
        id: this.generateSecureId(),
        type: 'heart_rate',
        value: faker.number.int({ min: 60, max: 100 }),
        unit: 'bpm',
        recordedAt: faker.date.recent(),
        recordedBy: 'patient'
      }
    ];
  }

  private generateClinicalAssessments(): ClinicalAssessment[] {
    return [
      {
        id: this.generateSecureId(),
        assessmentType: 'nutritional_assessment',
        findings: faker.lorem.sentences(3),
        recommendations: faker.lorem.sentences(2),
        riskLevel: faker.helpers.arrayElement(['low', 'medium', 'high']),
        followUpRequired: faker.datatype.boolean(),
        nextReviewDate: faker.date.future(),
        providerId: this.generateSecureId()
      }
    ];
  }

  private generateTreatmentPlans(): TreatmentPlan[] {
    return [
      {
        id: this.generateSecureId(),
        planType: 'dietary_management',
        goals: faker.helpers.arrayElements(['weight_loss', 'blood_sugar_control', 'blood_pressure_management'], { min: 1, max: 2 }),
        interventions: faker.lorem.sentences(3),
        timeline: '3 months',
        provider: faker.person.fullName(),
        startDate: faker.date.recent(),
        reviewDate: faker.date.future({ years: 0.25 })
      }
    ];
  }

  private generateClinicalAuditLog(patientId: string): ClinicalAuditEntry[] {
    return Array.from({ length: faker.number.int({ min: 10, max: 50 }) }, () => ({
      id: this.generateSecureId(),
      patientId,
      userId: this.generateSecureId(),
      action: faker.helpers.arrayElement(['view', 'create', 'update', 'delete', 'export']),
      resource: faker.helpers.arrayElement(['clinical_notes', 'lab_results', 'vital_signs', 'assessments']),
      timestamp: faker.date.recent(),
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      result: faker.helpers.arrayElement(['success', 'failure', 'unauthorized']),
      reason: faker.lorem.sentence()
    }));
  }
}

// Supporting interfaces
interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface HealthProfile {
  userId: string;
  conditions: HealthCondition[];
  medications: Medication[];
  allergies: Allergy[];
  dietaryRestrictions: DietaryRestriction[];
  nutritionalGoals: NutritionalGoal[];
  activityLevel: ActivityLevel;
  biometrics: Biometric[];
  healthGoals: HealthGoal[];
  riskFactors: RiskFactor[];
  lastUpdated: Date;
}

interface UserPreferences {
  language: string;
  timezone: string;
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacySettings: {
    shareWithFamily: boolean;
    shareWithProviders: boolean;
    allowResearch: boolean;
  };
  cuisinePreferences: string[];
}

interface ConsentRecord {
  id: string;
  consentType: string;
  version: string;
  consentedAt: Date;
  ipAddress: string;
  userAgent: string;
  documentUrl: string;
}

interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  result: string;
}

interface FamilyMember {
  userId: string;
  role: FamilyRole;
  permissions: FamilyPermissions;
  joinedAt: Date;
}

interface FamilyPermissions {
  viewProfile: boolean;
  editProfile: boolean;
  viewHealthData: boolean;
  editHealthData: boolean;
  manageMembers: boolean;
  billing: boolean;
  emergencyAccess: boolean;
}

interface SharedPreferences {
  mealPlanningStyle: string;
  shoppingListAccess: string;
  recipeSharing: boolean;
  nutritionGoalAlignment: boolean;
}

interface EmergencyAccessConfig {
  enabled: boolean;
  authorizedMembers: string[];
  accessLevel: string;
  notificationSettings: {
    immediateNotification: boolean;
    delayedNotification: boolean;
    delayHours: number;
  };
}

interface PrivacySettings {
  profileVisibility: string;
  healthDataSharing: string;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dataRetention: string;
}

interface FamilySubscription {
  tier: SubscriptionTier;
  billingCycle: string;
  maxMembers: number;
  currentMembers: number;
  nextBillingDate: Date;
  autoRenew: boolean;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: Date;
  endDate: Date | null;
  notes: string;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: string;
  symptoms: string[];
  diagnosedDate: Date;
  lastReaction: Date;
}

interface DietaryRestriction {
  id: string;
  type: string;
  reason: string;
  since: Date;
  strictness: string;
}

interface NutritionalGoal {
  id: string;
  type: string;
  target: number;
  unit: string;
  period: string;
}

interface Biometric {
  id: string;
  type: string;
  value: number;
  unit: string;
  recordedAt: Date;
}

interface HealthGoal {
  id: string;
  type: string;
  target: string;
  targetDate: Date;
  progress: number;
  priority: string;
}

interface RiskFactor {
  id: string;
  type: string;
  severity: string;
  assessedDate: Date;
  notes: string;
}

interface ClinicalNote {
  id: string;
  providerId: string;
  noteType: string;
  content: string;
  createdAt: Date;
  lastModified: Date;
  confidentiality: string;
}

interface LabResult {
  id: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: string;
  testDate: Date;
  providerId: string;
}

interface VitalSign {
  id: string;
  type: string;
  systolic?: number;
  diastolic?: number;
  value?: number;
  unit?: string;
  recordedAt: Date;
  recordedBy: string;
}

interface ClinicalAssessment {
  id: string;
  assessmentType: string;
  findings: string;
  recommendations: string;
  riskLevel: string;
  followUpRequired: boolean;
  nextReviewDate: Date;
  providerId: string;
}

interface TreatmentPlan {
  id: string;
  planType: string;
  goals: string[];
  interventions: string;
  timeline: string;
  provider: string;
  startDate: Date;
  reviewDate: Date;
}

interface ClinicalAuditEntry {
  id: string;
  patientId: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  result: string;
  reason: string;
}

interface DrugFoodInteraction {
  id: string;
  drugName: string;
  foodItem: string;
  interactionType: string;
  severity: string;
  description: string;
  recommendation: string;
  evidence: string;
  lastUpdated: Date;
}

interface AllergyScenario {
  id: string;
  allergen: string;
  severity: string;
  symptoms: string[];
  onsetTime: string;
  crossReactivity: string[];
  emergencyAction: string;
  lastReaction: Date;
}

interface ComplianceScenario {
  id: string;
  scenarioType: string;
  description: string;
  severity: string;
  affectedUsers: string[];
  detectionTime: Date;
  responseTime: Date;
  mitigationSteps: string[];
  complianceRequirements: string[];
  documentationRequired: boolean;
  resolved: boolean;
}

interface PerformanceTestData {
  concurrentUsers: number;
  testDuration: number;
  endpoints: {
    endpoint: string;
    avgResponseTime: number;
    maxResponseTime: number;
    throughput: number;
    errorRate: number;
  }[];
  databaseMetrics: {
    connectionPoolUsage: number;
    queryExecutionTime: number;
    lockWaitTime: number;
    deadlocks: number;
  };
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
}

interface AccessibilityTestScenario {
  id: string;
  testType: string;
  component: string;
  wcagLevel: string;
  successCriteria: string;
  issue: string;
  severity: string;
  recommendation: string;
  affectedUsers: string[];
  testResult: string;
}

export default MockDataGenerator; 