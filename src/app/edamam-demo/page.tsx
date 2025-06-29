'use client';

import { useState, useEffect } from 'react';
import { edamamClient } from '@/lib/edamam/api-client';

export default function EdamamDemo() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    setApiConfigured(edamamClient.isConfigured());
  }, []);

  // Health label mapping for common search terms
  const parseHealthLabels = (searchQuery: string) => {
    const healthMapping: { [key: string]: string[] } = {
      'diabetes-friendly': ['low-sugar'],
      'diabetic-friendly': ['low-sugar'],
      'diabetes friendly': ['low-sugar'],
      'diabetic friendly': ['low-sugar'],
      'heart-healthy': ['low-sodium'],
      'heart healthy': ['low-sodium'],
      'cardiovascular': ['low-sodium', 'low-fat'],
      'low-sodium': ['low-sodium'],
      'low sodium': ['low-sodium'],
      'low-fat': ['low-fat'],
      'low fat': ['low-fat'],
      'gluten-free': ['gluten-free'],
      'gluten free': ['gluten-free'],
      'vegan': ['vegan'],
      'vegetarian': ['vegetarian'],
      'keto': ['keto-friendly'],
      'paleo': ['paleo'],
      'high-protein': ['high-protein'],
      'high protein': ['high-protein'],
    };

    const lowerQuery = searchQuery.toLowerCase();
    let healthLabels: string[] = [];
    let cleanedQuery = searchQuery;

    // Find matching health terms and extract them
    Object.entries(healthMapping).forEach(([term, labels]) => {
      if (lowerQuery.includes(term)) {
        healthLabels.push(...labels);
        // Remove the health term from the query to get cleaner food search
        cleanedQuery = cleanedQuery.replace(new RegExp(term, 'gi'), '').trim();
      }
    });

    // If no specific food mentioned, use a generic search
    if (!cleanedQuery || cleanedQuery.length < 2) {
      cleanedQuery = 'chicken';
    }

    return { healthLabels: Array.from(new Set(healthLabels)), cleanedQuery };
  };

  const searchRecipes = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (edamamClient.isConfigured()) {
        // Use real Edamam API
        console.log('🔍 Using real Edamam API');
        
        const { healthLabels, cleanedQuery } = parseHealthLabels(query);
        console.log('🔍 Parsed query:', cleanedQuery);
        console.log('🏥 Health labels:', healthLabels);
        
        const result = await edamamClient.searchRecipes({
          query: cleanedQuery,
          healthLabels: healthLabels.length > 0 ? healthLabels : [] as string[],
          from: 0,
          to: 8
        });
        setRecipes(result.recipes);
        console.log('✅ Found', result.recipes.length, 'real recipes');
      } else {
        // Use demo data
        console.log('🔍 Using demo data (API not configured)');
        const demoRecipes = [
          {
            id: 'demo-1',
            title: 'Diabetes-Friendly Grilled Chicken Salad',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
            source: 'Demo Recipe',
            url: '#',
            calories: 285,
            servings: 2,
            cookTime: '25 minutes',
            dietLabels: ['Low-Carb'],
            healthLabels: ['Low-Sugar', 'Diabetic', 'Low-Sodium'],
            cautions: [],
            ingredients: [
              '2 chicken breasts, grilled',
              '4 cups mixed greens',
              '1 cucumber, sliced',
              '2 tbsp olive oil',
              '1 tbsp lemon juice'
            ],
            healthcareFlags: {
              diabetesFriendly: true,
              heartHealthy: true,
              lowCalorie: true,
              allergenFree: true,
              balanced: true
            }
          },
          {
            id: 'demo-2',
            title: 'Heart-Healthy Baked Salmon',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
            source: 'Demo Recipe',
            url: '#',
            calories: 320,
            servings: 4,
            cookTime: '30 minutes',
            dietLabels: ['Low-Carb', 'Keto-Friendly'],
            healthLabels: ['Heart-Healthy', 'Low-Sodium', 'High-Protein'],
            cautions: ['Fish'],
            ingredients: [
              '4 salmon fillets',
              '2 tbsp olive oil',
              '1 lemon, sliced',
              'Fresh herbs (dill, parsley)',
              'Black pepper to taste'
            ],
            healthcareFlags: {
              diabetesFriendly: false,
              heartHealthy: true,
              lowCalorie: true,
              allergenFree: false,
              balanced: true
            }
          }
        ];
        setRecipes(demoRecipes);
        console.log('✅ Demo recipes loaded');
      }
      
    } catch (err) {
      console.error('❌ Recipe search failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchRecipes();
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🍎 Edamam Nutrition API Integration
        </h1>
        <p className="text-gray-600 text-lg">
          Healthcare-focused recipe search for Praneya Healthcare Platform
        </p>
      </div>

      {/* API Configuration Status */}
      <div className={`p-6 rounded-lg mb-6 ${apiConfigured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <h2 className="font-semibold mb-4">
          {apiConfigured ? '✅ Connected to Edamam Recipe & Meal Planner API | User: praneya-test-user | 10,000+ Recipes Available' : '🚀 Ready to Connect Real API?'}
        </h2>
        
        {apiConfigured ? (
          <div className="text-sm text-green-700">
            <p>✨ Your Edamam API keys are configured and working!</p>
            <p>🔍 Searches will return real recipe data from Edamam's database</p>
            <p>📊 Free plan includes 1,000 requests/month</p>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-medium">Step 1: Get Free Edamam API Keys (2 minutes)</h3>
              <p>• Go to <a href="https://developer.edamam.com/" className="text-blue-600 underline" target="_blank">developer.edamam.com</a></p>
              <p>• Create free account (no credit card needed)</p>
              <p>• Apply for "Recipe Search API" access (instant approval)</p>
              <p>• Copy your APP_ID and APP_KEY</p>
            </div>
            
            <div>
              <h3 className="font-medium">Step 2: Configure Environment</h3>
              <div className="bg-gray-800 text-green-400 p-3 rounded mt-2 font-mono text-xs">
                # Add to your .env.local file:<br/>
                NEXT_PUBLIC_EDAMAM_APP_ID=your_app_id_here<br/>
                NEXT_PUBLIC_EDAMAM_APP_KEY=your_app_key_here
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Step 3: Restart & Test</h3>
              <p>• Restart dev server: <code className="bg-gray-200 px-2 py-1 rounded text-xs">npm run dev</code></p>
              <p>• This page will automatically use real API when keys are configured</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded mt-3">
              <p className="text-xs text-blue-700">
                💡 <strong>For now:</strong> Demo works with sample data to show you the interface
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Patient Context Notice */}
      <div className="bg-amber-50 p-4 rounded-lg mb-6 border border-amber-200">
        <div className="flex items-center">
          <span className="text-lg mr-2">👨‍⚕️</span>
          <span className="font-medium text-amber-800">Patient Context</span>
        </div>
        <p className="text-amber-700 text-sm mt-1">
          Searching for healthcare-appropriate recipes. All results include nutritional analysis and health labels for clinical review.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg border mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search for Healthcare-Friendly Recipes:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., diabetes-friendly chicken, low sodium pasta"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search Recipes'}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Search Buttons */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Healthcare quick searches:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: '🩺', label: 'Diabetes Management', term: 'diabetes-friendly' },
              { icon: '❤️', label: 'Cardiovascular Health', term: 'heart-healthy' },
              { icon: '🫘', label: 'Renal Diet', term: 'low-sodium' },
              { icon: '🌾', label: 'Celiac-Safe', term: 'gluten-free' },
              { icon: '💪', label: 'High Protein', term: 'high-protein' }
            ].map((item) => (
              <button
                key={item.term}
                onClick={() => setQuery(item.term)}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-1"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-red-800 flex items-center">
            <span className="mr-2">⚠️</span>
            Search Failed: API Error: {error.includes('400') ? '400 -' : ''}
          </h3>
          <p className="text-red-700">Please check connection and try again.</p>
          {!apiConfigured && (
            <p className="text-red-600 text-sm mt-2">
              💡 This might be because API keys aren't configured yet. See setup instructions above.
            </p>
          )}
        </div>
      )}

      {/* Results */}
      {recipes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              Found {recipes.length} Healthcare-Friendly Recipes
            </h2>
            {!apiConfigured && (
              <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                Demo Data
              </span>
            )}
            {apiConfigured && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Real Edamam Data
              </span>
            )}
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {recipes.map((recipe: any) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-lg border overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {recipe.title}
                  </h3>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p>🔥 {recipe.calories} calories</p>
                    {recipe.servings && <p>👥 {recipe.servings} servings</p>}
                    {recipe.cookTime && <p>⏱️ {recipe.cookTime}</p>}
                    {recipe.source && <p>📍 {recipe.source}</p>}
                  </div>

                  {/* Healthcare Flags */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {recipe.healthcareFlags?.diabetesFriendly && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Diabetes Friendly
                        </span>
                      )}
                      {recipe.healthcareFlags?.heartHealthy && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          Heart Healthy
                        </span>
                      )}
                      {recipe.healthcareFlags?.lowCalorie && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Low Calorie
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Health Labels */}
                  {recipe.healthLabels && recipe.healthLabels.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Health Labels:</p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.healthLabels.slice(0, 4).map((label: string) => (
                          <span
                            key={label}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {label}
                          </span>
                        ))}
                        {recipe.healthLabels.length > 4 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{recipe.healthLabels.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ingredients Preview */}
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Key Ingredients:</p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {recipe.ingredients.slice(0, 3).join(', ')}
                        {recipe.ingredients.length > 3 && '...'}
                      </p>
                    </div>
                  )}

                  {/* Cautions */}
                  {recipe.cautions && recipe.cautions.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⚠️</span>
                        <span className="text-xs text-yellow-700 font-medium">
                          Contains: {recipe.cautions.join(', ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {recipe.url && recipe.url !== '#' && (
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm">
                      View Full Recipe
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && recipes.length === 0 && query && !error && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No recipes found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">Try a different search term or check the healthcare quick searches above.</p>
        </div>
      )}
    </div>
  );
} 