import { useState, useEffect } from 'react';
import type { DeviceCodeResponse } from '../types';

interface DeviceFlowModalProps {
  isOpen: boolean;
  deviceCode: DeviceCodeResponse | null;
  onClose: () => void;
}

export default function DeviceFlowModal({
  isOpen,
  deviceCode,
  onClose,
}: DeviceFlowModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (deviceCode) {
      setTimeRemaining(deviceCode.expires_in);

      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [deviceCode]);

  const copyCode = async () => {
    if (deviceCode) {
      try {
        await navigator.clipboard.writeText(deviceCode.user_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !deviceCode) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign in with GitHub
          </h2>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              To complete sign in, follow these steps:
            </p>
            <ol className="text-left text-sm text-gray-700 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>
                  A new tab has opened to GitHub. If not,{' '}
                  <a
                    href={deviceCode.verification_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    click here
                  </a>
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>Copy the code below and paste it on GitHub</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>Authorize the application</span>
              </li>
            </ol>
          </div>

          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-500 mb-2">Your code:</p>
            <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider mb-3">
              {deviceCode.user_code}
            </p>
            <button
              onClick={copyCode}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Code expires in: {' '}
              <span className="font-semibold text-gray-700">
                {formatTime(timeRemaining)}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="ml-3 text-sm text-gray-600">
              Waiting for authorization...
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
