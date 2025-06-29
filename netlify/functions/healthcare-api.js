// Healthcare API serverless function for Netlify
exports.handler = async (event, _context) => {
  const { path, httpMethod, headers, body } = event;

  // CORS headers for healthcare compliance
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'https://praneyahealthcare.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
    // HIPAA compliance headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  try {
    // Parse request body if present
    let requestBody = {};
    if (body) {
      try {
        requestBody = JSON.parse(body);
      } catch (error) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Invalid JSON in request body',
            timestamp: new Date().toISOString()
          })
        };
      }
    }

    // Route handling based on path
    const apiPath = path.replace('/api/', '');
    
    switch (apiPath) {
      case 'health-check':
        return handleHealthCheck(corsHeaders);
      
      case 'user/profile':
        return handleUserProfile(httpMethod, requestBody, headers, corsHeaders);
      
      case 'nutrition/analyze':
        return handleNutritionAnalysis(httpMethod, requestBody, headers, corsHeaders);
      
      case 'ai/food-recognition':
        return handleFoodRecognition(httpMethod, requestBody, headers, corsHeaders);
      
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'API endpoint not found',
            path: apiPath,
            timestamp: new Date().toISOString()
          })
        };
    }

  } catch (error) {
    console.error('Healthcare API Error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Healthcare service temporarily unavailable',
        timestamp: new Date().toISOString()
      })
    };
  }
};

// Health check endpoint
function handleHealthCheck(headers) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'healthy',
      service: 'Praneya Healthcare API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    })
  };
}

// User profile management
async function handleUserProfile(method, body, requestHeaders, headers) {
  // Authentication check
  const authHeader = requestHeaders.authorization;
  if (!authHeader) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ 
        error: 'Authentication required',
        timestamp: new Date().toISOString()
      })
    };
  }

  switch (method) {
    case 'GET':
      // Mock user profile data
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: {
            id: 'user_123',
            name: 'Healthcare User',
            email: 'user@example.com',
            subscription: 'premium',
            healthGoals: ['weight-management', 'nutrition-tracking']
          },
          timestamp: new Date().toISOString()
        })
      };
    
    case 'PUT':
      // Update user profile
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Profile updated successfully',
          updatedFields: Object.keys(body),
          timestamp: new Date().toISOString()
        })
      };
    
    default:
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ 
          error: 'Method not allowed',
          allowedMethods: ['GET', 'PUT'],
          timestamp: new Date().toISOString()
        })
      };
  }
}

// Nutrition analysis endpoint
async function handleNutritionAnalysis(method, body, requestHeaders, headers) {
  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        allowedMethods: ['POST'],
        timestamp: new Date().toISOString()
      })
    };
  }

  const { foodItems = [] } = body;

  // Mock nutrition analysis
  const nutritionData = {
    totalCalories: foodItems.length * 150, // Mock calculation
    macronutrients: {
      protein: foodItems.length * 12,
      carbs: foodItems.length * 20,
      fat: foodItems.length * 8
    },
    micronutrients: {
      vitaminC: foodItems.length * 15,
      calcium: foodItems.length * 100,
      iron: foodItems.length * 2
    },
    healthScore: 85,
    recommendations: [
      'Consider adding more leafy greens for iron',
      'Increase protein intake for muscle maintenance'
    ]
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      analysis: nutritionData,
      foodItemsAnalyzed: foodItems.length,
      timestamp: new Date().toISOString()
    })
  };
}

// AI Food recognition endpoint
async function handleFoodRecognition(method, body, requestHeaders, headers) {
  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        allowedMethods: ['POST'],
        timestamp: new Date().toISOString()
      })
    };
  }

  const { imageData } = body;

  if (!imageData) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Image data required',
        timestamp: new Date().toISOString()
      })
    };
  }

  // Mock AI food recognition
  const recognitionResults = {
    detectedFoods: [
      {
        name: 'Apple',
        confidence: 0.95,
        calories: 95,
        category: 'fruit'
      },
      {
        name: 'Banana',
        confidence: 0.87,
        calories: 105,
        category: 'fruit'
      }
    ],
    processingTime: '1.2s',
    confidence: 0.91
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      recognition: recognitionResults,
      timestamp: new Date().toISOString()
    })
  };
} 