import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { GitHubUser } from '../types';
import { setAuthErrorHandler } from '../services/github';
import { supabase } from '../lib/supabase';
import type { Provider } from '@supabase/supabase-js';

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
const REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER || 'cinnamon-msft';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.provider_token) {
          await completeAuthentication(session.provider_token);
        } else {
          // Fallback: check localStorage for PAT
          const storedToken = localStorage.getItem('github_token');
          const storedUser = localStorage.getItem('github_user');

          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.provider_token) {
        await completeAuthentication(session.provider_token);
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Set up auth error handler for github service
  useEffect(() => {
    setAuthErrorHandler(handleAuthError);
  }, []);

  const handleAuthError = () => {
    console.log('Authentication error detected, clearing session');
    logout();
  };

  // OAuth flow - use Supabase
  const login = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github' as Provider,
        options: {
          scopes: 'repo',
          redirectTo: window.location.origin + window.location.pathname,
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        alert(`Sign in failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Sign in failed. Please try again.');
    }
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
      // Fetch user info from GitHub
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

  const logout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear local state
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
