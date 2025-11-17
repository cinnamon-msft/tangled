# GitHub OAuth Setup Guide

This guide walks you through setting up GitHub OAuth authentication for the Tangled application.

## Prerequisites

- A GitHub account
- Admin access to the `cinnamon-msft/tangled` repository
- Node.js 20+ installed locally

## Step 1: Create a GitHub OAuth App

1. Go to your GitHub account settings: https://github.com/settings/developers
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"** button
4. Fill in the application details:
   - **Application name**: `Tangled Craft Tracker`
   - **Homepage URL**: `https://cinnamon-msft.github.io/tangled`
   - **Application description**: (optional) `Personal craft project tracker`
   - **Authorization callback URL**: `https://cinnamon-msft.github.io/tangled`
5. Click **"Register application"**
6. On the app details page, note your **Client ID** (you'll need this in Step 3)
7. Click **"Generate a new client secret"** and save it securely (optional - not needed for Device Flow)

## Step 2: Enable GitHub Pages and Actions Permissions

### Enable GitHub Pages

1. Go to the repository settings: https://github.com/cinnamon-msft/tangled/settings
2. In the left sidebar, click **"Pages"**
3. Under **"Build and deployment"**:
   - **Source**: Select **"GitHub Actions"**
4. Click **"Save"**

### Configure Actions Permissions

1. Still in repository settings, click **"Actions"** → **"General"** in the left sidebar
2. Scroll down to **"Workflow permissions"**
3. Select **"Read and write permissions"**
4. Check ✅ **"Allow GitHub Actions to create and approve pull requests"**
5. Click **"Save"**

## Step 3: Add Client ID as Repository Secret

1. In repository settings, click **"Secrets and variables"** → **"Actions"** in the left sidebar
2. Click **"New repository secret"** button
3. Add the following secret:
   - **Name**: `VITE_GITHUB_CLIENT_ID`
   - **Secret**: (paste your OAuth App Client ID from Step 1)
4. Click **"Add secret"**

## Step 4: Configure Local Environment

1. Navigate to the `frontend/` directory
2. Create a `.env.local` file:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
3. Edit `.env.local` and add your Client ID:
   ```env
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   VITE_GITHUB_REPO_OWNER=cinnamon-msft
   VITE_GITHUB_REPO_NAME=tangled
   ```

## Step 5: Verify Setup

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:5173 in your browser
3. Click **"Sign in with GitHub"**
4. You should see a modal with a device code
5. Follow the instructions to authorize the app
6. After authorization, you should be logged in and see your GitHub avatar in the navbar

## How Authentication Works

This application uses **GitHub Device Flow** for authentication:

1. When you click "Sign in with GitHub", the app requests a device code from GitHub
2. A modal displays the code and automatically opens https://github.com/login/device
3. You enter the code on GitHub to authorize the app
4. The app polls GitHub every 5 seconds until you complete authorization
5. Once authorized, your access token is stored in browser localStorage
6. The token is used to commit data changes back to the repository

## Data Persistence

All data is stored in JSON files in `frontend/public/data/`:
- `projects.json` - Your craft projects
- `materials.json` - Your yarn/materials stash
- `ideas.json` - Future project ideas

When you create, update, or delete items, the app commits changes directly to the GitHub repository using the GitHub API with your authenticated token.

## Security Notes

- ✅ OAuth Client IDs are **not secret** - they're embedded in the built JavaScript
- ✅ Your personal access token is stored locally and never shared
- ✅ Only you can modify data in the repository (requires authentication)
- ✅ All changes are tracked in git history
- ⚠️ If you revoke the OAuth app access, you'll need to sign in again

## Troubleshooting

### "Failed to authenticate" error
- Verify your Client ID is correct in `.env.local`
- Check that the OAuth app callback URL matches your deployment URL
- Try logging out and signing in again

### "403 Forbidden" when saving data
- Ensure you have write access to the repository
- Check that Actions permissions are set to "Read and write"
- Verify your token hasn't been revoked at https://github.com/settings/applications

### Page not deploying
- Check the Actions tab for workflow errors
- Verify the `VITE_GITHUB_CLIENT_ID` secret is set correctly
- Ensure GitHub Pages source is set to "GitHub Actions"

## Support

For issues or questions, please open an issue on the GitHub repository.
