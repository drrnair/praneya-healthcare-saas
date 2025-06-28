# API Integration Guide - External Services

## 🎯 Overview

This comprehensive guide covers the integration of all external APIs used in the Praneya Healthcare Nutrition SaaS platform, including Edamam Nutrition APIs, Google Gemini AI, Stripe Payments, and Firebase Authentication. Each integration includes implementation details, error handling, cost optimization, and security considerations.

## 🔗 Architecture Overview

```typescript
// Central API management architecture
export class APIManager {
  private edamamClient: EdamamAPIClient;
  private geminiClient: GeminiAIClient;
  private stripeClient: StripeClient;
  private firebaseClient: FirebaseClient;
  private cacheManager: CacheManager;
  private rateLimiter: RateLimiter;
  private costTracker: CostTracker;

  constructor() {
    this.initializeClients();
    this.setupCaching();
    this.setupRateLimiting();
    this.setupCostTracking();
  }

  async initializeClients(): Promise<void> {
    this.edamamClient = new EdamamAPIClient({
      appId: process.env.EDAMAM_APP_ID,
      appKey: process.env.EDAMAM_APP_KEY,
      baseURL: 'https://api.edamam.com',
      timeout: 10000
    });

    this.geminiClient = new GeminiAIClient({
      apiKey: process.env.GEMINI_API_KEY,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: 'us-central1'
    });

    this.stripeClient = new StripeClient({
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      apiVersion: '2023-10-16'
    });

    this.firebaseClient = new FirebaseClient({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
    });
  }
}
```

## 🍎 Edamam Nutrition API Integration

### 1. Recipe Search API Implementation

```typescript
// Comprehensive Edamam Recipe Search integration
export class EdamamRecipeSearchClient {
  private httpClient: HttpClient;
  private cacheManager: CacheManager;
  private costTracker: CostTracker;
  private rateLimiter: RateLimiter;

  constructor(config: EdamamConfig) {
    this.httpClient = new HttpClient({
      baseURL: 'https://api.edamam.com/api/recipes/v2',
      timeout: 10000,
      retries: 3
    });
    
    this.setupAuthentication(config);
    this.setupCaching();
    this.setupRateLimiting();
  }

  async searchRecipes(params: RecipeSearchParams): Promise<EdamamRecipeSearchResponse> {
    // Validate user quota before making request
    await this.rateLimiter.checkQuota(params.userId, 'recipe_search');
    
    // Check cache first
    const cacheKey = this.generateCacheKey(params);
    const cachedResult = await this.cacheManager.get(cacheKey);
    
    if (cachedResult) {
      await this.costTracker.recordCacheHit(params.userId, 'recipe_search');
      return cachedResult;
    }

    try {
      // Prepare request parameters
      const requestParams = this.prepareSearchParams(params);
      
      // Make API request with retry logic
      const response = await this.httpClient.get('/search', {
        params: requestParams,
        validateStatus: (status) => status < 500
      });

      // Handle API errors
      if (response.status !== 200) {
        throw new EdamamAPIError(response.data.message, response.status);
      }

      // Process and validate response
      const processedResponse = await this.processSearchResponse(response.data);
      
      // Cache successful response
      await this.cacheManager.set(cacheKey, processedResponse, 86400); // 24 hours
      
      // Track API usage and costs
      await this.costTracker.recordAPIUsage(params.userId, 'recipe_search', {
        requestCost: 0.005, // $0.005 per request
        responseSize: JSON.stringify(response.data).length
      });

      return processedResponse;

    } catch (error) {
      await this.handleAPIError(error, params);
      throw error;
    }
  }

  private prepareSearchParams(params: RecipeSearchParams): EdamamAPIParams {
    const apiParams: EdamamAPIParams = {
      type: 'public',
      app_id: this.config.appId,
      app_key: this.config.appKey,
      q: params.query,
      from: params.from || 0,
      to: params.to || 20
    };

    // Add health labels (dietary restrictions)
    if (params.health && params.health.length > 0) {
      apiParams.health = params.health;
    }

    // Add diet labels
    if (params.diet && params.diet.length > 0) {
      apiParams.diet = params.diet;
    }

    // Add cuisine type
    if (params.cuisineType) {
      apiParams.cuisineType = params.cuisineType;
    }

    // Add meal type
    if (params.mealType) {
      apiParams.mealType = params.mealType;
    }

    // Add dish type
    if (params.dishType) {
      apiParams.dishType = params.dishType;
    }

    // Add nutritional constraints
    if (params.nutrients) {
      Object.entries(params.nutrients).forEach(([nutrient, range]) => {
        if (range.min !== undefined) {
          apiParams[`${nutrient}.min`] = range.min;
        }
        if (range.max !== undefined) {
          apiParams[`${nutrient}.max`] = range.max;
        }
      });
    }

    // Add calorie range
    if (params.calories) {
      if (params.calories.min) apiParams['calories.min'] = params.calories.min;
      if (params.calories.max) apiParams['calories.max'] = params.calories.max;
    }

    // Add preparation time constraints
    if (params.time) {
      if (params.time.min) apiParams['time.min'] = params.time.min;
      if (params.time.max) apiParams['time.max'] = params.time.max;
    }

    return apiParams;
  }

  private async processSearchResponse(data: any): Promise<EdamamRecipeSearchResponse> {
    const recipes = data.hits?.map((hit: any) => this.transformRecipe(hit.recipe)) || [];
    
    // Add clinical safety flags for each recipe
    const recipesWithSafetyFlags = await Promise.all(
      recipes.map(recipe => this.addClinicalSafetyFlags(recipe))
    );

    return {
      count: data.count || 0,
      from: data.from || 0,
      to: data.to || 0,
      more: data.more || false,
      recipes: recipesWithSafetyFlags,
      _links: data._links
    };
  }

  private transformRecipe(edamamRecipe: any): StandardRecipe {
    return {
      id: this.extractRecipeId(edamamRecipe.uri),
      title: edamamRecipe.label,
      image: edamamRecipe.image,
      source: edamamRecipe.source,
      url: edamamRecipe.url,
      shareAs: edamamRecipe.shareAs,
      yield: edamamRecipe.yield,
      dietLabels: edamamRecipe.dietLabels || [],
      healthLabels: edamamRecipe.healthLabels || [],
      cautions: edamamRecipe.cautions || [],
      ingredientLines: edamamRecipe.ingredientLines || [],
      ingredients: edamamRecipe.ingredients?.map(this.transformIngredient) || [],
      calories: Math.round(edamamRecipe.calories || 0),
      totalWeight: Math.round(edamamRecipe.totalWeight || 0),
      totalTime: edamamRecipe.totalTime || null,
      cuisineType: edamamRecipe.cuisineType || [],
      mealType: edamamRecipe.mealType || [],
      dishType: edamamRecipe.dishType || [],
      totalNutrients: this.transformNutrients(edamamRecipe.totalNutrients),
      totalDaily: this.transformNutrients(edamamRecipe.totalDaily),
      digest: edamamRecipe.digest || []
    };
  }

  private async addClinicalSafetyFlags(recipe: StandardRecipe): Promise<StandardRecipe> {
    const safetyFlags = {
      highSodium: this.checkHighSodium(recipe),
      highSugar: this.checkHighSugar(recipe),
      allergenWarnings: this.identifyAllergens(recipe),
      drugInteractionWarnings: await this.checkDrugInteractions(recipe),
      nutritionalConcerns: this.identifyNutritionalConcerns(recipe)
    };

    return {
      ...recipe,
      clinicalSafetyFlags: safetyFlags
    };
  }

  private async handleAPIError(error: any, params: RecipeSearchParams): Promise<void> {
    const errorInfo = {
      timestamp: new Date(),
      userId: params.userId,
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      },
      params: { ...params, userId: '[REDACTED]' }
    };

    // Log error for monitoring
    console.error('Edamam API Error:', errorInfo);

    // Track error metrics
    await this.costTracker.recordAPIError(params.userId, 'recipe_search', error);

    // Implement circuit breaker logic
    if (error.response?.status >= 500) {
      await this.circuitBreaker.recordFailure('edamam_recipe_search');
    }
  }
}
```

