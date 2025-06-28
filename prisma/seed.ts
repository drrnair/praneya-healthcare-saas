/**
 * Praneya Healthcare Platform - Seed Data
 * Comprehensive test data for healthcare scenarios and family configurations
 */

import { PrismaClient } from '@prisma/client';
import { HealthcareEncryption } from '../src/server/middleware/healthcare-security';

const prisma = new PrismaClient();

async function main() {
  console.log('🏥 Starting healthcare platform seed...');

  // =====================================================
  // TENANT SETUP
  // =====================================================
  
  const mainTenant = await prisma.tenant.create({
    data: {
      id: 'tenant_healthcare_demo',
      name: 'Healthcare Demo Tenant',
      subdomain: 'demo',
      planType: 'PREMIUM',
      isActive: true,
      hipaaCompliant: true,
      encryptionKeyId: 'key_demo_tenant_001',
      dataRegion: 'us-east-1',
      complianceLevel: 'HIPAA_READY',
    },
  });

  console.log('✅ Created tenant:', mainTenant.name);

  // =====================================================
  // CLINICAL RULES SETUP
  // =====================================================

  const drugInteractionRule = await prisma.clinicalRule.create({
    data: {
      id: 'rule_drug_interaction_001',
      tenantId: mainTenant.id,
      ruleType: 'DRUG_INTERACTION',
      name: 'Warfarin-Aspirin Interaction Check',
      description: 'Check for dangerous combination of warfarin and aspirin',
      conditions: {
        medications: ['warfarin', 'aspirin'],
        severity: 'MAJOR',
        contraindicated: true
      },
      actions: {
        block: true,
        alert: 'CRITICAL: Warfarin + Aspirin = High bleeding risk',
        recommend: 'Consult cardiologist before combining'
      },
      severity: 'CRITICAL',
      evidenceLevel: 'HIGH',
      clinicalReferences: ['PMID:12345678', 'ACC/AHA Guidelines 2023'],
      isActive: true,
      version: '1.0',
      createdBy: 'system',
      approvedBy: 'clinical_team',
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  });

  console.log('✅ Created clinical rule:', drugInteractionRule.name);

  // =====================================================
  // DEMO USERS AND HEALTH PROFILES
  // =====================================================

  // Demo Doctor/Clinical Advisor
  const doctorUser = await prisma.user.create({
    data: {
      id: 'user_doctor_001',
      tenantId: mainTenant.id,
      email: 'dr.smith@praneyahealth.com',
      firebaseUid: 'firebase_doctor_001',
      encryptedFirstName: HealthcareEncryption.encryptPHI('Dr. Sarah'),
      encryptedLastName: HealthcareEncryption.encryptPHI('Smith'),
      encryptedPhone: HealthcareEncryption.encryptPHI('+1-555-0123'),
      healthcareRole: 'CLINICAL_ADVISOR',
      subscriptionTier: 'PREMIUM',
      mfaEnabled: true,
      isActive: true,
      isVerified: true,
      lastHipaaTraining: new Date(),
    },
  });

  // Family Account Primary User (Parent)
  const parentUser = await prisma.user.create({
    data: {
      id: 'user_parent_001',
      tenantId: mainTenant.id,
      email: 'john.doe@example.com',
      firebaseUid: 'firebase_parent_001',
      encryptedFirstName: HealthcareEncryption.encryptPHI('John'),
      encryptedLastName: HealthcareEncryption.encryptPHI('Doe'),
      encryptedPhone: HealthcareEncryption.encryptPHI('+1-555-0456'),
      encryptedDateOfBirth: HealthcareEncryption.encryptPHI('1985-03-15'),
      healthcareRole: 'END_USER',
      subscriptionTier: 'ENHANCED',
      mfaEnabled: true,
      isActive: true,
      isVerified: true,
    },
  });

  // Spouse User
  const spouseUser = await prisma.user.create({
    data: {
      id: 'user_spouse_001',
      tenantId: mainTenant.id,
      email: 'jane.doe@example.com',
      firebaseUid: 'firebase_spouse_001',
      encryptedFirstName: HealthcareEncryption.encryptPHI('Jane'),
      encryptedLastName: HealthcareEncryption.encryptPHI('Doe'),
      encryptedPhone: HealthcareEncryption.encryptPHI('+1-555-0789'),
      encryptedDateOfBirth: HealthcareEncryption.encryptPHI('1987-07-22'),
      healthcareRole: 'END_USER',
      subscriptionTier: 'ENHANCED',
      isActive: true,
      isVerified: true,
    },
  });

  // Child User (Minor)
  const childUser = await prisma.user.create({
    data: {
      id: 'user_child_001',
      tenantId: mainTenant.id,
      email: 'emergency.contact@example.com', // Parent's emergency email
      firebaseUid: 'firebase_child_001',
      encryptedFirstName: HealthcareEncryption.encryptPHI('Emma'),
      encryptedLastName: HealthcareEncryption.encryptPHI('Doe'),
      encryptedDateOfBirth: HealthcareEncryption.encryptPHI('2015-12-10'),
      healthcareRole: 'END_USER',
      subscriptionTier: 'BASIC',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Created demo users');

  // =====================================================
  // FAMILY ACCOUNT SETUP
  // =====================================================

  const familyAccount = await prisma.familyAccount.create({
    data: {
      id: 'family_doe_001',
      tenantId: mainTenant.id,
      primaryUserId: parentUser.id,
      familyName: 'Doe Family',
      subscriptionTier: 'ENHANCED',
      maxMembers: 6,
      privacySettings: {
        shareHealthData: true,
        emergencyAccess: true,
        parentalControls: true
      },
    },
  });

  // Family Members
  await prisma.familyMember.createMany({
    data: [
      {
        familyAccountId: familyAccount.id,
        userId: parentUser.id,
        relationship: 'PARENT',
        permissionLevel: 'FULL',
        canViewHealthData: true,
        isMinor: false,
        guardianConsent: false,
      },
      {
        familyAccountId: familyAccount.id,
        userId: spouseUser.id,
        relationship: 'SPOUSE',
        permissionLevel: 'FULL',
        canViewHealthData: true,
        isMinor: false,
        guardianConsent: false,
      },
      {
        familyAccountId: familyAccount.id,
        userId: childUser.id,
        relationship: 'CHILD',
        permissionLevel: 'LIMITED',
        canViewHealthData: false,
        isMinor: true,
        guardianConsent: true,
      },
    ],
  });

  console.log('✅ Created family account and relationships');

  // =====================================================
  // HEALTH PROFILES WITH CLINICAL DATA
  // =====================================================

  // Parent Health Profile (Complex medical history)
  const parentHealthProfile = await prisma.healthProfile.create({
    data: {
      id: 'health_parent_001',
      userId: parentUser.id,
      subscriptionTier: 'ENHANCED',
      dataIntegrityHash: 'hash_parent_001',
      version: 1,
    },
  });

  // Child Health Profile (Pediatric allergies)
  const childHealthProfile = await prisma.healthProfile.create({
    data: {
      id: 'health_child_001',
      userId: childUser.id,
      subscriptionTier: 'BASIC',
      dataIntegrityHash: 'hash_child_001',
      version: 1,
    },
  });

  // =====================================================
  // ALLERGIES DATA
  // =====================================================

  await prisma.allergy.createMany({
    data: [
      {
        healthProfileId: parentHealthProfile.id,
        allergen: 'Peanuts',
        allergenCategory: 'FOOD',
        severity: 'SEVERE',
        reactions: ['hives', 'swelling', 'difficulty breathing'],
        firstOccurrence: new Date('2010-05-15'),
        lastOccurrence: new Date('2023-08-20'),
        verifiedBy: 'Dr. Sarah Smith',
        testDate: new Date('2023-09-01'),
        testType: 'Skin prick test',
        emergencyMedication: 'EpiPen Auto-Injector',
        isActive: true,
      },
      {
        healthProfileId: childHealthProfile.id,
        allergen: 'Tree nuts',
        allergenCategory: 'FOOD',
        severity: 'ANAPHYLACTIC',
        reactions: ['anaphylaxis', 'respiratory distress'],
        firstOccurrence: new Date('2020-03-10'),
        lastOccurrence: new Date('2023-11-05'),
        verifiedBy: 'Dr. Pediatric Allergist',
        testDate: new Date('2023-11-10'),
        testType: 'Blood test (IgE)',
        emergencyMedication: 'EpiPen Jr Auto-Injector',
        notes: 'CRITICAL: Always carry EpiPen. School nurse notified.',
        isActive: true,
      },
    ],
  });

  // =====================================================
  // MEDICATIONS DATA
  // =====================================================

  const warfarinMed = await prisma.medication.create({
    data: {
      healthProfileId: parentHealthProfile.id,
      genericName: 'Warfarin',
      brandName: 'Coumadin',
      dosage: '5mg',
      frequency: 'Once daily',
      route: 'oral',
      indication: 'Atrial fibrillation anticoagulation',
      prescribedBy: 'Dr. Sarah Smith',
      prescriptionDate: new Date('2023-01-15'),
      isActive: true,
    },
  });

  // =====================================================
  // DRUG INTERACTIONS
  // =====================================================

  await prisma.drugInteraction.create({
    data: {
      medicationId: warfarinMed.id,
      interactingSubstance: 'Aspirin',
      severity: 'MAJOR',
      interactionType: 'DRUG_DRUG',
      description: 'Concurrent use increases bleeding risk significantly',
      mechanism: 'Additive anticoagulant effects',
      clinicalEffect: 'Increased risk of major bleeding, including GI and intracranial hemorrhage',
      recommendation: 'Avoid combination. Use alternative pain relief if needed.',
      avoidCombination: true,
      requiresMonitoring: true,
      evidenceLevel: 'HIGH',
      clinicalReferences: ['Warfarin-Aspirin Drug Interaction Study 2023'],
      lastReviewed: new Date(),
    },
  });

  // =====================================================
  // BIOMETRIC READINGS
  // =====================================================

  const biometricData = [
    { type: 'WEIGHT', value: 75.5, unit: 'kg', date: new Date('2024-01-01') },
    { type: 'WEIGHT', value: 74.8, unit: 'kg', date: new Date('2024-01-15') },
    { type: 'BLOOD_PRESSURE_SYSTOLIC', value: 125, unit: 'mmHg', date: new Date('2024-01-15') },
    { type: 'BLOOD_PRESSURE_DIASTOLIC', value: 78, unit: 'mmHg', date: new Date('2024-01-15') },
    { type: 'BLOOD_GLUCOSE', value: 95, unit: 'mg/dL', date: new Date('2024-01-15') },
  ];

  for (const reading of biometricData) {
    await prisma.biometricReading.create({
      data: {
        userId: parentUser.id,
        healthProfileId: parentHealthProfile.id,
        readingType: reading.type as any,
        value: reading.value,
        unit: reading.unit,
        takenAt: reading.date,
        conditions: { fasting: reading.type === 'BLOOD_GLUCOSE' },
        confidence: 1.0,
        isVerified: true,
        verifiedBy: 'Dr. Sarah Smith',
        trendDirection: 'STABLE',
      },
    });
  }

  // =====================================================
  // CONSENT RECORDS
  // =====================================================

  await prisma.consentRecord.createMany({
    data: [
      {
        userId: parentUser.id,
        consentType: 'MEDICAL_DISCLAIMER',
        status: 'GRANTED',
        version: '2024.1',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 Healthcare App',
        consentedAt: new Date(),
      },
      {
        userId: parentUser.id,
        consentType: 'FAMILY_SHARING',
        status: 'GRANTED',
        version: '2024.1',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 Healthcare App',
        consentedAt: new Date(),
      },
      {
        userId: childUser.id,
        consentType: 'MEDICAL_DISCLAIMER',
        status: 'GRANTED',
        version: '2024.1',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 Healthcare App',
        consentedAt: new Date(),
      },
    ],
  });

  // =====================================================
  // DEMO RECIPES AND MEAL PLANS
  // =====================================================

  const allergyFriendlyRecipe = await prisma.recipe.create({
    data: {
      createdBy: parentUser.id,
      title: 'Nut-Free Chocolate Chip Cookies',
      description: 'Safe cookies for children with severe nut allergies',
      instructions: [
        'Preheat oven to 350°F',
        'Mix flour, baking soda, and salt',
        'Cream butter and sugars',
        'Add eggs and vanilla',
        'Combine wet and dry ingredients',
        'Add nut-free chocolate chips',
        'Bake for 10-12 minutes'
      ],
      ingredients: {
        flour: '2 cups all-purpose flour',
        bakingSoda: '1 tsp baking soda',
        salt: '1 tsp salt',
        butter: '1 cup softened butter',
        sugar: '3/4 cup granulated sugar',
        brownSugar: '3/4 cup brown sugar',
        eggs: '2 large eggs',
        vanilla: '2 tsp vanilla extract',
        chocolateChips: '2 cups nut-free chocolate chips'
      },
      nutrition: {
        calories: 180,
        protein: 2.5,
        carbs: 28,
        fat: 8,
        fiber: 1,
        sugar: 16
      },
      servings: 24,
      prepTime: 15,
      cookTime: 12,
      cuisineType: 'American',
      mealType: ['SNACK'],
      dietaryFlags: ['NUT_FREE'],
      queryHash: 'nut_free_cookies_001',
      complexity: 'SIMPLE',
      allergenWarnings: ['Contains wheat, eggs, dairy'],
      healthBenefits: ['Nut-free for allergic children'],
      contraindications: ['Not suitable for gluten-free diets'],
      isVerified: true,
      verifiedBy: doctorUser.id,
      verifiedAt: new Date(),
      rating: 4.5,
      ratingCount: 12,
    },
  });

  console.log('✅ Created demo recipe:', allergyFriendlyRecipe.title);

  // =====================================================
  // AUDIT LOGS FOR COMPLIANCE DEMONSTRATION
  // =====================================================

  await prisma.auditLog.createMany({
    data: [
      {
        tenantId: mainTenant.id,
        userId: parentUser.id,
        action: 'LOGIN',
        resourceType: 'user',
        resourceId: parentUser.id,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 Healthcare App',
        riskScore: 0.1,
        complianceFlags: ['SUCCESSFUL_LOGIN'],
        phiAccessed: false,
      },
      {
        tenantId: mainTenant.id,
        userId: parentUser.id,
        action: 'VIEW_HEALTH_PROFILE',
        resourceType: 'health_profile',
        resourceId: childHealthProfile.id,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 Healthcare App',
        riskScore: 0.3,
        complianceFlags: ['FAMILY_ACCESS', 'PHI_ACCESS'],
        phiAccessed: true,
      },
      {
        tenantId: mainTenant.id,
        userId: doctorUser.id,
        action: 'CLINICAL_REVIEW',
        resourceType: 'health_profile',
        resourceId: parentHealthProfile.id,
        ipAddress: '10.0.1.50',
        userAgent: 'Clinical Portal v2.1',
        riskScore: 0.2,
        complianceFlags: ['CLINICAL_ACCESS', 'PHI_ACCESS'],
        phiAccessed: true,
      },
    ],
  });

  console.log('✅ Created audit logs for compliance demonstration');

  console.log('🎉 Healthcare platform seed completed successfully!');
  console.log(`
  📊 Created:
  - 1 Healthcare tenant with HIPAA compliance
  - 4 Demo users (Doctor, Parent, Spouse, Child)
  - 1 Family account with hierarchical permissions
  - Clinical rules for drug interactions
  - Health profiles with allergies and medications
  - Biometric readings and trends
  - HIPAA consent records
  - Allergy-friendly recipes
  - Comprehensive audit logs
  
  🔐 Security Features:
  - Row-level security policies
  - Field-level encryption for PHI
  - Multi-tenant isolation
  - Family privacy controls
  - Emergency access procedures
  - Comprehensive audit trails
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 