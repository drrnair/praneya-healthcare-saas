import { NextResponse } from "next/server";
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
  try {
    // Initialize Google AI client
    const googleAI = getGoogleAIClient();
    
    // Check Google AI specifically
    const googleAIConfigured = googleAI?.isConfigured() || false;
    let googleAIHealthy = false;
    
    if (googleAI && googleAIConfigured) {
      try {
        googleAIHealthy = await googleAI.healthCheck();
      } catch (error) {
        console.error('Google AI health check failed:', error);
        googleAIHealthy = false;
      }
    }

    const overallStatus = googleAIConfigured && googleAIHealthy ? 'healthy' : 'degraded';

    return NextResponse.json({
      status: overallStatus,
      services: {
        googleAI: {
          status: googleAIHealthy ? 'healthy' : (googleAIConfigured ? 'degraded' : 'unhealthy'),
          configured: googleAIConfigured,
          ready: googleAIConfigured && googleAIHealthy
        }
      },
      ai_endpoints: {
        recipe_generation: "/api/ai/generate-recipe",
        nutrition_analysis: "/api/ai/analyze-nutrition", 
        healthcare_chat: "/api/ai/healthcare-chat"
      },
      environment: {
        google_ai_configured: !!process.env.GOOGLE_AI_API_KEY && process.env.GOOGLE_AI_API_KEY !== "your-gemini-api-key",
        med_gemini_model: process.env.MED_GEMINI_MODEL || "gemini-pro",
        safety_threshold: process.env.MED_GEMINI_SAFETY_THRESHOLD || "BLOCK_MEDIUM_AND_ABOVE"
      },
      last_checked: new Date(),
      uptime: process.uptime()
    });

  } catch (error) {
    console.error("❌ Health check failed:", error);
    
    return NextResponse.json(
      { 
        status: "unhealthy",
        error: "Health check failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 