/**
 * Healthcare Data Types for Praneya SaaS Platform
 * Comprehensive type definitions with HIPAA compliance and clinical safety
 */

// Core Healthcare Enums
export enum SubscriptionTierEnum {
  BASIC = 'basic',
  ENHANCED = 'enhanced',
  PREMIUM = 'premium'
}

export enum HealthcareRoleEnum {
  END_USER = 'end_user',
  CLINICAL_ADVISOR = 'clinical_advisor',
  SUPER_ADMIN = 'super_admin'
}

export enum AllergenSeverityEnum {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  ANAPHYLACTIC = 'anaphylactic'
}

export enum DrugInteractionSeverityEnum {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CONTRAINDICATED = 'contraindicated'
}

// User and Authentication Types
export interface IHealthcareUser {
  readonly id: string;
  readonly email: string;
  readonly tenantId: string;
  readonly encryptedPii?: string;
  readonly deviceFingerprints: DeviceFingerprintType[];
  readonly consentTimestamps: ConsentTimestampType;
  readonly healthcareRole: HealthcareRoleEnum;
  readonly mfaEnabled: boolean;
  readonly lastHipaaTraining?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface DeviceFingerprintType {
  readonly id: string;
  readonly fingerprint: string;
  readonly userAgent: string;
  readonly ipAddress?: string;
  readonly trusted: boolean;
  readonly lastSeen: Date;
  readonly riskScore: number;
}

export interface ConsentTimestampType {
  readonly medicalDisclaimer?: Date;
  readonly dataProcessing?: Date;
  readonly familySharing?: Date;
  readonly clinicalAdvice?: Date;
  readonly versionConsented: string;
}

// Health Profile Types
export interface IHealthProfile {
  readonly id: string;
  readonly userId: string;
  readonly tenantId: string;
  readonly subscriptionTier: SubscriptionTierEnum;
  readonly encryptedHealthData?: string;
  readonly allergies: AllergyType[];
  readonly dietaryRestrictions: DietaryRestrictionType[];
  readonly medications?: MedicationType[]; // Premium only
  readonly labValues?: LabValueType[]; // Premium only
  readonly chronicConditions?: ChronicConditionType[]; // Premium only
  readonly nutritionGoals: NutritionGoalType[];
  readonly lastUpdated: Date;
  readonly version: number;
  readonly dataIntegrityHash: string;
}

export interface AllergyType {
  readonly id: string;
  readonly allergen: string;
  readonly severity: AllergenSeverityEnum;
  readonly reaction: string[];
  readonly verifiedBy?: string;
  readonly notes?: string;
  readonly dateIdentified?: Date;
  readonly isActive: boolean;
}

export interface DietaryRestrictionType {
  readonly id: string;
  readonly restriction: string;
  readonly reason: 'allergy' | 'medical' | 'religious' | 'preference';
  readonly strictness: 'strict' | 'moderate' | 'flexible';
  readonly notes?: string;
  readonly isActive: boolean;
}

export interface LabValueType {
  readonly id: string;
  readonly testName: string;
  readonly value: number;
  readonly unit: string;
  readonly referenceRange: string;
  readonly status: 'normal' | 'abnormal' | 'critical';
  readonly dateCollected: Date;
  readonly issuingLab?: string;
  readonly notes?: string;
}

export interface ChronicConditionType {
  readonly id: string;
  readonly condition: string;
  readonly icd10Code?: string;
  readonly diagnosedDate?: Date;
  readonly severity: 'mild' | 'moderate' | 'severe';
  readonly managementNotes?: string;
  readonly isActive: boolean;
}

export interface NutritionGoalType {
  readonly id: string;
  readonly goalType: 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber' | 'sodium';
  readonly targetValue: number;
  readonly unit: string;
  readonly timeframe: 'daily' | 'weekly' | 'monthly';
  readonly isActive: boolean;
  readonly reason?: string;
}

export interface MedicationType {
  readonly id: string;
  readonly genericName: string;
  readonly brandName?: string;
  readonly dosage: string;
  readonly frequency: string;
  readonly route: string;
  readonly prescribedBy?: string;
  readonly datePrescribed?: Date;
  readonly indication?: string;
  readonly isActive: boolean;
  readonly interactions?: DrugInteractionType[];
}

export interface DrugInteractionType {
  readonly id: string;
  readonly interactingMedication: string;
  readonly severity: DrugInteractionSeverityEnum;
  readonly description: string;
  readonly clinicalSignificance: string;
  readonly evidenceLevel: 'high' | 'medium' | 'low';
  readonly lastReviewed: Date;
}

// Family Account Types
export interface IFamilyAccount {
  readonly id: string;
  readonly tenantId: string;
  readonly primaryUserId: string;
  readonly familyName: string;
  readonly subscriptionTier: SubscriptionTierEnum;
  readonly maxMembers: number;
  readonly privacySettings: FamilyPrivacySettingsType;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface FamilyPrivacySettingsType {
  readonly defaultHealthSharing: boolean;
  readonly requireExplicitConsent: boolean;
  readonly minorProtectionEnabled: boolean;
  readonly auditAllAccess: boolean;
  readonly emergencyDataSharing: boolean;
}

// Clinical and Safety Types
export interface MedicalAdviceAnalysisType {
  readonly overallRisk: number;
  readonly confidence: number;
  readonly flaggedPhrases: string[];
  readonly medicalConcepts: string[];
  readonly requiresReview: boolean;
  readonly analysisTimestamp: Date;
}

export interface HealthConflictType {
  readonly id: string;
  readonly type: 'medication_interaction' | 'allergy_conflict' | 'condition_compatibility';
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly description: string;
  readonly affectedUserId: string;
  readonly conflictingData: Record<string, unknown>;
  readonly detectedAt: Date;
  readonly resolved: boolean;
  readonly resolutionAction?: string;
}

// Type guards for healthcare data
export function isHealthcareUser(obj: unknown): obj is IHealthcareUser {
  return typeof obj === 'object' && obj !== null && 'healthcareRole' in obj;
}

export function isPremiumTier(tier: SubscriptionTierEnum): boolean {
  return tier === SubscriptionTierEnum.PREMIUM;
}

export function isCriticalSeverity(severity: AllergenSeverityEnum | DrugInteractionSeverityEnum): boolean {
  return severity === AllergenSeverityEnum.ANAPHYLACTIC || severity === DrugInteractionSeverityEnum.CONTRAINDICATED;
} 