# 🔗 External API Setup Guide - Praneya Healthcare

## Overview

This guide will help you connect Praneya to external APIs for real-time testing and production functionality. We'll set up:

1. **Firebase Authentication** - Healthcare user management
2. **Stripe** - Payment processing and healthcare billing  
3. **Edamam Nutrition API** - Recipe search and nutrition analysis
4. **Google AI** - Clinical AI capabilities
5. **Monitoring Services** - Error tracking and analytics

## 🚀 Quick Start Setup

### Step 1: Install Additional Dependencies

```bash
npm install framer-motion tailwindcss
npm install firebase-admin firebase
npm install stripe
npm install @google-ai/generativelanguage
```

### Step 2: Create Your Environment File

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

## 🔥 Firebase Authentication Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "Praneya Healthcare"
3. Enable Authentication with email/password and Google sign-in
4. Go to Project Settings > Service Accounts
5. Generate a new private key (download the JSON file)

### 2. Configure Environment Variables

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id  
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id

# Next.js Firebase Config (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Test Firebase Connection

Create a test endpoint:

```bash
curl http://localhost:3001/api/test/firebase
```

## 💳 Stripe Payment Setup

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account and complete verification
3. Get your API keys from the Developers section

### 2. Configure Stripe Environment Variables

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Healthcare Plan IDs (create these in Stripe)
STRIPE_BASIC_PRICE_ID=price_basic_plan
STRIPE_ENHANCED_PRICE_ID=price_enhanced_plan
STRIPE_PREMIUM_PRICE_ID=price_premium_plan
```

### 3. Create Healthcare Products in Stripe

Run this setup script:

```bash
npm run setup:stripe
```

### 4. Test Stripe Integration

```bash
curl -X POST http://localhost:3001/api/test/stripe \
  -H "Content-Type: application/json" \
  -d '{"plan": "enhanced", "userId": "test-user"}'
```

## 🍎 Edamam Nutrition API Setup

### 1. Get Edamam API Keys

1. Go to [Edamam Developer Portal](https://developer.edamam.com/)
2. Create an account and apply for API access
3. Get API keys for:
   - Recipe Search API
   - Nutrition Analysis API
   - Food Database API

### 2. Configure Edamam Environment Variables

```env
# Edamam Configuration
EDAMAM_APP_ID=your-edamam-app-id
EDAMAM_APP_KEY=your-edamam-app-key
EDAMAM_RECIPE_APP_ID=your-recipe-app-id
EDAMAM_RECIPE_APP_KEY=your-recipe-app-key
EDAMAM_NUTRITION_APP_ID=your-nutrition-app-id
EDAMAM_NUTRITION_APP_KEY=your-nutrition-app-key

# Rate Limiting
EDAMAM_RATE_LIMIT_PER_MINUTE=10
EDAMAM_CACHE_TTL_HOURS=24
```

### 3. Test Edamam Integration

```bash
# Test recipe search
curl "http://localhost:3001/api/test/edamam/recipes?q=diabetes%20friendly%20chicken"

# Test nutrition analysis  
curl -X POST http://localhost:3001/api/test/edamam/nutrition \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["1 cup brown rice", "4 oz grilled chicken breast"]}'
```

## 🤖 Google AI Setup

### 1. Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Vertex AI API
4. Create a service account and download credentials

### 2. Configure Google AI Environment Variables

```env
# Google AI Configuration
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Med-Gemini Settings
MED_GEMINI_MODEL=gemini-pro
MED_GEMINI_TEMPERATURE=0.1
MED_GEMINI_MAX_TOKENS=1000
```

### 3. Test Google AI Integration

```bash
curl -X POST http://localhost:3001/api/test/google-ai \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What are some diabetes-friendly meal options?",
    "context": {
      "allergies": ["peanuts"],
      "chronicConditions": ["type2_diabetes"]
    }
  }'
```

## 🧪 Testing Your API Integrations

### 1. Run the Health Check

```bash
curl http://localhost:3001/api/health/external
```

Expected response:
```json
{
  "firebase": "healthy",
  "stripe": "healthy", 
  "edamam": "healthy",
  "googleAI": "healthy",
  "overall": "healthy",
  "lastChecked": "2024-01-01T12:00:00.000Z"
}
```

### 2. Test the Demo Pages

Visit these URLs in your browser:

- **Recipe Search Demo**: `http://localhost:3000/api-demo/recipes`
- **Nutrition Analysis Demo**: `http://localhost:3000/api-demo/nutrition`
- **AI Health Advice Demo**: `http://localhost:3000/api-demo/ai-health`
- **Billing Demo**: `http://localhost:3000/api-demo/billing`

### 3. Monitor API Usage

```bash
curl http://localhost:3001/api/monitor/usage
```

## 🔧 Troubleshooting

### Common Issues

**Firebase "Project not found" error:**
- Verify your project ID is correct
- Check that your service account has proper permissions

**Stripe "Invalid API key" error:**
- Make sure you're using the correct test/live keys
- Verify the key format (starts with `sk_test_` or `sk_live_`)

**Edamam rate limit errors:**
- Check your rate limit settings
- Implement proper caching to reduce API calls

**Google AI authentication errors:**
- Verify your service account credentials
- Check that Vertex AI API is enabled

### Debug Mode

Enable debug logging:

```env
DEBUG_MODE=true
API_LOGGING_ENABLED=true
```

### Testing with Mock Data

For development, enable mock APIs:

```env
MOCK_EXTERNAL_APIS=true
```

## 📊 Cost Management

### Monitor API Costs

```bash
curl http://localhost:3001/api/costs/summary
```

### Set Budget Alerts

Configure budget thresholds in your environment:

```env
EDAMAM_MONTHLY_BUDGET=100
GOOGLE_AI_MONTHLY_BUDGET=50
COST_ALERT_THRESHOLD_PERCENT=80
```

## 🚀 Going to Production

### 1. Security Checklist

- [ ] Use production API keys
- [ ] Enable SSL/TLS everywhere
- [ ] Set up proper CORS policies
- [ ] Configure webhook endpoints
- [ ] Enable monitoring and alerting

### 2. Environment Variables for Production

```env
NODE_ENV=production
HIPAA_COMPLIANCE_ENABLED=true
SECURITY_HEADERS_ENABLED=true
RATE_LIMITING_ENABLED=true
```

### 3. Monitoring Setup

Consider integrating:
- **Sentry** for error tracking
- **New Relic** for performance monitoring
- **DataDog** for comprehensive observability

## 🎯 Next Steps

1. **Set up your first API integration** (recommend starting with Edamam)
2. **Test the recipe search functionality**
3. **Configure Firebase authentication**
4. **Set up Stripe for billing**
5. **Enable Google AI for health recommendations**

## 🆘 Need Help?

- Check the troubleshooting section above
- Review API documentation links
- Enable debug logging to see detailed error messages
- Test with mock APIs first before using real services 