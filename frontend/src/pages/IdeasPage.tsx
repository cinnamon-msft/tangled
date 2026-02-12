import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectIdeasApi } from '../api';
import { ProjectIdea } from '../types';
import CreateIdeaModal from '../components/CreateIdeaModal';
import EditIdeaModal from '../components/EditIdeaModal';

export default function IdeasPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ProjectIdea | null>(null);
  const { data: ideas, isLoading, error } = useQuery({
    queryKey: ['projectIdeas'],
    queryFn: projectIdeasApi.getAll,
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading ideas...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading ideas: {error.message}
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Project Ideas</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          New Idea
        </button>
      </div>

      <CreateIdeaModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {editingIdea && (
        <EditIdeaModal
          key={editingIdea.id}
          isOpen={!!editingIdea}
          onClose={() => setEditingIdea(null)}
          idea={editingIdea}
        />
      )}

      {!ideas || ideas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No ideas yet. Save your first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{idea.name}</h3>
                <button
                  onClick={() => setEditingIdea(idea)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Edit idea"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2 text-sm">
                {idea.description && (
                  <p className="text-gray-600">{idea.description}</p>
                )}
                {idea.estimatedDifficulty && (
                  <div>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      {idea.estimatedDifficulty}
                    </span>
                  </div>
                )}
                {idea.inspirationLinks && (
                  <p className="text-blue-600 text-xs hover:underline">
                    <a href={idea.inspirationLinks} target="_blank" rel="noopener noreferrer">
                      View Inspiration
                    </a>
                  </p>
                )}
                {idea.notes && (
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">{idea.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
