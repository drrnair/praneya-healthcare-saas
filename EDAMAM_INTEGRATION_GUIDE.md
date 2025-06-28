# 🍎 Edamam Nutrition API Integration Guide

## Overview

This guide walks you through integrating the Edamam Nutrition API with your Praneya Healthcare platform for real-time recipe search and nutrition analysis.

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your Free API Keys

1. **Visit Edamam Developer Portal**
   - Go to [developer.edamam.com](https://developer.edamam.com/)
   - Click "Get Started" or "Sign Up"

2. **Create Your Account**
   - Use your email (no credit card required)
   - Verify your email address

3. **Apply for Recipe Search API**
   - Go to "Applications" in your dashboard
   - Click "Create a new application"
   - Select "Recipe Search API" 
   - Choose "Developer" plan (free)
   - Application is usually approved instantly

4. **Get Your Credentials**
   - Copy your `Application ID` (APP_ID)
   - Copy your `Application Key` (APP_KEY)

### Step 2: Configure Your Environment

1. **Create/Edit .env.local**
   ```bash
   # In your project root, create or edit .env.local
   touch .env.local
   ```

2. **Add Your API Keys**
   ```env
   # Edamam Recipe Search API
   NEXT_PUBLIC_EDAMAM_APP_ID=your_app_id_here
   NEXT_PUBLIC_EDAMAM_APP_KEY=your_app_key_here
   ```

3. **Restart Your Development Server**
   ```bash
   # Stop current server (Ctrl+C) then restart
   npm run dev
   ```

### Step 3: Test Your Integration

1. **Visit the Demo Page**
   - Go to: `http://localhost:3005/edamam-demo`
   - (Note: Your app might be on a different port - check terminal)

2. **Search for Recipes**
   - Try searching: "diabetes friendly chicken"
   - Click quick search buttons
   - See real recipe results from Edamam

## 🔍 Understanding the API Response

### What You Get From Edamam:

```json
{
  "hit": {
    "recipe": {
      "label": "Diabetes-Friendly Grilled Chicken",
      "image": "https://...",
      "calories": 285,
      "healthLabels": ["Low-Sugar", "Diabetic"],
      "cautions": [],
      "ingredientLines": ["2 chicken breasts", "..."],
      "nutrients": { "ENERC_KCAL": { "quantity": 285 } }
    }
  }
}
```

### Healthcare-Specific Processing:

Our integration adds healthcare flags:
- `diabetesFriendly`: Low-Sugar or Diabetic labels
- `heartHealthy`: Low-Sodium labels  
- `lowCalorie`: Under 400 calories
- `allergenFree`: No caution warnings
- `balanced`: Balanced nutrition label

## 🏥 Healthcare Use Cases

### 1. Patient Recipe Recommendations
```javascript
// Search for diabetes-friendly recipes
const diabeticRecipes = await searchRecipes({
  query: "chicken",
  healthLabels: ["Low-Sugar", "Diabetic"],
  calories: { max: 400 }
});
```

### 2. Family Meal Planning
```javascript
// Find recipes safe for family allergies
const familySafeRecipes = await searchRecipes({
  query: "pasta",
  excludeIngredients: ["nuts", "shellfish"],
  healthLabels: ["Gluten-Free"]
});
```

### 3. Nutrition Analysis
```javascript
// Analyze a custom meal
const nutrition = await analyzeNutrition([
  "1 cup brown rice",
  "4 oz grilled salmon", 
  "1 cup steamed broccoli"
]);
```

## 📊 API Limits & Costs

### Free Developer Plan:
- ✅ **1,000 requests/month**
- ✅ Recipe Search API access
- ✅ Basic nutrition data
- ✅ Perfect for development/testing

### Paid Plans (Optional):
- **Basic**: $99/month - 5,000 requests
- **Premium**: $299/month - 20,000 requests
- **Enterprise**: Custom pricing

### Cost Optimization Tips:
1. **Cache API responses** (24-48 hours)
2. **Batch similar requests**
3. **Use specific search terms** (fewer results = faster)
4. **Filter on client-side** when possible

## 🔧 Advanced Integration

### 1. Add Nutrition Analysis

```typescript
// src/lib/edamam/nutrition-client.ts
export class EdamamNutritionClient {
  async analyzeNutrition(ingredients: string[]) {
    const response = await fetch(
      'https://api.edamam.com/api/nutrition-details',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingr: ingredients
        })
      }
    );
    
    return response.json();
  }
}
```

### 2. Add to Your Family Management

```typescript
// Search recipes considering family dietary restrictions
const searchFamilyRecipes = async (familyProfile: FamilyProfile) => {
  const allergies = familyProfile.getAllergies();
  const healthConditions = familyProfile.getHealthConditions();
  
  const healthLabels = [];
  if (healthConditions.includes('diabetes')) {
    healthLabels.push('Low-Sugar', 'Diabetic');
  }
  if (healthConditions.includes('hypertension')) {
    healthLabels.push('Low-Sodium');
  }
  
  return await searchRecipes({
    query: 'family dinner',
    healthLabels,
    excludeIngredients: allergies
  });
};
```

### 3. Cache for Performance

```typescript
// Simple caching strategy
const recipeCache = new Map();

const searchWithCache = async (query: string) => {
  const cacheKey = `recipes_${query}`;
  
  if (recipeCache.has(cacheKey)) {
    const cached = recipeCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
      return cached.data;
    }
  }
  
  const results = await searchRecipes(query);
  recipeCache.set(cacheKey, {
    data: results,
    timestamp: Date.now()
  });
  
  return results;
};
```

## 🚨 Error Handling

### Common Issues:

1. **"Unauthorized" Error**
   - Check your APP_ID and APP_KEY
   - Ensure keys are in .env.local
   - Restart development server

2. **"Rate Limit Exceeded"**
   - You've used 1,000 requests this month
   - Wait for monthly reset or upgrade plan
   - Implement caching to reduce requests

3. **"No Results Found"**
   - Try broader search terms
   - Remove restrictive health filters
   - Check spelling in query

4. **CORS Issues**
   - Use server-side API calls for production
   - Consider proxying through your backend

## 🎯 Next Steps

### Immediate:
1. ✅ Test the demo page
2. ✅ Get your API keys
3. ✅ Search for real recipes

### Short-term:
1. 🔄 Add nutrition analysis
2. 🔄 Integrate with family profiles
3. 🔄 Add recipe favorites/saving

### Long-term:
1. 🚀 Add meal planning features
2. 🚀 Integrate with grocery lists
3. 🚀 Add nutrition tracking

## 🆘 Troubleshooting

### Debug Mode:
```javascript
// Add to your search function
console.log('API Request:', {
  url: searchUrl,
  appId: process.env.NEXT_PUBLIC_EDAMAM_APP_ID ? 'SET' : 'MISSING',
  appKey: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY ? 'SET' : 'MISSING'
});
```

### Test API Directly:
```bash
# Test your keys work
curl "https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=YOUR_ID&app_key=YOUR_KEY"
```

## 📞 Support

- **Edamam Documentation**: [developer.edamam.com/edamam-docs-recipe-api](https://developer.edamam.com/edamam-docs-recipe-api)
- **API Status**: [status.edamam.com](https://status.edamam.com)
- **Contact Edamam**: support@edamam.com

---

## 🎉 Ready to Go!

Your Edamam integration is now ready for real-time recipe search! Visit `/edamam-demo` to see it in action with your healthcare platform.

Perfect for:
- ✅ Patient dietary recommendations
- ✅ Family meal planning with health conditions
- ✅ Nutrition analysis and tracking
- ✅ Clinical-grade recipe filtering
