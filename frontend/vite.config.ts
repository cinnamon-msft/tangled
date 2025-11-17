import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/tangled/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    'import.meta.env.VITE_GITHUB_CLIENT_ID': JSON.stringify(process.env.VITE_GITHUB_CLIENT_ID),
    'import.meta.env.VITE_GITHUB_REPO_OWNER': JSON.stringify(process.env.VITE_GITHUB_REPO_OWNER || 'cinnamon-msft'),
    'import.meta.env.VITE_GITHUB_REPO_NAME': JSON.stringify(process.env.VITE_GITHUB_REPO_NAME || 'tangled'),
    'import.meta.env.VITE_GITHUB_BRANCH': JSON.stringify(process.env.VITE_GITHUB_BRANCH || 'main'),
  },
}))
