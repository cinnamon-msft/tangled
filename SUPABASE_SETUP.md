# Supabase Setup Guide

This guide walks you through setting up Supabase authentication for Tangled.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name**: tangled (or your preferred name)
   - **Database Password**: Generate a secure password (save it somewhere safe)
   - **Region**: Choose closest to your users
5. Click **"Create new project"** (takes ~2 minutes)

## Step 2: Configure GitHub OAuth

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Find **GitHub** in the list and click to expand it
3. Enable the **GitHub** provider
4. You'll need to create a GitHub OAuth App:

### Create GitHub OAuth App

1. Go to [https://github.com/settings/developers](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: Tangled
   - **Homepage URL**: `https://cinnamon-msft.github.io/tangled/` (or your deployment URL)
   - **Authorization callback URL**: Copy from Supabase (should be `https://your-project.supabase.co/auth/v1/callback`)
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

### Configure Supabase with GitHub OAuth

1. Back in Supabase, paste:
   - **Client ID** from GitHub
   - **Client Secret** from GitHub
2. Click **"Save"**

## Step 3: Configure Redirect URLs

This is crucial for OAuth to work properly!

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your site URLs to **Redirect URLs** (one per line):
   ```
   http://localhost:3000/
   https://cinnamon-msft.github.io/tangled/
   ```
3. Click **"Save"**

**Note:** The trailing slash is important for GitHub Pages!

## Step 4: Get Supabase API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (safe to use in frontend)

## Step 5: Configure Your Application

### Local Development

1. Create `frontend/.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GITHUB_REPO_OWNER=cinnamon-msft
VITE_GITHUB_REPO_NAME=tangled
```

2. Start your dev server:
```bash
cd frontend
npm run dev
```

### Production (GitHub Pages)

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

3. Update `.github/workflows/deploy.yml` to use the new secrets:

```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  VITE_GITHUB_REPO_OWNER: cinnamon-msft
  VITE_GITHUB_REPO_NAME: tangled
```

## Step 6: Test Authentication

1. Open your app locally or visit the deployed URL
2. Click **"Sign in with GitHub"**
3. Authorize the Supabase app
4. You should be redirected back and signed in!

## How It Works

- **Supabase** handles all OAuth flow complexities
- No backend code needed - Supabase is your backend
- GitHub access token is provided by Supabase after authentication
- Token is used to read/write to your GitHub repository
- Only the repository owner can edit (authorization check in app)

## Troubleshooting

### "Invalid redirect URI"
- Make sure the callback URL in GitHub OAuth app matches Supabase exactly
- Format: `https://your-project.supabase.co/auth/v1/callback`

### "Authentication failed"
- Check that GitHub provider is enabled in Supabase
- Verify Client ID and Secret are correct
- Make sure secrets are added to GitHub repository

### "Can't read environment variables"
- For local: create `.env.local` file with VITE_ prefixes
- For production: add secrets to GitHub Actions
- Restart dev server after changing .env files

## Security Notes

- ✅ Supabase anon key is safe to expose (it's public)
- ✅ OAuth client secret stays secure in Supabase
- ✅ GitHub tokens never exposed in frontend code
- ✅ Row Level Security policies can be added if using Supabase database

## Fallback: Token Authentication

Users can still use Personal Access Tokens:
1. Click **"Use token"** instead of OAuth button
2. Create a PAT at [https://github.com/settings/tokens](https://github.com/settings/tokens)
3. Select **repo** scope
4. Paste token once - it's saved in localStorage
