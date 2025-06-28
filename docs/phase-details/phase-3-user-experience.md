# Phase 3: Enhanced User Experience (Weeks 5-6)

## 🎯 Phase Overview

Building on the AI features from Phase 2, this phase focuses on creating an intuitive, conversational user experience that makes healthy eating accessible and engaging for all family members, with progressive web app capabilities for offline access.

## 🎯 Phase Objectives

### Primary Goals
- Implement conversational AI onboarding for seamless user engagement
- Create interactive recipe refinement with real-time AI coaching
- Build comprehensive meal planning with visual calendar interface
- Develop smart shopping list generation with optimization
- Deploy Progressive Web App with offline capabilities

### Success Criteria
- [ ] Conversational onboarding flow with 80%+ completion rate
- [ ] Interactive recipe refinement with natural language processing
- [ ] Weekly meal planning with drag-and-drop calendar interface
- [ ] Smart shopping lists with store optimization and price tracking
- [ ] PWA with offline recipe viewing and meal planning

## 🏗️ Technical Implementation Plan

### 1. Conversational AI Onboarding
**Status: 🔄 PLANNED**

```typescript
// Progressive conversational onboarding system
export class ConversationalOnboarding {
  private geminiAI: GeminiAIService;
  private profileBuilder: ProfileBuilder;

  async startOnboardingConversation(userId: string): Promise<OnboardingSession> {
    const session = await this.createSession(userId);
    
    const welcomeMessage = await this.geminiAI.generateResponse({
      context: 'onboarding_welcome',
      userInfo: await this.getUserBasicInfo(userId),
      prompt: this.buildWelcomePrompt()
    });

    return {
      sessionId: session.id,
      currentStep: 'welcome',
      aiMessage: welcomeMessage,
      collectedData: {},
      progress: 0
    };
  }

  async processUserResponse(
    sessionId: string, 
    userMessage: string
  ): Promise<OnboardingResponse> {
    const session = await this.getSession(sessionId);
    const currentStep = session.currentStep;

    // Extract structured data from natural language
    const extractedData = await this.geminiAI.extractStructuredData({
      userMessage,
      expectedFields: this.getExpectedFields(currentStep),
      context: session.collectedData
    });

    // Validate and store extracted data
    const validationResult = await this.validateExtractedData(
      extractedData, 
      currentStep
    );

    if (!validationResult.isValid) {
      return this.requestClarification(validationResult.issues);
    }

    // Update session with validated data
    await this.updateSessionData(sessionId, extractedData);

    // Generate next question or complete onboarding
    const nextStep = this.determineNextStep(session, extractedData);
    
    if (nextStep === 'complete') {
      await this.completeOnboarding(sessionId);
      return this.generateCompletionResponse(session);
    }

    const nextQuestion = await this.generateNextQuestion(nextStep, session);
    
    return {
      aiMessage: nextQuestion,
      currentStep: nextStep,
      progress: this.calculateProgress(nextStep),
      suggestedResponses: this.generateSuggestions(nextStep)
    };
  }

  private buildWelcomePrompt(): string {
    return `
      You are a friendly nutrition assistant helping someone set up their personalized meal planning.
      
      Your role:
      - Ask natural, conversational questions about food preferences
      - Extract specific dietary information from casual responses
      - Make the process feel like chatting with a knowledgeable friend
      - Adapt questions based on subscription tier and health goals
      
      Start by asking about their cooking experience and favorite foods.
      Keep responses warm, encouraging, and under 50 words.
    `;
  }
}
```

**Onboarding Features:**
- Natural language preference collection
- Adaptive questioning based on subscription tier
- Visual preference selection with AI interpretation
- Progressive disclosure of health information
- Smart data extraction from conversational input

### 2. Interactive Recipe Refinement
**Status: 🔄 PLANNED**

