import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { GitHubUser } from '../types';
import { setAuthErrorHandler } from '../services/github';

interface AuthContextType {
  user: GitHubUser | null;
  token: string | null;
  isAuthenticated: boolean;
  canEdit: boolean;
  isLoading: boolean;
  login: () => void;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  handleAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const OAUTH_PROXY_URL = import.meta.env.VITE_OAUTH_PROXY_URL;
const REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER || 'cinnamon-msft';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle OAuth callback and load auth state
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        // Remove code from URL immediately
        window.history.replaceState({}, document.title, window.location.pathname);
        
        try {
          if (!OAUTH_PROXY_URL) {
            console.error('OAuth proxy URL not configured');
            return;
          }

          // Exchange code for token via proxy
          const response = await fetch(OAUTH_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();
          
          if (data.access_token) {
            await completeAuthentication(data.access_token);
          } else {
            console.error('OAuth error:', data.error);
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
        }
      } else {
        // Load existing auth from localStorage
        const storedToken = localStorage.getItem('github_token');
        const storedUser = localStorage.getItem('github_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }

      setIsLoading(false);
    };

    handleOAuthCallback();
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

  // OAuth flow - redirect to GitHub
  const login = () => {
    if (!GITHUB_CLIENT_ID) {
      alert('GitHub OAuth is not configured. Please add VITE_GITHUB_CLIENT_ID to repository secrets.');
      return;
    }

    if (!OAUTH_PROXY_URL) {
      alert('OAuth proxy is not configured. Please deploy the oauth-worker and set VITE_OAUTH_PROXY_URL.');
      return;
    }

    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    // Redirect to GitHub OAuth
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'repo',
      state,
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  // Fallback: login with PAT (for manual token entry)
  const loginWithToken = async (accessToken: string) => {
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
    loginWithToken,
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
