
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'window', // This provides the global object required by simple-peer
  },
  optimizeDeps: {
    exclude: ['simple-peer'], // Exclude simple-peer from optimization
    esbuildOptions: {
      // Ne pas essayer de bundler ces modules Node.js
      define: {
        global: 'globalThis',
      },
    },
  },
}));
