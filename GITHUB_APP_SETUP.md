# GitHub App Authentication Guide

This app uses GitHub App authentication - a more secure and user-friendly approach than PATs.

## Benefits
- No manual token creation or copying
- Tokens auto-refresh every hour
- More secure than PATs
- Better permission granularity
- Works entirely client-side (no backend needed)

## Setup

### 1. Create a GitHub App

1. Go to https://github.com/settings/apps/new
2. Fill in the details:
   - **GitHub App name:** `Tangled App` (must be unique across GitHub)
   - **Homepage URL:** `https://cinnamon-msft.github.io/tangled/`
   - **Callback URL:** `https://cinnamon-msft.github.io/tangled/auth-callback`
   - **Setup URL:** Leave empty
   - **Webhook:** Uncheck "Active"
   
3. **Permissions:**
   - Repository permissions:
     - **Contents:** Read and write
     - **Metadata:** Read-only (automatically selected)

4. **Where can this GitHub App be installed?**
   - Select "Only on this account"

5. Click **Create GitHub App**

6. **Note down:**
   - App ID (shown on the app page)
   - Client ID (in the "OAuth" section)

7. **Generate a Client Secret:**
   - In the OAuth section, click "Generate a new client secret"
   - Copy the secret (you won't be able to see it again)

### 2. Install the App to Your Repository

1. On your GitHub App page, click **"Install App"** in the left sidebar
2. Select your account
3. Choose **"Only select repositories"**
4. Select the `tangled` repository
5. Click **Install**

### 3. Configure the Frontend

Add to `frontend/.env.local`:
```env
VITE_GITHUB_APP_CLIENT_ID=Iv1.xxxxxxxxx
VITE_GITHUB_REPO_OWNER=cinnamon-msft
VITE_GITHUB_REPO_NAME=tangled
VITE_GITHUB_BRANCH=main
```

### 4. Add GitHub Secrets (for deployment)

1. Go to https://github.com/cinnamon-msft/tangled/settings/secrets/actions
2. Add:
   - `VITE_GITHUB_APP_CLIENT_ID`: Your App's Client ID

### 5. Update OAuth Settings

The callback URL in your GitHub App must match:
- Development: `http://localhost:5173/auth-callback`
- Production: `https://cinnamon-msft.github.io/tangled/auth-callback`

You can add both URLs separated by newlines in the callback URL field.

## How It Works

1. User clicks "Sign in with GitHub"
2. Redirects to GitHub's OAuth page
3. User authorizes the app (one-time)
4. GitHub redirects back with a code
5. Frontend exchanges code for a token using GitHub's public API
6. Token is valid for 8 hours and auto-refreshes

## Security Notes

- Client secret is NOT exposed (we use GitHub's Device Flow alternative)
- Tokens are scoped only to your repository
- Tokens expire automatically
- You can revoke access anytime from GitHub settings

## Testing

Run the app locally:
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 and click "Sign in with GitHub"
