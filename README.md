# 🧶 Tangled

A crafts project tracker for knitting, crochet, and embroidery - manage your yarn stash, track completed projects, and plan future creations. Deployed as a static site on GitHub Pages with GitHub OAuth authentication.

## Features

- **Projects**: Track your current and completed crafting projects with detailed information
  - Support for knitting, crochet, and embroidery
  - Track status (Planning, In Progress, Completed)
  - Link materials/yarn used in each project
  - Store pattern details and notes
  
- **Materials**: Manage your yarn stash and materials inventory
  - Track brand, color, weight, and fiber content
  - Monitor remaining yardage
  - Add purchase details and notes
  
- **Ideas**: Save project ideas and inspiration for future creations
  - Store descriptions and inspiration links
  - Track estimated difficulty
  - Keep notes on desired materials

- **GitHub Authentication**: Secure sign-in with GitHub OAuth
  - Create, edit, and delete data only when authenticated
  - Changes are committed directly to your GitHub repository
  - Full git history of all data changes

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite 7 for build tooling and bundling
- Tailwind CSS 4 for styling
- React Router 7 for navigation
- TanStack Query 5 (React Query) for data fetching and caching

**Authentication & Data Persistence:**
- GitHub OAuth Device Flow (no backend required)
- GitHub API for data storage (JSON files in repository)
- Last-write-wins strategy for conflict resolution
- Static site deployment via GitHub Pages

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- A GitHub account
- Admin access to this repository (for OAuth setup)

## Getting Started

### 1. GitHub OAuth Setup

Before running the application, you need to set up GitHub OAuth authentication. Follow the comprehensive guide in [GITHUB_SETUP.md](./GITHUB_SETUP.md) which covers:

- Creating a GitHub OAuth App
- Enabling GitHub Pages
- Configuring Actions permissions
- Adding repository secrets
- Local environment setup

### 2. Local Development

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local` and add your OAuth Client ID:**
   ```env
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   VITE_GITHUB_REPO_OWNER=cinnamon-msft
   VITE_GITHUB_REPO_NAME=tangled
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`

### 3. Authentication Flow

1. Click **"Sign in with GitHub"** in the navbar
2. A modal will appear with a device code
3. The GitHub authorization page will open automatically
4. Enter the code on GitHub to authorize the app
5. Once authorized, you'll be logged in automatically
6. You can now create, edit, and delete projects, materials, and ideas

### 4. Deployment

The application automatically deploys to GitHub Pages when you push to the `main` branch:

1. **Ensure you've completed the GitHub OAuth setup** (see GITHUB_SETUP.md)
2. **Push to main branch:**
   ```bash
   git push origin main
   ```
3. **GitHub Actions will automatically:**
   - Build the application
   - Deploy to GitHub Pages
4. **Access your site at:** `https://cinnamon-msft.github.io/tangled/`

## Sample Data

The application comes with sample data to help you get started:

**Projects:**
- Cozy Winter Scarf (Knitting, Completed)
- GArchitecture

### Overview

Tangled is a **fully static web application** that uses GitHub as its backend:

- **Frontend**: React SPA deployed to GitHub Pages
- **Authentication**: GitHub OAuth Device Flow (no backend server needed)
- **Data Storage**: JSON files in the repository (`frontend/public/data/`)
- **Data Persistence**: GitHub API commits changes directly to the repo
- **Conflict Resolution**: Last-write-wins strategy (always uses latest file SHA)

### How It Works

1. **Reading Data**: The app fetches static JSON files from `/data/` directory
2. **Authentication**: Users sign in with GitHub OAuth to gain write access
3. **Writing Data**: Authenticated users can create/update/delete items
4. **Persistence**: Changes are committed directly to the GitHub repo via the API
5. **Sync Detection**: App automatically detects when remote data is newer and refreshes
6. **Git History**: All changes are tracked in git commits for full audit trail

### Project Structure

```
tangled/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── frontend/
│   ├── public/
│   │   └── data/               # Static JSON data files
│   │       ├── projects.json   # Projects data
│   │       ├── materials.json  # Materials data
│   │       └── ideas.json      # Project ideas data
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── DeviceFlowModal.tsx
│   │   │   ├── ConfirmDeleteModal.tsx
│   │   │   └── ...
│   │   ├── contexts/           # React contexts
│   │   │   ├── AuthContext.tsx # GitHub OAuth authentication
│   │   │   └── SyncContext.tsx # Sync status tracking
│   │   ├── pages/              # Page components
│   │   ├── services/           # External services
│   │   │   └── github.ts       # GitHub API integration
│   │   ├── api.ts              # Data access layer
│   │   └── types.ts            # TypeScript type definitions
│   ├── .env.example            # Environment variables template
│   └── package.json
├── GITHUB_SETUP.md             # Detailed OAuth setup guide
└── README.md
```

### Data Format

All data is stored in JSON files with metadata:

```json
{
  "_metadata": {
    "lastSynced": "2025-11-17T00:00:00.000Z",
    "version": "1.0.0"
  },
  "projects": [
    {
      "id": 1,
      "name": "Cozy Winter Scarf",
      "craftType": 0,
      "status": 2,
      ...
    }
  ]
}
```

### Authentication & Authorization

- **Public Access**: Anyone can view projects, materials, and ideas
- **Authenticated Access**: Only authenticated users can create, edit, or delete items
- **OAuth Scopes**: Requires `repo` scope to commit changes
- **Token Storage**: Access tokens stored securely in browser localStorage
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

- `GET /api/materials` - Get all materials
- `POST /api/materials` - Create new material
- `PUT /api/materials/{id}` - Update material
- `DELETE /api/materials/{id}` - Delete material

- `GET /api/projectideas` - Get all project ideas
- `POST /api/projectideas` - Create new idea
- `PUT /api/projectideas/{id}` - Update idea
- `DELETE /api/projectideas/{id}` - Delete idea

## License

MIT
