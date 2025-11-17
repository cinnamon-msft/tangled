# OAuth Setup Guide

This guide will help you set up GitHub OAuth with Cloudflare Workers for the Tangled app.

## Prerequisites

- A Cloudflare account (free tier works fine)
- Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: Deploy the OAuth Worker

1. **Navigate to the oauth-worker directory:**
   ```bash
   cd oauth-worker
   npm install
   ```

2. **Login to Cloudflare:**
   ```bash
   npx wrangler login
   ```

3. **Deploy the worker:**
   ```bash
   npm run deploy
   ```
   
   Copy the worker URL (e.g., `https://tangled-oauth-proxy.your-subdomain.workers.dev`)

## Step 2: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name:** Tangled
   - **Homepage URL:** `https://cinnamon-msft.github.io/tangled/`
   - **Authorization callback URL:** `https://cinnamon-msft.github.io/tangled/`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

## Step 3: Configure Cloudflare Secrets

Set your GitHub OAuth credentials as Cloudflare Worker secrets:

```bash
cd oauth-worker

# Set Client ID
npx wrangler secret put GITHUB_CLIENT_ID
# Paste your Client ID when prompted

# Set Client Secret
npx wrangler secret put GITHUB_CLIENT_SECRET
# Paste your Client Secret when prompted
```

## Step 4: Configure GitHub Repository Secrets

1. Go to https://github.com/cinnamon-msft/tangled/settings/secrets/actions
2. Add these secrets:
   - **VITE_GITHUB_CLIENT_ID:** Your OAuth App Client ID
   - **VITE_OAUTH_PROXY_URL:** Your Cloudflare Worker URL from Step 1

## Step 5: Test Locally (Optional)

To test the OAuth flow locally:

1. **Create `frontend/.env.local`:**
   ```env
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   VITE_OAUTH_PROXY_URL=http://localhost:8787
   VITE_GITHUB_REPO_OWNER=cinnamon-msft
   VITE_GITHUB_REPO_NAME=tangled
   VITE_GITHUB_BRANCH=main
   ```

2. **Run the worker locally:**
   ```bash
   cd oauth-worker
   npm run dev
   ```

3. **Run the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Update your GitHub OAuth App callback URL temporarily:**
   - Add `http://localhost:5173/` to the callback URLs

## Step 6: Deploy

Push your changes to the main branch:

```bash
git add .
git commit -m "feat: Add OAuth flow with Cloudflare Workers"
git push origin main
```

GitHub Actions will automatically deploy the app with the new OAuth flow!

## How It Works

1. User clicks "Sign in with GitHub"
2. Frontend redirects to GitHub OAuth page
3. User authorizes the app
4. GitHub redirects back with a code
5. Frontend sends code to Cloudflare Worker
6. Worker exchanges code for access token (using client secret)
7. Worker returns token to frontend
8. Frontend saves token and fetches user info

## Troubleshooting

- **"OAuth proxy is not configured"**: Make sure `VITE_OAUTH_PROXY_URL` is set in GitHub Secrets
- **"Failed to fetch"**: Check that the Cloudflare Worker is deployed and the URL is correct
- **CORS errors**: Verify the `ALLOWED_ORIGIN` in `wrangler.toml` matches your GitHub Pages URL
- **"Invalid client"**: Double-check your Client ID and Secret in Cloudflare Worker secrets

## Security Notes

- Client secret is stored securely in Cloudflare Workers (never exposed to browser)
- Access tokens are stored in browser localStorage (standard OAuth practice)
- CORS is restricted to your GitHub Pages domain only
- State parameter provides CSRF protection
