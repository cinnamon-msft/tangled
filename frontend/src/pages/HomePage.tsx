import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { ProjectStatus, CraftType } from '../types';

export default function HomePage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  // Filter only completed projects and group by craft type
  const completedProjects = projects?.filter(
    (project) => project.status === ProjectStatus.Completed
  ) || [];

  const knittingProjects = completedProjects.filter(p => p.craftType === CraftType.Knitting);
  const crochetProjects = completedProjects.filter(p => p.craftType === CraftType.Crochet);
  const embroideryProjects = completedProjects.filter(p => p.craftType === CraftType.Embroidery);

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
                {knittingProjects.map((project) => (
                  <Link
                    key={project.id}
                    to="/projects"
                    className="group relative bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className={`h-48 bg-gradient-to-br ${getPlaceholderImage(project.craftType)} flex items-center justify-center`}>
                      <span className="text-6xl text-white opacity-80">🧶</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {project.name}
                        </h3>
                        {project.isFavorite && <span className="text-xl">⭐</span>}
                      </div>
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

          {/* Crochet Projects */}
          {crochetProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🪡</span> Crochet Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {crochetProjects.map((project) => (
                  <Link
                    key={project.id}
                    to="/projects"
                    className="group relative bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className={`h-48 bg-gradient-to-br ${getPlaceholderImage(project.craftType)} flex items-center justify-center`}>
                      <span className="text-6xl text-white opacity-80">🪡</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {project.name}
                        </h3>
                        {project.isFavorite && <span className="text-xl">⭐</span>}
                      </div>
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

          {/* Embroidery Projects */}
          {embroideryProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🪡</span> Embroidery Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {embroideryProjects.map((project) => (
                  <Link
                    key={project.id}
                    to="/projects"
                    className="group relative bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className={`h-48 bg-gradient-to-br ${getPlaceholderImage(project.craftType)} flex items-center justify-center`}>
                      <span className="text-6xl text-white opacity-80">🪡</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {project.name}
                        </h3>
                        {project.isFavorite && <span className="text-xl">⭐</span>}
                      </div>
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
        </div>
      )}
    </div>
  );
}