### 2. Nutrition Analysis API Implementation

```typescript
// Edamam Nutrition Analysis API integration
export class EdamamNutritionAnalysisClient {
  async analyzeNutrition(params: NutritionAnalysisParams): Promise<NutritionAnalysisResponse> {
    await this.rateLimiter.checkQuota(params.userId, 'nutrition_analysis');

    const cacheKey = this.generateNutritionCacheKey(params.ingredients);
    const cachedResult = await this.cacheManager.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    try {
      const requestBody = {
        ingr: params.ingredients.map(ingredient => 
          `${ingredient.quantity} ${ingredient.unit} ${ingredient.food}`
        )
      };

      const response = await this.httpClient.post('/nutrition-details', requestBody, {
        params: {
          app_id: this.config.appId,
          app_key: this.config.appKey
        }
      });

      if (response.status !== 200) {
        throw new EdamamAPIError(response.data.message, response.status);
      }

      const analysisResult = await this.processNutritionResponse(response.data, params);
      
      // Cache for 12 hours (nutrition data is more static)
      await this.cacheManager.set(cacheKey, analysisResult, 43200);
      
      await this.costTracker.recordAPIUsage(params.userId, 'nutrition_analysis', {
        requestCost: 0.002, // $0.002 per analysis
        ingredientCount: params.ingredients.length
      });

      return analysisResult;

    } catch (error) {
      await this.handleNutritionAnalysisError(error, params);
      throw error;
    }
  }

  private async processNutritionResponse(
    data: any, 
    params: NutritionAnalysisParams
  ): Promise<NutritionAnalysisResponse> {
    const nutrition = {
      calories: data.calories || 0,
      totalWeight: data.totalWeight || 0,
      dietLabels: data.dietLabels || [],
      healthLabels: data.healthLabels || [],
      cautions: data.cautions || [],
      totalNutrients: this.transformDetailedNutrients(data.totalNutrients),
      totalDaily: this.transformDetailedNutrients(data.totalDaily),
      ingredients: data.ingredients?.map(this.transformAnalyzedIngredient) || []
    };

    // Add clinical interpretations
    const clinicalAnalysis = await this.generateClinicalAnalysis(nutrition, params.userProfile);

    return {
      ...nutrition,
      clinicalAnalysis,
      perServing: this.calculatePerServing(nutrition, params.servings || 1),
      recommendedDailyValues: this.calculateRDVPercentages(nutrition)
    };
  }

  private async generateClinicalAnalysis(
    nutrition: any, 
    userProfile?: UserHealthProfile
  ): Promise<ClinicalAnalysis> {
    if (!userProfile) {
      return { applicable: false };
    }

    const analysis: ClinicalAnalysis = {
      applicable: true,
      recommendations: [],
      warnings: [],
      suitabilityScore: 0
    };

    // Analyze for diabetes management
    if (userProfile.healthConditions?.includes('diabetes_type_2')) {
      const carbAnalysis = this.analyzeCarbsForDiabetes(nutrition);
      analysis.recommendations.push(...carbAnalysis.recommendations);
      analysis.warnings.push(...carbAnalysis.warnings);
    }

    // Analyze for hypertension
    if (userProfile.healthConditions?.includes('hypertension')) {
      const sodiumAnalysis = this.analyzeSodiumForHypertension(nutrition);
      analysis.recommendations.push(...sodiumAnalysis.recommendations);
      analysis.warnings.push(...sodiumAnalysis.warnings);
    }

    // Analyze for kidney disease
    if (userProfile.healthConditions?.includes('kidney_disease')) {
      const kidneyAnalysis = this.analyzeForKidneyDisease(nutrition);
      analysis.recommendations.push(...kidneyAnalysis.recommendations);
      analysis.warnings.push(...kidneyAnalysis.warnings);
    }

    // Calculate overall suitability score
    analysis.suitabilityScore = this.calculateSuitabilityScore(nutrition, userProfile);

    return analysis;
  }
}
```

