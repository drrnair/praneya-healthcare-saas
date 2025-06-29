'use client';

import { useState } from 'react';

interface HealthContext {
  conditions: string[];
  medications: string[];
  allergies: string[];
  dietaryRestrictions: string[];
}

interface AIResponse {
  content: string;
  containsmedicalAdvice: boolean;
  clinicalFlags: string[];
  nutritionalGuidance: boolean;
  confidence: number;
  disclaimer: string;
}

export default function GeminiDemo() {
  const [activeTab, setActiveTab] = useState<'recipe' | 'nutrition' | 'chat'>('recipe');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // Recipe Generation State
  const [recipePrompt, setRecipePrompt] = useState('');
  
  // Nutrition Analysis State
  const [nutritionData, setNutritionData] = useState({
    calories: 350,
    protein: 25,
    carbs: 45,
    fat: 12,
    fiber: 8,
    sodium: 480
  });

  // Healthcare Chat State
  const [chatPrompt, setChatPrompt] = useState('');
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  // Health Context State
  const [healthContext, setHealthContext] = useState<HealthContext>({
    conditions: [],
    medications: [],
    allergies: [],
    dietaryRestrictions: []
  });

  const addHealthContextItem = (type: keyof HealthContext, value: string) => {
    if (value.trim()) {
      setHealthContext(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }));
    }
  };

  const removeHealthContextItem = (type: keyof HealthContext, index: number) => {
    setHealthContext(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const generateRecipe = async () => {
    if (!recipePrompt.trim()) {
      setError('Please enter a recipe prompt');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('/api/ai/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: recipePrompt,
          healthContext,
          userId: 'demo-user'
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const analyzeNutrition = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('/api/ai/analyze-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nutritionData,
          healthContext,
          userId: 'demo-user'
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze nutrition');
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatPrompt.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/healthcare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: chatPrompt,
          healthContext,
          conversationHistory,
          userId: 'demo-user'
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Add to conversation history
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: chatPrompt },
        { role: 'assistant', content: data.response.content }
      ];
      setConversationHistory(newHistory);
      setChatPrompt('');
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold text-purple-600 mb-6">
        🤖 Google Gemini AI Healthcare Demo
      </h1>

      {/* Health Context Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h2 className="font-semibold mb-4 text-blue-800">🏥 Health Context (Optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['conditions', 'medications', 'allergies', 'dietaryRestrictions'] as const).map((type) => (
            <div key={type}>
              <label className="block text-sm font-medium mb-2 capitalize">
                {type.replace('dietaryRestrictions', 'Dietary Restrictions')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {healthContext[type].map((item, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    {item}
                    <button
                      onClick={() => removeHealthContextItem(type, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder={`Add ${type.slice(0, -1)}...`}
                className="w-full p-2 border rounded text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addHealthContextItem(type, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {[
          { id: 'recipe', label: '🍳 Recipe Generation', icon: '🍳' },
          { id: 'nutrition', label: '📊 Nutrition Analysis', icon: '📊' },
          { id: 'chat', label: '💬 Healthcare Chat', icon: '💬' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          {activeTab === 'recipe' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">🍳 Generate Recipe</h3>
              <textarea
                value={recipePrompt}
                onChange={(e) => setRecipePrompt(e.target.value)}
                placeholder="Describe the recipe you want... e.g., 'A heart-healthy dinner for someone with diabetes'"
                className="w-full h-32 p-3 border rounded-lg resize-none"
              />
              <button
                onClick={generateRecipe}
                disabled={loading}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Recipe'}
              </button>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">📊 Analyze Nutrition</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(nutritionData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 capitalize">{key}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setNutritionData(prev => ({
                        ...prev,
                        [key]: parseInt(e.target.value) || 0
                      }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={analyzeNutrition}
                disabled={loading}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Nutrition'}
              </button>
            </div>
          )}

          {activeTab === 'chat' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">💬 Healthcare Chat</h3>
              
              {/* Conversation History */}
              {conversationHistory.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 max-h-40 overflow-y-auto">
                  {conversationHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block p-2 rounded text-sm ${
                        msg.role === 'user' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content.substring(0, 100)}
                        {msg.content.length > 100 && '...'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Ask about nutrition, dietary advice, or health-related food questions..."
                className="w-full h-32 p-3 border rounded-lg resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setConversationHistory([])}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Clear History
                </button>
                <button
                  onClick={sendChatMessage}
                  disabled={loading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Response Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">🤖 AI Response</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <p className="text-red-800">❌ {error}</p>
              {error.includes('not configured') && (
                <div className="mt-2 text-sm text-red-600">
                  <p>To fix this:</p>
                  <ol className="list-decimal list-inside">
                    <li>Get API key from <a href="https://aistudio.google.com/app/apikey" className="underline" target="_blank">Google AI Studio</a></li>
                    <li>Add to .env.local: GOOGLE_AI_API_KEY=your_key_here</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {response && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600">✅</span>
                  <span className="font-medium text-green-800">Response Generated Successfully</span>
                </div>
                
                {/* Content */}
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium mb-2">Content:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {response.recipe?.content || response.analysis?.content || response.response?.content}
                  </p>
                </div>

                {/* Safety Information */}
                {(response.recipe || response.analysis || response.response) && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Safety Checks:</strong>
                      <ul className="mt-1">
                        <li className="flex items-center gap-1">
                          <span className={
                            (response.recipe?.containsmedicalAdvice || response.analysis?.containsmedicalAdvice || response.response?.containsmedicalAdvice) 
                              ? 'text-red-500' : 'text-green-500'
                          }>
                            {(response.recipe?.containsmedicalAdvice || response.analysis?.containsmedicalAdvice || response.response?.containsmedicalAdvice) ? '⚠️' : '✅'}
                          </span>
                          Medical Advice: {(response.recipe?.containsmedicalAdvice || response.analysis?.containsmedicalAdvice || response.response?.containsmedicalAdvice) ? 'Detected' : 'None'}
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="text-green-500">✅</span>
                          Nutritional Guidance: {(response.recipe?.nutritionalGuidance || response.analysis?.nutritionalGuidance || response.response?.nutritionalGuidance) ? 'Yes' : 'No'}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <strong>Confidence:</strong>
                      <div className="mt-1">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(response.recipe?.confidence || response.analysis?.confidence || response.response?.confidence || 0) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((response.recipe?.confidence || response.analysis?.confidence || response.response?.confidence || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                {(response.recipe?.disclaimer || response.analysis?.disclaimer || response.response?.disclaimer) && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
                    <strong>⚠️ Medical Disclaimer:</strong>
                    <p className="text-yellow-800 mt-1">
                      {response.recipe?.disclaimer || response.analysis?.disclaimer || response.response?.disclaimer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!response && !error && !loading && (
            <div className="text-center text-gray-500 py-8">
              <p>👆 Configure your health context above and try one of the AI features</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your request...</p>
            </div>
          )}
        </div>
      </div>

      {/* API Health Check */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            💡 Check API status: <a href="/api/ai/health-check" className="text-blue-600 underline" target="_blank">Health Check</a>
          </span>
          <span className="text-xs text-gray-500">
            Demo Mode - Using healthcare-compliant AI with safety filters
          </span>
        </div>
      </div>
    </div>
  );
}
