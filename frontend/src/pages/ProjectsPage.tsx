import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { CraftType, ProjectStatus, Project } from '../types';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  // Group projects by craft type
  const knittingProjects = projects?.filter(p => p.craftType === CraftType.Knitting) || [];
  const crochetProjects = projects?.filter(p => p.craftType === CraftType.Crochet) || [];
  const embroideryProjects = projects?.filter(p => p.craftType === CraftType.Embroidery) || [];

  const renderProjectCard = (project: Project) => (
    <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
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
    </div>
  );

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

      {!projects || projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No projects yet. Create your first one!
        </div>
      ) : (
        <div className="space-y-12">
          {/* Knitting Projects */}
          {knittingProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🧶</span> Knitting Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {knittingProjects.map(renderProjectCard)}
              </div>
            </div>
          )}

          {/* Crochet Projects */}
          {crochetProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🪡</span> Crochet Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crochetProjects.map(renderProjectCard)}
              </div>
            </div>
          )}

          {/* Embroidery Projects */}
          {embroideryProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🪡</span> Embroidery Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {embroideryProjects.map(renderProjectCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
