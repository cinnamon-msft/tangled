import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { ProjectStatus, CraftType, Project } from '../types';
import { useProjectOrder, ProjectOrderMap } from '../hooks/useProjectOrder';
import { useState } from 'react';

export default function HomePage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const { sortProjects, updateOrder } = useProjectOrder();
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

  // Filter projects by status
  const inProgressProjects = sortProjects(
    projects?.filter(
      (project) => project.status === ProjectStatus.InProgress
    ) || [],
    'inProgress'
  );

  const completedProjects = projects?.filter(
    (project) => project.status === ProjectStatus.Completed
  ) || [];

  const knittingProjects = sortProjects(
    completedProjects.filter(p => p.craftType === CraftType.Knitting),
    'knitting'
  );
  const crochetProjects = sortProjects(
    completedProjects.filter(p => p.craftType === CraftType.Crochet),
    'crochet'
  );
  const embroideryProjects = sortProjects(
    completedProjects.filter(p => p.craftType === CraftType.Embroidery),
    'embroidery'
  );

  const getCraftTypeLabel = (type: CraftType): string => {
    switch (type) {
      case CraftType.Knitting: return '🧶 Knitting';
      case CraftType.Crochet: return '🪡 Crochet';
      case CraftType.Embroidery: return '🪡 Embroidery';
      default: return '🧶 Craft';
    }
  };

  // Placeholder image based on craft type
  const getPlaceholderImage = (craftType: CraftType) => {
    const colors = {
      [CraftType.Knitting]: 'from-purple-400 to-pink-400',
      [CraftType.Crochet]: 'from-blue-400 to-cyan-400',
      [CraftType.Embroidery]: 'from-green-400 to-teal-400',
    };
    return colors[craftType] || 'from-gray-400 to-gray-500';
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, projectId: number) => {
    setDraggedItemId(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetProjectId: number, section: keyof ProjectOrderMap) => {
    e.preventDefault();
    
    if (draggedItemId === null || draggedItemId === targetProjectId) {
      return;
    }

    // Get the current list for this section
    let currentList: Project[];
    switch (section) {
      case 'inProgress':
        currentList = inProgressProjects;
        break;
      case 'knitting':
        currentList = knittingProjects;
        break;
      case 'crochet':
        currentList = crochetProjects;
        break;
      case 'embroidery':
        currentList = embroideryProjects;
        break;
    }

    const draggedIndex = currentList.findIndex(p => p.id === draggedItemId);
    const targetIndex = currentList.findIndex(p => p.id === targetProjectId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    // Reorder the list
    const newList = [...currentList];
    const [removed] = newList.splice(draggedIndex, 1);
    newList.splice(targetIndex, 0, removed);

    // Update the order in storage
    updateOrder(newList.map(p => p.id), section);
    setDraggedItemId(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  // Helper function to render a draggable project card
  const renderProjectCard = (project: Project, section: keyof ProjectOrderMap, emoji: string) => (
    <div
      key={project.id}
      draggable
      onDragStart={(e) => handleDragStart(e, project.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, project.id, section)}
      onDragEnd={handleDragEnd}
      className={`cursor-move ${draggedItemId === project.id ? 'opacity-50' : ''}`}
    >
      <Link
        to="/projects"
        className="group relative bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden block"
      >
        <div className="absolute top-2 left-2 z-10 bg-white rounded-full p-2 shadow opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-gray-600 text-sm" role="button" aria-label="Drag to reorder">⋮⋮</span>
        </div>
        <div className={`h-48 bg-gradient-to-br ${getPlaceholderImage(project.craftType)} flex items-center justify-center`}>
          <span className="text-6xl text-white opacity-80">{emoji}</span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {project.name}
            </h3>
            {project.isFavorite && <span className="text-xl">⭐</span>}
          </div>
          {section === 'inProgress' && (
            <>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-2">{getCraftTypeLabel(project.craftType)}</span>
              </div>
              {project.startDate && (
                <p className="text-xs text-gray-400">
                  Started: {new Date(project.startDate).toLocaleDateString()}
                </p>
              )}
            </>
          )}
          {section !== 'inProgress' && project.completionDate && (
            <p className="text-xs text-gray-400">
              Completed: {new Date(project.completionDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </Link>
    </div>
  );

  return (
    <div className="px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Tangled
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal crafts project tracker for knitting, crochet, and embroidery
        </p>
      </div>

      {/* Works in Progress Section */}
      {!isLoading && inProgressProjects.length > 0 && (
        <div className="mb-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🚧</span> Works in Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {inProgressProjects.map((project) => 
              renderProjectCard(project, 'inProgress', getCraftTypeLabel(project.craftType).split(' ')[0])
            )}
          </div>
        </div>
      )}

      {/* Completed Projects Gallery by Craft Type */}
      {!isLoading && completedProjects.length > 0 && (
        <div className="mb-16 max-w-6xl mx-auto space-y-12">
          {/* Knitting Projects */}
          {knittingProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🧶</span> Knitting Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {knittingProjects.map((project) => 
                  renderProjectCard(project, 'knitting', '🧶')
                )}
              </div>
            </div>
          )}

          {/* Crochet Projects */}
          {crochetProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🪡</span> Crochet Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {crochetProjects.map((project) => 
                  renderProjectCard(project, 'crochet', '🪡')
                )}
              </div>
            </div>
          )}

          {/* Embroidery Projects */}
          {embroideryProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🪡</span> Embroidery Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {embroideryProjects.map((project) => 
                  renderProjectCard(project, 'embroidery', '🪡')
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
