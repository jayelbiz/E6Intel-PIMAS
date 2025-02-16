import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.jsx', '.json']
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false
  }
});
