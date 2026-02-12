import { Material, Project, ProjectIdea, CreateMaterial, UpdateMaterial, CreateProject, UpdateProject, CreateProjectIdea, UpdateProjectIdea } from './types';

const API_BASE_URL = '/api';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Projects API
export const projectsApi = {
  getAll: () => apiCall<Project[]>('/projects'),
  getById: (id: number) => apiCall<Project>(`/projects/${id}`),
  create: (project: CreateProject) =>
    apiCall<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),
  update: (project: UpdateProject) =>
    apiCall<void>(`/projects/${project.id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    }),
  delete: (id: number) =>
    apiCall<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
  uploadImage: async (projectId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/images`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }
    return response.json();
  },
  deleteImage: async (projectId: number, imageId: number) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/images/${imageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Image deletion failed: ${response.statusText}`);
    }
  },
};

// Materials API
export const materialsApi = {
  getAll: () => apiCall<Material[]>('/materials'),
  getById: (id: number) => apiCall<Material>(`/materials/${id}`),
  create: (material: CreateMaterial) =>
    apiCall<Material>('/materials', {
      method: 'POST',
      body: JSON.stringify(material),
    }),
  update: (material: UpdateMaterial) =>
    apiCall<void>(`/materials/${material.id}`, {
      method: 'PUT',
      body: JSON.stringify(material),
    }),
  delete: (id: number) =>
    apiCall<void>(`/materials/${id}`, {
      method: 'DELETE',
    }),
  uploadImage: async (materialId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/materials/${materialId}/images`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }
    return response.json();
  },
  deleteImage: async (materialId: number, imageId: number) => {
    const response = await fetch(`${API_BASE_URL}/materials/${materialId}/images/${imageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Image deletion failed: ${response.statusText}`);
    }
  },
};

// Project Ideas API
export const projectIdeasApi = {
  getAll: () => apiCall<ProjectIdea[]>('/projectideas'),
  getById: (id: number) => apiCall<ProjectIdea>(`/projectideas/${id}`),
  create: (idea: CreateProjectIdea) =>
    apiCall<ProjectIdea>('/projectideas', {
      method: 'POST',
      body: JSON.stringify(idea),
    }),
  update: (idea: UpdateProjectIdea) =>
    apiCall<void>(`/projectideas/${idea.id}`, {
      method: 'PUT',
      body: JSON.stringify(idea),
    }),
  delete: (id: number) =>
    apiCall<void>(`/projectideas/${id}`, {
      method: 'DELETE',
    }),
  uploadImage: async (ideaId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/projectideas/${ideaId}/images`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }
    return response.json();
  },
  deleteImage: async (ideaId: number, imageId: number) => {
    const response = await fetch(`${API_BASE_URL}/projectideas/${ideaId}/images/${imageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Image deletion failed: ${response.statusText}`);
    }
  },
};
