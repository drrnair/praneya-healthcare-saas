// ===========================================
// EXTERNAL API TYPES - PRANEYA HEALTHCARE
// ===========================================

// ===========================================
// COMMON API TYPES
// ===========================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  requestId?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  windowStart: Date;
}

export interface APIUsageMetrics {
  userId: string;
  apiService: string;
  endpoint: string;
  requestCount: number;
  totalCost: number;
  lastUsed: Date;
  rateLimitHits: number;
}

// ===========================================
// FIREBASE AUTHENTICATION TYPES
// ===========================================

export interface FirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL?: string;
}

export interface HealthcareUserClaims {
  role: 'patient' | 'family_member' | 'guardian' | 'clinical_advisor';
  permissions: string[];
  familyId?: string;
  clinicalOversight: boolean;
  hipaaConsented: boolean;
  emergencyContactAccess: boolean;
}

export interface FirebaseUserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  healthcareClaims: HealthcareUserClaims;
  lastLogin: Date;
  mfaEnabled: boolean;
}

// ===========================================
// STRIPE BILLING TYPES
// ===========================================

export interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  apiVersion: string;
}

export interface HealthcarePlan {
  id: string;
  name: 'Basic' | 'Enhanced' | 'Premium';
  type: 'individual' | 'family';
  price: number;
  currency: 'usd';
  features: string[];
  maxFamilyMembers?: number;
  clinicalOversightIncluded: boolean;
  emergencyAccessIncluded: boolean;
}

export interface BillingSession {
  sessionId: string;
  userId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
  clientSecret?: string;
}

// ===========================================
// EDAMAM NUTRITION API TYPES
// ===========================================

export interface EdamamConfig {
  appId: string;
  appKey: string;
  recipeAppId: string;
  recipeAppKey: string;
  nutritionAppId: string;
  nutritionAppKey: string;
  baseURL: string;
  rateLimitPerMinute: number;
}

export interface RecipeSearchParams {
  userId: string;
  query: string;
  from?: number;
  to?: number;
  health?: string[]; // dietary restrictions
  diet?: string[]; // diet labels
  cuisineType?: string;
  mealType?: string;
  dishType?: string;
  calories?: { min?: number; max?: number };
  time?: { min?: number; max?: number };
  nutrients?: Record<string, { min?: number; max?: number }>;
}

export interface StandardRecipe {
  id: string;
  title: string;
  image: string;
  source: string;
  url: string;
  shareAs: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: RecipeIngredient[];
  calories: number;
  totalWeight: number;
  totalTime: number | null;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
  totalNutrients: NutrientInfo;
  totalDaily: NutrientInfo;
  digest: any[];
  clinicalSafetyFlags?: ClinicalSafetyFlags;
}

export interface RecipeIngredient {
  text: string;
  quantity: number;
  measure: string;
  food: string;
  weight: number;
  foodCategory: string;
  foodId: string;
  image?: string;
}

export interface NutrientInfo {
  [key: string]: {
    label: string;
    quantity: number;
    unit: string;
  };
}

export interface ClinicalSafetyFlags {
  highSodium: boolean;
  highSugar: boolean;
  allergenWarnings: string[];
  drugInteractionWarnings: string[];
  nutritionalConcerns: string[];
}

export interface NutritionAnalysisParams {
  userId: string;
  ingredients: Array<{
    quantity: number;
    unit: string;
    food: string;
  }>;
}

export interface NutritionAnalysisResponse {
  calories: number;
  totalWeight: number;
  totalNutrients: NutrientInfo;
  totalDaily: NutrientInfo;
  healthLabels: string[];
  cautions: string[];
  clinicalAnalysis: {
    allergenAlerts: string[];
    nutritionalWarnings: string[];
    healthRecommendations: string[];
  };
}

// ===========================================
// GOOGLE AI TYPES
// ===========================================

export interface GoogleAIConfig {
  apiKey: string;
  projectId: string;
  location: string;
  model: string;
  temperature: number;
  maxTokens: number;
  safetyThreshold: string;
}

export interface ClinicalAIRequest {
  userId: string;
  prompt: string;
  context: {
    userHealthProfile?: any;
    currentMedications?: string[];
    allergies?: string[];
    chronicConditions?: string[];
    familyHistory?: string[];
  };
  type: 'nutrition_advice' | 'meal_recommendation' | 'health_analysis' | 'drug_interaction';
  requiresClinicalReview: boolean;
}

export interface ClinicalAIResponse {
  response: string;
  confidence: number;
  safetyFlags: string[];
  requiresHumanReview: boolean;
  citedSources: string[];
  disclaimers: string[];
  clinicalOversightRequired: boolean;
  timestamp: Date;
}

// ===========================================
// COST TRACKING TYPES
// ===========================================

export interface CostTrackingData {
  userId: string;
  service: 'firebase' | 'stripe' | 'edamam' | 'google_ai';
  operation: string;
  cost: number;
  timestamp: Date;
  requestDetails: {
    endpoint: string;
    responseSize?: number;
    processingTime?: number;
  };
}

export interface MonthlyAPIBudget {
  userId: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  services: {
    edamam: { budget: number; spent: number };
    googleAI: { budget: number; spent: number };
    firebase: { budget: number; spent: number };
    stripe: { budget: number; spent: number };
  };
  alerts: {
    threshold50: boolean;
    threshold75: boolean;
    threshold90: boolean;
    budgetExceeded: boolean;
  };
}

// ===========================================
// CACHE TYPES
// ===========================================

export interface CacheConfig {
  ttl: number; // time to live in seconds
  maxSize: number; // maximum cache size in MB
  strategy: 'lru' | 'lfu' | 'ttl';
}

export interface CachedAPIResponse<T = any> {
  data: T;
  cached: true;
  cachedAt: Date;
  expiresAt: Date;
  hitCount: number;
}

// ===========================================
// ERROR TYPES
// ===========================================

export class ExternalAPIError extends Error {
  constructor(
    message: string,
    public service: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ExternalAPIError';
  }
}

export class RateLimitError extends ExternalAPIError {
  constructor(
    service: string,
    public resetTime: Date,
    public limit: number
  ) {
    super(`Rate limit exceeded for ${service}. Resets at ${resetTime.toISOString()}`, service, 429);
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends ExternalAPIError {
  constructor(
    service: string,
    public quotaType: string,
    public resetTime: Date
  ) {
    super(`Quota exceeded for ${service} (${quotaType}). Resets at ${resetTime.toISOString()}`, service, 429);
    this.name = 'QuotaExceededError';
  }
} 