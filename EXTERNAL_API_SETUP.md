# 🔗 External API Setup Guide - Praneya Healthcare

## Overview

This guide will help you connect Praneya to external APIs for real-time testing. We'll set up the most important APIs for your healthcare nutrition platform.

## 🍎 1. Edamam Nutrition API (Priority 1)

### Why This API?
- **Perfect for healthcare nutrition**: Recipe search, nutrition analysis, food database
- **Free tier available**: 1,000+ requests/month
- **Instant results**: Great for testing your app functionality

### Setup Steps:

1. **Get API Keys**
   - Go to [developer.edamam.com](https://developer.edamam.com/)
   - Create a free account
   - Apply for "Recipe Search API" access
   - Get your APP_ID and APP_KEY

2. **Configure Environment**
   ```bash
   # Add to your .env.local file:
   EDAMAM_APP_ID=your_app_id_here
   EDAMAM_APP_KEY=your_app_key_here
   ```

3. **Test the Integration**
   ```bash
   # Start your app
   npm run dev
   
   # Visit the test page
   http://localhost:3000/api-test
   
   # Or test the API directly
   curl "http://localhost:3000/api/test/edamam?q=diabetes%20friendly"
   ```

### Expected Response:
```json
{
  "success": true,
  "query": "diabetes friendly",
  "totalFound": 1000,
  "recipes": [
    {
      "title": "Diabetes-Friendly Chicken Salad",
      "calories": 320,
      "healthLabels": ["Low-Sugar", "Diabetic"],
      "image": "https://..."
    }
  ],
  "message": "✅ Edamam API connection successful!"
}
```

## 🔥 2. Firebase Authentication (Priority 2)

### Why This API?
- **Healthcare-compliant auth**: Perfect for managing patient accounts
- **Family account support**: Essential for your family management features
- **Free tier**: 50,000 monthly active users

### Setup Steps:

1. **Create Firebase Project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com/)
   - Create new project named "Praneya Healthcare"
   - Enable Authentication > Email/Password

2. **Get Configuration**
   - Project Settings > General > Your apps
   - Add web app and copy config

3. **Configure Environment**
   ```bash
   # Add to .env.local:
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   ```

## 💳 3. Stripe Payments (Priority 3)

### Why This API?
- **Healthcare billing**: Perfect for subscription management
- **Family plans**: Supports your family account billing
- **Test mode**: Free testing with fake cards

### Setup Steps:

1. **Create Stripe Account**
   - Go to [dashboard.stripe.com](https://dashboard.stripe.com/)
   - Create account (use test mode initially)

2. **Get API Keys**
   - Dashboard > Developers > API keys
   - Copy Publishable and Secret keys

3. **Configure Environment**
   ```bash
   # Add to .env.local:
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   ```

## 🤖 4. Google AI (Optional)

### Why This API?
- **Medical AI**: Great for health recommendations
- **Free tier**: $300 credit for new users

### Setup Steps:

1. **Create Google Cloud Project**
   - Go to [console.cloud.google.com](https://console.cloud.google.com/)
   - Create project and enable AI APIs

2. **Get API Key**
   - APIs & Services > Credentials
   - Create API Key

3. **Configure Environment**
   ```bash
   # Add to .env.local:
   GOOGLE_AI_API_KEY=your_google_ai_key
   ```

## 🧪 Testing Your Setup

### 1. Start Your Application
```bash
npm run dev
```

### 2. Test Individual APIs

**Edamam Test:**
```bash
curl "http://localhost:3000/api/test/edamam?q=healthy"
```

**Recipe Search in Browser:**
- Visit: `http://localhost:3000/api-test`
- Click "Test Recipe Search"

### 3. Expected Results

✅ **Success**: You should see recipe data with nutrition info
❌ **Error**: Check your API keys and internet connection

## 🔧 Troubleshooting

### Common Issues:

**"API credentials not configured"**
- Check your .env.local file exists
- Verify API keys are correct
- Restart your development server

**"Rate limit exceeded"**
- You've used up your free quota
- Wait for reset or upgrade account

**"Network error"**
- Check internet connection
- Verify API endpoints are correct

### Debug Steps:

1. **Check Environment Variables**
   ```bash
   # Add to your API route for debugging:
   console.log('API Keys:', {
     edamam_id: process.env.EDAMAM_APP_ID ? 'SET' : 'MISSING',
     edamam_key: process.env.EDAMAM_APP_KEY ? 'SET' : 'MISSING'
   });
   ```

2. **Test API Directly**
   ```bash
   # Test Edamam directly (replace YOUR_KEYS):
   curl "https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=YOUR_ID&app_key=YOUR_KEY"
   ```

## 🎯 Quick Start Recommendation

**Start with Edamam API first** - it's:
- ✅ Easy to set up (5 minutes)
- ✅ Free tier available
- ✅ Perfect for testing your nutrition features
- ✅ Immediate visual results

Once Edamam is working, add Firebase for authentication, then Stripe for billing.

## 📱 Demo Features You Can Test

With these APIs connected, you can test:

1. **Recipe Search**: "Show me diabetes-friendly recipes"
2. **Nutrition Analysis**: Analyze meal nutritional content
3. **User Authentication**: Healthcare-compliant login system
4. **Family Billing**: Subscription management for families
5. **Health Recommendations**: AI-powered meal suggestions

## 🆘 Need Help?

If you encounter issues:
1. Check the API provider's documentation
2. Verify your account has remaining quota
3. Test with simple queries first
4. Check browser network tab for errors

Ready to connect your first API? Start with Edamam - it's the easiest and most impactful for your healthcare nutrition platform!