### 3. Food Database API Implementation

```typescript
// Edamam Food Database API for ingredient recognition
export class EdamamFoodDatabaseClient {
  async searchFood(params: FoodSearchParams): Promise<FoodSearchResponse> {
    await this.rateLimiter.checkQuota(params.userId, 'food_search');

    const cacheKey = this.generateFoodCacheKey(params.query, params.nutrition);
    const cachedResult = await this.cacheManager.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    try {
      const requestParams = {
        app_id: this.config.foodDbAppId,
        app_key: this.config.foodDbAppKey,
        ingr: params.query
      };

      if (params.nutrition) {
        requestParams.nutrition_type = 'cooking';
      }

      if (params.category) {
        requestParams.category = params.category;
      }

      const response = await this.httpClient.get('/parser', { params: requestParams });

      if (response.status !== 200) {
        throw new EdamamAPIError(response.data.message, response.status);
      }

      const searchResult = this.processFoodSearchResponse(response.data);
      
      // Cache food search results for 7 days
      await this.cacheManager.set(cacheKey, searchResult, 604800);
      
      await this.costTracker.recordAPIUsage(params.userId, 'food_search', {
        requestCost: 0.001, // $0.001 per search
        resultsCount: searchResult.parsed.length + searchResult.hints.length
      });

      return searchResult;

    } catch (error) {
      await this.handleFoodSearchError(error, params);
      throw error;
    }
  }

  async getFoodNutrients(foodId: string, userId: string): Promise<FoodNutrientsResponse> {
    await this.rateLimiter.checkQuota(userId, 'food_nutrients');

    const cacheKey = `food_nutrients:${foodId}`;
    const cachedResult = await this.cacheManager.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    try {
      const response = await this.httpClient.get(`/nutrients`, {
        params: {
          app_id: this.config.foodDbAppId,
          app_key: this.config.foodDbAppKey
        },
        data: {
          ingredients: [{ foodId, quantity: 100, unit: 'gram' }]
        }
      });

      const nutrientsData = this.processFoodNutrientsResponse(response.data);
      
      // Cache nutrient data for 30 days (very stable)
      await this.cacheManager.set(cacheKey, nutrientsData, 2592000);
      
      await this.costTracker.recordAPIUsage(userId, 'food_nutrients', {
        requestCost: 0.001
      });

      return nutrientsData;

    } catch (error) {
      await this.handleFoodNutrientsError(error, foodId, userId);
      throw error;
    }
  }
}
```

## 🤖 Google Gemini AI Integration

### 1. Recipe Generation Implementation

```typescript
// Google Gemini AI integration for recipe generation
export class GeminiAIRecipeGenerator {
  private geminiClient: GoogleGenerativeAI;
  private clinicalReviewer: ClinicalContentReviewer;
  private safetyFilter: AISafetyFilter;

  constructor(config: GeminiConfig) {
    this.geminiClient = new GoogleGenerativeAI(config.apiKey);
    this.setupSafetySettings();
    this.setupClinicalReview();
  }

  async generateRecipe(request: RecipeGenerationRequest): Promise<AIRecipeResponse> {
    // Validate user quota and permissions
    await this.rateLimiter.checkQuota(request.userId, 'ai_recipe_generation');
    await this.featureGate.checkAccess(request.userId, 'ai_recipe_generation');

    try {
      // Pre-process and validate request
      const validatedRequest = await this.validateRecipeRequest(request);
      
      // Build clinical-safe prompt
      const prompt = await this.buildClinicalPrompt(validatedRequest);
      
      // Generate recipe with safety controls
      const model = this.geminiClient.getGenerativeModel({ 
        model: 'gemini-1.5-pro',
        safetySettings: this.safetySettings
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;

      // Process and validate AI response
      const processedRecipe = await this.processAIResponse(response, validatedRequest);
      
      // Clinical safety review
      const safetyReview = await this.clinicalReviewer.reviewAIContent(processedRecipe);
      
      if (safetyReview.requiresReview) {
        return {
          status: 'pending_review',
          reviewId: safetyReview.reviewId,
          message: 'Recipe is being reviewed by our clinical team for safety.',
          estimatedReviewTime: '24 hours'
        };
      }

      if (!safetyReview.isApproved) {
        return {
          status: 'rejected',
          reason: safetyReview.rejectionReason,
          suggestions: safetyReview.suggestions
        };
      }

      // Track successful generation
      await this.costTracker.recordAIUsage(request.userId, 'recipe_generation', {
        promptTokens: result.response.usage?.promptTokenCount || 0,
        responseTokens: result.response.usage?.candidatesTokenCount || 0,
        cost: this.calculateAICost(result.response.usage)
      });

      return {
        status: 'approved',
        recipe: processedRecipe,
        generationId: uuidv4(),
        clinicalNotes: safetyReview.clinicalNotes
      };

    } catch (error) {
      await this.handleAIError(error, request);
      throw error;
    }
  }

  private async buildClinicalPrompt(request: RecipeGenerationRequest): Promise<string> {
    const basePrompt = `
You are a nutrition education assistant helping create safe, evidence-based recipes. 

IMPORTANT GUIDELINES:
- Provide ONLY nutrition education and recipe suggestions
- NEVER give medical advice, diagnose conditions, or recommend treatment changes
- Always include appropriate disclaimers about consulting healthcare providers
- Focus on general nutrition principles, not medical treatment
- If asked about medical topics, redirect to nutrition education

User Profile:
${this.formatUserProfileForPrompt(request.userProfile)}

Recipe Request:
${request.description}

Requirements:
- Create a detailed recipe with ingredients, instructions, and nutrition information
- Ensure the recipe aligns with general nutrition guidelines for the user's stated preferences
- Include preparation time, serving size, and difficulty level
- Provide educational information about key nutrients
- Include appropriate disclaimers

