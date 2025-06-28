// Healthcare Database Types for Praneya SaaS
// Type-safe interfaces for all database entities

export type UserRole = 'end_user' | 'super_admin' | 'clinical_advisor';
export type SubscriptionTier = 'basic' | 'enhanced' | 'premium';
export type HealthCondition = 'diabetes' | 'hypertension' | 'heart_disease' | 'kidney_disease' | 'other';
export type ConsentStatus = 'pending' | 'granted' | 'revoked';

// Base interface for all tenant-aware entities
export interface TenantEntity {
  id: string;
  tenant_id: string;
  created_at: Date;
  updated_at: Date;
}

// Tenant management
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

// User management with healthcare compliance
export interface User extends TenantEntity {
  firebase_uid: string;
  email: string;
  role: UserRole;
  subscription_tier: SubscriptionTier;
  device_fingerprint?: string;
  last_login?: Date;
  failed_login_attempts: number;
  account_locked_until?: Date;
  is_active: boolean;
}

// Medical disclaimer and consent tracking
export interface MedicalDisclaimer {
  id: string;
  version: string;
  content: string;
  effective_date: Date;
  created_at: Date;
  is_current: boolean;
}

export interface UserConsent extends TenantEntity {
  user_id: string;
  disclaimer_id: string;
  status: ConsentStatus;
  ip_address?: string;
  user_agent?: string;
  consented_at?: Date;
}

// Health profile with tiered data collection
export interface HealthProfile extends TenantEntity {
  user_id: string;
  age_range?: string;
  gender?: string;
  activity_level?: string;
  dietary_restrictions?: string[];
  allergies?: string[];
  health_conditions?: HealthCondition[];
  medications?: string[];
  lab_values?: LabValues; // Premium tier only
  biometric_data?: BiometricData; // Premium tier only
  clinical_notes?: string; // Premium tier only
}

// Lab values for Premium tier (HIPAA-sensitive)
export interface LabValues {
  hba1c?: number; // Diabetes monitoring
  egfr?: number; // Kidney function
  total_cholesterol?: number;
  ldl_cholesterol?: number;
  hdl_cholesterol?: number;
  triglycerides?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  last_updated: Date;
  provider_name?: string;
}

// Biometric data for Premium tier
export interface BiometricData {
  weight?: number;
  height?: number;
  bmi?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  heart_rate_resting?: number;
  blood_glucose?: number;
  last_updated: Date;
  device_source?: string;
}

// Family account management
export interface FamilyAccount extends TenantEntity {
  primary_user_id: string;
  family_name?: string;
  max_members: number;
}

export interface FamilyMember extends TenantEntity {
  family_account_id: string;
  user_id: string;
  relationship?: string;
  can_view_health_data: boolean;
  can_manage_meals: boolean;
  added_at: Date;
}

// Audit logging for healthcare compliance
export interface AuditLog extends TenantEntity {
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// Recipe and nutrition data structures
export interface Recipe {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition_info: NutritionInfo;
  dietary_labels: string[];
  allergen_warnings: string[];
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  servings: number;
  difficulty_level?: 'easy' | 'medium' | 'hard';
  source: 'edamam' | 'ai_generated' | 'user_created';
  source_id?: string; // External API ID
  image_url?: string;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  food_id?: string; // Edamam food database ID
  weight_grams?: number;
}

// Comprehensive nutrition information (28 nutrients from Edamam)
export interface NutritionInfo {
  calories: number;
  total_fat_g: number;
  saturated_fat_g: number;
  trans_fat_g?: number;
  cholesterol_mg: number;
  sodium_mg: number;
  total_carbs_g: number;
  dietary_fiber_g: number;
  total_sugars_g: number;
  added_sugars_g?: number;
  protein_g: number;
  vitamin_a_mcg?: number;
  vitamin_c_mg?: number;
  vitamin_d_mcg?: number;
  vitamin_e_mg?: number;
  vitamin_k_mcg?: number;
  thiamin_mg?: number;
  riboflavin_mg?: number;
  niacin_mg?: number;
  vitamin_b6_mg?: number;
  folate_mcg?: number;
  vitamin_b12_mcg?: number;
  biotin_mcg?: number;
  pantothenic_acid_mg?: number;
  phosphorus_mg?: number;
  iodine_mcg?: number;
  magnesium_mg?: number;
  zinc_mg?: number;
  selenium_mcg?: number;
  copper_mg?: number;
  manganese_mg?: number;
  chromium_mcg?: number;
  molybdenum_mcg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  potassium_mg?: number;
}

// Meal planning
export interface MealPlan extends TenantEntity {
  user_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  meals: MealPlanEntry[];
  total_nutrition: NutritionInfo;
  is_active: boolean;
}

export interface MealPlanEntry {
  date: Date;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id: string;
  servings: number;
  notes?: string;
}

// User preferences and goals
export interface NutritionGoals {
  daily_calories?: number;
  protein_percentage?: number;
  carb_percentage?: number;
  fat_percentage?: number;
  fiber_grams?: number;
  sodium_limit_mg?: number;
  sugar_limit_g?: number;
  custom_goals?: Record<string, number>;
}

// Drug-food interaction data (Premium tier)
export interface DrugFoodInteraction {
  drug_name: string;
  drug_class?: string;
  interacting_foods: string[];
  interaction_type: 'avoid' | 'monitor' | 'timing' | 'supplement';
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendations: string[];
  source: string;
  last_updated: Date;
}

// Clinical rules for therapeutic recommendations
export interface ClinicalRule {
  id: string;
  condition: HealthCondition;
  rule_type: 'dietary_restriction' | 'nutrient_limit' | 'food_recommendation';
  criteria: Record<string, any>;
  recommendations: string[];
  evidence_level: 'A' | 'B' | 'C' | 'D';
  source: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// API response types for external services
export interface EdamamRecipeResponse {
  recipe: {
    uri: string;
    label: string;
    image: string;
    source: string;
    url: string;
    shareAs: string;
    yield: number;
    dietLabels: string[];
    healthLabels: string[];
    cautions: string[];
    ingredientLines: string[];
    ingredients: any[];
    calories: number;
    totalWeight: number;
    totalTime: number;
    cuisineType: string[];
    mealType: string[];
    dishType: string[];
    totalNutrients: Record<string, any>;
  };
}

// Database query helpers
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Healthcare compliance types
export interface ComplianceEvent {
  event_type: 'data_access' | 'data_modification' | 'consent_change' | 'export_request';
  user_id: string;
  resource_type: string;
  resource_id?: string;
  metadata: Record<string, any>;
  timestamp: Date;
  ip_address?: string;
  user_agent?: string;
}

// Error types for healthcare-specific errors
export interface HealthcareError extends Error {
  code: string;
  category: 'authentication' | 'authorization' | 'validation' | 'compliance' | 'external_api';
  details?: Record<string, any>;
  userMessage?: string;
}

// Type guards for subscription tier validation
export function isSubscriptionTier(value: string): value is SubscriptionTier {
  return ['basic', 'enhanced', 'premium'].includes(value);
}

export function isPremiumFeature(subscriptionTier: SubscriptionTier): boolean {
  return subscriptionTier === 'premium';
}

export function isEnhancedOrPremium(subscriptionTier: SubscriptionTier): boolean {
  return ['enhanced', 'premium'].includes(subscriptionTier);
}