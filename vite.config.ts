import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  // Base path configuration - use '/' for Netlify, Vercel
  // For GitHub Pages, use '/AluVerse-project/'
 base: process.env.NODE_ENV === 'production'
  ? '/hackaluverse93/'
  : '/',

});
