# Deploy to Vercel - Step-by-Step Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)

## Step 1: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
   - Name: `Wedding-Invitation-humdumbangye` (or any name you prefer)
   - Keep it private
   - DON'T initialize with README (we already have code)

2. Add GitHub as a remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   Click "Environment Variables" and add:

   ```
   DATABASE_URL=your_production_database_url
   SESSION_SECRET=your_production_secret_key
   WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
   WHATSAPP_PHONE_ID=your_whatsapp_phone_id
   WHATSAPP_VERIFY_TOKEN=your_verify_token
   WHATSAPP_WEBHOOK_SECRET=your_webhook_secret
   ```

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## Step 3: Configure PostgreSQL Database

Vercel offers PostgreSQL through their Storage offering:

1. Go to your project on Vercel Dashboard
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Follow the wizard to create your database
5. Copy the `DATABASE_URL` connection string
6. Add it to your Environment Variables

**OR** use an external PostgreSQL provider:
- **Neon** (https://neon.tech) - Free tier available
- **Supabase** (https://supabase.com) - Free tier available
- **Railway** (https://railway.app) - $5/month credit
- **ElephantSQL** (https://www.elephantsql.com) - Free tier available

## Step 4: Seed Your Database

After deployment, you can seed the database by:

1. The app will auto-seed on first server start
2. Or manually run migrations if needed

## Step 5: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app-name.vercel.app`)
2. Test the admin login at `/admin/login`
3. Upload your wedding music through admin panel
4. Create guest invites
5. Test WhatsApp integration

## Important Environment Variables Explained

### Required:
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql://user:password@host:5432/database?sslmode=require`

- `SESSION_SECRET`: Random string for JWT signing (generate a strong one!)
  - Example: Use `openssl rand -base64 32` to generate

### Optional (for WhatsApp features):
- `WHATSAPP_ACCESS_TOKEN`: Meta WhatsApp API token
- `WHATSAPP_PHONE_ID`: WhatsApp Business Phone Number ID
- `WHATSAPP_VERIFY_TOKEN`: Custom token for webhook verification
- `WHATSAPP_WEBHOOK_SECRET`: Secret for webhook signature validation

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation: `npm run check`

### Database Connection Issues
- Ensure `DATABASE_URL` is set correctly
- Check if SSL is required: add `?sslmode=require` to connection string
- Verify database is accessible from Vercel's IP range

### App Not Loading
- Check Function logs in Vercel dashboard
- Verify build output in `dist/` folder
- Test locally with `npm run build && npm start`

### Environment Variables Not Working
- Re-deploy after adding environment variables
- Check variable names match exactly (case-sensitive)
- Ensure no quotes around values in Vercel dashboard

## Local Development vs Production

**Local (.env file)**:
```
DATABASE_URL=postgresql://localhost:5432/wedding_app
SESSION_SECRET=dev-secret-key-change-in-production
```

**Production (Vercel Environment Variables)**:
```
DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/wedding_db?sslmode=require
SESSION_SECRET=<strong-random-secret>
WHATSAPP_ACCESS_TOKEN=<your-token>
...
```

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch auto-deploys to production
- Pull requests create preview deployments
- Rollback to previous deployment anytime from Vercel dashboard

## Custom Domain (Optional)

1. Go to project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. SSL certificate is automatically provisioned

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- Your project is configured and ready to deploy!
