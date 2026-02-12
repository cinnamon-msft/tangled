import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { materialsApi } from '../api';
import { YarnWeight } from '../types';
import CreateMaterialModal from '../components/CreateMaterialModal';
import AssignMaterialModal from '../components/AssignMaterialModal';

export default function MaterialsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
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
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAssignModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Assign to Project
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Add Material
          </button>
        </div>
      </div>

      <CreateMaterialModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      <AssignMaterialModal 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
      />

      {!materials || materials.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No materials yet. Add your first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div key={material.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{material.name}</h3>
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
                {material.projectMaterials && material.projectMaterials.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">Used in Projects:</p>
                    <div className="space-y-1">
                      {material.projectMaterials.map((pm) => (
                        <div key={pm.id} className="text-xs text-gray-600">
                          <span className="font-medium">{pm.project?.name}</span>
                          {pm.yardsUsed && <span className="text-gray-400"> • {pm.yardsUsed} yds</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
