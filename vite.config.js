import { defineConfig, loadEnv } from 'vite';
import { functionBaseUrl } from '@neon/env';

// Public addresses of the Neon backend, baked into the browser bundle (they are not secrets).
// Locally they are derived from .env.local, which `neon deploy` / `neon env pull` writes, so
// they follow whichever Neon branch is checked out. On Netlify they come from
// [build.environment] in netlify.toml. If neither is set, the contact form still posts to
// Netlify Forms and /admin/ explains that the backend isn't configured.
function neonUrls(mode) {
  const env = loadEnv(mode, process.cwd(), '');
  const api = env.VITE_NEON_API_URL
    || (env.NEON_BRANCH_ID && env.NEON_FUNCTION_HOST_SUFFIX ? functionBaseUrl('api', env) : '');
  const auth = env.VITE_NEON_AUTH_URL || env.NEON_AUTH_BASE_URL || '';
  return { api: api.replace(/\/+$/, ''), auth: auth.replace(/\/+$/, '') };
}

// The client build bundles index.html (the page template). scripts/prerender.mjs then renders
// every route from src/routes.js to its own static HTML file in dist/.
export default defineConfig(({ mode, isSsrBuild }) => {
  const neon = neonUrls(mode);
  return {
    define: {
      'import.meta.env.VITE_NEON_API_URL': JSON.stringify(neon.api),
      'import.meta.env.VITE_NEON_AUTH_URL': JSON.stringify(neon.auth),
    },
    build: {
      assetsInlineLimit: 0,
      copyPublicDir: !isSsrBuild, // public/ files only belong in dist/, not the temporary render bundle
    },
  };
});
