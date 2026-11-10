import { defineConfig } from 'vite';

// The client build bundles index.html (the page template). scripts/prerender.mjs then renders
// every route from src/routes.js to its own static HTML file in dist/.
export default defineConfig(({ isSsrBuild }) => ({
  build: {
    assetsInlineLimit: 0,
    copyPublicDir: !isSsrBuild, // public/ files only belong in dist/, not the temporary render bundle
  },
}));
