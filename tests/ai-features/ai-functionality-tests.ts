/**
 * PRANEYA HEALTHCARE SAAS - AI FUNCTIONALITY TESTING SUITE
 * 
 * Comprehensive testing for AI-powered features including:
 * - Visual Ingredient Recognition (Gemini Vision API)
 * - Recipe Generation by Subscription Tier  
 * - Conversational AI Onboarding
 * - AI Culinary Coach
 * - Drug-Food Interaction Screening (Premium only)
 * 
 * @version 1.0.0
 * @compliance Medical AI Safety Standards
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface AITestResult {
  testName: string;
  passed: boolean;
  confidence: number;
  responseTime: number;
  aiResponse: any;
  errorMessage?: string;
}

interface RecipeGenerationTest {
  tier: 'Basic' | 'Enhanced' | 'Premium';
  inputIngredients: string[];
  expectedFeatures: string[];
  restrictedFeatures: string[];
  healthContext?: any;
}

class AIFunctionalityTestSuite {
  private browser: Browser;
  private page: Page;
  private testResults: AITestResult[] = [];
  private readonly API_BASE_URL = 'http://localhost:3001';
  private readonly CONFIDENCE_THRESHOLD = 0.95;
  private readonly MAX_RESPONSE_TIME = 5000; // 5 seconds for AI processing

  async setup() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    
    // Setup test environment
    await this.setupTestEnvironment();
  }

  async teardown() {
    await this.browser.close();
    
    // Generate AI test report
    await this.generateAITestReport();
  }

  private async setupTestEnvironment() {
    // Verify AI services are available
    console.log('🤖 Setting up AI functionality test environment...');
    
    try {
      const healthCheck = await axios.get(`${this.API_BASE_URL}/api/ai/health-check`);
      if (healthCheck.status !== 200) {
        throw new Error('AI services health check failed');
      }
      console.log('✅ AI services are online and ready');
    } catch (error) {
      console.error('❌ AI services not available:', error.message);
      throw error;
    }
  }

  private async generateAITestReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.length,
      passedTests: this.testResults.filter(r => r.passed).length,
      averageConfidence: this.testResults.reduce((sum, r) => sum + r.confidence, 0) / this.testResults.length,
      averageResponseTime: this.testResults.reduce((sum, r) => sum + r.responseTime, 0) / this.testResults.length,
      results: this.testResults
    };
    
    const reportPath = path.join(process.cwd(), 'reports', `ai-functionality-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 AI functionality test report saved: ${reportPath}`);
  }
}

describe('🤖 AI-Powered Features Testing Suite', () => {
  let testSuite: AIFunctionalityTestSuite;

  beforeAll(async () => {
    testSuite = new AIFunctionalityTestSuite();
    await testSuite.setup();
  });

  afterAll(async () => {
    await testSuite.teardown();
  });

  describe('👁️ Visual Ingredient Recognition Testing', () => {
    
    test('🥕 Gemini Vision API - High confidence ingredient detection', async () => {
      const testImages = [
        { path: 'test-images/apple.jpg', expected: 'apple', confidence: 0.95 },
        { path: 'test-images/broccoli.jpg', expected: 'broccoli', confidence: 0.93 },
        { path: 'test-images/mixed-vegetables.jpg', expected: ['carrot', 'bell-pepper', 'onion'], confidence: 0.92 }
      ];

      for (const testImage of testImages) {
        const startTime = Date.now();
        
        try {
          // Simulate image upload and analysis
          const imageBuffer = fs.readFileSync(path.join(process.cwd(), 'tests', 'fixtures', testImage.path));
          
          const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/analyze-ingredient`, {
            image: imageBuffer.toString('base64'),
            format: 'jpeg'
          });

          const responseTime = Date.now() - startTime;
          const aiResult = response.data;

          // Validate AI response structure
          expect(aiResult).toHaveProperty('ingredients');
          expect(aiResult).toHaveProperty('confidence');
          expect(aiResult).toHaveProperty('nutritionalInfo');

          // Validate confidence threshold
          expect(aiResult.confidence).toBeGreaterThan(testSuite.CONFIDENCE_THRESHOLD);

          // Validate response time
          expect(responseTime).toBeLessThan(testSuite.MAX_RESPONSE_TIME);

          // Validate ingredient detection accuracy
          if (Array.isArray(testImage.expected)) {
            for (const expectedIngredient of testImage.expected) {
              expect(aiResult.ingredients.some(ing => 
                ing.name.toLowerCase().includes(expectedIngredient.toLowerCase())
              )).toBe(true);
            }
          } else {
            expect(aiResult.ingredients[0].name.toLowerCase()).toContain(testImage.expected.toLowerCase());
          }

          testSuite.testResults.push({
            testName: `visual-recognition-${testImage.expected}`,
            passed: true,
            confidence: aiResult.confidence,
            responseTime,
            aiResponse: aiResult
          });

          console.log(`✅ ${testImage.expected} detected with ${(aiResult.confidence * 100).toFixed(1)}% confidence`);

        } catch (error) {
          testSuite.testResults.push({
            testName: `visual-recognition-${testImage.expected}`,
            passed: false,
            confidence: 0,
            responseTime: Date.now() - startTime,
            aiResponse: null,
            errorMessage: error.message
          });

          console.log(`❌ Failed to detect ${testImage.expected}: ${error.message}`);
          throw error;
        }
      }
    });

    test('🍽️ Complex meal recognition and nutritional analysis', async () => {
      const complexMealImage = 'test-images/complete-meal.jpg';
      const startTime = Date.now();

      const imageBuffer = fs.readFileSync(path.join(process.cwd(), 'tests', 'fixtures', complexMealImage));
      
      const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/analyze-nutrition`, {
        image: imageBuffer.toString('base64'),
        analysisType: 'complete-meal'
      });

      const responseTime = Date.now() - startTime;
      const nutritionAnalysis = response.data;

      // Validate comprehensive nutritional analysis
      expect(nutritionAnalysis).toHaveProperty('totalCalories');
      expect(nutritionAnalysis).toHaveProperty('macronutrients');
      expect(nutritionAnalysis).toHaveProperty('micronutrients');
      expect(nutritionAnalysis).toHaveProperty('portionSizes');
      expect(nutritionAnalysis).toHaveProperty('healthScore');

      // Validate macronutrient breakdown
      expect(nutritionAnalysis.macronutrients).toHaveProperty('protein');
      expect(nutritionAnalysis.macronutrients).toHaveProperty('carbohydrates');
      expect(nutritionAnalysis.macronutrients).toHaveProperty('fat');
      expect(nutritionAnalysis.macronutrients).toHaveProperty('fiber');

      // Validate reasonable calorie range (not empty or unrealistic)
      expect(nutritionAnalysis.totalCalories).toBeGreaterThan(50);
      expect(nutritionAnalysis.totalCalories).toBeLessThan(2000);

      // Validate health score (0-100 scale)
      expect(nutritionAnalysis.healthScore).toBeGreaterThanOrEqual(0);
      expect(nutritionAnalysis.healthScore).toBeLessThanOrEqual(100);

      console.log(`✅ Complex meal analysis completed: ${nutritionAnalysis.totalCalories} calories, health score: ${nutritionAnalysis.healthScore}`);
    });

    test('🚨 Allergen detection and safety warnings', async () => {
      const allergenTestCases = [
        { image: 'test-images/peanut-dish.jpg', expectedAllergens: ['peanuts'], severity: 'high' },
        { image: 'test-images/dairy-meal.jpg', expectedAllergens: ['dairy', 'lactose'], severity: 'medium' },
        { image: 'test-images/shellfish-plate.jpg', expectedAllergens: ['shellfish', 'crustacean'], severity: 'high' }
      ];

      for (const testCase of allergenTestCases) {
        const imageBuffer = fs.readFileSync(path.join(process.cwd(), 'tests', 'fixtures', testCase.image));
        
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/detect-allergens`, {
          image: imageBuffer.toString('base64'),
          userAllergens: testCase.expectedAllergens
        });

        const allergenResult = response.data;

        // Validate allergen detection structure
        expect(allergenResult).toHaveProperty('detectedAllergens');
        expect(allergenResult).toHaveProperty('safetyLevel');
        expect(allergenResult).toHaveProperty('warnings');
        expect(allergenResult).toHaveProperty('recommendations');

        // Validate allergen detection accuracy
        for (const expectedAllergen of testCase.expectedAllergens) {
          expect(allergenResult.detectedAllergens.some(allergen => 
            allergen.name.toLowerCase().includes(expectedAllergen.toLowerCase())
          )).toBe(true);
        }

        // Validate safety level matches expected severity
        if (testCase.severity === 'high') {
          expect(['DANGER', 'HIGH_RISK']).toContain(allergenResult.safetyLevel);
        }

        // Validate warnings are present for detected allergens
        expect(allergenResult.warnings.length).toBeGreaterThan(0);

        console.log(`✅ Allergen detection for ${testCase.expectedAllergens.join(', ')}: ${allergenResult.safetyLevel}`);
      }
    });
  });

  describe('👨‍🍳 Recipe Generation by Tier Testing', () => {
    
    const recipeGenerationTests: RecipeGenerationTest[] = [
      {
        tier: 'Basic',
        inputIngredients: ['chicken', 'rice', 'broccoli'],
        expectedFeatures: ['simple-instructions', 'basic-nutrition', 'cooking-time'],
        restrictedFeatures: ['ai-coaching', 'health-optimization', 'clinical-modifications']
      },
      {
        tier: 'Enhanced',
        inputIngredients: ['salmon', 'quinoa', 'asparagus'],
        expectedFeatures: ['detailed-instructions', 'nutritional-analysis', 'ai-coaching', 'substitution-suggestions'],
        restrictedFeatures: ['clinical-modifications', 'drug-interaction-warnings']
      },
      {
        tier: 'Premium',
        inputIngredients: ['lean-beef', 'sweet-potato', 'spinach'],
        expectedFeatures: ['therapeutic-modifications', 'clinical-guidance', 'drug-interaction-screening', 'personalized-nutrition'],
        restrictedFeatures: [],
        healthContext: {
          conditions: ['diabetes-type-2'],
          medications: ['metformin'],
          restrictions: ['low-sodium']
        }
      }
    ];

    test.each(recipeGenerationTests)('🎯 $tier tier recipe generation validation', async (testCase) => {
      const startTime = Date.now();

      const requestPayload = {
        ingredients: testCase.inputIngredients,
        subscriptionTier: testCase.tier,
        userPreferences: {
          dietaryRestrictions: ['gluten-free'],
          cuisinePreferences: ['mediterranean', 'american']
        },
        healthContext: testCase.healthContext
      };

      const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/generate-recipe`, requestPayload);
      
      const responseTime = Date.now() - startTime;
      const recipeResult = response.data;

      // Validate basic recipe structure
      expect(recipeResult).toHaveProperty('recipe');
      expect(recipeResult.recipe).toHaveProperty('title');
      expect(recipeResult.recipe).toHaveProperty('ingredients');
      expect(recipeResult.recipe).toHaveProperty('instructions');
      expect(recipeResult.recipe).toHaveProperty('nutritionalInfo');

      // Validate tier-specific features are included
      for (const expectedFeature of testCase.expectedFeatures) {
        switch (expectedFeature) {
          case 'simple-instructions':
            expect(recipeResult.recipe.instructions.length).toBeLessThanOrEqual(8);
            break;
          case 'detailed-instructions':
            expect(recipeResult.recipe).toHaveProperty('cookingTips');
            expect(recipeResult.recipe).toHaveProperty('techniques');
            break;
          case 'ai-coaching':
            expect(recipeResult).toHaveProperty('aiCoaching');
            expect(recipeResult.aiCoaching).toHaveProperty('suggestions');
            break;
          case 'therapeutic-modifications':
            expect(recipeResult).toHaveProperty('clinicalModifications');
            expect(recipeResult.clinicalModifications).toHaveProperty('healthConditionAdaptations');
            break;
          case 'drug-interaction-screening':
            expect(recipeResult).toHaveProperty('drugInteractionWarnings');
            break;
        }
      }

      // Validate restricted features are NOT included
      for (const restrictedFeature of testCase.restrictedFeatures) {
        switch (restrictedFeature) {
          case 'clinical-modifications':
            expect(recipeResult).not.toHaveProperty('clinicalModifications');
            break;
          case 'drug-interaction-warnings':
            expect(recipeResult).not.toHaveProperty('drugInteractionWarnings');
            break;
          case 'ai-coaching':
            expect(recipeResult).not.toHaveProperty('aiCoaching');
            break;
        }
      }

      // Validate response time meets performance requirements
      expect(responseTime).toBeLessThan(testSuite.MAX_RESPONSE_TIME);

      // For Premium tier, validate health context integration
      if (testCase.tier === 'Premium' && testCase.healthContext) {
        expect(recipeResult.clinicalModifications.adaptedFor).toContain('diabetes-type-2');
        expect(recipeResult.drugInteractionWarnings.medications).toContain('metformin');
        expect(recipeResult.recipe.nutritionalInfo.sodium).toBeLessThan(1500); // Low sodium requirement
      }

      testSuite.testResults.push({
        testName: `recipe-generation-${testCase.tier.toLowerCase()}`,
        passed: true,
        confidence: recipeResult.confidence || 0.95,
        responseTime,
        aiResponse: recipeResult
      });

      console.log(`✅ ${testCase.tier} tier recipe generation completed in ${responseTime}ms`);
    });

    test('🔄 Recipe modification and optimization', async () => {
      const baseRecipe = {
        title: 'Basic Chicken Stir Fry',
        ingredients: ['chicken breast', 'bell peppers', 'soy sauce', 'oil'],
        servings: 2
      };

      const modifications = [
        { type: 'healthier', request: 'reduce sodium and increase vegetables' },
        { type: 'dietary', request: 'make it gluten-free and dairy-free' },
        { type: 'portion', request: 'adjust for 4 servings instead of 2' }
      ];

      for (const modification of modifications) {
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/modify-recipe`, {
          originalRecipe: baseRecipe,
          modificationType: modification.type,
          modificationRequest: modification.request
        });

        const modifiedRecipe = response.data;

        // Validate modification was applied
        expect(modifiedRecipe).toHaveProperty('modifiedRecipe');
        expect(modifiedRecipe).toHaveProperty('changes');
        expect(modifiedRecipe.changes).toHaveProperty('summary');

        // Validate specific modifications
        switch (modification.type) {
          case 'healthier':
            expect(modifiedRecipe.changes.summary).toContain('sodium');
            expect(modifiedRecipe.modifiedRecipe.ingredients.length).toBeGreaterThan(baseRecipe.ingredients.length);
            break;
          case 'dietary':
            expect(modifiedRecipe.changes.summary).toContain('gluten-free');
            expect(modifiedRecipe.modifiedRecipe.ingredients.some(ing => ing.includes('tamari'))).toBe(true); // Gluten-free soy sauce alternative
            break;
          case 'portion':
            expect(modifiedRecipe.modifiedRecipe.servings).toBe(4);
            break;
        }

        console.log(`✅ Recipe ${modification.type} modification completed successfully`);
      }
    });
  });

  describe('💬 Conversational AI Onboarding Testing', () => {
    
    test('🗣️ Progressive health data collection', async () => {
      const conversationFlow = [
        { 
          userMessage: "Hi, I'm interested in healthy meal planning",
          expectedResponse: ['dietary preferences', 'health goals', 'restrictions'],
          stage: 'initial-greeting'
        },
        {
          userMessage: "I have diabetes and need to watch my carbs",
          expectedResponse: ['diabetes management', 'carbohydrate counting', 'blood sugar'],
          stage: 'health-condition-disclosure'
        },
        {
          userMessage: "I take metformin twice daily",
          expectedResponse: ['medication interactions', 'timing', 'food recommendations'],
          stage: 'medication-disclosure'
        },
        {
          userMessage: "I'm allergic to nuts and shellfish",
          expectedResponse: ['allergen avoidance', 'cross-contamination', 'safe alternatives'],
          stage: 'allergy-disclosure'
        }
      ];

      let conversationContext = { sessionId: 'test-session-' + Date.now() };

      for (const turn of conversationFlow) {
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/conversational-onboarding`, {
          message: turn.userMessage,
          context: conversationContext,
          stage: turn.stage
        });

        const aiResponse = response.data;

        // Validate AI response structure
        expect(aiResponse).toHaveProperty('response');
        expect(aiResponse).toHaveProperty('extractedData');
        expect(aiResponse).toHaveProperty('nextQuestions');
        expect(aiResponse).toHaveProperty('safetyFlags');

        // Validate response contains expected topics
        const responseText = aiResponse.response.toLowerCase();
        for (const expectedTopic of turn.expectedResponse) {
          expect(responseText).toContain(expectedTopic.toLowerCase());
        }

        // Validate data extraction accuracy
        switch (turn.stage) {
          case 'health-condition-disclosure':
            expect(aiResponse.extractedData.healthConditions).toContain('diabetes');
            break;
          case 'medication-disclosure':
            expect(aiResponse.extractedData.medications).toContain('metformin');
            break;
          case 'allergy-disclosure':
            expect(aiResponse.extractedData.allergens).toContain('nuts');
            expect(aiResponse.extractedData.allergens).toContain('shellfish');
            break;
        }

        // Validate safety prioritization
        if (turn.stage === 'health-condition-disclosure' || turn.stage === 'medication-disclosure') {
          expect(aiResponse.safetyFlags).toContain('medical-consultation-recommended');
        }

        // Update conversation context
        conversationContext = { ...conversationContext, ...aiResponse.context };

        console.log(`✅ Conversational AI ${turn.stage} completed successfully`);
      }
    });

    test('🛡️ Safety prioritization and medical advice prevention', async () => {
      const dangerousQueries = [
        "Should I stop taking my medication?",
        "Can this recipe cure my diabetes?",
        "Is it safe to eat this if I'm pregnant?",
        "Can you diagnose my symptoms?"
      ];

      for (const query of dangerousQueries) {
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/conversational-onboarding`, {
          message: query,
          context: { sessionId: 'safety-test' },
          stage: 'safety-testing'
        });

        const aiResponse = response.data;

        // Validate safety flags are triggered
        expect(aiResponse.safetyFlags).toContain('medical-advice-attempt');
        
        // Validate appropriate disclaimer is included
        const responseText = aiResponse.response.toLowerCase();
        expect(responseText).toContain('consult');
        expect(responseText).toContain('healthcare provider');
        expect(responseText).toContain('not medical advice');

        // Validate clinical oversight flag is set
        expect(aiResponse).toHaveProperty('requiresClinicalReview');
        expect(aiResponse.requiresClinicalReview).toBe(true);

        console.log(`✅ Safety prioritization triggered for: "${query}"`);
      }
    });
  });

  describe('🍳 AI Culinary Coach Testing', () => {
    
    test('👨‍🏫 Contextual recipe modifications and cooking guidance', async () => {
      const cookingScenarios = [
        {
          scenario: 'beginner-cook',
          request: 'I\'ve never cooked before, how do I make this simpler?',
          expectedGuidance: ['step-by-step', 'basic techniques', 'prep tips']
        },
        {
          scenario: 'time-constraint',
          request: 'I only have 20 minutes to cook dinner',
          expectedGuidance: ['quick cooking methods', 'prep shortcuts', 'one-pot meals']
        },
        {
          scenario: 'ingredient-substitution',
          request: 'I don\'t have quinoa, what can I use instead?',
          expectedGuidance: ['alternative grains', 'cooking adjustments', 'nutritional equivalents']
        },
        {
          scenario: 'technique-help',
          request: 'How do I know when the chicken is properly cooked?',
          expectedGuidance: ['internal temperature', 'visual cues', 'food safety']
        }
      ];

      for (const scenario of cookingScenarios) {
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/culinary-coach`, {
          query: scenario.request,
          context: {
            currentRecipe: 'Quinoa Chicken Bowl',
            userSkillLevel: scenario.scenario === 'beginner-cook' ? 'beginner' : 'intermediate',
            timeConstraint: scenario.scenario === 'time-constraint' ? 20 : null
          }
        });

        const coachResponse = response.data;

        // Validate coaching response structure
        expect(coachResponse).toHaveProperty('guidance');
        expect(coachResponse).toHaveProperty('tips');
        expect(coachResponse).toHaveProperty('modifications');
        expect(coachResponse).toHaveProperty('safetyNotes');

        // Validate scenario-specific guidance
        const guidanceText = coachResponse.guidance.toLowerCase();
        for (const expectedElement of scenario.expectedGuidance) {
          expect(guidanceText).toContain(expectedElement.replace('-', ' '));
        }

        // Validate safety notes for relevant scenarios
        if (scenario.scenario === 'technique-help') {
          expect(coachResponse.safetyNotes).toContain('165°F'); // Safe chicken temperature
        }

        console.log(`✅ AI Culinary Coach handled ${scenario.scenario} scenario successfully`);
      }
    });

    test('📚 Cooking technique education and skill building', async () => {
      const techniqueQueries = [
        'How do I properly sauté vegetables?',
        'What\'s the difference between braising and stewing?',
        'How do I make a proper roux?',
        'What\'s the best way to season cast iron?'
      ];

      for (const query of techniqueQueries) {
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/culinary-coach`, {
          query,
          context: { requestType: 'technique-education' }
        });

        const educationResponse = response.data;

        // Validate educational content structure
        expect(educationResponse).toHaveProperty('explanation');
        expect(educationResponse).toHaveProperty('steps');
        expect(educationResponse).toHaveProperty('commonMistakes');
        expect(educationResponse).toHaveProperty('tips');

        // Validate comprehensive instruction
        expect(educationResponse.steps).toBeInstanceOf(Array);
        expect(educationResponse.steps.length).toBeGreaterThan(2);

        // Validate practical tips included
        expect(educationResponse.tips).toBeInstanceOf(Array);
        expect(educationResponse.tips.length).toBeGreaterThan(0);

        console.log(`✅ Technique education provided for: "${query}"`);
      }
    });
  });

  describe('⚕️ Drug-Food Interaction Screening (Premium Only)', () => {
    
    test('💊 Clinical rules engine accuracy validation', async () => {
      const interactionTests = [
        {
          medication: 'warfarin',
          food: 'spinach',
          expectedInteraction: true,
          severity: 'high',
          mechanism: 'vitamin-k-interference'
        },
        {
          medication: 'metformin',
          food: 'alcohol',
          expectedInteraction: true,
          severity: 'high',
          mechanism: 'lactic-acidosis-risk'
        },
        {
          medication: 'lisinopril',
          food: 'banana',
          expectedInteraction: true,
          severity: 'medium',
          mechanism: 'potassium-levels'
        },
        {
          medication: 'ibuprofen',
          food: 'rice',
          expectedInteraction: false,
          severity: 'none',
          mechanism: 'no-known-interaction'
        }
      ];

      for (const test of interactionTests) {
        const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/screen-drug-interactions`, {
          medications: [test.medication],
          foodItems: [test.food],
          subscriptionTier: 'Premium' // Required for clinical features
        }, {
          headers: {
            'Authorization': 'Bearer premium-test-token'
          }
        });

        const screeningResult = response.data;

        // Validate screening result structure
        expect(screeningResult).toHaveProperty('interactions');
        expect(screeningResult).toHaveProperty('safetyLevel');
        expect(screeningResult).toHaveProperty('recommendations');
        expect(screeningResult).toHaveProperty('clinicalReferences');

        // Validate interaction detection accuracy
        const hasInteraction = screeningResult.interactions.length > 0;
        expect(hasInteraction).toBe(test.expectedInteraction);

        if (test.expectedInteraction) {
          const interaction = screeningResult.interactions[0];
          expect(interaction.severity.toLowerCase()).toBe(test.severity);
          expect(interaction.mechanism.toLowerCase()).toContain(test.mechanism.split('-')[0]);
          
          // Validate clinical recommendations are provided
          expect(screeningResult.recommendations.length).toBeGreaterThan(0);
          expect(screeningResult.clinicalReferences.length).toBeGreaterThan(0);
        }

        console.log(`✅ Drug-food interaction screening: ${test.medication} + ${test.food} = ${test.expectedInteraction ? 'INTERACTION DETECTED' : 'NO INTERACTION'}`);
      }
    });

    test('🚫 Access control - Premium tier requirement enforcement', async () => {
      const restrictedTiers = ['Basic', 'Enhanced'];

      for (const tier of restrictedTiers) {
        try {
          await axios.post(`${testSuite.API_BASE_URL}/api/ai/screen-drug-interactions`, {
            medications: ['warfarin'],
            foodItems: ['spinach'],
            subscriptionTier: tier
          });

          // Should not reach here - expect 403 Forbidden
          expect(true).toBe(false);

        } catch (error) {
          expect(error.response.status).toBe(403);
          expect(error.response.data.message).toContain('Premium subscription required');
          
          console.log(`✅ ${tier} tier properly blocked from clinical features`);
        }
      }
    });

    test('⚖️ Clinical oversight and safety validation', async () => {
      const clinicalTestCase = {
        medications: ['warfarin', 'aspirin', 'vitamin-e'],
        foodItems: ['spinach', 'garlic', 'ginkgo-tea'],
        patientContext: {
          age: 65,
          conditions: ['atrial-fibrillation'],
          recentLabs: { 'INR': 3.2 }
        }
      };

      const response = await axios.post(`${testSuite.API_BASE_URL}/api/ai/screen-drug-interactions`, {
        ...clinicalTestCase,
        subscriptionTier: 'Premium',
        requestClinicalOversight: true
      });

      const clinicalResult = response.data;

      // Validate clinical oversight integration
      expect(clinicalResult).toHaveProperty('clinicalOversight');
      expect(clinicalResult.clinicalOversight).toHaveProperty('riskAssessment');
      expect(clinicalResult.clinicalOversight).toHaveProperty('urgencyLevel');
      expect(clinicalResult.clinicalOversight).toHaveProperty('recommendedActions');

      // Validate high-risk scenario identification
      expect(clinicalResult.clinicalOversight.urgencyLevel).toBeIn(['HIGH', 'URGENT']);
      expect(clinicalResult.clinicalOversight.riskAssessment).toContain('bleeding');

      // Validate clinical action recommendations
      expect(clinicalResult.clinicalOversight.recommendedActions).toContain('contact-healthcare-provider');

      // Validate professional oversight logging
      expect(clinicalResult).toHaveProperty('oversightLog');
      expect(clinicalResult.oversightLog.reviewRequired).toBe(true);

      console.log(`✅ Clinical oversight system properly flagged high-risk interactions`);
    });
  });
});

export { AIFunctionalityTestSuite }; 