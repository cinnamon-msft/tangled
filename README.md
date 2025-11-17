# 🧶 Tangled

A crafts project tracker for knitting, crochet, and embroidery - manage your yarn stash, track completed projects, and plan future creations.

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

## Tech Stack

**Backend:**
- ASP.NET Core 10 Web API (Minimal APIs)
- Entity Framework Core with SQLite
- C# / .NET 10

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- TanStack Query (React Query) for data fetching

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) (v18 or later)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. The database is already set up with migrations. If needed, you can recreate it:
   ```bash
   dotnet ef database drop --project Tangled.Data --startup-project Tangled.Api
   dotnet ef database update --project Tangled.Data --startup-project Tangled.Api
   ```

4. Run the API:
   ```bash
   cd Tangled.Api
   dotnet run
   ```

   The API will start at `http://localhost:5000` (and `https://localhost:5001`)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

### Running Both Servers

You'll need two terminal windows:
- **Terminal 1**: Run the backend API from `backend/Tangled.Api`
- **Terminal 2**: Run the frontend dev server from `frontend`

The frontend is configured to proxy API requests to `http://localhost:5000`

## Sample Data

The application comes with sample data to help you get started:

**Projects:**
- Cozy Winter Scarf (Knitting, Completed)
- Granny Square Blanket (Crochet, In Progress)
- Floral Embroidery Hoop (Embroidery, Completed)

**Materials:**
- Wool-Ease Yarn (Navy, Worsted)
- Cotton Yarn (Hot Pink, Worsted)
- Baby Alpaca Fingering (Sage Green, Fingering)

**Project Ideas:**
- Lace Shawl
- Amigurumi Octopus

## Development

### Project Structure

```
tangled/
├── backend/
│   ├── Tangled.Api/        # Web API project
│   ├── Tangled.Core/       # Domain entities and enums
│   ├── Tangled.Data/       # EF Core DbContext and migrations
│   └── Tangled.sln         # Solution file
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── api.ts          # API service layer
│   │   └── types.ts        # TypeScript types
│   └── package.json
└── README.md
```

### API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
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

