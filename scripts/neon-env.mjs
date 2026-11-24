// Public addresses of the Neon backend (not secrets), used by vite.config.js and the content
// fetch. Explicit VITE_NEON_* values win (Netlify sets them in netlify.toml); otherwise they are
// derived from the variables `neon deploy` / `neon env pull` write to .env.local, so local work
// follows whichever Neon branch is checked out.
import { functionBaseUrl } from '@neon/env';

export function neonUrls(env) {
  const api = env.VITE_NEON_API_URL
    || (env.NEON_BRANCH_ID && env.NEON_FUNCTION_HOST_SUFFIX ? functionBaseUrl('api', env) : '');
  const auth = env.VITE_NEON_AUTH_URL || env.NEON_AUTH_BASE_URL || '';
  return { api: api.replace(/\/+$/, ''), auth: auth.replace(/\/+$/, '') };
}
