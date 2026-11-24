import { defineConfig, loadEnv } from 'vite';
import { neonUrls } from './scripts/neon-env.mjs';

// Two apps, built separately so the admin can't change how the public site is bundled:
//   vite build               the public site (index.html, src/site); scripts/prerender.mjs then
//                            renders every page to static HTML
//   vite build --mode admin  the staff admin (admin/index.html, src/admin) at /admin/. Its files
//                            are prefixed admin- and added to the same dist/ folder.
// `npm run dev` serves both (the admin at /admin/).
// The Neon API and Auth addresses are baked into both bundles (they are not secrets). Locally
// they come from .env.local (written by `neon deploy` / `neon env pull`); on Netlify, from
// [build.environment] in netlify.toml. See scripts/neon-env.mjs.
export default defineConfig(({ mode, isSsrBuild }) => {
  const neon = neonUrls(loadEnv(mode, process.cwd(), ''));
  const define = {
    'import.meta.env.VITE_NEON_API_URL': JSON.stringify(neon.api),
    'import.meta.env.VITE_NEON_AUTH_URL': JSON.stringify(neon.auth),
  };
  if (mode === 'admin') {
    return {
      define,
      build: {
        emptyOutDir: false, // the site build already filled dist/
        copyPublicDir: false,
        assetsInlineLimit: 0,
        rollupOptions: {
          input: 'admin/index.html',
          output: { entryFileNames: 'assets/admin-[hash].js', chunkFileNames: 'assets/admin-[name]-[hash].js', assetFileNames: 'assets/admin-[name]-[hash][extname]' },
        },
      },
    };
  }
  return {
    define,
    build: {
      assetsInlineLimit: 0,
      copyPublicDir: !isSsrBuild, // public/ files only belong in dist/, not the temporary render bundle
    },
  };
});
