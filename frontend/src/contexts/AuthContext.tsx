import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { GitHubUser } from '../types';
import { setAuthErrorHandler } from '../services/github';

interface AuthContextType {
  user: GitHubUser | null;
  token: string | null;
  isAuthenticated: boolean;
  canEdit: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  handleAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER || 'cinnamon-msft';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    // User will need to manually re-enter token
  };

  const login = async (accessToken: string) => {
    if (!accessToken || !accessToken.trim()) {
      throw new Error('Please enter a valid GitHub Personal Access Token');
    }

    try {
      await completeAuthentication(accessToken.trim());
    } catch (error) {
      console.error('Login error:', error);
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
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    canEdit: !!token && !!user && user.login.toLowerCase() === REPO_OWNER.toLowerCase(),
    isLoading,
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
