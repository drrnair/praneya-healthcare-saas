import { NextRequest, NextResponse } from "next/server";
import { GoogleAIClient } from "@/lib/external-apis/clients/google-ai-client";

// Initialize Google AI client
const getGoogleAIClient = () => {
  return new GoogleAIClient({
    apiKey: process.env.GOOGLE_AI_API_KEY!,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'default',
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    model: process.env.MED_GEMINI_MODEL || 'gemini-pro',
    temperature: parseFloat(process.env.MED_GEMINI_TEMPERATURE || '0.1'),
    maxTokens: parseInt(process.env.MED_GEMINI_MAX_TOKENS || '1000'),
    safetyThreshold: process.env.MED_GEMINI_SAFETY_THRESHOLD || 'BLOCK_MEDIUM_AND_ABOVE'
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt, 
      healthContext,
      userId = "anonymous" 
    } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Initialize Google AI client
    const googleAI = getGoogleAIClient();
    
    // Check if Google AI is configured
    if (!googleAI.isConfigured()) {
      return NextResponse.json(
        { 
          error: "Google AI is not configured",
          setup: "Please add GOOGLE_AI_API_KEY to your environment variables"
        },
        { status: 503 }
      );
    }

    // Generate recipe using Google AI
    const recipeResponse = await googleAI.generateRecipeRecommendation({
      prompt,
      healthContext,
      userId,
      clinicalContext: true
    });

    return NextResponse.json({
      success: true,
      recipe: recipeResponse,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Recipe generation failed:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate recipe",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "AI Recipe Generation",
    method: "POST",
    description: "Generate personalized recipes using Google AI with healthcare context",
    required_fields: ["prompt"],
    optional_fields: ["healthContext", "userId"],
    example: {
      prompt: "I want a heart-healthy dinner recipe",
      healthContext: {
        conditions: ["hypertension"],
        dietaryRestrictions: ["low-sodium"],
        allergies: ["nuts"]
      }
    }
  });
} 