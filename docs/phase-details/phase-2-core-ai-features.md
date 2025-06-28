# Phase 2: Core AI Features (Weeks 3-4)

## 🎯 Phase Overview - IN PROGRESS

Building on the secure foundation from Phase 1, this phase implements the core AI-powered features that form the heart of the Praneya platform, including Edamam API integration, Gemini AI capabilities, and clinical oversight systems.

## 🎯 Phase Objectives

### Primary Goals
- Integrate Edamam nutrition APIs with intelligent caching
- Implement Gemini AI for recipe generation and analysis
- Create clinical oversight system for AI-generated content
- Build user profile and health preference management
- Establish cost optimization strategies for API usage

### Success Criteria
- [ ] Edamam Recipe Search API integration with 180K+ recipes
- [ ] Edamam Nutrition Analysis API for 28-nutrient breakdown
- [ ] Gemini AI integration for recipe generation and refinement
- [ ] Clinical review queue for AI-generated content
- [ ] User health profile management with tiered data collection
- [ ] API cost tracking and optimization system

## 🏗️ Technical Implementation Plan

### 1. Edamam API Integration
**Status: 🔄 PLANNED**

```typescript
// Edamam API client with intelligent caching
export class EdamamAPIClient {
  private redis: Redis;
  private apiQuotaTracker: QuotaTracker;

  async searchRecipes(params: RecipeSearchParams): Promise<EdamamRecipe[]> {
    // Check cache first (24-hour TTL)
    const cacheKey = this.generateCacheKey(params);
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // Validate API quota before request
    await this.apiQuotaTracker.checkQuota(params.userId);
    
    // Make API request with retry logic
    const response = await this.makeRequest('/search', params);
    
    // Cache response and track usage
    await this.redis.setex(cacheKey, 86400, JSON.stringify(response));
    await this.apiQuotaTracker.recordUsage(params.userId, 'recipe_search');
    
    return response.hits.map(hit => hit.recipe);
  }

  async analyzeNutrition(ingredients: string[]): Promise<NutritionAnalysis> {
    // 28-nutrient breakdown with clinical interpretation
    const analysis = await this.makeRequest('/nutrition-details', {
      ingr: ingredients
    });

    return {
      nutrients: analysis.totalNutrients,
      healthLabels: analysis.healthLabels,
      dietLabels: analysis.dietLabels,
      clinicalFlags: this.generateClinicalFlags(analysis),
      warnings: this.checkSafetyWarnings(analysis)
    };
  }
}
```

**Implementation Features:**
- Intelligent caching with Redis (24-hour TTL for cost optimization)
- API quota tracking per user subscription tier
- Retry logic with exponential backoff
- Clinical flags generation for health conditions
- Safety warnings for dietary restrictions

### 2. Gemini AI Integration
**Status: 🔄 PLANNED**

```typescript
// Gemini AI service with clinical oversight
export class GeminiAIService {
  private geminiClient: GoogleGenerativeAI;
  private clinicalReviewQueue: ClinicalReviewQueue;

  async generateRecipe(request: RecipeGenerationRequest): Promise<AIRecipe> {
    // Clinical prompt validation
    const safePrompt = await this.validatePrompt(request);
    
    // Generate recipe with health context
    const prompt = this.buildClinicalPrompt(safePrompt);
    const response = await this.geminiClient.generateContent(prompt);
    
    // Parse and validate AI response
    const recipe = this.parseRecipeResponse(response);
    
    // Clinical safety check
    const safetyCheck = await this.performSafetyCheck(recipe, request.userProfile);
    
    if (safetyCheck.requiresReview) {
      // Queue for clinical advisor review
      await this.clinicalReviewQueue.add(recipe, safetyCheck);
      return { ...recipe, status: 'pending_review' };
    }

    return { ...recipe, status: 'approved' };
  }

  private buildClinicalPrompt(request: RecipeGenerationRequest): string {
    return `
      CLINICAL NUTRITION RECIPE GENERATION
      
      User Health Profile:
      - Conditions: ${request.healthConditions.join(', ')}
      - Medications: ${request.medications.join(', ')}
      - Allergies: ${request.allergies.join(', ')}
      - Dietary Restrictions: ${request.dietaryRestrictions.join(', ')}
      
      Requirements:
      - Generate a safe, evidence-based recipe
      - Include nutritional breakdown per serving
      - Flag any potential drug-food interactions
      - Provide clinical reasoning for ingredient choices
      - Include preparation safety notes
      
      Recipe Request: ${request.description}
      
      IMPORTANT: Do not provide medical advice. Focus on nutrition education.
    `;
  }
}
```

**AI Safety Features:**
- Clinical prompt templates with health context
- Automated safety checks for drug-food interactions
- Clinical review queue for flagged content
- Medical advice detection and prevention
- Evidence-based ingredient recommendations

### 3. Clinical Oversight System
**Status: 🔄 PLANNED**

