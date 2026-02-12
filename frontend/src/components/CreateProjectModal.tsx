import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { CreateProject, CraftType, ProjectStatus } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Standard crochet hook sizes (US)
const CROCHET_HOOK_SIZES = [
  'B/1 (2.25mm)',
  'C/2 (2.75mm)',
  'D/3 (3.25mm)',
  'E/4 (3.5mm)',
  'F/5 (3.75mm)',
  'G/6 (4mm)',
  'H/8 (5mm)',
  'I/9 (5.5mm)',
  'J/10 (6mm)',
  'K/10.5 (6.5mm)',
  'L/11 (8mm)',
  'M/13 (9mm)',
  'N/15 (10mm)',
  'P/16 (12mm)',
  'Q (15mm)',
  'S (19mm)',
];

// Standard knitting needle sizes (US)
const KNITTING_NEEDLE_SIZES = [
  '0 (2mm)',
  '1 (2.25mm)',
  '1.5 (2.5mm)',
  '2 (2.75mm)',
  '2.5 (3mm)',
  '3 (3.25mm)',
  '4 (3.5mm)',
  '5 (3.75mm)',
  '6 (4mm)',
  '7 (4.5mm)',
  '8 (5mm)',
  '9 (5.5mm)',
  '10 (6mm)',
  '10.5 (6.5mm)',
  '11 (8mm)',
  '13 (9mm)',
  '15 (10mm)',
  '17 (12.75mm)',
  '19 (15mm)',
  '35 (19mm)',
  '50 (25mm)',
];

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateProject>({
    name: '',
    craftType: CraftType.Knitting,
    status: ProjectStatus.Planning,
    isFavorite: false,
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
      setFormData({
        name: '',
        craftType: CraftType.Knitting,
        status: ProjectStatus.Planning,
        isFavorite: false,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      createMutation.mutate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">New Project</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Craft Type
              </label>
              <select
                value={formData.craftType}
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
                value={formData.status}
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

            {/* Only show hook/needle size for knitting and crochet, not embroidery */}
            {(formData.craftType === CraftType.Knitting || formData.craftType === CraftType.Crochet) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.craftType === CraftType.Crochet ? 'Hook Size' : 'Needle Size'}
                </label>
                <select
                  value={formData.hookOrNeedleSize || ''}
                  onChange={(e) => setFormData({ ...formData, hookOrNeedleSize: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a size</option>
                  {(formData.craftType === CraftType.Crochet ? CROCHET_HOOK_SIZES : KNITTING_NEEDLE_SIZES).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completion Date
              </label>
              <input
                type="date"
                value={formData.completionDate || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  completionDate: e.target.value,
                  status: e.target.value ? ProjectStatus.Completed : formData.status
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFavorite}
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
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
