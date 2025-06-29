# 🚀 Netlify Deployment Guide for Praneya Healthcare SaaS

## Quick Deploy Steps:

1. **Connect to Netlify:**
   - Go to https://app.netlify.com/
   - Click "New site from Git"
   - Connect your GitHub repository
   - Use these build settings:
     - Build command: `npm run build`
     - Publish directory: `out`
     - Functions directory: `netlify/functions`

2. **Environment Variables:**
   Add in Netlify Dashboard → Site Settings → Environment Variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
   DATABASE_URL=your_supabase_url
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_key
   EDAMAM_APP_ID=your_id
   EDAMAM_APP_KEY=your_key
   GOOGLE_AI_API_KEY=your_key
   STRIPE_PUBLISHABLE_KEY=your_key
   ```

3. **Deploy:**
   - Click "Deploy site"
   - Your app will be live at https://your-site-name.netlify.app

## Features Included:
- ✅ Complete animation system with micro-interactions
- ✅ Healthcare compliance (HIPAA)
- ✅ AI-powered nutrition analysis
- ✅ PWA support
- ✅ Automatic HTTPS and CDN
- ✅ Serverless functions for API

## Access Your App:
- Main App: https://your-site-name.netlify.app
- Animation Demo: https://your-site-name.netlify.app/animations-demo
- API Health: https://your-site-name.netlify.app/.netlify/functions/api/health-check

🎉 Your sophisticated healthcare platform is now live!
