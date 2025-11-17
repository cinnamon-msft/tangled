import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectIdeasApi } from '../api';
import { ProjectIdea, UpdateProjectIdea } from '../types';

interface EditIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: ProjectIdea;
}

export default function EditIdeaModal({ isOpen, onClose, idea }: EditIdeaModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UpdateProjectIdea>(() => ({
    id: idea.id,
    name: idea.name,
    description: idea.description,
    inspirationLinks: idea.inspirationLinks,
    estimatedDifficulty: idea.estimatedDifficulty,
    notes: idea.notes,
  }));

  const updateMutation = useMutation({
    mutationFn: projectIdeasApi.update,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projectIdeas'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name?.trim()) {
      updateMutation.mutate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Project Idea</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Difficulty
              </label>
              <input
                type="text"
                value={formData.estimatedDifficulty || ''}
                onChange={(e) => setFormData({ ...formData, estimatedDifficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Beginner, Intermediate, Advanced"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspiration Links
              </label>
              <input
                type="url"
                value={formData.inspirationLinks || ''}
                onChange={(e) => setFormData({ ...formData, inspirationLinks: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Idea'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
