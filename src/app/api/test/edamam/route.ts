import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'healthy chicken';
    
    const appId = process.env.EDAMAM_APP_ID;
    const appKey = process.env.EDAMAM_APP_KEY;
    
    if (!appId || !appKey) {
      return NextResponse.json({
        success: false,
        error: 'Edamam API credentials not configured',
        setup_instructions: [
          'Go to https://developer.edamam.com/',
          'Create account and get API keys',
          'Add EDAMAM_APP_ID and EDAMAM_APP_KEY to .env.local'
        ]
      }, { status: 500 });
    }

    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${appId}&app_key=${appKey}&from=0&to=5`;
    
    console.log('🔍 Testing Edamam API for:', query);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Edamam API error: ${response.status}`);
    }

    const data = await response.json();
    
    const recipes = data.hits?.map((hit: any) => {
      const recipe = hit.recipe;
      return {
        title: recipe.label,
        calories: Math.round(recipe.calories),
        healthLabels: recipe.healthLabels,
        image: recipe.image
      };
    }) || [];

    return NextResponse.json({
      success: true,
      query,
      totalFound: data.count,
      recipes,
      message: '✅ Edamam API connection successful!'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: '❌ Edamam API connection failed'
    }, { status: 500 });
  }
}
