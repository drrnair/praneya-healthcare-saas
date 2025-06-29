'use client';

import React, { useState } from 'react';

export default function APITestPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testRecipeSearch = async () => {
    setLoading('recipes');
    try {
      // Test Edamam Recipe Search
      const query = 'diabetes friendly chicken';
      const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY&from=0&to=3`);
      
      if (!response.ok) {
        throw new Error('API credentials not configured');
      }
      
      const data = await response.json();
      setTestResults((prev: any) => ({ ...prev, recipes: data }));
    } catch (error) {
      setTestResults((prev: any) => ({ 
        ...prev, 
        recipes: { 
          error: 'Configure EDAMAM_APP_ID and EDAMAM_APP_KEY in .env.local',
          setup: 'Go to https://developer.edamam.com/ to get API keys'
        } 
      }));
    }
    setLoading(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        🔗 Praneya Healthcare - External API Testing
      </h1>
      
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4">🍎 Recipe Search Test</h2>
          <p className="text-gray-600 mb-4">
            Test searching for diabetes-friendly recipes
          </p>
          <button
            onClick={testRecipeSearch}
            disabled={loading === 'recipes'}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading === 'recipes' ? 'Testing...' : 'Test Recipe Search'}
          </button>
          
          {testResults.recipes && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Results:</h3>
              <pre className="text-sm overflow-auto max-h-60">
                {JSON.stringify(testResults.recipes, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">🚀 Setup Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">1. Get Edamam API Keys:</h3>
              <ul className="list-disc ml-6 text-sm">
                <li>Visit <a href="https://developer.edamam.com/" className="text-blue-600 underline">developer.edamam.com</a></li>
                <li>Create free account</li>
                <li>Apply for Recipe Search API access</li>
                <li>Get your APP_ID and APP_KEY</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">2. Configure Environment:</h3>
              <div className="bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
                <div># Add to .env.local:</div>
                <div>EDAMAM_APP_ID=your_app_id_here</div>
                <div>EDAMAM_APP_KEY=your_app_key_here</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
