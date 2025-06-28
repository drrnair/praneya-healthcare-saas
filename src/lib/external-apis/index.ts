// ===========================================
// PRANEYA HEALTHCARE - EXTERNAL API MANAGEMENT
// ===========================================
// Centralized management for all external API integrations
// Includes Firebase Auth, Stripe, Edamam Nutrition, Google AI

export * from './clients/supabase-client';
export * from './clients/stripe-client';
export * from './clients/edamam-client';
export * from './clients/google-ai-client';
export * from './core/api-manager';
export * from './core/rate-limiter';
export * from './core/cache-manager';
export * from './core/cost-tracker';
export * from './types/api-types';
export * from './utils/api-utils';

// Main API Manager - Central coordinator for all external APIs
import { APIManager } from './core/api-manager';

// Export singleton instance for application use
export const apiManager = new APIManager();

// Health check endpoint data
export interface ExternalAPIHealth {
  supabase: 'healthy' | 'degraded' | 'unhealthy';
  stripe: 'healthy' | 'degraded' | 'unhealthy';
  edamam: 'healthy' | 'degraded' | 'unhealthy';
  googleAI: 'healthy' | 'degraded' | 'unhealthy';
  overall: 'healthy' | 'degraded' | 'unhealthy';
  lastChecked: Date;
}

// Quick health check function
export async function checkExternalAPIHealth(): Promise<ExternalAPIHealth> {
  try {
    const results = await apiManager.performHealthCheck();
    return results;
  } catch (error) {
    console.error('External API health check failed:', error);
    return {
      supabase: 'unhealthy',
      stripe: 'unhealthy', 
      edamam: 'unhealthy',
      googleAI: 'unhealthy',
      overall: 'unhealthy',
      lastChecked: new Date()
    };
  }
} 