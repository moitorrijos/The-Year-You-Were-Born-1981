import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isDev = mode === 'development';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), tailwindcss()],
    define: {
      // Only expose API key in development mode for local testing
      // Production uses server-side API route with Turso caching
      'import.meta.env.VITE_GEMINI_API_KEY': isDev
        ? JSON.stringify(env.GEMINI_API_KEY)
        : JSON.stringify(''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
