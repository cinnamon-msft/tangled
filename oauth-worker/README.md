# Tangled OAuth Worker

This Cloudflare Worker handles OAuth token exchange for the Tangled app.

## Setup

1. **Install dependencies:**
   ```bash
   cd oauth-worker
   npm install
   ```

2. **Create a GitHub OAuth App:**
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Settings:
     - Application name: `Tangled`
     - Homepage URL: `https://cinnamon-msft.github.io/tangled/`
     - Authorization callback URL: `https://cinnamon-msft.github.io/tangled/`
   - Copy the **Client ID** and generate a **Client Secret**

3. **Set secrets in Cloudflare:**
   ```bash
   npx wrangler secret put GITHUB_CLIENT_ID
   # Paste your Client ID when prompted
   
   npx wrangler secret put GITHUB_CLIENT_SECRET
   # Paste your Client Secret when prompted
   ```

4. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

5. **Update frontend environment:**
   After deployment, copy the worker URL (e.g., `https://tangled-oauth-proxy.your-subdomain.workers.dev`)
   
   Update `frontend/.env.local`:
   ```env
   VITE_OAUTH_PROXY_URL=https://tangled-oauth-proxy.your-subdomain.workers.dev
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   ```

## Development

Run locally:
```bash
npm run dev
```

## How It Works

1. User clicks "Sign in with GitHub" → redirected to GitHub OAuth
2. GitHub redirects back with a `code` parameter
3. Frontend sends code to this worker
4. Worker exchanges code for access token using client secret
5. Worker returns access token to frontend
6. Frontend uses token for GitHub API calls

This keeps the client secret secure on the server side.