Format your response as a JSON object with the following structure:
{
  "recipe": {
    "title": "Recipe Name",
    "description": "Brief description",
    "prepTime": "30 minutes",
    "cookTime": "45 minutes", 
    "servings": 4,
    "difficulty": "intermediate",
    "ingredients": [
      {
        "amount": "2 cups",
        "ingredient": "ingredient name",
        "notes": "optional preparation notes"
      }
    ],
    "instructions": [
      "Step 1 instructions",
      "Step 2 instructions"
    ],
    "nutritionEducation": "Educational content about key nutrients",
    "disclaimer": "Always consult with healthcare providers for medical advice"
  }
}
`;

    return basePrompt;
  }

  private async processAIResponse(
    response: any, 
    request: RecipeGenerationRequest
  ): Promise<ProcessedRecipe> {
    try {
      const responseText = response.text();
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AIResponseError('No valid JSON found in AI response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Validate recipe structure
      const validatedRecipe = await this.validateRecipeStructure(parsedResponse.recipe);
      
      // Add safety flags and clinical notes
      const recipeWithSafety = await this.addSafetyFlags(validatedRecipe, request.userProfile);
      
      // Calculate nutrition information
      const nutritionAnalysis = await this.analyzeRecipeNutrition(recipeWithSafety);
      
      return {
        ...recipeWithSafety,
        nutritionAnalysis,
        generatedAt: new Date(),
        aiModel: 'gemini-1.5-pro',
        clinicalReviewStatus: 'pending'
      };

    } catch (error) {
      throw new AIResponseProcessingError(`Failed to process AI response: ${error.message}`);
    }
  }

  private async addSafetyFlags(
    recipe: any, 
    userProfile: UserHealthProfile
  ): Promise<any> {
    const safetyFlags = {
      allergenWarnings: this.identifyAllergens(recipe.ingredients, userProfile.allergies),
      medicationInteractions: await this.checkMedicationInteractions(recipe.ingredients, userProfile.medications),
      nutritionalConcerns: this.identifyNutritionalConcerns(recipe, userProfile.healthConditions),
      calorieConcerns: this.assessCalorieContent(recipe, userProfile.caloricNeeds),
      sodiumConcerns: this.assessSodiumContent(recipe, userProfile.healthConditions)
    };

    return {
      ...recipe,
      safetyFlags,
      requiresClinicalReview: this.requiresClinicalReview(safetyFlags)
    };
  }
}
```

### 2. Content Safety and Review Implementation

```typescript
// AI content safety and clinical review system
export class AISafetyFilter {
  private medicalAdviceDetector: MedicalAdviceDetector;
  private contentModerator: ContentModerator;
  private clinicalValidator: ClinicalValidator;

  async reviewAIContent(content: AIGeneratedContent): Promise<SafetyReviewResult> {
    const reviews = await Promise.all([
      this.medicalAdviceDetector.analyze(content),
      this.contentModerator.analyze(content),
      this.clinicalValidator.analyze(content)
    ]);

    const medicalAdviceReview = reviews[0];
    const contentModerationReview = reviews[1];
    const clinicalValidationReview = reviews[2];

    // Determine overall safety status
    const safetyStatus = this.determineSafetyStatus(reviews);
    
    // Generate recommendations if content needs modification
    const recommendations = this.generateSafetyRecommendations(reviews);

    return {
      isApproved: safetyStatus.approved,
      requiresReview: safetyStatus.requiresHumanReview,
      confidence: safetyStatus.confidence,
      reviews: {
        medicalAdvice: medicalAdviceReview,
        contentModeration: contentModerationReview,
        clinicalValidation: clinicalValidationReview
      },
      recommendations,
      flaggedConcerns: this.extractFlaggedConcerns(reviews),
      clinicalNotes: this.generateClinicalNotes(reviews)
    };
  }

  private determineSafetyStatus(reviews: SafetyReview[]): SafetyStatus {
    const hasHighRiskFlags = reviews.some(review => 
      review.riskLevel === 'high' || review.confidence < 0.7
    );
    
    const hasMedicalAdvice = reviews.some(review => 
      review.type === 'medical_advice' && review.detected
    );

    const hasModerateRiskFlags = reviews.some(review => 
      review.riskLevel === 'moderate'
    );

    if (hasHighRiskFlags || hasMedicalAdvice) {
      return {
        approved: false,
        requiresHumanReview: true,
        confidence: 0.9
      };
    }

    if (hasModerateRiskFlags) {
      return {
        approved: false,
        requiresHumanReview: true,
        confidence: 0.7
      };
    }

    return {
      approved: true,
      requiresHumanReview: false,
      confidence: 0.95
    };
  }
}

// Medical advice detection system
export class MedicalAdviceDetector {
  private medicalTermsDatabase: MedicalTermsDatabase;
  private advicePatterns: RegExp[];

  async analyze(content: AIGeneratedContent): Promise<MedicalAdviceAnalysis> {
    const text = this.extractTextContent(content);
    
    // Check for medical advice patterns
    const advicePatterns = this.detectAdvicePatterns(text);
    
    // Check for medical terminology misuse
    const medicalTermsMisuse = this.detectMedicalTermsMisuse(text);
    
    // Check for diagnostic language
    const diagnosticLanguage = this.detectDiagnosticLanguage(text);
    
    // Check for treatment recommendations
    const treatmentRecommendations = this.detectTreatmentRecommendations(text);

    const riskScore = this.calculateRiskScore([
      advicePatterns,
      medicalTermsMisuse,
      diagnosticLanguage,
      treatmentRecommendations
    ]);

    return {
      type: 'medical_advice',
      detected: riskScore > 0.5,
      riskLevel: this.mapRiskScoreToLevel(riskScore),
      confidence: Math.min(riskScore * 2, 1.0),
      details: {
        advicePatterns: advicePatterns.matches,
        medicalTermsMisuse: medicalTermsMisuse.misusedTerms,
        diagnosticLanguage: diagnosticLanguage.matches,
        treatmentRecommendations: treatmentRecommendations.matches
      },
      recommendations: this.generateMedicalAdviceRecommendations(riskScore)
    };
  }

  private detectAdvicePatterns(text: string): AdvicePatternAnalysis {
    const patterns = [
      /you should (take|stop|increase|decrease|avoid) (your )?medication/gi,
      /(take|stop|start) (this|that|your) (medication|drug|pill)/gi,
      /i (recommend|suggest|advise) (taking|stopping|changing)/gi,
      /(diagnose|treat|cure) (your|this) (condition|disease|illness)/gi,
      /this will (cure|treat|heal) your/gi,
      /(increase|decrease|adjust) your (dose|dosage|medication)/gi
    ];

    const matches = [];
    let totalScore = 0;

    patterns.forEach(pattern => {
      const patternMatches = text.match(pattern);
      if (patternMatches) {
        matches.push(...patternMatches);
        totalScore += patternMatches.length * 0.3;
      }
    });

    return {
      matches,
      score: Math.min(totalScore, 1.0)
    };
  }

  private detectMedicalTermsMisuse(text: string): MedicalTermsMisuseAnalysis {
    const medicalTerms = [
      'diagnosis', 'diagnose', 'treatment', 'cure', 'heal',
      'medicine', 'prescription', 'dosage', 'therapy'
    ];

    const misusedTerms = [];
    let totalScore = 0;

    medicalTerms.forEach(term => {
      const pattern = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = text.match(pattern);
      
      if (matches) {
        // Check if used in inappropriate context
        const context = this.extractContext(text, term);
        const isInappropriate = this.isMedicalTermMisused(context, term);
        
        if (isInappropriate) {
          misusedTerms.push({ term, context, matches: matches.length });
          totalScore += matches.length * 0.2;
        }
      }
    });

    return {
      misusedTerms,
      score: Math.min(totalScore, 1.0)
    };
  }
}
```

