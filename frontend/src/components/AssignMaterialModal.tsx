import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectMaterialsApi, projectsApi, materialsApi } from '../api';
import { CreateProjectMaterial } from '../types';

interface AssignMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignMaterialModal({ isOpen, onClose }: AssignMaterialModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateProjectMaterial>({
    projectId: 0,
    materialId: 0,
    yardsUsed: undefined,
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const { data: materials } = useQuery({
    queryKey: ['materials'],
    queryFn: materialsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: projectMaterialsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projectmaterials'] });
      onClose();
      setFormData({
        projectId: 0,
        materialId: 0,
        yardsUsed: undefined,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.projectId && formData.materialId) {
      createMutation.mutate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assign Material to Project</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project *
              </label>
              <select
                required
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={0}>Select a project...</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material *
              </label>
              <select
                required
                value={formData.materialId}
                onChange={(e) => setFormData({ ...formData, materialId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={0}>Select a material...</option>
                {materials?.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} {material.color ? `- ${material.color}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yards Used
              </label>
              <input
                type="number"
                min="0"
                value={formData.yardsUsed || ''}
                onChange={(e) => setFormData({ ...formData, yardsUsed: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Optional"
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
                disabled={createMutation.isPending || !formData.projectId || !formData.materialId}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
              >
                {createMutation.isPending ? 'Assigning...' : 'Assign Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
