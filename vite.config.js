import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page build: each HTML file below becomes a page in dist/.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        vepifind: resolve(import.meta.dirname, 'vepifind.html'),
        privacy: resolve(import.meta.dirname, 'vepifind-privacy-policy.html'),
        terms: resolve(import.meta.dirname, 'vepifind-terms.html'),
      },
    },
  },
});
