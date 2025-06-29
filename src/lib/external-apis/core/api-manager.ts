import { SupabaseClient } from '../clients/supabase-client';
import { HealthcareStripeClient } from '../clients/stripe-client';
import { EdamamClient } from '../../edamam/api-client';
import { GoogleAIClient } from '../clients/google-ai-client';
import { CacheManager } from './cache-manager';
import { RateLimiter } from './rate-limiter';
import { CostTracker } from './cost-tracker';

class ApiManager {
  private supabaseClient: SupabaseClient;
  private stripeClient: HealthcareStripeClient;
  private edamamClient: EdamamClient;
  private googleAIClient: GoogleAIClient;
  private cacheManager: CacheManager;
  private rateLimiter: RateLimiter;
  private costTracker: CostTracker;
  private initialized = false;

  constructor() {
    // Initialize immediately but handle async properly
    this.initializeClients().catch(console.error);
  }

  private async initializeClients(): Promise<void> {
    try {
      // Initialize cache and utilities first
      this.cacheManager = new CacheManager();
      this.rateLimiter = new RateLimiter();
      this.costTracker = new CostTracker();

      // Initialize API clients
          this.supabaseClient = new SupabaseClient({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceKey: process.env.SUPABASE_SERVICE_KEY,
    });

      this.stripeClient = new HealthcareStripeClient({
        secretKey: process.env.STRIPE_SECRET_KEY!,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
        healthcareProductId: process.env.STRIPE_HEALTHCARE_PRODUCT_ID!,
        gracePeriodDays: parseInt(process.env.BILLING_GRACE_PERIOD_DAYS || "7"),
        criticalAccessEnabled: process.env.BILLING_CRITICAL_ACCESS_ENABLED === "true",
      });
      this.edamamClient = new EdamamClient({
        appId: process.env.EDAMAM_APP_ID!,
        appKey: process.env.EDAMAM_APP_KEY!,
        recipeAppId: process.env.EDAMAM_RECIPE_APP_ID!,
        recipeAppKey: process.env.EDAMAM_RECIPE_APP_KEY!,
        nutritionAppId: process.env.EDAMAM_NUTRITION_APP_ID!,
        nutritionAppKey: process.env.EDAMAM_NUTRITION_APP_KEY!,
        baseURL: 'https://api.edamam.com',
        rateLimitPerMinute: parseInt(process.env.EDAMAM_RATE_LIMIT_PER_MINUTE || '10')
      });

      this.googleAIClient = new GoogleAIClient({
        apiKey: process.env.GOOGLE_AI_API_KEY!,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID!,
        location: process.env.GOOGLE_CLOUD_LOCATION!,
        model: process.env.MED_GEMINI_MODEL!,
        temperature: parseFloat(process.env.MED_GEMINI_TEMPERATURE || '0.1'),
        maxTokens: parseInt(process.env.MED_GEMINI_MAX_TOKENS || '1000'),
        safetyThreshold: process.env.MED_GEMINI_SAFETY_THRESHOLD!
      });

      this.initialized = true;
      console.log('✅ External API Manager initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize External API Manager:', error);
      throw error;
    }
  }

  // Getters for individual clients
  get supabase() {
    if (!this.initialized) throw new Error('APIManager not initialized');
    return this.supabaseClient;
  }

  get stripe() {
    if (!this.initialized) throw new Error('APIManager not initialized');
    return this.stripeClient;
  }

  get edamam() {
    if (!this.initialized) throw new Error('APIManager not initialized');
    return this.edamamClient;
  }

  get googleAI() {
    if (!this.initialized) throw new Error('APIManager not initialized');
    return this.googleAIClient;
  }

  get cache() {
    return this.cacheManager;
  }

  get limiter() {
    return this.rateLimiter;
  }

  get costs() {
    return this.costTracker;
  }

  // Health check for all external APIs
  async performHealthCheck() {
    const results = {
      supabase: 'unhealthy' as 'healthy' | 'degraded' | 'unhealthy',
      stripe: 'unhealthy' as 'healthy' | 'degraded' | 'unhealthy',
      edamam: 'unhealthy' as 'healthy' | 'degraded' | 'unhealthy',
      googleAI: 'unhealthy' as 'healthy' | 'degraded' | 'unhealthy',
      overall: 'unhealthy' as 'healthy' | 'degraded' | 'unhealthy',
      lastChecked: new Date()
    };

    try {
      // Check Supabase
      const supabaseHealth = await this.supabaseClient.healthCheck();
      results.supabase = supabaseHealth ? 'healthy' : 'unhealthy';
    } catch (error) {
      console.error('Supabase health check failed:', error);
      results.supabase = 'unhealthy';
    }

    try {
      // Check Stripe
      const stripeHealth = await this.stripeClient.healthCheck();
      results.stripe = stripeHealth ? 'healthy' : 'unhealthy';
    } catch (error) {
      console.error('Stripe health check failed:', error);
      results.stripe = 'unhealthy';
    }

    try {
      // Check Edamam
      const edamamHealth = await this.edamamClient.healthCheck();
      results.edamam = edamamHealth ? 'healthy' : 'unhealthy';
    } catch (error) {
      console.error('Edamam health check failed:', error);
      results.edamam = 'unhealthy';
    }

    try {
      // Check Google AI
      const googleAIHealth = await this.googleAIClient.healthCheck();
      results.googleAI = googleAIHealth ? 'healthy' : 'unhealthy';
    } catch (error) {
      console.error('Google AI health check failed:', error);
      results.googleAI = 'unhealthy';
    }

    // Determine overall health
    const healthyServices = Object.values(results).filter(status => status === 'healthy').length - 1; // -1 for lastChecked
    if (healthyServices === 4) {
      results.overall = 'healthy';
    } else if (healthyServices >= 2) {
      results.overall = 'degraded';
    } else {
      results.overall = 'unhealthy';
    }

    return results;
  }
}

// Export both named and default exports for flexibility
export { ApiManager };
export default ApiManager;