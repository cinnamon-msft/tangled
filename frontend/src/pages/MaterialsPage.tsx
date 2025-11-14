import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { materialsApi } from '../api';
import { YarnWeight, Material } from '../types';
import CreateMaterialModal from '../components/CreateMaterialModal';
import EditMaterialModal from '../components/EditMaterialModal';

export default function MaterialsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials'],
    queryFn: materialsApi.getAll,
  });

  const getYarnWeightLabel = (weight?: YarnWeight) => {
    if (weight === undefined) return 'N/A';
    switch (weight) {
      case YarnWeight.Lace: return 'Lace';
      case YarnWeight.Fingering: return 'Fingering';
      case YarnWeight.Sport: return 'Sport';
      case YarnWeight.DK: return 'DK';
      case YarnWeight.Worsted: return 'Worsted';
      case YarnWeight.Bulky: return 'Bulky';
      case YarnWeight.SuperBulky: return 'Super Bulky';
      case YarnWeight.Jumbo: return 'Jumbo';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading materials...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading materials: {error.message}
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Materials</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Add Material
        </button>
      </div>

      <CreateMaterialModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {editingMaterial && (
        <EditMaterialModal
          isOpen={!!editingMaterial}
          onClose={() => setEditingMaterial(null)}
          material={editingMaterial}
        />
      )}

      {!materials || materials.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No materials yet. Add your first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div key={material.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{material.name}</h3>
                <button
                  onClick={() => setEditingMaterial(material)}
                  className="text-gray-500 hover:text-purple-600 transition-colors"
                  title="Edit material"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2 text-sm">
                {material.brand && (
                  <p className="text-gray-600">
                    <span className="font-medium">Brand:</span> {material.brand}
                  </p>
                )}
                {material.color && (
                  <p className="text-gray-600">
                    <span className="font-medium">Color:</span> {material.color}
                  </p>
                )}
                {material.weight !== undefined && (
                  <p className="text-gray-600">
                    <span className="font-medium">Weight:</span> {getYarnWeightLabel(material.weight)}
                  </p>
                )}
                {material.fiberContent && (
                  <p className="text-gray-600">
                    <span className="font-medium">Fiber:</span> {material.fiberContent}
                  </p>
                )}
                {material.yardage && (
                  <div className="text-gray-600">
                    <span className="font-medium">Yardage:</span>{' '}
                    {material.remainingYardage !== undefined
                      ? `${material.remainingYardage} / ${material.yardage} yds`
                      : `${material.yardage} yds`}
                  </div>
                )}
                {material.skeinQuantity && (
                  <p className="text-gray-600">
                    <span className="font-medium">Skeins:</span> {material.skeinQuantity}
                  </p>
                )}
                {material.notes && (
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">{material.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
