import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { Project, UpdateProject, CraftType, ProjectStatus } from '../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UpdateProject>(() => ({
    id: project.id,
    name: project.name,
    craftType: project.craftType,
    status: project.status,
    patternName: project.patternName,
    patternLink: project.patternLink,
    hookOrNeedleSize: project.hookOrNeedleSize,
    notes: project.notes,
    startDate: project.startDate,
    completionDate: project.completionDate,
    isFavorite: project.isFavorite,
  }));

  const updateMutation = useMutation({
    mutationFn: projectsApi.update,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Project</h2>
          
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
                Craft Type
              </label>
              <select
                value={formData.craftType ?? ''}
                onChange={(e) => setFormData({ ...formData, craftType: Number(e.target.value) as CraftType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={CraftType.Knitting}>Knitting</option>
                <option value={CraftType.Crochet}>Crochet</option>
                <option value={CraftType.Embroidery}>Embroidery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status ?? ''}
                onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) as ProjectStatus })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={ProjectStatus.Planning}>Planning</option>
                <option value={ProjectStatus.InProgress}>In Progress</option>
                <option value={ProjectStatus.Completed}>Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pattern Name
              </label>
              <input
                type="text"
                value={formData.patternName || ''}
                onChange={(e) => setFormData({ ...formData, patternName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pattern Link
              </label>
              <input
                type="url"
                value={formData.patternLink || ''}
                onChange={(e) => setFormData({ ...formData, patternLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hook/Needle Size
              </label>
              <input
                type="text"
                value={formData.hookOrNeedleSize || ''}
                onChange={(e) => setFormData({ ...formData, hookOrNeedleSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFavorite ?? false}
                  onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Favorite</span>
              </label>
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
                {updateMutation.isPending ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
