import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { CraftType, ProjectStatus, Project } from '../types';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import ImageUpload from '../components/ImageUpload';

export default function ProjectsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const getCraftTypeLabel = (type: CraftType) => {
    switch (type) {
      case CraftType.Knitting: return '🧶 Knitting';
      case CraftType.Crochet: return '🪡 Crochet';
      case CraftType.Embroidery: return '🪡 Embroidery';
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning: return 'Planning';
      case ProjectStatus.InProgress: return 'In Progress';
      case ProjectStatus.Completed: return 'Completed';
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning: return 'bg-gray-100 text-gray-800';
      case ProjectStatus.InProgress: return 'bg-blue-100 text-blue-800';
      case ProjectStatus.Completed: return 'bg-green-100 text-green-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading projects...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading projects: {error.message}
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          New Project
        </button>
      </div>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {editingProject && (
        <EditProjectModal
          key={editingProject.id}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          project={editingProject}
        />
      )}

      {!projects || projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No projects yet. Create your first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <div className="flex items-center space-x-2">
                  {project.isFavorite && <span className="text-xl">⭐</span>}
                  <button
                    onClick={() => setEditingProject(project)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Edit project"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">{getCraftTypeLabel(project.craftType)}</span>
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                {project.patternName && (
                  <p className="text-gray-600">Pattern: {project.patternName}</p>
                )}
                {project.hookOrNeedleSize && (
                  <p className="text-gray-600">Size: {project.hookOrNeedleSize}</p>
                )}
                {project.notes && (
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">{project.notes}</p>
                )}
                {project.startDate && (
                  <p className="text-gray-400 text-xs">
                    Started: {new Date(project.startDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <ImageUpload
                entityId={project.id}
                images={project.projectImages}
                uploadFunction={projectsApi.uploadImage}
                deleteFunction={projectsApi.deleteImage}
                queryKey={['projects']}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
