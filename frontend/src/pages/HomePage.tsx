import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { ProjectStatus, CraftType } from '../types';

export default function HomePage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  // Filter only completed projects
  const completedProjects = projects?.filter(
    (project) => project.status === ProjectStatus.Completed
  ) || [];

  const getCraftTypeLabel = (type: CraftType) => {
    switch (type) {
      case CraftType.Knitting: return '🧶 Knitting';
      case CraftType.Crochet: return '🪡 Crochet';
      case CraftType.Embroidery: return '🪡 Embroidery';
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

      {/* Completed Projects Gallery */}
      {!isLoading && completedProjects.length > 0 && (
        <div className="mb-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Completed Projects Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <Link
                key={project.id}
                to="/projects"
                className="group relative bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Project Image or Placeholder */}
                <div className={`h-48 bg-gradient-to-br ${getPlaceholderImage(project.craftType)} flex items-center justify-center`}>
                  <span className="text-6xl text-white opacity-80">
                    {project.craftType === CraftType.Knitting && '🧶'}
                    {project.craftType === CraftType.Crochet && '🪡'}
                    {project.craftType === CraftType.Embroidery && '🪡'}
                  </span>
                </div>
                
                {/* Project Info Overlay */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {project.name}
                    </h3>
                    {project.isFavorite && <span className="text-xl">⭐</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {getCraftTypeLabel(project.craftType)}
                  </p>
                  {project.completionDate && (
                    <p className="text-xs text-gray-400">
                      Completed: {new Date(project.completionDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link
          to="/projects"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Projects</h2>
          <p className="text-gray-600">
            Track your current and completed crafting projects
          </p>
        </Link>
        <Link
          to="/materials"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">🧵</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Materials</h2>
          <p className="text-gray-600">
            Manage your yarn stash and materials inventory
          </p>
        </Link>
        <Link
          to="/ideas"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">💡</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ideas</h2>
          <p className="text-gray-600">
            Save project ideas and inspiration for the future
          </p>
        </Link>
      </div>
    </div>
  );
}
