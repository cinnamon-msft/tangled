interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemName: string;
  itemType: 'project' | 'material' | 'idea';
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  itemName,
  itemType,
  onConfirm,
  onCancel,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  const typeLabel =
    itemType === 'project'
      ? 'project'
      : itemType === 'material'
      ? 'material'
      : 'idea';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete {typeLabel}?
          </h2>
          <p className="text-gray-600 text-center">
            Are you sure you want to delete{' '}
            <span className="font-semibold">"{itemName}"</span>? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