```typescript
// AI-powered recipe refinement system
export class RecipeRefinementEngine {
  private geminiAI: GeminiAIService;
  private nutritionAnalyzer: NutritionAnalyzer;

  async refineRecipe(
    originalRecipe: Recipe,
    refinementRequest: RefinementRequest
  ): Promise<RefinedRecipe> {
    const refinementPrompt = this.buildRefinementPrompt(
      originalRecipe,
      refinementRequest
    );

    const refinedVersion = await this.geminiAI.generateContent({
      prompt: refinementPrompt,
      constraints: {
        maintainNutritionBalance: true,
        respectAllergies: refinementRequest.userAllergies,
        considerHealthConditions: refinementRequest.healthProfile
      }
    });

    // Analyze nutritional impact of changes
    const nutritionComparison = await this.nutritionAnalyzer.compareRecipes(
      originalRecipe,
      refinedVersion
    );

    // Validate safety and appropriateness
    const safetyCheck = await this.validateRefinement(
      refinedVersion,
      refinementRequest.userProfile
    );

    return {
      refinedRecipe: refinedVersion,
      nutritionComparison,
      safetyValidation: safetyCheck,
      refinementExplanation: this.generateExplanation(refinementRequest),
      alternativeOptions: await this.generateAlternatives(refinementRequest)
    };
  }

  async suggestImprovements(recipe: Recipe, userGoals: UserGoals): Promise<ImprovementSuggestions> {
    const analysis = await this.nutritionAnalyzer.analyzeRecipe(recipe);
    
    const suggestions = await this.geminiAI.generateContent({
      prompt: `
        Analyze this recipe for someone with these health goals: ${userGoals.join(', ')}
        
        Recipe: ${JSON.stringify(recipe)}
        Nutrition: ${JSON.stringify(analysis)}
        
        Provide 3 specific, actionable improvements that would:
        1. Better align with their health goals
        2. Improve nutritional value
        3. Enhance flavor while maintaining health benefits
        
        For each suggestion, explain the nutritional reasoning.
      `
    });

    return {
      improvements: suggestions.improvements,
      nutritionalReasoning: suggestions.reasoning,
      difficultyLevel: this.assessDifficulty(suggestions),
      estimatedImpact: this.calculateNutritionalImpact(suggestions, analysis)
    };
  }
}
```

### 3. Advanced Meal Planning System
**Status: 🔄 PLANNED**

```typescript
// Comprehensive meal planning with calendar interface
export class MealPlanningSystem {
  private recipeRecommender: RecipeRecommender;
  private nutritionOptimizer: NutritionOptimizer;
  private calendarManager: CalendarManager;

  async generateWeeklyMealPlan(
    userId: string,
    preferences: MealPlanPreferences
  ): Promise<WeeklyMealPlan> {
    const userProfile = await this.getUserProfile(userId);
    const nutritionTargets = await this.calculateNutritionTargets(userProfile);

    // Generate optimized meal plan
    const mealPlan = await this.nutritionOptimizer.optimizeMealPlan({
      duration: preferences.duration || 7,
      mealsPerDay: preferences.mealsPerDay || 3,
      calorieTarget: nutritionTargets.calories,
      macroTargets: nutritionTargets.macros,
      restrictions: userProfile.dietaryRestrictions,
      preferences: userProfile.foodPreferences,
      budget: preferences.budgetLimit,
      cookingTime: preferences.maxCookingTime
    });

    // Add variety and seasonal considerations
    const enhancedPlan = await this.addVarietyAndSeasonal(mealPlan, preferences);

    // Generate shopping list
    const shoppingList = await this.generateShoppingList(enhancedPlan);

    return {
      mealPlan: enhancedPlan,
      nutritionSummary: this.calculateNutritionSummary(enhancedPlan),
      shoppingList,
      prepSchedule: this.generatePrepSchedule(enhancedPlan),
      costEstimate: this.estimateCost(shoppingList)
    };
  }

  async optimizeForFamily(
    familyId: string,
    individualPlans: IndividualMealPlan[]
  ): Promise<FamilyMealPlan> {
    // Find common recipes that work for multiple family members
    const commonRecipes = await this.findFamilyFriendlyRecipes(individualPlans);
    
    // Optimize for shared cooking and preparation
    const optimizedSchedule = await this.optimizeSharedCooking(commonRecipes);
    
    // Handle individual dietary needs within family meals
    const adaptations = await this.generateMealAdaptations(
      commonRecipes,
      individualPlans
    );

    return {
      sharedMeals: optimizedSchedule.sharedMeals,
      individualMeals: optimizedSchedule.individualMeals,
      mealAdaptations: adaptations,
      consolidatedShoppingList: this.consolidateShoppingLists(individualPlans),
      familyCookingSchedule: optimizedSchedule.cookingSchedule
    };
  }
}
```

