#!/bin/bash

# Final Vercel Deployment - All Issues Fixed
# This script commits all fixes and deploys to Vercel

set -e

echo "🎊 Wedding Invitation - Final Vercel Deployment"
echo "================================================"
echo ""

echo "📋 Checking all fixes are in place..."
echo ""

# Check TypeScript
echo "✓ Running TypeScript check..."
npm run check > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "  ✅ TypeScript compilation passed"
else
  echo "  ❌ TypeScript errors found"
  exit 1
fi

# Check build
echo "✓ Running build test..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "  ✅ Build successful"
else
  echo "  ❌ Build failed"
  exit 1
fi

echo ""
echo "📦 Committing all fixes..."
echo ""

# Show what will be committed
git add -A
echo "Files to commit:"
git status --short
echo ""

# Commit
git commit -m "fix: Complete Vercel deployment fixes

Issues fixed:
1. ERR_MODULE_NOT_FOUND - Added .js extensions to all ESM imports
2. Missing API routes - Updated api/index.ts to register all routes
3. Build error (ENOENT) - Fixed Vite publicDir configuration
4. Database pool - Optimized for serverless (1 connection)
5. Error handling - Added global error handler

All serverless compatibility issues resolved for Vercel deployment."

if [ $? -eq 0 ]; then
  echo "✅ Changes committed successfully"
else
  echo "⚠️  Nothing to commit (already committed)"
fi

echo ""
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ Pushed to GitHub"
else
  echo "❌ Push failed"
  exit 1
fi

echo ""
echo "🎯 Pre-deployment checklist:"
echo ""

# Check env vars
if [ -z "$DATABASE_URL" ]; then
  echo "  ⚠️  DATABASE_URL not set locally"
  echo "     → Make sure it's set in Vercel dashboard"
else
  echo "  ✅ DATABASE_URL is set"
fi

if [ -z "$SESSION_SECRET" ]; then
  echo "  ⚠️  SESSION_SECRET not set locally"
  echo "     → Make sure it's set in Vercel dashboard"
  echo ""
  echo "     Generate with: openssl rand -base64 32"
else
  echo "  ✅ SESSION_SECRET is set"
fi

echo ""
echo "🚀 Ready to deploy!"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "⚠️  Vercel CLI not installed"
  echo ""
  echo "Install with:"
  echo "  npm install -g vercel"
  echo ""
  echo "Then run:"
  echo "  vercel login"
  echo "  vercel --prod"
  exit 0
fi

echo "Vercel CLI detected ✅"
echo ""
read -p "Deploy to production now? (y/n): " deploy_now

if [ "$deploy_now" = "y" ] || [ "$deploy_now" = "Y" ]; then
  echo ""
  echo "🚀 Deploying to Vercel production..."
  echo ""
  vercel --prod

  echo ""
  echo "✅ Deployment complete!"
  echo ""
  echo "🧪 Test your deployment:"
  echo "  1. Visit your Vercel URL"
  echo "  2. Check /api/health endpoint"
  echo "  3. Verify homepage loads without errors"
  echo "  4. Test admin login (admin / wedding2025)"
  echo ""
else
  echo ""
  echo "Deployment skipped. Deploy later with:"
  echo "  vercel --prod"
  echo ""
fi

echo "📚 See VERCEL_DEPLOYMENT_CHECKLIST.md for full testing steps"
echo ""
echo "🎉 Done!"

