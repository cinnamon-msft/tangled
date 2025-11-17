import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TokenInputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenInputModal({ isOpen, onClose }: TokenInputModalProps) {
  const { login } = useAuth();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(token);
      setToken('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateToken = () => {
    window.open('https://github.com/settings/tokens/new?scopes=repo&description=Tangled%20App', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Sign in to Tangled</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Authentication Required:</strong> This app needs a GitHub Personal Access Token to save your data directly to your repository.
            </p>
            <button
              onClick={handleCreateToken}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              → Create a new token on GitHub
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Personal Access Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Token must have <code className="bg-gray-100 px-1 rounded">repo</code> scope
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !token}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="border-t pt-4">
            <details className="text-xs text-gray-600">
              <summary className="cursor-pointer hover:text-gray-900 font-medium">
                How to create a Personal Access Token
              </summary>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Click "Create a new token on GitHub" above</li>
                <li>Give it a name like "Tangled App"</li>
                <li>Select the <code className="bg-gray-100 px-1 rounded">repo</code> scope</li>
                <li>Click "Generate token" at the bottom</li>
                <li>Copy the token and paste it above</li>
              </ol>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