### 4. Smart Shopping List System
**Status: 🔄 PLANNED**

```typescript
// Intelligent shopping list generation and optimization
export class SmartShoppingListGenerator {
  private priceTracker: PriceTracker;
  private storeOptimizer: StoreOptimizer;
  private inventoryManager: InventoryManager;

  async generateShoppingList(
    mealPlan: WeeklyMealPlan,
    userPreferences: ShoppingPreferences
  ): Promise<SmartShoppingList> {
    // Extract all ingredients from meal plan
    const allIngredients = this.extractIngredients(mealPlan);
    
    // Check user's existing inventory
    const inventory = await this.inventoryManager.getUserInventory(
      userPreferences.userId
    );
    
    // Calculate needed quantities accounting for inventory
    const neededIngredients = this.calculateNeededQuantities(
      allIngredients,
      inventory
    );

    // Optimize for store layout and efficiency
    const optimizedList = await this.storeOptimizer.optimizeForStore(
      neededIngredients,
      userPreferences.preferredStore
    );

    // Add price tracking and budget optimization
    const priceOptimizedList = await this.priceTracker.optimizeForBudget(
      optimizedList,
      userPreferences.budget
    );

    // Group by store sections for efficient shopping
    const organizedList = this.organizeByStoreSections(priceOptimizedList);

    return {
      organizedList,
      totalEstimatedCost: this.calculateTotalCost(priceOptimizedList),
      budgetAnalysis: this.analyzeBudgetImpact(priceOptimizedList, userPreferences.budget),
      substitutionSuggestions: await this.generateSubstitutions(priceOptimizedList),
      storeMap: await this.generateStoreMap(organizedList, userPreferences.preferredStore)
    };
  }

  async trackPrices(ingredients: Ingredient[]): Promise<PriceTrackingData> {
    const priceData = await Promise.all(
      ingredients.map(async ingredient => {
        const currentPrices = await this.priceTracker.getCurrentPrices(ingredient);
        const priceHistory = await this.priceTracker.getPriceHistory(ingredient, 30);
        const bestStores = await this.findBestStoresForIngredient(ingredient);

        return {
          ingredient,
          currentPrices,
          priceHistory,
          bestStores,
          priceAlert: this.shouldAlertUser(ingredient, currentPrices, priceHistory)
        };
      })
    );

    return {
      ingredients: priceData,
      totalSavingsOpportunity: this.calculateSavingsOpportunity(priceData),
      recommendedShoppingStrategy: this.recommendShoppingStrategy(priceData)
    };
  }
}
```

### 5. Progressive Web App Implementation
**Status: 🔄 PLANNED**