```typescript
// Clinical review and oversight framework
export class ClinicalReviewSystem {
  async reviewAIContent(content: AIGeneratedContent): Promise<ReviewResult> {
    const analysis = {
      containsMedicalAdvice: this.detectMedicalAdvice(content),
      hasContraindications: this.checkContraindications(content),
      evidenceLevel: this.assessEvidenceLevel(content),
      safetyRisk: this.calculateSafetyRisk(content)
    };

    if (analysis.safetyRisk === 'high' || analysis.containsMedicalAdvice) {
      return {
        status: 'rejected',
        reason: 'Contains inappropriate medical advice',
        requiresHumanReview: true
      };
    }

    if (analysis.safetyRisk === 'moderate') {
      return {
        status: 'flagged',
        reason: 'Requires clinical advisor review',
        requiresHumanReview: true
      };
    }

    return {
      status: 'approved',
      confidenceScore: this.calculateConfidence(analysis)
    };
  }

  private detectMedicalAdvice(content: string): boolean {
    const medicalAdvicePatterns = [
      /take.*medication/i,
      /stop.*medication/i,
      /increase.*dose/i,
      /decrease.*dose/i,
      /diagnose/i,
      /treat.*condition/i,
      /cure/i,
      /medical.*treatment/i
    ];

    return medicalAdvicePatterns.some(pattern => pattern.test(content));
  }
}
```

### 4. User Profile Management
**Status: 🔄 PLANNED**

```typescript
// Tiered health profile collection
export class UserProfileService {
  async collectHealthProfile(userId: string, tier: SubscriptionTier): Promise<void> {
    const profileData = await this.getProgressiveProfile(tier);
    
    switch (tier) {
      case 'basic':
        await this.collectBasicProfile(userId, profileData);
        break;
      case 'enhanced':
        await this.collectEnhancedProfile(userId, profileData);
        break;
      case 'premium':
        await this.collectClinicalProfile(userId, profileData);
        break;
    }
  }

  private async collectBasicProfile(userId: string, data: any): Promise<void> {
    // Basic dietary preferences and allergies
    const profile = {
      dietaryPreferences: data.dietaryPreferences,
      foodAllergies: data.allergies,
      dislikedIngredients: data.dislikes,
      cookingSkillLevel: data.skillLevel,
      mealPreferences: data.mealTypes
    };

    await this.saveUserProfile(userId, profile, 'basic');
  }

  private async collectClinicalProfile(userId: string, data: any): Promise<void> {
    // Premium clinical data collection
    const clinicalProfile = {
      healthConditions: data.conditions,
      currentMedications: data.medications,
      labValues: data.labResults,
      clinicalGoals: data.therapeuticGoals,
      providerInformation: data.providers
    };

    // Requires clinical validation
    await this.clinicalValidationService.validateProfile(clinicalProfile);
    await this.saveClinicalProfile(userId, clinicalProfile);
  }
}
```

## 🧪 Testing Strategy

### API Integration Tests
```typescript
describe('Edamam API Integration', () => {
  it('should search recipes with dietary filters', async () => {
    const client = new EdamamAPIClient();
    const results = await client.searchRecipes({
      q: 'chicken',
      health: ['dairy-free'],
      diet: ['low-carb'],
      userId: 'test-user'
    });

    expect(results).toHaveLength(20);
    expect(results[0]).toHaveProperty('label');
    expect(results[0]).toHaveProperty('healthLabels');
  });

  it('should cache API responses for cost optimization', async () => {
    const client = new EdamamAPIClient();
    
    // First request
    const start1 = Date.now();
    await client.searchRecipes({ q: 'pasta', userId: 'test-user' });
    const time1 = Date.now() - start1;

    // Second request (cached)
    const start2 = Date.now();
    await client.searchRecipes({ q: 'pasta', userId: 'test-user' });
    const time2 = Date.now() - start2;

    expect(time2).toBeLessThan(time1 * 0.1); // Cache should be 10x faster
  });
});
```

### AI Safety Tests
```typescript
describe('Gemini AI Safety', () => {
  it('should detect and reject medical advice', async () => {
    const aiService = new GeminiAIService();
    const request = {
      description: 'Tell me to stop taking my diabetes medication',
      userProfile: { conditions: ['diabetes_type_2'] }
    };

    const result = await aiService.generateRecipe(request);
    expect(result.status).toBe('rejected');
    expect(result.reason).toContain('medical advice');
  });

  it('should flag content for clinical review', async () => {
    const reviewSystem = new ClinicalReviewSystem();
    const content = {
      text: 'This recipe may help manage blood sugar levels',
      healthContext: ['diabetes']
    };

    const review = await reviewSystem.reviewAIContent(content);
    expect(review.status).toBe('flagged');
    expect(review.requiresHumanReview).toBe(true);
  });
});
```

## 📊 API Cost Optimization

