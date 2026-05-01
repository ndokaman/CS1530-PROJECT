import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const BACKEND = 'http://localhost:3000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': BACKEND,
      '/workouts': BACKEND,
      '/meals': BACKEND,
      '/goals': BACKEND,
      '/ping': BACKEND,
      '/db-ping': BACKEND,
      '/students': BACKEND,
    },
  },
});
