#!/bin/bash

# Praneya Healthcare SaaS - GitHub Codespaces Setup Script
echo "🏥 Setting up Praneya Healthcare SaaS in GitHub Codespaces..."

# Copy environment template
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please update with your actual API keys."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up basic development environment
echo "🔧 Setting up development environment..."
mkdir -p data/{postgres,redis,audit-logs,clinical-logs,emergency,backups}

# Create a simple local development setup
echo "🚀 Starting development servers..."
echo "Run the following commands in separate terminals:"
echo "1. npm run dev:next      # Start Next.js frontend"
echo "2. npm run dev:server    # Start Express backend"

# Health check
echo "🩺 Running health checks..."
npm run health-check

echo "✅ Setup complete!"
echo "🌐 Your app will be available at https://[codespace-name]-3000.github.dev"
echo "⚠️  Remember to add your API keys to the .env file!" 