### Intelligent Caching Strategy
```typescript
// Multi-level caching for cost optimization
export class APICacheManager {
  async getCachedResponse(key: string): Promise<any> {
    // L1: Memory cache (fastest)
    const memoryCache = this.memoryCache.get(key);
    if (memoryCache) return memoryCache;

    // L2: Redis cache (fast)
    const redisCache = await this.redis.get(key);
    if (redisCache) {
      this.memoryCache.set(key, JSON.parse(redisCache));
      return JSON.parse(redisCache);
    }

    // L3: Database cache (persistent)
    const dbCache = await this.db.getCachedResponse(key);
    if (dbCache && !this.isCacheExpired(dbCache)) {
      await this.redis.setex(key, 3600, JSON.stringify(dbCache.data));
      return dbCache.data;
    }

    return null;
  }
}
```

### Quota Management
```typescript
// User-based API quota tracking
export class QuotaTracker {
  async checkQuota(userId: string): Promise<void> {
    const user = await this.getUserWithSubscription(userId);
    const usage = await this.getCurrentMonthUsage(userId);

    if (usage.apiCalls >= user.subscriptionTier.apiQuotaMonthly) {
      throw new QuotaExceededError('Monthly API quota exceeded');
    }

    if (usage.aiRequests >= user.subscriptionTier.aiRequestsMonthly) {
      throw new QuotaExceededError('Monthly AI quota exceeded');
    }
  }
}
```

## 🔒 Security Implementation

### API Key Management
```typescript
// Secure API credential management
export class CredentialManager {
  private encryptionKey: string;

  async getEdamamCredentials(): Promise<EdamamCredentials> {
    const encrypted = await this.secretsManager.get('edamam-credentials');
    return this.decrypt(encrypted);
  }

  async getGeminiAPIKey(): Promise<string> {
    const encrypted = await this.secretsManager.get('gemini-api-key');
    return this.decrypt(encrypted);
  }

  private decrypt(encryptedData: string): any {
    // AES-256 decryption with environment key
    return crypto.decrypt(encryptedData, this.encryptionKey);
  }
}
```

### Rate Limiting
```typescript
// API rate limiting and throttling
export class RateLimiter {
  async checkRateLimit(userId: string, endpoint: string): Promise<void> {
    const key = `rate_limit:${userId}:${endpoint}`;
    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, 60); // 1-minute window
    }

    const limit = this.getRateLimit(endpoint);
    if (current > limit) {
      throw new RateLimitError(`Rate limit exceeded for ${endpoint}`);
    }
  }
}
```

## 📋 Phase 2 Deliverables

### Core API Integrations
- [ ] **Edamam Recipe Search** - 180K+ recipes with dietary filtering
- [ ] **Edamam Nutrition Analysis** - 28-nutrient breakdown
- [ ] **Edamam Food Database** - 900K+ food items for ingredient recognition
- [ ] **Gemini AI Recipe Generation** - Personalized recipe creation
- [ ] **Gemini Vision API** - Visual ingredient recognition

### AI Safety Systems
- [ ] **Clinical Review Queue** - Automated content review
- [ ] **Medical Advice Detection** - Pattern recognition for safety
- [ ] **Drug-Food Interaction Screening** - Safety validation
- [ ] **Evidence-Based Recommendations** - Clinical guideline integration

### User Management
- [ ] **Tiered Profile Collection** - Progressive health data gathering
- [ ] **Health Preference Management** - Dietary and medical preferences
- [ ] **Consent Management** - PHI data collection consent
- [ ] **Profile Validation** - Clinical data verification

### Cost Optimization
- [ ] **Multi-Level Caching** - Memory, Redis, and database caching
- [ ] **Quota Management** - Subscription-based API limits
- [ ] **Usage Tracking** - Cost monitoring and alerts
- [ ] **Rate Limiting** - API abuse prevention

## 🎯 Success Metrics

### Technical Metrics
- **API Response Time**: < 2 seconds for recipe search
- **Cache Hit Rate**: > 70% for cost optimization
- **AI Safety Rate**: > 95% appropriate content approval
- **API Cost per User**: < $0.50 per month average

### User Experience Metrics
- **Recipe Relevance**: > 80% user satisfaction
- **Health Safety**: Zero inappropriate medical advice incidents
- **Profile Completion**: > 60% of users complete health profiles
- **Feature Adoption**: > 40% of users try AI recipe generation

## 🔄 Integration with Phase 1

### Building on Foundation
- Utilizes secure multi-tenant database for user profiles
- Leverages authentication system for API access control
- Integrates with clinical oversight framework
- Uses audit logging for API usage tracking

### Preparing for Phase 3
- User profiles ready for enhanced personalization
- Recipe database for meal planning features
- AI systems prepared for conversational interfaces
- Cost optimization ready for family accounts

## 🚧 Current Development Status

### In Progress
- Setting up Edamam API integration with caching
- Implementing Gemini AI safety framework
- Building clinical review queue system
- Creating user profile management interfaces

### Next Steps
1. Complete Edamam API client with comprehensive testing
2. Implement Gemini AI with clinical safety filters
3. Build clinical review dashboard for advisors
4. Create user health profile collection workflows
5. Establish cost monitoring and optimization systems

---

**Phase 2 Status: 🔄 IN PROGRESS**
**Target Completion: Week 4**
**Next Phase: Enhanced User Experience**