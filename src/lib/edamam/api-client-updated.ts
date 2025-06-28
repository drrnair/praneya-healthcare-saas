/**
 * Praneya Healthcare - Edamam API Client
 * Recipe Search and Meal Planner API with User Management
 * WORKING VERSION - Uses user header pattern
 */

interface EdamamConfig {
  appId: string;
  appKey: string;
  userId: string;
  baseUrl?: string;
}

interface RecipeSearchParams {
  query: string;
  healthFilters?: string[];
  from?: number;
  to?: number;
  mealType?: string[];
  dishType?: string[];
  cuisineType?: string[];
  diet?: string[];
}

interface EdamamRecipe {
  uri: string;
  label: string;
  image?: string;
  source: string;
  url: string;
  yield: number;
  calories: number;
  totalTime?: number;
  healthLabels: string[];
  cautions: string[];
  ingredients: Array<{
    text: string;
    quantity: number;
    measure: string;
    food: string;
    weight: number;
  }>;
  totalNutrients: Record<string, {
    label: string;
    quantity: number;
    unit: string;
  }>;
}

interface EdamamResponse {
  from: number;
  to: number;
  count: number;
  _links: {
    next?: { href: string; title: string; };
  };
  hits: Array<{
    recipe: EdamamRecipe;
  }>;
}

export class EdamamAPIClient {
  private config: EdamamConfig;

  constructor(config: EdamamConfig) {
    this.config = {
      baseUrl: 'https://api.edamam.com/api/recipes/v2',
      ...config
    };
  }

  /**
   * Search for recipes with healthcare-specific filtering
   * CRITICAL: Must include Edamam-Account-User header
   */
  async searchRecipes(params: RecipeSearchParams): Promise<EdamamResponse> {
    const url = this.buildSearchUrl(params);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Edamam-Account-User': this.config.userId, // REQUIRED!
          'Content-Type': 'application/json',
          'User-Agent': 'Praneya-Healthcare/1.0',
        }
      });

      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Edamam API request failed:', error);
      throw error;
    }
  }

  /**
   * Healthcare-specific search presets
   */
  async searchForDiabetes(query: string = 'healthy meals'): Promise<EdamamResponse> {
    return this.searchRecipes({
      query,
      healthFilters: ['diabetic-friendly', 'low-sugar'],
      diet: ['low-carb']
    });
  }

  async searchForHeartHealth(query: string = 'heart healthy'): Promise<EdamamResponse> {
    return this.searchRecipes({
      query,
      healthFilters: ['heart-healthy', 'low-sodium'],
      diet: ['low-fat']
    });
  }

  async searchForRenalDiet(query: string = 'kidney friendly'): Promise<EdamamResponse> {
    return this.searchRecipes({
      query,
      healthFilters: ['kidney-friendly', 'low-potassium', 'low-sodium']
    });
  }

  /**
   * Clinical analysis helpers
   */
  static analyzeRecipeForClinicalFlags(recipe: EdamamRecipe): string[] {
    const flags: string[] = [];
    const caloriesPerServing = recipe.calories / recipe.yield;
    
    if (caloriesPerServing > 600) flags.push('High Calorie');
    
    const sodium = recipe.totalNutrients?.NA?.quantity || 0;
    if (sodium > 1000) flags.push('High Sodium');
    
    const sugar = recipe.totalNutrients?.SUGAR?.quantity || 0;
    if (sugar > 25) flags.push('High Sugar');
    
    return flags;
  }

  private buildSearchUrl(params: RecipeSearchParams): string {
    const url = new URL(this.config.baseUrl!);
    
    url.searchParams.set('type', 'public');
    url.searchParams.set('q', params.query);
    url.searchParams.set('app_id', this.config.appId);
    url.searchParams.set('app_key', this.config.appKey);
    url.searchParams.set('from', (params.from || 0).toString());
    url.searchParams.set('to', (params.to || 20).toString());
    
    if (params.healthFilters) {
      params.healthFilters.forEach(filter => {
        url.searchParams.append('health', filter);
      });
    }
    
    return url.toString();
  }
}

// Factory function for easy setup
export function createEdamamClient(): EdamamAPIClient {
  const config = {
    appId: process.env.EDAMAM_APP_ID!,
    appKey: process.env.EDAMAM_APP_KEY!,
    userId: process.env.EDAMAM_TEST_USER_ID || 'praneya-test-user'
  };
  
  return new EdamamAPIClient(config);
}

export type { EdamamRecipe, EdamamResponse, RecipeSearchParams };
