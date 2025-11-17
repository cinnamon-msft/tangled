import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { DeviceCodeResponse, AccessTokenResponse, GitHubUser } from '../types';
import { setAuthErrorHandler } from '../services/github';

interface AuthContextType {
  user: GitHubUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  deviceCode: DeviceCodeResponse | null;
  login: () => Promise<void>;
  logout: () => void;
  handleAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_DEVICE_AUTH_URL = 'https://github.com/login/device/code';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceCode, setDeviceCode] = useState<DeviceCodeResponse | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('github_token');
    const storedUser = localStorage.getItem('github_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Set up auth error handler for github service
  useEffect(() => {
    setAuthErrorHandler(handleAuthError);
  }, []);

  const handleAuthError = () => {
    console.log('Authentication error detected, clearing session');
    logout();
    // Auto-trigger login after clearing
    setTimeout(() => {
      login();
    }, 100);
  };

  const login = async () => {
    if (!GITHUB_CLIENT_ID) {
      throw new Error('GitHub Client ID is not configured');
    }

    try {
      // Step 1: Request device code
      const deviceResponse = await fetch(GITHUB_DEVICE_AUTH_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          scope: 'repo',
        }),
      });

      if (!deviceResponse.ok) {
        throw new Error('Failed to initiate device flow');
      }

      const deviceData: DeviceCodeResponse = await deviceResponse.json();
      setDeviceCode(deviceData);

      // Open GitHub authorization page in new tab
      window.open(deviceData.verification_uri, '_blank');

      // Step 2: Poll for authorization
      const pollInterval = deviceData.interval * 1000; // Convert to milliseconds
      const expiresAt = Date.now() + deviceData.expires_in * 1000;

      const poll = async (): Promise<void> => {
        if (Date.now() >= expiresAt) {
          setDeviceCode(null);
          throw new Error('Device code expired. Please try again.');
        }

        const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            device_code: deviceData.device_code,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          if (tokenData.error === 'authorization_pending') {
            // User hasn't authorized yet, keep polling
            setTimeout(poll, pollInterval);
            return;
          } else if (tokenData.error === 'slow_down') {
            // We're polling too fast, slow down
            setTimeout(poll, pollInterval + 5000);
            return;
          } else {
            setDeviceCode(null);
            throw new Error(tokenData.error_description || tokenData.error);
          }
        }

        // Success! We have an access token
        const accessToken: AccessTokenResponse = tokenData;
        await completeAuthentication(accessToken.access_token);
      };

      // Start polling
      setTimeout(poll, pollInterval);
    } catch (error) {
      console.error('Login error:', error);
      setDeviceCode(null);
      throw error;
    }
  };

  const completeAuthentication = async (accessToken: string) => {
    try {
      // Fetch user info
      const userResponse = await fetch(`${GITHUB_API_BASE}/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user information');
      }

      const userData: GitHubUser = await userResponse.json();

      // Save to state and localStorage
      setToken(accessToken);
      setUser(userData);
      setDeviceCode(null);

      localStorage.setItem('github_token', accessToken);
      localStorage.setItem('github_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Authentication completion error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setDeviceCode(null);
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    deviceCode,
    login,
    logout,
    handleAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