## 💳 Stripe Payment Integration

### 1. Subscription Management Implementation

```typescript
// Comprehensive Stripe subscription management
export class StripeSubscriptionManager {
  private stripe: Stripe;
  private webhookHandler: StripeWebhookHandler;
  private subscriptionTracker: SubscriptionTracker;

  constructor(config: StripeConfig) {
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2023-10-16',
      typescript: true
    });
    
    this.setupWebhookHandling(config.webhookSecret);
    this.setupSubscriptionTracking();
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult> {
    try {
      // Validate user and payment method
      await this.validateUserForSubscription(params.userId);
      await this.validatePaymentMethod(params.paymentMethodId);

      // Get or create Stripe customer
      const customer = await this.getOrCreateStripeCustomer(params.userId);
      
      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(params.paymentMethodId, {
        customer: customer.id
      });

      // Set as default payment method
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: params.paymentMethodId
        }
      });

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: params.priceId,
            quantity: 1
          }
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: params.trialDays,
        metadata: {
          userId: params.userId,
          subscriptionTier: params.tier,
          source: 'web_application'
        }
      });

      // Update user subscription in database
      await this.updateUserSubscription(params.userId, {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer.id,
        subscriptionTier: params.tier,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      });

      // Set up usage tracking for metered billing
      if (params.hasUsageBasedBilling) {
        await this.setupUsageBasedBilling(subscription.id, params.userId);
      }

      return {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        status: subscription.status,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      };

    } catch (error) {
      await this.handleSubscriptionError(error, params);
      throw error;
    }
  }

  async handleFamilySubscription(params: FamilySubscriptionParams): Promise<FamilySubscriptionResult> {
    try {
      // Get primary user's subscription
      const primarySubscription = await this.getUserSubscription(params.primaryUserId);
      
      if (!primarySubscription) {
        throw new SubscriptionError('Primary user must have an active subscription');
      }

      // Calculate family pricing
      const familyPricing = await this.calculateFamilyPricing(
        params.primaryUserId,
        params.additionalMembers
      );

      // Update subscription with family pricing
      const updatedSubscription = await this.stripe.subscriptions.update(
        primarySubscription.stripeSubscriptionId,
        {
          items: [
            {
              id: primarySubscription.stripeSubscriptionItemId,
              price: familyPricing.basePriceId,
              quantity: 1
            },
            {
              price: familyPricing.additionalMemberPriceId,
              quantity: params.additionalMembers
            }
          ],
          proration_behavior: 'create_prorations'
        }
      );

      // Update family account billing information
      await this.updateFamilyAccountBilling(params.familyAccountId, {
        totalMembers: params.additionalMembers + 1,
        monthlyAmount: familyPricing.totalAmount,
        nextBillingDate: new Date(updatedSubscription.current_period_end * 1000)
      });

      return {
        subscriptionId: updatedSubscription.id,
        totalMonthlyAmount: familyPricing.totalAmount,
        additionalMemberCost: familyPricing.additionalMemberCost,
        nextBillingDate: new Date(updatedSubscription.current_period_end * 1000)
      };

    } catch (error) {
      await this.handleFamilySubscriptionError(error, params);
      throw error;
    }
  }

  async handleUsageBasedBilling(params: UsageBillingParams): Promise<UsageBillingResult> {
    try {
      // Get user's subscription and usage data
      const subscription = await this.getUserSubscription(params.userId);
      const usageData = await this.getUsageData(params.userId, params.billingPeriod);

      // Calculate overages
      const overages = this.calculateUsageOverages(usageData, subscription.limits);

      if (overages.total > 0) {
        // Record usage for billing
        await this.recordUsageForBilling(subscription.stripeSubscriptionId, overages);

        // Create usage record in Stripe
        for (const [usageType, usage] of Object.entries(overages.breakdown)) {
          if (usage.overage > 0) {
            await this.stripe.subscriptionItems.createUsageRecord(
              subscription.usageItems[usageType],
              {
                quantity: usage.overage,
                timestamp: Math.floor(Date.now() / 1000),
                action: 'increment'
              }
            );
          }
        }

        // Notify user of overage charges
        await this.notifyUserOfOverageCharges(params.userId, overages);
      }

      return {
        billingPeriod: params.billingPeriod,
        totalUsage: usageData.total,
        includedUsage: usageData.included,
        overageUsage: overages.total,
        estimatedCharges: overages.totalCost,
        nextBillingDate: subscription.currentPeriodEnd
      };

    } catch (error) {
      await this.handleUsageBillingError(error, params);
      throw error;
    }
  }
}
```

