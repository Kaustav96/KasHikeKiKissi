#!/bin/bash

# Vercel Deployment Script
# Run this script to deploy your wedding invitation to Vercel

set -e  # Exit on error

echo "🎊 Wedding Invitation - Vercel Deployment"
echo "=========================================="
echo ""

# Check if DATABASE_URL is set in environment
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  Warning: DATABASE_URL not found in local environment"
  echo "   Make sure it's set in Vercel dashboard"
  echo ""
fi

# Check if SESSION_SECRET is set
if [ -z "$SESSION_SECRET" ]; then
  echo "⚠️  Warning: SESSION_SECRET not found in local environment"
  echo "   Make sure it's set in Vercel dashboard"
  echo ""
fi

# Type check
echo "🔍 Running TypeScript check..."
npm run check
echo "✅ Type check passed"
echo ""

# Build locally to test
echo "🏗️  Building project..."
npm run build
echo "✅ Build successful"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not found"
  echo "   Install with: npm install -g vercel"
  echo "   Then run this script again"
  exit 1
fi

echo "📤 Deploying to Vercel..."
echo ""
echo "Choose deployment type:"
echo "  1) Production (--prod)"
echo "  2) Preview (staging)"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
  echo ""
  echo "🚀 Deploying to PRODUCTION..."
  vercel --prod
elif [ "$choice" = "2" ]; then
  echo ""
  echo "🧪 Deploying to PREVIEW..."
  vercel
else
  echo "❌ Invalid choice"
  exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Test the deployment URL"
echo "  2. Check /api/health endpoint"
echo "  3. Verify admin login works"
echo "  4. Test RSVP form submission"
echo ""
echo "📚 See VERCEL_DEPLOYMENT_CHECKLIST.md for detailed testing"

