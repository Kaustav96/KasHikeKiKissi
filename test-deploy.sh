#!/bin/bash

# Quick Vercel deployment test script
# Tests build and shows deployment command

echo "🧪 Testing Vercel Deployment Setup"
echo "===================================="
echo ""

echo "1️⃣ Checking TypeScript compilation..."
npm run check
if [ $? -eq 0 ]; then
  echo "✅ TypeScript check passed"
else
  echo "❌ TypeScript errors found - fix before deploying"
  exit 1
fi
echo ""

echo "2️⃣ Testing build..."
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ Build failed - check errors above"
  exit 1
fi
echo ""

echo "3️⃣ Checking build output..."
if [ -d "dist/public" ]; then
  echo "✅ Client built to dist/public"
  echo "   Files:"
  ls -lh dist/public | head -10
else
  echo "❌ dist/public not found"
  exit 1
fi
echo ""

if [ -f "dist/index.cjs" ]; then
  echo "✅ Server built to dist/index.cjs"
  echo "   Size: $(du -h dist/index.cjs | cut -f1)"
else
  echo "❌ dist/index.cjs not found"
  exit 1
fi
echo ""

echo "4️⃣ Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set locally"
  echo "   Make sure it's set in Vercel dashboard"
else
  echo "✅ DATABASE_URL is set"
fi

if [ -z "$SESSION_SECRET" ]; then
  echo "⚠️  SESSION_SECRET not set locally"
  echo "   Make sure it's set in Vercel dashboard"
  echo ""
  echo "   Generate one with: openssl rand -base64 32"
else
  echo "✅ SESSION_SECRET is set"
fi
echo ""

echo "5️⃣ Checking Vercel CLI..."
if command -v vercel &> /dev/null; then
  echo "✅ Vercel CLI installed"
  echo "   Version: $(vercel --version)"
  echo ""
  echo "🚀 Ready to deploy!"
  echo ""
  echo "Deploy now with:"
  echo "  vercel --prod"
else
  echo "⚠️  Vercel CLI not installed"
  echo ""
  echo "Install with:"
  echo "  npm install -g vercel"
  echo ""
  echo "Then run:"
  echo "  vercel login"
  echo "  vercel --prod"
fi
echo ""

echo "✅ All pre-deployment checks passed!"
echo ""
echo "📋 Before deploying, ensure:"
echo "   1. DATABASE_URL is set in Vercel dashboard"
echo "   2. SESSION_SECRET is set in Vercel dashboard"
echo ""
echo "Then deploy with:"
echo "   vercel --prod"
echo ""

