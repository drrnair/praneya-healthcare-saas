import { GoogleGenerativeAI, GenerativeModel, SafetySetting, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export interface GoogleAIConfig {
  apiKey: string;
  projectId: string;
  location: string;
  model: string;
  temperature: number;
  maxTokens: number;
  safetyThreshold: string;
}

export interface HealthcarePromptRequest {
  prompt: string;
  healthContext?: {
    conditions?: string[];
    medications?: string[];
    allergies?: string[];
    dietaryRestrictions?: string[];
  };
  userId?: string;
  clinicalContext?: boolean;
}

export interface AIHealthcareResponse {
  content: string;
  safetyRatings: any[];
  containsmedicalAdvice: boolean;
  clinicalFlags: string[];
  nutritionalGuidance: boolean;
  confidence: number;
  disclaimer: string;
}

export class GoogleAIClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private config: GoogleAIConfig;
  private safetySettings: SafetySetting[];

  constructor(config: GoogleAIConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    
    // Configure safety settings for healthcare
    this.safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    this.model = this.genAI.getGenerativeModel({
      model: config.model,
      safetySettings: this.safetySettings,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
    });
  }

  /**
   * Generate healthcare-appropriate content with clinical oversight
   */
  async generateHealthcareContent(request: HealthcarePromptRequest): Promise<AIHealthcareResponse> {
    try {
      // Build clinical-safe prompt
      const clinicalPrompt = this.buildClinicalPrompt(request);
      
      // Generate content
      const result = await this.model.generateContent(clinicalPrompt);
      const response = await result.response;
      const text = response.text();

      // Analyze response for clinical safety
      const safetyAnalysis = this.analyzeClinicalSafety(text, request.healthContext);

      return {
        content: text,
        safetyRatings: response.candidates?.[0]?.safetyRatings || [],
        containsmedicalAdvice: safetyAnalysis.containsmedicalAdvice,
        clinicalFlags: safetyAnalysis.flags,
        nutritionalGuidance: safetyAnalysis.nutritionalGuidance,
        confidence: safetyAnalysis.confidence,
        disclaimer: this.generateHealthcareDisclaimer()
      };
    } catch (error) {
      console.error('❌ Google AI generation failed:', error);
      throw new Error(`AI content generation failed: ${error.message}`);
    }
  }

  /**
   * Generate personalized recipe recommendations
   */
  async generateRecipeRecommendation(request: HealthcarePromptRequest): Promise<AIHealthcareResponse> {
    const recipePrompt = {
      ...request,
      prompt: `Generate a healthy recipe recommendation based on the following:

Health Context:
- Health Conditions: ${request.healthContext?.conditions?.join(', ') || 'None specified'}
- Dietary Restrictions: ${request.healthContext?.dietaryRestrictions?.join(', ') || 'None'}
- Known Allergies: ${request.healthContext?.allergies?.join(', ') || 'None'}

Request: ${request.prompt}

IMPORTANT GUIDELINES:
- Focus on nutritional benefits and ingredient safety
- Include preparation instructions and nutritional highlights  
- Do NOT provide medical advice or treatment recommendations
- Include appropriate disclaimers about consulting healthcare providers
- Suggest modifications for different dietary needs

Format your response as a structured recipe with:
1. Recipe name
2. Ingredients list
3. Preparation steps
4. Nutritional highlights
5. Health considerations
6. Healthcare disclaimer`
    };

    return this.generateHealthcareContent(recipePrompt);
  }

  /**
   * Analyze nutrition information with health context
   */
  async analyzeNutritionData(nutritionData: any, healthContext?: any): Promise<AIHealthcareResponse> {
    const analysisPrompt: HealthcarePromptRequest = {
      prompt: `Analyze the following nutrition data and provide insights:

Nutrition Data: ${JSON.stringify(nutritionData, null, 2)}

Health Context: ${JSON.stringify(healthContext, null, 2)}

Provide:
1. Key nutritional highlights
2. Health considerations for the given context
3. Suggestions for balanced nutrition
4. Any flags or concerns to be aware of

IMPORTANT: Focus on educational nutrition information. Do not provide medical advice.`,
      healthContext,
      clinicalContext: true
    };

    return this.generateHealthcareContent(analysisPrompt);
  }

  /**
   * Build clinical-safe prompts with healthcare context
   */
  private buildClinicalPrompt(request: HealthcarePromptRequest): string {
    let prompt = `You are a healthcare nutrition assistant. Your role is to provide evidence-based nutritional guidance while being mindful of patient safety.

CRITICAL GUIDELINES:
- NEVER provide medical advice, diagnoses, or treatment recommendations
- NEVER suggest stopping, starting, or changing medications
- ALWAYS include appropriate disclaimers about consulting healthcare providers
- Focus on nutritional education and general wellness information
- Be mindful of food-drug interactions when health conditions are mentioned

`;

    if (request.healthContext) {
      prompt += `HEALTH CONTEXT (for consideration only, not for medical advice):
`;
      if (request.healthContext.conditions?.length) {
        prompt += `- Health Conditions: ${request.healthContext.conditions.join(', ')}\n`;
      }
      if (request.healthContext.medications?.length) {
        prompt += `- Medications: ${request.healthContext.medications.join(', ')}\n`;
      }
      if (request.healthContext.allergies?.length) {
        prompt += `- Allergies: ${request.healthContext.allergies.join(', ')}\n`;
      }
      if (request.healthContext.dietaryRestrictions?.length) {
        prompt += `- Dietary Restrictions: ${request.healthContext.dietaryRestrictions.join(', ')}\n`;
      }
      prompt += `\n`;
    }

    prompt += `USER REQUEST:
${request.prompt}

Please provide helpful, safe, and educational nutrition information while following all guidelines above.`;

    return prompt;
  }

  /**
   * Analyze response for clinical safety flags
   */
  private analyzeClinicalSafety(text: string, healthContext?: any) {
    const flags: string[] = [];
    let containsmedicalAdvice = false;
    let nutritionalGuidance = false;
    let confidence = 0.8;

    // Check for medical advice indicators
    const medicalAdvicePatterns = [
      /take this medication/i,
      /stop taking/i,
      /start taking/i,
      /cure/i,
      /treat your/i,
      /diagnose/i,
      /you have/i,
      /medical treatment/i
    ];

    for (const pattern of medicalAdvicePatterns) {
      if (pattern.test(text)) {
        containsmedicalAdvice = true;
        flags.push('potential_medical_advice');
        break;
      }
    }

    // Check for nutritional guidance
    const nutritionPatterns = [
      /nutrients/i,
      /vitamins/i,
      /minerals/i,
      /calories/i,
      /protein/i,
      /carbohydrates/i,
      /healthy eating/i,
      /balanced diet/i
    ];

    for (const pattern of nutritionPatterns) {
      if (pattern.test(text)) {
        nutritionalGuidance = true;
        break;
      }
    }

    // Check for appropriate disclaimers
    if (!/consult.*healthcare/i.test(text) && healthContext) {
      flags.push('missing_healthcare_disclaimer');
    }

    return {
      flags,
      containsmedicalAdvice,
      nutritionalGuidance,
      confidence
    };
  }

  /**
   * Generate healthcare-appropriate disclaimer
   */
  private generateHealthcareDisclaimer(): string {
    return "This information is for educational purposes only and should not replace professional medical advice. Always consult with your healthcare provider before making significant dietary changes, especially if you have health conditions or take medications.";
  }

  /**
   * Health check for Google AI service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const testResult = await this.model.generateContent("Hello, please respond with 'OK' to confirm the service is working.");
      const response = await testResult.response;
      const text = response.text();
      return text.toLowerCase().includes('ok') || text.toLowerCase().includes('working');
    } catch (error) {
      console.error('Google AI health check failed:', error);
      return false;
    }
  }

  /**
   * Check if client is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.apiKey && 
              this.config.apiKey !== 'your-gemini-api-key' &&
              this.config.projectId &&
              this.config.projectId !== 'your-gcp-project-id');
  }
}

// Default export
export default GoogleAIClient; 