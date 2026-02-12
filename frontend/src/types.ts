// Enums matching backend
export type CraftType = 0 | 1 | 2;
export const CraftType = {
  Knitting: 0 as CraftType,
  Crochet: 1 as CraftType,
  Embroidery: 2 as CraftType,
} as const;

export type ProjectStatus = 0 | 1 | 2;
export const ProjectStatus = {
  Planning: 0 as ProjectStatus,
  InProgress: 1 as ProjectStatus,
  Completed: 2 as ProjectStatus,
} as const;

export type YarnWeight = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const YarnWeight = {
  Lace: 0 as YarnWeight,
  Fingering: 1 as YarnWeight,
  Sport: 2 as YarnWeight,
  DK: 3 as YarnWeight,
  Worsted: 4 as YarnWeight,
  Bulky: 5 as YarnWeight,
  SuperBulky: 6 as YarnWeight,
  Jumbo: 7 as YarnWeight,
} as const;

// Entities
export interface Material {
  id: number;
  name: string;
  brand?: string;
  color?: string;
  weight?: YarnWeight;
  fiberContent?: string;
  yardage?: number;
  remainingYardage?: number;
  skeinQuantity?: number;
  dyeLot?: string;
  purchaseDate?: string;
  purchasedAt?: string;
  purchasePrice?: number;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  craftType: CraftType;
  status: ProjectStatus;
  patternName?: string;
  patternLink?: string;
  hookOrNeedleSize?: string;
  notes?: string;
  startDate?: string;
  completionDate?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  projectMaterials?: ProjectMaterial[];
  projectImages?: ProjectImage[];
}

export interface ProjectMaterial {
  id: number;
  projectId: number;
  materialId: number;
  yardsUsed?: number;
  createdAt: string;
  material?: Material;
  project?: Project;
}

export interface ProjectIdea {
  id: number;
  name: string;
  description?: string;
  inspirationLinks?: string;
  estimatedDifficulty?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: number;
  projectId: number;
  fileName: string;
  filePath: string;
  uploadedAt: string;
  project?: Project;
}

// DTOs for creating/updating
export type CreateMaterial = Omit<Material, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMaterial = Partial<CreateMaterial> & { id: number };

export type CreateProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'projectMaterials' | 'projectImages'>;
export type UpdateProject = Partial<CreateProject> & { id: number };

export type CreateProjectIdea = Omit<ProjectIdea, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectIdea = Partial<CreateProjectIdea> & { id: number };
