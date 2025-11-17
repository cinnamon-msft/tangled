import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  // Use base path for production (GitHub Pages), root for development
  const basename = import.meta.env.PROD ? '/tangled' : '';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SyncProvider>
          <BrowserRouter basename={basename}>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/ideas" element={<IdeasPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </SyncProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
