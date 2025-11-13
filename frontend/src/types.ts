// Enums matching backend
export enum CraftType {
  Knitting = 0,
  Crochet = 1,
  Embroidery = 2,
}

export enum ProjectStatus {
  Planning = 0,
  InProgress = 1,
  Completed = 2,
}

export enum YarnWeight {
  Lace = 0,
  Fingering = 1,
  Sport = 2,
  DK = 3,
  Worsted = 4,
  Bulky = 5,
  SuperBulky = 6,
  Jumbo = 7,
}

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
