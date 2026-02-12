import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ImageUploadProps {
  entityId: number;
  images?: Array<{
    id: number;
    fileName: string;
    filePath: string;
  }>;
  uploadFunction: (entityId: number, file: File) => Promise<any>;
  deleteFunction: (entityId: number, imageId: number) => Promise<void>;
  queryKey: string[];
}

export default function ImageUpload({
  entityId,
  images = [],
  uploadFunction,
  deleteFunction,
  queryKey,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFunction(entityId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (err: Error) => {
      setError(err.message);
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: number) => deleteFunction(entityId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);
    uploadMutation.mutate(file);
  };

  const handleDelete = (imageId: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteMutation.mutate(imageId);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">Images</h4>
        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 inline-block">
            {uploading ? 'Uploading...' : '+ Add Image'}
          </span>
        </label>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.filePath}
                alt={image.fileName}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                onClick={() => handleDelete(image.id)}
                disabled={deleteMutation.isPending}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                title="Delete image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-60 text-white text-xs p-1 rounded truncate">
                {image.fileName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic">No images yet</div>
      )}
    </div>
  );
}
