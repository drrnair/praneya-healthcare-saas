// Edamam API Client for Praneya Healthcare
export interface EdamamRecipeSearch {
  query: string;
  healthLabels?: string[];
  calories?: { min?: number; max?: number };
  from?: number;
  to?: number;
}

export interface HealthcareRecipe {
  id: string;
  title: string;
  image: string;
  calories: number;
  healthLabels: string[];
  healthcareFlags: {
    diabetesFriendly: boolean;
    heartHealthy: boolean;
    lowCalorie: boolean;
  };
}

export class EdamamAPIClient {
  private appId: string;
  private appKey: string;

  constructor() {
    this.appId = process.env.NEXT_PUBLIC_EDAMAM_APP_ID || '';
    this.appKey = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY || '';
  }

  isConfigured(): boolean {
    return !!(this.appId && this.appKey);
  }

  async searchRecipes(params: EdamamRecipeSearch): Promise<{
    recipes: HealthcareRecipe[];
    totalFound: number;
  }> {
    if (!this.isConfigured()) {
      throw new Error('Edamam API not configured');
    }

    // Build URL with proper health filters
    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(params.query)}&app_id=${this.appId}&app_key=${this.appKey}&from=${params.from || 0}&to=${params.to || 20}`;
    
    // Add health filters if provided
    if (params.healthLabels && params.healthLabels.length > 0) {
      params.healthLabels.forEach(label => {
        url += `&health=${encodeURIComponent(label)}`;
      });
    }

    console.log('API Request URL:', url); // Debug logging
    
    const response = await fetch(url, {
      headers: {
        'Edamam-Account-User': 'praneya-test-user',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    const recipes = data.hits?.map((hit: any) => {
      const recipe = hit.recipe;
      return {
        id: recipe.uri.split('#recipe_')[1],
        title: recipe.label,
        image: recipe.image,
        calories: Math.round(recipe.calories),
        healthLabels: recipe.healthLabels || [],
        healthcareFlags: {
          diabetesFriendly: recipe.healthLabels?.includes('Low-Sugar') || recipe.healthLabels?.includes('Diabetic'),
          heartHealthy: recipe.healthLabels?.includes('Low-Sodium') || recipe.healthLabels?.includes('Low-Fat'),
          lowCalorie: recipe.calories < 400
        }
      };
    }) || [];

    return {
      recipes,
      totalFound: data.count || 0
    };
  }
}

export const edamamClient = new EdamamAPIClient();
