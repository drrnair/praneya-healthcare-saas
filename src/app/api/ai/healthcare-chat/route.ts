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
      userId = "anonymous",
      conversationHistory = []
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

    // Build contextual prompt with conversation history
    const contextualPrompt = conversationHistory.length > 0 
      ? `Previous conversation:\n${conversationHistory.map((msg: any) => 
          `${msg.role}: ${msg.content}`
        ).join('\n')}\n\nCurrent question: ${prompt}`
      : prompt;

    // Generate healthcare response using Google AI
    const healthcareResponse = await googleAI.generateHealthcareContent({
      prompt: contextualPrompt,
      healthContext,
      userId,
      clinicalContext: true
    });

    return NextResponse.json({
      success: true,
      response: healthcareResponse,
      conversation_id: `conv_${userId}_${Date.now()}`,
      responded_at: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Healthcare chat failed:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate healthcare response",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "AI Healthcare Chat",
    method: "POST", 
    description: "Chat with Google AI about healthcare and nutrition topics",
    required_fields: ["prompt"],
    optional_fields: ["healthContext", "userId", "conversationHistory"],
    example: {
      prompt: "What foods should I avoid with high blood pressure?",
      healthContext: {
        conditions: ["hypertension"],
        medications: ["lisinopril"],
        dietaryRestrictions: ["low-sodium"]
      },
      conversationHistory: [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi! How can I help with your nutrition questions?" }
      ]
    }
  });
} 