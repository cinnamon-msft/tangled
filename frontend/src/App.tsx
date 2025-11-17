import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import { SyncProvider } from './contexts/SyncContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import MaterialsPage from './pages/MaterialsPage';
import IdeasPage from './pages/IdeasPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Component to handle OAuth callback redirect
function AuthCallbackHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have OAuth tokens in the URL hash (at root path)
    if (location.pathname === '/' && location.hash.includes('access_token')) {
      console.log('OAuth callback detected at root, redirecting to /tangled');
      // Keep the hash and redirect to the app's basename
      navigate('/tangled' + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SyncProvider>
          <BrowserRouter>
            <AuthCallbackHandler />
            <Routes>
              <Route path="/tangled/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/materials" element={<MaterialsPage />} />
                    <Route path="/ideas" element={<IdeasPage />} />
                  </Routes>
                </Layout>
              } />
              <Route path="/" element={
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p>Redirecting...</p>
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </SyncProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
