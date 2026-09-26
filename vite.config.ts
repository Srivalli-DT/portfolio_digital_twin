import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /<repo-name>/. Change this if the repo is renamed.
// For a <user>.github.io repo, use '/' instead.
export default defineConfig({
  base: '/portfolio_digital_twin/',
  plugins: [react()],
});
