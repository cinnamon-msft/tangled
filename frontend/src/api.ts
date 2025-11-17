import { Material, Project, ProjectIdea, CreateMaterial, UpdateMaterial, CreateProject, UpdateProject, CreateProjectIdea, UpdateProjectIdea, DataFileWithMetadata } from './types';
import { commitJSONFile, getFileContent, decodeContent } from './services/github';

// Use import.meta.env.BASE_URL to respect Vite's base path configuration
const DATA_BASE_URL = `${import.meta.env.BASE_URL}data`.replace(/\/+/g, '/');

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('github_token');
}

// Helper to fetch static JSON files
async function fetchStaticJSON<T>(filename: string): Promise<DataFileWithMetadata<T>> {
  const response = await fetch(`${DATA_BASE_URL}/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
  }
  return response.json();
}

// Helper to check and fetch latest data from GitHub if stale
async function checkAndRefreshData<T>(
  filename: string,
  localData: DataFileWithMetadata<T>
): Promise<DataFileWithMetadata<T>> {
  const token = getAuthToken();
  if (!token) {
    return localData; // Not authenticated, use local data
  }

  try {
    // Fetch from GitHub to check if remote is newer
    const githubFile = await getFileContent(`frontend/public/data/${filename}`, token);
    const remoteData: DataFileWithMetadata<T> = JSON.parse(decodeContent(githubFile.content));
    
    // Compare timestamps
    const localTime = new Date(localData._metadata.lastSynced);
    const remoteTime = new Date(remoteData._metadata.lastSynced);
    
    if (remoteTime > localTime) {
      console.log(`Remote data for ${filename} is newer, using remote version`);
      return remoteData;
    }
  } catch (error) {
    console.error(`Failed to check remote data for ${filename}:`, error);
  }
  
  return localData;
}

// Helper to commit data changes to GitHub
async function commitDataFile<T>(
  filename: string,
  data: T[],
  message: string
): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated. Please sign in to make changes.');
  }

  const fileData: DataFileWithMetadata<T> = {
    _metadata: {
      lastSynced: new Date().toISOString(),
      version: '1.0.0',
    },
    [filename.replace('.json', '')]: data,
  };

  await commitJSONFile(
    `frontend/public/data/${filename}`,
    fileData,
    message,
    token
  );
}

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const data = await fetchStaticJSON<Project>('projects.json');
    const refreshedData = await checkAndRefreshData('projects.json', data);
    return refreshedData.projects as Project[];
  },
  
  getById: async (id: number): Promise<Project> => {
    const projects = await projectsApi.getAll();
    const project = projects.find((p) => p.id === id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return project;
  },
  
  create: async (project: CreateProject): Promise<Project> => {
    const projects = await projectsApi.getAll();
    const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    const now = new Date().toISOString();
    
    const newProject: Project = {
      ...project,
      id: newId,
      createdAt: now,
      updatedAt: now,
      projectMaterials: [],
      projectImages: [],
    };
    
    const updatedProjects = [...projects, newProject];
    await commitDataFile('projects.json', updatedProjects, `Add project: ${project.name}`);
    
    return newProject;
  },
  
  update: async (project: UpdateProject): Promise<void> => {
    const projects = await projectsApi.getAll();
    const index = projects.findIndex((p) => p.id === project.id);
    
    if (index === -1) {
      throw new Error(`Project with id ${project.id} not found`);
    }
    
    const updatedProject: Project = {
      ...projects[index],
      ...project,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProjects = [
      ...projects.slice(0, index),
      updatedProject,
      ...projects.slice(index + 1),
    ];
    
    await commitDataFile('projects.json', updatedProjects, `Update project: ${updatedProject.name}`);
  },
  
  delete: async (id: number): Promise<void> => {
    const projects = await projectsApi.getAll();
    const project = projects.find((p) => p.id === id);
    
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    const updatedProjects = projects.filter((p) => p.id !== id);
    await commitDataFile('projects.json', updatedProjects, `Delete project: ${project.name}`);
  },
};

// Materials API
export const materialsApi = {
  getAll: async (): Promise<Material[]> => {
    const data = await fetchStaticJSON<Material>('materials.json');
    const refreshedData = await checkAndRefreshData('materials.json', data);
    return refreshedData.materials as Material[];
  },
  
  getById: async (id: number): Promise<Material> => {
    const materials = await materialsApi.getAll();
    const material = materials.find((m) => m.id === id);
    if (!material) {
      throw new Error(`Material with id ${id} not found`);
    }
    return material;
  },
  
  create: async (material: CreateMaterial): Promise<Material> => {
    const materials = await materialsApi.getAll();
    const newId = materials.length > 0 ? Math.max(...materials.map((m) => m.id)) + 1 : 1;
    const now = new Date().toISOString();
    
    const newMaterial: Material = {
      ...material,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedMaterials = [...materials, newMaterial];
    await commitDataFile('materials.json', updatedMaterials, `Add material: ${material.name}`);
    
    return newMaterial;
  },
  
  update: async (material: UpdateMaterial): Promise<void> => {
    const materials = await materialsApi.getAll();
    const index = materials.findIndex((m) => m.id === material.id);
    
    if (index === -1) {
      throw new Error(`Material with id ${material.id} not found`);
    }
    
    const updatedMaterial: Material = {
      ...materials[index],
      ...material,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedMaterials = [
      ...materials.slice(0, index),
      updatedMaterial,
      ...materials.slice(index + 1),
    ];
    
    await commitDataFile('materials.json', updatedMaterials, `Update material: ${updatedMaterial.name}`);
  },
  
  delete: async (id: number): Promise<void> => {
    const materials = await materialsApi.getAll();
    const material = materials.find((m) => m.id === id);
    
    if (!material) {
      throw new Error(`Material with id ${id} not found`);
    }
    
    const updatedMaterials = materials.filter((m) => m.id !== id);
    await commitDataFile('materials.json', updatedMaterials, `Delete material: ${material.name}`);
  },
};

// Project Ideas API
export const projectIdeasApi = {
  getAll: async (): Promise<ProjectIdea[]> => {
    const data = await fetchStaticJSON<ProjectIdea>('ideas.json');
    const refreshedData = await checkAndRefreshData('ideas.json', data);
    return refreshedData.ideas as ProjectIdea[];
  },
  
  getById: async (id: number): Promise<ProjectIdea> => {
    const ideas = await projectIdeasApi.getAll();
    const idea = ideas.find((i) => i.id === id);
    if (!idea) {
      throw new Error(`Project idea with id ${id} not found`);
    }
    return idea;
  },
  
  create: async (idea: CreateProjectIdea): Promise<ProjectIdea> => {
    const ideas = await projectIdeasApi.getAll();
    const newId = ideas.length > 0 ? Math.max(...ideas.map((i) => i.id)) + 1 : 1;
    const now = new Date().toISOString();
    
    const newIdea: ProjectIdea = {
      ...idea,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedIdeas = [...ideas, newIdea];
    await commitDataFile('ideas.json', updatedIdeas, `Add project idea: ${idea.name}`);
    
    return newIdea;
  },
  
  update: async (idea: UpdateProjectIdea): Promise<void> => {
    const ideas = await projectIdeasApi.getAll();
    const index = ideas.findIndex((i) => i.id === idea.id);
    
    if (index === -1) {
      throw new Error(`Project idea with id ${idea.id} not found`);
    }
    
    const updatedIdea: ProjectIdea = {
      ...ideas[index],
      ...idea,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedIdeas = [
      ...ideas.slice(0, index),
      updatedIdea,
      ...ideas.slice(index + 1),
    ];
    
    await commitDataFile('ideas.json', updatedIdeas, `Update project idea: ${updatedIdea.name}`);
  },
  
  delete: async (id: number): Promise<void> => {
    const ideas = await projectIdeasApi.getAll();
    const idea = ideas.find((i) => i.id === id);
    
    if (!idea) {
      throw new Error(`Project idea with id ${id} not found`);
    }
    
    const updatedIdeas = ideas.filter((i) => i.id !== id);
    await commitDataFile('ideas.json', updatedIdeas, `Delete project idea: ${idea.name}`);
  },
};