```typescript
// PWA configuration with offline capabilities
export class PWAManager {
  private serviceWorker: ServiceWorkerManager;
  private offlineStorage: OfflineStorageManager;

  async initializePWA(): Promise<void> {
    // Register service worker
    await this.serviceWorker.register('/sw.js');

    // Set up offline storage
    await this.offlineStorage.initialize();

    // Cache critical resources
    await this.cacheEssentialResources();

    // Set up background sync
    await this.setupBackgroundSync();
  }

  async cacheRecipeData(recipes: Recipe[]): Promise<void> {
    const essentialData = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      nutrition: recipe.nutrition,
      images: recipe.images?.map(img => this.optimizeImageForOffline(img))
    }));

    await this.offlineStorage.store('recipes', essentialData);
  }

  async enableOfflineMealPlanning(): Promise<void> {
    // Cache meal planning interface
    await this.serviceWorker.cacheResource('/meal-planning');
    
    // Store meal plan data offline
    await this.offlineStorage.enableOfflineAccess('meal-plans');
    
    // Set up sync when back online
    await this.setupMealPlanSync();
  }
}

// Service Worker configuration
// sw.js
const CACHE_NAME = 'praneya-v1';
const urlsToCache = [
  '/',
  '/meal-planning',
  '/recipes',
  '/shopping-lists',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

## 🧪 Testing Strategy

### User Experience Tests
```typescript
describe('Conversational Onboarding', () => {
  it('should complete onboarding flow with natural language', async () => {
    const onboarding = new ConversationalOnboarding();
    let session = await onboarding.startOnboardingConversation('test-user');
    
    // Simulate natural language responses
    session = await onboarding.processUserResponse(
      session.sessionId,
      "I'm a beginner cook and I love pasta dishes"
    );
    
    expect(session.collectedData.cookingLevel).toBe('beginner');
    expect(session.collectedData.preferences).toContain('pasta');
    expect(session.progress).toBeGreaterThan(0);
  });

  it('should handle dietary restrictions mentioned casually', async () => {
    const onboarding = new ConversationalOnboarding();
    const session = await onboarding.startOnboardingConversation('test-user');
    
    const response = await onboarding.processUserResponse(
      session.sessionId,
      "I can't eat nuts because I'm allergic, and I try to avoid dairy"
    );
    
    expect(response.collectedData.allergies).toContain('nuts');
    expect(response.collectedData.dietaryRestrictions).toContain('dairy-free');
  });
});

describe('Recipe Refinement', () => {
  it('should modify recipes based on user feedback', async () => {
    const refinementEngine = new RecipeRefinementEngine();
    const originalRecipe = { /* recipe data */ };
    
    const refined = await refinementEngine.refineRecipe(originalRecipe, {
      feedback: "Make it lower in sodium and add more vegetables",
      userProfile: { conditions: ['hypertension'] }
    });
    
    expect(refined.nutritionComparison.sodium.change).toBeLessThan(0);
    expect(refined.refinedRecipe.vegetables.length).toBeGreaterThan(
      originalRecipe.vegetables.length
    );
  });
});
```

### PWA Performance Tests
```typescript
describe('Progressive Web App', () => {
  it('should work offline for cached recipes', async () => {
    const pwa = new PWAManager();
    await pwa.cacheRecipeData(mockRecipes);
    
    // Simulate offline state
    navigator.onLine = false;
    
    const recipes = await pwa.getOfflineRecipes();
    expect(recipes).toHaveLength(mockRecipes.length);
    expect(recipes[0].instructions).toBeDefined();
  });

  it('should sync meal plans when back online', async () => {
    const pwa = new PWAManager();
    
    // Create meal plan offline
    navigator.onLine = false;
    await pwa.createOfflineMealPlan(mockMealPlan);
    
    // Go back online
    navigator.onLine = true;
    await pwa.syncWithServer();
    
    const serverMealPlan = await pwa.getServerMealPlan();
    expect(serverMealPlan.id).toBe(mockMealPlan.id);
  });
});
```

## 📱 Mobile-First Design

### Responsive Interface Components
```typescript
// Mobile-optimized meal planning calendar
export const MealPlanningCalendar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  return (
    <div className="meal-planning-calendar">
      {isMobile ? (
        <MobileCalendarView 
          onMealSelect={handleMealSelect}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ) : (
        <DesktopCalendarView
          dragAndDrop={true}
          weekView={true}
        />
      )}
    </div>
  );
};

