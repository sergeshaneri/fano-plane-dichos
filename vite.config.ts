import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  base: '/fano-plane-dichos/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR disabled when running inside AI Studio (sets DISABLE_HMR=true)
    // to prevent flicker during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