### 2. Webhook Handling Implementation

```typescript
// Stripe webhook handling for subscription events
export class StripeWebhookHandler {
  private stripe: Stripe;
  private webhookSecret: string;
  private eventProcessors: Map<string, EventProcessor>;

  constructor(stripe: Stripe, webhookSecret: string) {
    this.stripe = stripe;
    this.webhookSecret = webhookSecret;
    this.setupEventProcessors();
  }

  async handleWebhook(body: Buffer, signature: string): Promise<WebhookResult> {
    try {
      // Verify webhook signature
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.webhookSecret
      );

      // Process event
      const processor = this.eventProcessors.get(event.type);
      
      if (!processor) {
        console.warn(`Unhandled webhook event type: ${event.type}`);
        return { handled: false, reason: 'no_processor' };
      }

      const result = await processor.process(event);
      
      // Log successful processing
      await this.logWebhookEvent(event, result);

      return { handled: true, result };

    } catch (error) {
      console.error('Webhook processing error:', error);
      await this.logWebhookError(body, signature, error);
      throw error;
    }
  }

  private setupEventProcessors(): void {
    this.eventProcessors = new Map([
      ['customer.subscription.created', new SubscriptionCreatedProcessor()],
      ['customer.subscription.updated', new SubscriptionUpdatedProcessor()],
      ['customer.subscription.deleted', new SubscriptionCancelledProcessor()],
      ['invoice.payment_succeeded', new PaymentSucceededProcessor()],
      ['invoice.payment_failed', new PaymentFailedProcessor()],
      ['customer.subscription.trial_will_end', new TrialEndingProcessor()],
      ['setup_intent.succeeded', new SetupIntentSucceededProcessor()]
    ]);
  }
}

// Subscription event processors
export class SubscriptionUpdatedProcessor implements EventProcessor {
  async process(event: Stripe.Event): Promise<ProcessorResult> {
    const subscription = event.data.object as Stripe.Subscription;
    const previousAttributes = event.data.previous_attributes as any;

    // Get user from subscription metadata
    const userId = subscription.metadata.userId;
    if (!userId) {
      throw new WebhookError('No userId in subscription metadata');
    }

    // Update subscription status in database
    await this.updateUserSubscription(userId, {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    });

    // Handle status changes
    if (previousAttributes?.status && previousAttributes.status !== subscription.status) {
      await this.handleSubscriptionStatusChange(
        userId,
        previousAttributes.status,
        subscription.status
      );
    }

    // Handle trial ending
    if (subscription.trial_end && subscription.trial_end <= Math.floor(Date.now() / 1000)) {
      await this.handleTrialEnd(userId, subscription);
    }

    return { success: true, action: 'subscription_updated' };
  }

  private async handleSubscriptionStatusChange(
    userId: string,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    switch (newStatus) {
      case 'active':
        await this.activateUserFeatures(userId);
        await this.sendSubscriptionActivatedEmail(userId);
        break;
        
      case 'past_due':
        await this.handlePastDueSubscription(userId);
        await this.sendPaymentRetryEmail(userId);
        break;
        
      case 'canceled':
        await this.deactivateUserFeatures(userId);
        await this.sendSubscriptionCancelledEmail(userId);
        break;
        
      case 'unpaid':
        await this.handleUnpaidSubscription(userId);
        await this.sendPaymentFailedEmail(userId);
        break;
    }
  }
}

export class PaymentFailedProcessor implements EventProcessor {
  async process(event: Stripe.Event): Promise<ProcessorResult> {
    const invoice = event.data.object as Stripe.Invoice;
    
    // Get subscription and user information
    const subscription = await this.getSubscriptionFromInvoice(invoice);
    const userId = subscription.metadata.userId;

    // Update payment failure count
    await this.incrementPaymentFailureCount(userId);
    
    // Check if this is the final attempt
    if (invoice.attempt_count >= 3) {
      await this.handleFinalPaymentFailure(userId, subscription.id);
    } else {
      await this.handleRetryablePaymentFailure(userId, invoice);
    }

    // Send appropriate notifications
    await this.sendPaymentFailureNotification(userId, {
      attemptCount: invoice.attempt_count,
      nextRetryDate: invoice.next_payment_attempt ? 
        new Date(invoice.next_payment_attempt * 1000) : null,
      amountDue: invoice.amount_due / 100
    });

    return { success: true, action: 'payment_failure_handled' };
  }
}
```

## 🔥 Firebase Authentication Integration

### 1. Authentication Service Implementation