// Touch-friendly recipe refinement
export const RecipeRefinementInterface: React.FC = () => {
  return (
    <div className="recipe-refinement">
      <SwipeableRecipeViewer recipes={refinedVersions} />
      <VoiceInputButton onVoiceInput={handleVoiceRefinement} />
      <QuickRefinementButtons 
        options={['Less Salt', 'More Protein', 'Vegetarian', 'Spicier']}
        onSelect={handleQuickRefinement}
      />
    </div>
  );
};
```

## 📊 User Engagement Features

### Gamification Elements
```typescript
// Cooking achievement system
export class CookingAchievements {
  async checkAchievements(userId: string, activity: UserActivity): Promise<Achievement[]> {
    const achievements = [];
    
    if (activity.type === 'recipe_completed') {
      achievements.push(...await this.checkCookingAchievements(userId, activity));
    }
    
    if (activity.type === 'meal_plan_completed') {
      achievements.push(...await this.checkPlanningAchievements(userId, activity));
    }
    
    return achievements;
  }

  private async checkCookingAchievements(userId: string, activity: UserActivity): Promise<Achievement[]> {
    const userStats = await this.getUserCookingStats(userId);
    const achievements = [];

    if (userStats.recipesCompleted === 5) {
      achievements.push({
        id: 'first_five_recipes',
        title: 'Kitchen Novice',
        description: 'Completed your first 5 recipes!',
        icon: '👨‍🍳',
        points: 100
      });
    }

    if (userStats.healthyRecipesCompleted === 10) {
      achievements.push({
        id: 'healthy_cooking_streak',
        title: 'Health Conscious Chef',
        description: 'Cooked 10 healthy recipes!',
        icon: '🥗',
        points: 200
      });
    }

    return achievements;
  }
}
```

## 📋 Phase 3 Deliverables

### User Experience Features
- [ ] **Conversational Onboarding** - Natural language preference collection
- [ ] **Interactive Recipe Refinement** - Real-time AI-powered customization
- [ ] **Visual Meal Planning** - Drag-and-drop calendar interface
- [ ] **Smart Shopping Lists** - Store optimization and price tracking
- [ ] **Progressive Web App** - Offline capabilities and mobile optimization

### Mobile Optimization
- [ ] **Touch-Friendly Interface** - Optimized for mobile interaction
- [ ] **Voice Input Support** - Hands-free recipe refinement
- [ ] **Swipe Gestures** - Intuitive navigation for recipes and meal plans
- [ ] **Offline Recipe Viewing** - Cached content for kitchen use

### Engagement Systems
- [ ] **Achievement System** - Gamified cooking progress tracking
- [ ] **Social Sharing** - Recipe and meal plan sharing features
- [ ] **Progress Visualization** - Health and cooking goal tracking
- [ ] **Personalized Recommendations** - AI-driven content suggestions

## 🎯 Success Metrics

### User Engagement
- **Onboarding Completion**: > 80% of users complete full profile setup
- **Recipe Refinement Usage**: > 60% of users modify at least one recipe
- **Meal Plan Creation**: > 70% of enhanced/premium users create meal plans
- **Shopping List Generation**: > 85% adoption for meal plan users

### Technical Performance
- **PWA Performance**: Lighthouse score > 90 for mobile
- **Offline Functionality**: 100% of cached recipes accessible offline
- **Response Time**: < 1 second for UI interactions
- **Cache Hit Rate**: > 80% for recipe and meal plan data

## 🔄 Integration Points

### Phase 2 Dependencies
- User profile system for personalization
- AI recipe generation for refinement base content
- Clinical safety systems for health-conscious recommendations
- API cost optimization for sustainable feature usage

### Phase 4 Preparation
- User engagement data for premium feature targeting
- Meal planning foundation for therapeutic optimization
- Shopping list system for family account optimization
- PWA infrastructure for advanced offline features

---

**Phase 3 Status: 🔄 PLANNED**
**Target Completion: Week 6**
**Next Phase: Advanced Health Features**