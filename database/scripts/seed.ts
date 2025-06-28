#!/usr/bin/env tsx
// Seed script for Praneya Healthcare SaaS development environment
// Populates database with sample healthcare data for testing

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  tenants,
  users,
  medicalDisclaimers,
  userConsents,
  clinicalProfiles,
  clinicalEvidence,
  drugFoodInteractions,
  subscriptionTiers,
  familyAccounts,
  familyPermissions,
} from '../../src/lib/database/schema';

// Database connection for seeding
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'praneya_dev',
  user: process.env.DB_USER || 'praneya_admin',
  password: process.env.DB_PASSWORD || 'praneya_dev_password_2024',
});

const db = drizzle(pool);

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Insert tenants
    console.log('📊 Seeding tenants...');
    const [tenant] = await db.insert(tenants).values({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Praneya Dev Tenant',
      subdomain: 'dev',
      isActive: true,
    }).returning();

    // Insert medical disclaimers
    console.log('⚕️ Seeding medical disclaimers...');
    const [disclaimer] = await db.insert(medicalDisclaimers).values({
      version: '1.0',
      content: `
IMPORTANT MEDICAL DISCLAIMER

This application provides general nutrition information and is not intended as medical advice, diagnosis, or treatment. The information provided is for educational purposes only and should not replace professional medical consultation.

Key Disclaimers:
• Always consult with healthcare professionals before making significant dietary changes
• Recipe recommendations are based on general nutrition guidelines, not individual medical needs
• Drug-food interaction warnings are for informational purposes only
• Clinical features require healthcare provider oversight
• Emergency medical situations require immediate professional care

By using this application, you acknowledge:
• You understand this is not medical advice
• You will consult healthcare providers for medical decisions
• You accept responsibility for your health choices
• You understand AI recommendations require professional validation

For medical emergencies, contact your healthcare provider or emergency services immediately.

Last updated: ${new Date().toISOString()}
      `.trim(),
      effectiveDate: new Date(),
      isCurrent: true,
    }).returning();

    // Insert subscription tiers
    console.log('💳 Seeding subscription tiers...');
    await db.insert(subscriptionTiers).values([
      {
        tierName: 'basic',
        displayName: 'Basic Nutrition',
        description: 'Essential nutrition tracking and recipe search with allergy management',
        basePriceCents: 0,
        familyMemberPriceCents: 0,
        maxFamilyMembers: 1,
        apiQuotaMonthly: 1000,
        clinicalConsultationsIncluded: 0,
        aiRequestsMonthly: 50,
        clinicalFeaturesEnabled: false,
        familyFeaturesEnabled: false,
        aiFeaturesEnabled: true,
        stripePriceId: 'price_basic_monthly',
        stripeProductId: 'prod_basic',
        trialDays: 0,
      },
      {
        tierName: 'enhanced',
        displayName: 'Family Nutrition',
        description: 'Advanced meal planning for families with shopping lists and nutrition goals',
        basePriceCents: 1299, // $12.99
        familyMemberPriceCents: 499, // $4.99 per additional member
        maxFamilyMembers: 6,
        apiQuotaMonthly: 5000,
        clinicalConsultationsIncluded: 0,
        aiRequestsMonthly: 200,
        clinicalFeaturesEnabled: false,
        familyFeaturesEnabled: true,
        aiFeaturesEnabled: true,
        stripePriceId: 'price_enhanced_monthly',
        stripeProductId: 'prod_enhanced',
        trialDays: 14,
      },
      {
        tierName: 'premium',
        displayName: 'Clinical Nutrition',
        description: 'Professional-grade nutrition with clinical AI, drug interactions, and provider integration',
        basePriceCents: 2999, // $29.99
        familyMemberPriceCents: 999, // $9.99 per additional member
        maxFamilyMembers: 6,
        apiQuotaMonthly: 20000,
        clinicalConsultationsIncluded: 2,
        aiRequestsMonthly: 1000,
        clinicalFeaturesEnabled: true,
        familyFeaturesEnabled: true,
        aiFeaturesEnabled: true,
        providerIntegrationEnabled: true,
        advancedAnalyticsEnabled: true,
        stripePriceId: 'price_premium_monthly',
        stripeProductId: 'prod_premium',
        trialDays: 7,
      },
    ]);

    // Insert sample users
    console.log('👥 Seeding sample users...');
    const [adminUser] = await db.insert(users).values({
      tenantId: tenant.id,
      firebaseUid: 'admin_firebase_uid_123',
      email: 'admin@praneya.com',
      role: 'super_admin',
      subscriptionTier: 'premium',
      isActive: true,
    }).returning();

    const [testUser] = await db.insert(users).values({
      tenantId: tenant.id,
      firebaseUid: 'test_user_firebase_uid_456',
      email: 'test@example.com',
      role: 'end_user',
      subscriptionTier: 'enhanced',
      isActive: true,
    }).returning();

    const [clinicalAdvisor] = await db.insert(users).values({
      tenantId: tenant.id,
      firebaseUid: 'clinical_advisor_firebase_uid_789',
      email: 'clinical@praneya.com',
      role: 'clinical_advisor',
      subscriptionTier: 'premium',
      isActive: true,
    }).returning();

    // Insert user consents
    console.log('📋 Seeding user consents...');
    await db.insert(userConsents).values([
      {
        tenantId: tenant.id,
        userId: adminUser.id,
        disclaimerId: disclaimer.id,
        status: 'granted',
        ipAddress: '127.0.0.1',
        userAgent: 'Test User Agent',
        consentedAt: new Date(),
      },
      {
        tenantId: tenant.id,
        userId: testUser.id,
        disclaimerId: disclaimer.id,
        status: 'granted',
        ipAddress: '127.0.0.1',
        userAgent: 'Test User Agent',
        consentedAt: new Date(),
      },
      {
        tenantId: tenant.id,
        userId: clinicalAdvisor.id,
        disclaimerId: disclaimer.id,
        status: 'granted',
        ipAddress: '127.0.0.1',
        userAgent: 'Test User Agent',
        consentedAt: new Date(),
      },
    ]);

    // Insert sample clinical profiles
    console.log('🏥 Seeding clinical profiles...');
    await db.insert(clinicalProfiles).values([
      {
        tenantId: tenant.id,
        userId: testUser.id,
        icd10Codes: ['E11.9', 'I10'], // Type 2 diabetes, Essential hypertension
        snomedCodes: ['44054006', '38341003'], // Type 2 diabetes, Hypertension
        currentMedications: [
          {
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'twice daily',
            startDate: '2024-01-15',
            prescribedBy: 'Dr. Jane Smith',
          },
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'once daily',
            startDate: '2023-06-10',
            prescribedBy: 'Dr. Jane Smith',
          },
        ],
        allergiesStructured: [
          {
            allergen: 'peanuts',
            severity: 'severe',
            reactions: ['anaphylaxis', 'hives'],
            confirmedDate: '2020-03-15',
            source: 'provider_confirmed',
          },
          {
            allergen: 'shellfish',
            severity: 'moderate',
            reactions: ['digestive_upset', 'skin_rash'],
            confirmedDate: '2021-08-22',
            source: 'patient_reported',
          },
        ],
        dietaryRestrictionsMedical: [
          {
            restriction: 'sodium_limited',
            limit: '2000mg_daily',
            reason: 'hypertension_management',
            prescribedBy: 'Dr. Jane Smith',
            startDate: '2023-06-10',
          },
          {
            restriction: 'carbohydrate_counting',
            limit: '45-60g_per_meal',
            reason: 'diabetes_management',
            prescribedBy: 'Dr. Jane Smith',
            startDate: '2024-01-15',
          },
        ],
        labValuesHistory: [
          {
            testDate: '2024-01-15',
            testName: 'HbA1c',
            value: 7.2,
            units: '%',
            referenceRange: '4.0-5.6',
            provider: 'LabCorp',
            abnormalFlag: true,
          },
          {
            testDate: '2024-01-15',
            testName: 'eGFR',
            value: 85,
            units: 'mL/min/1.73m²',
            referenceRange: '>60',
            provider: 'LabCorp',
            abnormalFlag: false,
          },
        ],
        vitalSignsHistory: [
          {
            date: '2024-01-15',
            bpSystolic: 135,
            bpDiastolic: 85,
            heartRate: 72,
            weightKg: 80.5,
            heightCm: 175,
          },
        ],
        providerInformation: {
          primaryCare: {
            name: 'Dr. Jane Smith',
            npi: '1234567890',
            phone: '+1-555-0123',
            email: 'jane.smith@healthcenter.com',
          },
          specialists: [
            {
              specialty: 'Endocrinology',
              name: 'Dr. Robert Johnson',
              npi: '0987654321',
              phone: '+1-555-0456',
            },
          ],
        },
        dataSource: 'provider_imported',
        verificationStatus: 'provider_verified',
        lastUpdatedBy: clinicalAdvisor.id,
      },
    ]);

    // Insert clinical evidence
    console.log('📚 Seeding clinical evidence...');
    await db.insert(clinicalEvidence).values([
      {
        recommendationType: 'dietary_carbohydrate_management',
        healthCondition: 'diabetes_type_2',
        evidenceLevel: 'A',
        sourceType: 'clinical_guideline',
        sourceCitation: 'American Diabetes Association. Standards of Medical Care in Diabetes—2024. Diabetes Care 2024;47(Suppl. 1)',
        pubmedId: '38078580',
        guidelineOrganization: 'American Diabetes Association',
        recommendationText: 'For adults with diabetes, a carbohydrate intake of 45–65% of total daily calories, or 45-60g per meal, is recommended for optimal glycemic control.',
        specificRecommendations: {
          carbohydratePercentage: '45-65%',
          carbsPerMeal: '45-60g',
          focus: 'complex_carbohydrates',
          fiber: 'minimum_25g_daily',
        },
        contraindications: ['severe_hypoglycemia_history', 'eating_disorders'],
        populationApplicability: {
          ageMin: 18,
          includes: ['type_2_diabetes', 'prediabetes'],
          excludes: ['pregnancy', 'type_1_diabetes', 'severe_renal_disease'],
        },
        confidenceLevel: 5,
        isActive: true,
      },
      {
        recommendationType: 'sodium_restriction',
        healthCondition: 'hypertension_stage_1',
        evidenceLevel: 'A',
        sourceType: 'clinical_guideline',
        sourceCitation: '2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults',
        guidelineOrganization: 'American College of Cardiology/American Heart Association',
        recommendationText: 'Sodium intake should be reduced to less than 2,300 mg/day, with an optimal goal of 1,500 mg/day for most adults with hypertension.',
        specificRecommendations: {
          sodiumLimit: '2300mg_maximum',
          optimalLimit: '1500mg_daily',
          implementation: 'gradual_reduction',
          monitoring: 'blood_pressure_tracking',
        },
        contraindications: ['severe_kidney_disease', 'adrenal_insufficiency'],
        populationApplicability: {
          ageMin: 18,
          includes: ['hypertension', 'prehypertension', 'heart_disease'],
        },
        confidenceLevel: 5,
        isActive: true,
      },
    ]);

    // Insert drug-food interactions
    console.log('💊 Seeding drug-food interactions...');
    await db.insert(drugFoodInteractions).values([
      {
        drugName: 'Warfarin',
        genericName: 'warfarin',
        brandNames: ['Coumadin', 'Jantoven'],
        drugClass: 'Anticoagulant',
        interactingFoods: ['leafy_greens', 'broccoli', 'brussels_sprouts', 'asparagus'],
        interactingNutrients: ['vitamin_k'],
        foodCategories: ['dark_leafy_vegetables', 'cruciferous_vegetables'],
        interactionType: 'monitor',
        severity: 'moderate',
        mechanism: 'Vitamin K antagonizes warfarin anticoagulant effect by promoting clotting factor synthesis',
        clinicalEffect: 'Decreased anticoagulation effectiveness, increased risk of thrombosis',
        recommendations: 'Maintain consistent vitamin K intake rather than avoiding it completely. Monitor INR closely when making dietary changes. Aim for consistent daily intake of vitamin K-rich foods.',
        timingInstructions: 'No specific timing required, focus on consistency',
        alternativeSuggestions: 'Newer anticoagulants (DOACs) have fewer dietary interactions',
        evidenceLevel: 'A',
        sourceCitation: 'FDA Drug Safety Communication: Warfarin and Vitamin K interactions. Clinical Pharmacology Review.',
        regulatorySource: 'FDA',
        isActive: true,
      },
      {
        drugName: 'Lisinopril',
        genericName: 'lisinopril',
        brandNames: ['Prinivil', 'Zestril'],
        drugClass: 'ACE Inhibitor',
        interactingFoods: ['bananas', 'oranges', 'potatoes', 'avocados', 'salt_substitutes'],
        interactingNutrients: ['potassium'],
        foodCategories: ['high_potassium_foods', 'potassium_salt_substitutes'],
        interactionType: 'monitor',
        severity: 'moderate',
        mechanism: 'ACE inhibitors reduce potassium excretion by the kidneys, leading to potential hyperkalemia',
        clinicalEffect: 'Risk of hyperkalemia, which can cause dangerous cardiac arrhythmias',
        recommendations: 'Monitor potassium levels regularly. Limit high-potassium foods and avoid salt substitutes containing potassium. Regular lab monitoring required.',
        timingInstructions: 'No specific timing restrictions',
        alternativeSuggestions: 'Moderate potassium intake rather than complete avoidance unless directed by healthcare provider',
        evidenceLevel: 'A',
        sourceCitation: 'Clinical Pharmacology: ACE Inhibitor Drug Interactions and Hyperkalemia Risk. Cardiovascular Medicine Review 2023.',
        regulatorySource: 'FDA',
        isActive: true,
      },
      {
        drugName: 'Metformin',
        genericName: 'metformin',
        brandNames: ['Glucophage', 'Fortamet', 'Glumetza'],
        drugClass: 'Biguanide',
        interactingFoods: ['alcohol', 'high_sugar_foods'],
        interactingNutrients: ['vitamin_b12', 'alcohol'],
        foodCategories: ['alcoholic_beverages', 'simple_sugars'],
        interactionType: 'avoid',
        severity: 'severe',
        mechanism: 'Alcohol increases risk of lactic acidosis with metformin. High sugar counteracts glucose-lowering effects.',
        clinicalEffect: 'Increased risk of lactic acidosis with alcohol; reduced drug effectiveness with high sugar intake',
        recommendations: 'Avoid alcohol or limit to occasional small amounts with food. Avoid high-sugar foods and beverages. Take with meals to reduce GI side effects.',
        timingInstructions: 'Take with meals to reduce gastrointestinal side effects',
        alternativeSuggestions: 'If alcohol consumption is desired, discuss alternative diabetes medications with healthcare provider',
        evidenceLevel: 'A',
        sourceCitation: 'Metformin and Alcohol Interaction: Risk of Lactic Acidosis. Diabetes Care 2024.',
        regulatorySource: 'FDA',
        isActive: true,
      },
    ]);

    // Create family account
    console.log('👨‍👩‍👧‍👦 Seeding family accounts...');
    const [familyAccount] = await db.insert(familyAccounts).values({
      tenantId: tenant.id,
      primaryUserId: testUser.id,
      familyName: 'Smith Family',
      maxMembers: 6,
    }).returning();

    // Add family member (spouse)
    const [spouseUser] = await db.insert(users).values({
      tenantId: tenant.id,
      firebaseUid: 'spouse_firebase_uid_789',
      email: 'spouse@example.com',
      role: 'end_user',
      subscriptionTier: 'enhanced',
      isActive: true,
    }).returning();

    // Grant spouse consent
    await db.insert(userConsents).values({
      tenantId: tenant.id,
      userId: spouseUser.id,
      disclaimerId: disclaimer.id,
      status: 'granted',
      ipAddress: '127.0.0.1',
      userAgent: 'Test User Agent',
      consentedAt: new Date(),
    });

    // Set up family permissions
    console.log('🔐 Seeding family permissions...');
    await db.insert(familyPermissions).values([
      {
        tenantId: tenant.id,
        familyAccountId: familyAccount.id,
        memberUserId: testUser.id,
        targetUserId: spouseUser.id,
        permissionType: 'health_view_basic',
        permissionScope: {
          dataTypes: ['meal_plans', 'recipes', 'nutrition_goals'],
          restrictions: ['no_clinical_data'],
        },
        grantedBy: testUser.id,
        approvedByTarget: true,
        targetConsentDate: new Date(),
        requiresTargetConsent: true,
      },
      {
        tenantId: tenant.id,
        familyAccountId: familyAccount.id,
        memberUserId: spouseUser.id,
        targetUserId: testUser.id,
        permissionType: 'meal_manage',
        permissionScope: {
          dataTypes: ['meal_plans', 'shopping_lists', 'recipes'],
        },
        grantedBy: testUser.id,
        approvedByTarget: true,
        targetConsentDate: new Date(),
        requiresTargetConsent: false,
      },
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded data summary:');
    console.log(`• 1 tenant: ${tenant.name}`);
    console.log(`• 4 users: admin, test user, clinical advisor, spouse`);
    console.log(`• 3 subscription tiers: basic, enhanced, premium`);
    console.log(`• 1 medical disclaimer (current version)`);
    console.log(`• 4 user consents (all granted)`);
    console.log(`• 1 clinical profile with comprehensive health data`);
    console.log(`• 2 clinical evidence entries`);
    console.log(`• 3 drug-food interactions`);
    console.log(`• 1 family account with 2 members`);
    console.log(`• 2 family permission grants`);
    console.log('\n🚀 Ready for development and testing!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;