```typescript
// Firebase Authentication integration
export class FirebaseAuthService {
  private auth: Admin.auth.Auth;
  private userManager: UserManager;
  private sessionManager: SessionManager;

  constructor(config: FirebaseConfig) {
    const adminApp = Admin.initializeApp({
      credential: Admin.credential.cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey
      })
    });
    
    this.auth = adminApp.auth();
    this.setupUserManagement();
    this.setupSessionManagement();
  }

  async authenticateUser(idToken: string): Promise<AuthenticationResult> {
    try {
      // Verify ID token
      const decodedToken = await this.auth.verifyIdToken(idToken);
      
      // Get or create user in our database
      const user = await this.getOrCreateUser(decodedToken);
      
      // Check for security flags
      const securityCheck = await this.performSecurityCheck(user, decodedToken);
      
      if (!securityCheck.passed) {
        await this.handleSecurityViolation(user.id, securityCheck);
        throw new SecurityViolationError(securityCheck.reason);
      }

      // Create session
      const session = await this.sessionManager.createSession(user.id, {
        firebaseUid: decodedToken.uid,
        deviceInfo: decodedToken.device_info,
        ipAddress: decodedToken.ip_address
      });

      // Update last login
      await this.updateLastLogin(user.id);

      return {
        user,
        session,
        permissions: await this.getUserPermissions(user.id)
      };

    } catch (error) {
      await this.logAuthenticationError(error, idToken);
      throw error;
    }
  }

  async createCustomClaims(userId: string, claims: CustomClaims): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      
      // Validate claims
      const validatedClaims = await this.validateCustomClaims(claims);
      
      // Set custom claims in Firebase
      await this.auth.setCustomUserClaims(user.firebaseUid, validatedClaims);
      
      // Update claims in our database
      await this.updateUserClaims(userId, validatedClaims);

    } catch (error) {
      await this.logClaimsError(error, userId, claims);
      throw error;
    }
  }

  private async getOrCreateUser(decodedToken: DecodedIdToken): Promise<User> {
    // Try to find existing user
    let user = await this.userManager.getUserByFirebaseUid(decodedToken.uid);
    
    if (!user) {
      // Create new user
      user = await this.userManager.createUser({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        name: decodedToken.name,
        picture: decodedToken.picture,
        tenantId: await this.determineTenantId(decodedToken),
        role: 'end_user',
        subscriptionTier: 'basic',
        deviceFingerprint: this.generateDeviceFingerprint(decodedToken)
      });

      // Send welcome email
      await this.sendWelcomeEmail(user);
    } else {
      // Update existing user info if needed
      await this.updateUserIfNeeded(user, decodedToken);
    }

    return user;
  }

  private async performSecurityCheck(
    user: User, 
    decodedToken: DecodedIdToken
  ): Promise<SecurityCheck> {
    const checks = await Promise.all([
      this.checkAccountStatus(user),
      this.checkDeviceFingerprint(user, decodedToken),
      this.checkFailedLoginAttempts(user),
      this.checkSuspiciousActivity(user, decodedToken)
    ]);

    const failedChecks = checks.filter(check => !check.passed);
    
    return {
      passed: failedChecks.length === 0,
      reason: failedChecks.map(check => check.reason).join(', '),
      details: checks
    };
  }

  private async checkDeviceFingerprint(
    user: User, 
    decodedToken: DecodedIdToken
  ): Promise<SecurityCheckResult> {
    const currentFingerprint = this.generateDeviceFingerprint(decodedToken);
    
    if (!user.deviceFingerprint) {
      // First login - store fingerprint
      await this.updateUserDeviceFingerprint(user.id, currentFingerprint);
      return { passed: true, reason: 'first_device_registration' };
    }

    const similarity = this.calculateFingerprintSimilarity(
      user.deviceFingerprint,
      currentFingerprint
    );

    if (similarity < 0.7) {
      // Significant device change - require additional verification
      await this.requestAdditionalVerification(user.id, currentFingerprint);
      return { 
        passed: false, 
        reason: 'device_fingerprint_mismatch',
        requiresVerification: true
      };
    }

    return { passed: true, reason: 'device_verified' };
  }
}
```

### 2. Role-Based Access Control Implementation

```typescript
// Role-based access control with Firebase custom claims
export class RoleBasedAccessControl {
  private auth: FirebaseAuthService;
  private permissionEngine: PermissionEngine;

  async assignUserRole(userId: string, role: UserRole): Promise<void> {
    try {
      // Validate role assignment permissions
      await this.validateRoleAssignment(userId, role);
      
      // Update role in database
      await this.updateUserRole(userId, role);
      
      // Set Firebase custom claims
      const customClaims = await this.generateCustomClaims(userId, role);
      await this.auth.createCustomClaims(userId, customClaims);
      
      // Update permissions cache
      await this.refreshUserPermissions(userId);

    } catch (error) {
      await this.logRoleAssignmentError(error, userId, role);
      throw error;
    }
  }

  async checkPermission(userId: string, permission: Permission): Promise<boolean> {
    try {
      // Get user permissions from cache
      const userPermissions = await this.getUserPermissions(userId);
      
      // Check direct permission
      if (userPermissions.direct.includes(permission)) {
        return true;
      }
      
      // Check role-based permissions
      const rolePermissions = await this.getRolePermissions(userPermissions.role);
      if (rolePermissions.includes(permission)) {
        return true;
      }
      
      // Check subscription-based permissions
      const subscriptionPermissions = await this.getSubscriptionPermissions(
        userPermissions.subscriptionTier
      );
      if (subscriptionPermissions.includes(permission)) {
        return true;
      }

      return false;

    } catch (error) {
      await this.logPermissionCheckError(error, userId, permission);
      return false; // Fail closed
    }
  }

  private async generateCustomClaims(userId: string, role: UserRole): Promise<CustomClaims> {
    const user = await this.getUserById(userId);
    const rolePermissions = await this.getRolePermissions(role);
    const subscriptionPermissions = await this.getSubscriptionPermissions(user.subscriptionTier);
    
    return {
      role,
      subscriptionTier: user.subscriptionTier,
      permissions: [...rolePermissions, ...subscriptionPermissions],
      tenantId: user.tenantId,
      lastUpdated: Date.now()
    };
  }
}
```

## 📊 Cost Optimization and Monitoring

### 1. API Cost Tracking Implementation

