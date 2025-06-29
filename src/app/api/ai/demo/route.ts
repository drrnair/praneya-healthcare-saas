import { NextRequest, NextResponse } from "next/server";
import { GoogleAIClient } from "@/lib/external-apis/clients/google-ai-client";

// Initialize Google AI client
const getGoogleAIClient = () => {
  try {
    return new GoogleAIClient({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'default',
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
      model: process.env.MED_GEMINI_MODEL || 'gemini-pro',
      temperature: parseFloat(process.env.MED_GEMINI_TEMPERATURE || '0.1'),
      maxTokens: parseInt(process.env.MED_GEMINI_MAX_TOKENS || '1000'),
      safetyThreshold: process.env.MED_GEMINI_SAFETY_THRESHOLD || 'BLOCK_MEDIUM_AND_ABOVE'
    });
  } catch (error) {
    return null;
  }
};

export async function GET() {
  const googleAI = getGoogleAIClient();
  const isConfigured = googleAI?.isConfigured() || false;

  return NextResponse.json({
    title: "🤖 Google AI Healthcare Demo",
    description: "Comprehensive demo of AI-powered healthcare features",
    status: isConfigured ? "ready" : "needs_configuration",
    
    setup_instructions: !isConfigured ? {
      step_1: "Get API key from https://aistudio.google.com/app/apikey",
      step_2: "Add GOOGLE_AI_API_KEY=your_key_here to .env.local",
      step_3: "Restart development server",
      step_4: "Refresh this page to see green status"
    } : null,

    available_endpoints: {
      recipe_generation: {
        url: "/api/ai/generate-recipe",
        method: "POST",
        description: "Generate personalized recipes with health context",
        example_request: {
          prompt: "A heart-healthy dinner for someone with diabetes",
          healthContext: {
            conditions: ["diabetes", "hypertension"],
            dietaryRestrictions: ["low-sodium", "low-sugar"],
            allergies: ["nuts"],
            medications: ["metformin"]
          }
        }
      },
      
      nutrition_analysis: {
        url: "/api/ai/analyze-nutrition",
        method: "POST", 
        description: "Analyze nutrition data with health insights",
        example_request: {
          nutritionData: {
            calories: 350,
            protein: 25,
            carbs: 45,
            fat: 12,
            fiber: 8,
            sodium: 480
          },
          healthContext: {
            conditions: ["diabetes"],
            medications: ["metformin"]
          }
        }
      },
      
      healthcare_chat: {
        url: "/api/ai/healthcare-chat",
        method: "POST",
        description: "Chat about health and nutrition topics",
        example_request: {
          prompt: "What foods should I avoid with high blood pressure?",
          healthContext: {
            conditions: ["hypertension"],
            medications: ["lisinopril"]
          }
        }
      }
    },

    safety_features: {
      clinical_oversight: "Blocks medical advice and treatment recommendations",
      healthcare_context: "Considers user's health conditions and medications",
      safety_filtering: "Google AI safety settings prevent harmful content",
      hipaa_compliance: "Designed for healthcare data protection",
      audit_logging: "All AI interactions are logged for compliance"
    },

    demo_scenarios: [
      {
        name: "Heart-Healthy Recipe",
        description: "Generate a recipe for someone with cardiovascular concerns",
        endpoint: "/api/ai/generate-recipe",
        sample_data: {
          prompt: "A delicious heart-healthy dinner recipe that's low in sodium and saturated fat",
          healthContext: {
            conditions: ["hypertension", "high cholesterol"],
            dietaryRestrictions: ["low-sodium", "heart-healthy"],
            allergies: []
          }
        }
      },
      
      {
        name: "Diabetic Meal Analysis", 
        description: "Analyze a meal's nutritional impact for diabetes management",
        endpoint: "/api/ai/analyze-nutrition",
        sample_data: {
          nutritionData: {
            calories: 400,
            protein: 30,
            carbs: 45,
            fat: 15,
            fiber: 8,
            sodium: 600,
            sugar: 12
          },
          healthContext: {
            conditions: ["type-2-diabetes"],
            medications: ["metformin", "insulin"]
          }
        }
      },
      
      {
        name: "Food Allergy Guidance",
        description: "Get advice on managing food allergies",
        endpoint: "/api/ai/healthcare-chat",
        sample_data: {
          prompt: "I have a severe peanut allergy. What should I look for on food labels?",
          healthContext: {
            allergies: ["peanuts", "tree nuts"],
            conditions: []
          }
        }
      }
    ],

    test_with_curl: {
      health_check: `curl -X GET ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/health-check`,
      recipe_generation: `curl -X POST ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/generate-recipe \\
  -H "Content-Type: application/json" \\
  -d '{"prompt":"A healthy breakfast recipe","healthContext":{"conditions":["diabetes"]}}'`,
      nutrition_analysis: `curl -X POST ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/analyze-nutrition \\
  -H "Content-Type: application/json" \\
  -d '{"nutritionData":{"calories":300,"protein":20,"carbs":30,"fat":10}}'`
    },

    environment_check: {
      google_ai_api_key: !!process.env.GOOGLE_AI_API_KEY,
      api_key_valid: process.env.GOOGLE_AI_API_KEY !== "your-gemini-api-key",
      model: process.env.MED_GEMINI_MODEL || "gemini-pro",
      temperature: process.env.MED_GEMINI_TEMPERATURE || "0.1",
      max_tokens: process.env.MED_GEMINI_MAX_TOKENS || "1000",
      safety_threshold: process.env.MED_GEMINI_SAFETY_THRESHOLD || "BLOCK_MEDIUM_AND_ABOVE"
    }
  });
}

export async function POST(request: NextRequest) {
  const googleAI = getGoogleAIClient();
  
  if (!googleAI?.isConfigured()) {
    return NextResponse.json(
      { 
        error: "Google AI is not configured",
        setup: "Please add GOOGLE_AI_API_KEY to your environment variables"
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { demo_type, ...params } = body;

    switch (demo_type) {
      case 'recipe': {
        const recipeResponse = await googleAI.generateRecipeRecommendation(params);
        return NextResponse.json({
          demo_type: 'recipe',
          success: true,
          result: recipeResponse
        });
      }

      case 'nutrition': {
        const nutritionResponse = await googleAI.analyzeNutritionData(
          params.nutritionData,
          params.healthContext
        );
        return NextResponse.json({
          demo_type: 'nutrition',
          success: true,
          result: nutritionResponse
        });
      }

      case 'chat': {
        const chatResponse = await googleAI.generateHealthcareContent(params);
        return NextResponse.json({
          demo_type: 'chat',
          success: true,
          result: chatResponse
        });
      }

      case 'analyze-nutrition': {
        const nutritionAnalysis = await googleAI.analyzeNutritionData(
          params.nutritionData,
          params.healthContext
        );
        return NextResponse.json(nutritionAnalysis);
      }

      case 'generate-recipe': {
        const recipe = await googleAI.generateRecipeRecommendation(params);
        return NextResponse.json(recipe);
      }

      case 'health-advice': {
        const advice = await googleAI.generateHealthcareContent(params);
        return NextResponse.json(advice);
      }

      default:
        return NextResponse.json(
          { error: "Invalid demo_type. Use 'recipe', 'nutrition', 'chat', 'analyze-nutrition', 'generate-recipe', or 'health-advice'" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("❌ Demo request failed:", error);
    
    return NextResponse.json(
      { 
        error: "Demo request failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 