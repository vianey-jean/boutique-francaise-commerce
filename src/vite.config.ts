
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  define: {
    global: 'globalThis',
    'process.env': process.env
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/socket\.io-client/, /socket\.io-parser/, /engine\.io-client/, /debug/, /ws/, /component-emitter/, /socket\.io-parser/, /engine\.io-parser/],
    },
  },
  server: {
    host: true,
    port: 8080,
  }
});