```typescript
// Comprehensive API cost tracking and optimization
export class APICostTracker {
  private redis: Redis;
  private costDatabase: CostDatabase;
  private alertManager: AlertManager;

  async trackAPIUsage(
    userId: string, 
    apiService: string, 
    usage: APIUsageData
  ): Promise<void> {
    const timestamp = Date.now();
    const costKey = `cost:${userId}:${apiService}:${this.getCurrentMonth()}`;
    
    // Update real-time usage
    await this.redis.hincrby(costKey, 'requests', 1);
    await this.redis.hincrbyfloat(costKey, 'cost', usage.cost);
    await this.redis.expire(costKey, 86400 * 32); // 32 days

    // Store detailed usage data
    await this.costDatabase.recordUsage({
      userId,
      apiService,
      timestamp,
      cost: usage.cost,
      usage: usage.details,
      metadata: usage.metadata
    });

    // Check for cost alerts
    await this.checkCostAlerts(userId, apiService);
  }

  async optimizeAPICosts(): Promise<CostOptimizationReport> {
    const optimizations = await Promise.all([
      this.optimizeCaching(),
      this.optimizeRateLimiting(),
      this.optimizeRequestBatching(),
      this.optimizeModelSelection()
    ]);

    const totalSavings = optimizations.reduce(
      (sum, opt) => sum + opt.estimatedSavings, 
      0
    );

    return {
      optimizations,
      totalEstimatedSavings: totalSavings,
      implementationPriority: this.prioritizeOptimizations(optimizations),
      monthlyProjectedSavings: totalSavings * 30
    };
  }

  private async optimizeCaching(): Promise<CostOptimization> {
    const cacheAnalysis = await this.analyzeCacheEffectiveness();
    
    const recommendations = [];
    let estimatedSavings = 0;

    if (cacheAnalysis.hitRate < 0.7) {
      recommendations.push({
        type: 'increase_cache_ttl',
        description: 'Increase cache TTL for stable data',
        impact: 'Reduce API calls by 20-30%'
      });
      estimatedSavings += cacheAnalysis.monthlyCost * 0.25;
    }

    if (cacheAnalysis.missedOpportunities.length > 0) {
      recommendations.push({
        type: 'add_caching_layers',
        description: 'Add caching for frequently requested data',
        impact: 'Reduce API calls by 15-25%'
      });
      estimatedSavings += cacheAnalysis.monthlyCost * 0.2;
    }

    return {
      category: 'caching',
      recommendations,
      estimatedSavings,
      implementationEffort: 'medium'
    };
  }

  async generateCostReport(timeframe: CostTimeframe): Promise<CostReport> {
    const usage = await this.getCostBreakdown(timeframe);
    const trends = await this.analyzeCostTrends(timeframe);
    const projections = await this.generateCostProjections(usage, trends);

    return {
      period: timeframe,
      totalCost: usage.total,
      breakdown: {
        edamam: usage.edamam,
        gemini: usage.gemini,
        stripe: usage.stripe,
        firebase: usage.firebase,
        infrastructure: usage.infrastructure
      },
      trends,
      projections,
      optimizationOpportunities: await this.identifyOptimizationOpportunities(usage),
      alerts: await this.generateCostAlerts(usage, projections)
    };
  }
}
```

### 2. Rate Limiting and Quota Management

```typescript
// Advanced rate limiting and quota management
export class RateLimitingManager {
  private redis: Redis;
  private quotaManager: QuotaManager;

  async checkRateLimit(
    userId: string, 
    apiService: string, 
    operation: string
  ): Promise<RateLimitResult> {
    const user = await this.getUserById(userId);
    const limits = await this.getRateLimits(user.subscriptionTier, apiService, operation);
    
    const key = `rate_limit:${userId}:${apiService}:${operation}`;
    const window = limits.windowSizeMs;
    const maxRequests = limits.maxRequests;
    
    // Sliding window rate limiting
    const now = Date.now();
    const pipeline = this.redis.pipeline();
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, now - window);
    
    // Count current requests
    pipeline.zcard(key);
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    
    // Set expiration
    pipeline.expire(key, Math.ceil(window / 1000));
    
    const results = await pipeline.exec();
    const currentCount = results[1][1] as number;
    
    if (currentCount >= maxRequests) {
      // Rate limit exceeded
      await this.logRateLimitExceeded(userId, apiService, operation);
      
      return {
        allowed: false,
        limitExceeded: true,
        retryAfter: this.calculateRetryAfter(key, window),
        remainingRequests: 0
      };
    }
    
    return {
      allowed: true,
      limitExceeded: false,
      remainingRequests: maxRequests - currentCount - 1,
      resetTime: now + window
    };
  }

  async implementIntelligentThrottling(
    userId: string,
    usage: UsagePattern
  ): Promise<ThrottlingStrategy> {
    // Analyze user behavior
    const behaviorAnalysis = await this.analyzeUserBehavior(userId, usage);
    
    // Adjust limits based on subscription tier and behavior
    const adjustedLimits = await this.calculateAdjustedLimits(
      userId,
      behaviorAnalysis
    );
    
    // Implement adaptive throttling
    const throttlingStrategy = {
      baseRate: adjustedLimits.baseRate,
      burstAllowance: adjustedLimits.burstAllowance,
      adaptiveScaling: behaviorAnalysis.trustScore > 0.8,
      priority: this.calculateUserPriority(userId, behaviorAnalysis)
    };

    await this.applyThrottlingStrategy(userId, throttlingStrategy);
    
    return throttlingStrategy;
  }
}
```

## 🎯 Success Metrics and Monitoring

### API Integration Success Criteria
- **Response Time**: 95% of API calls complete within 2 seconds
- **Success Rate**: 99.5% success rate for all API integrations
- **Cost Efficiency**: API costs remain under $0.50 per user per month
- **Cache Hit Rate**: 80% cache hit rate for frequently accessed data

### Security and Compliance Metrics
- **Authentication Success**: 99.9% successful authentication rate
- **Security Incidents**: Zero security breaches or data exposures
- **Token Validation**: 100% successful token validation
- **Access Control**: 100% accurate permission enforcement

### User Experience Metrics
- **Feature Adoption**: 70% of premium users actively use AI features
- **Error Recovery**: 95% of API failures resolve gracefully
- **Subscription Retention**: 85% monthly subscription retention
- **Support Requests**: <1% of API integrations require user support

---

**This comprehensive API integration guide ensures robust, secure, and cost-effective integration with all external services, providing the foundation for Praneya's healthcare nutrition platform.**