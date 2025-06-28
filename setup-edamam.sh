#!/bin/bash

echo "🍎 Edamam API Integration Setup for Praneya Healthcare"
echo "=================================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << ENV_EOF
# ===========================================
# EDAMAM NUTRITION API
# ===========================================
# Get keys from: https://developer.edamam.com/
NEXT_PUBLIC_EDAMAM_APP_ID=your_app_id_here
NEXT_PUBLIC_EDAMAM_APP_KEY=your_app_key_here

# ===========================================
# OTHER APIs (Optional)
# ===========================================
# NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
# STRIPE_SECRET_KEY=your_stripe_key

ENV_EOF
    echo "✅ Created .env.local with Edamam placeholders"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Get FREE Edamam API keys:"
echo "   → Visit: https://developer.edamam.com/"
echo "   → Sign up (no credit card needed)"
echo "   → Apply for Recipe Search API"
echo "   → Get your APP_ID and APP_KEY"
echo ""
echo "2. Edit .env.local and replace the placeholder values:"
echo "   → NEXT_PUBLIC_EDAMAM_APP_ID=your_actual_app_id"
echo "   → NEXT_PUBLIC_EDAMAM_APP_KEY=your_actual_app_key"
echo ""
echo "3. Restart your dev server:"
echo "   → Stop current server (Ctrl+C)"
echo "   → Run: npm run dev"
echo ""
echo "4. Test your integration:"
echo "   → Visit: http://localhost:3005/edamam-demo"
echo "   → Search for diabetes-friendly recipes"
echo "   → See real data from Edamam!"
echo ""
echo "📖 Full guide: EDAMAM_INTEGRATION_GUIDE.md"
echo "🆘 Need help? Check the troubleshooting section"

