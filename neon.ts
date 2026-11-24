import { defineConfig } from "@neon/config/v1";

// Neon services for this site. Apply with `npm run neon:deploy` (neon deploy --env .env.local).
// - auth: staff sign-in for /admin/ (Managed Better Auth)
// - functions.api: the site API (functions/api/): enquiries, editable content, publishing
// - buckets.assets: private storage for enquiry attachments and product images
export default defineConfig({
  auth: true,
  functions: {
    api: {
      name: "Site API",
      source: "./functions/api/index.ts",
      env: {
        // Optional comma-separated list of extra site origins allowed to call the API
        // (e.g. a Netlify deploy preview). The defaults live in functions/api/lib.ts.
        ALLOWED_ORIGINS: { value: process.env.ALLOWED_ORIGINS, required: false },
        // Netlify build hook that the admin's Publish button calls to rebuild the site.
        // Create one in Netlify: Site configuration > Build & deploy > Build hooks.
        NETLIFY_BUILD_HOOK_URL: { value: process.env.NETLIFY_BUILD_HOOK_URL, required: false },
      },
    },
  },
  buckets: {
    // "private" is the default; use "public_read" for anonymous reads
    assets: { access: "private" },
  },
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      // Run `neon checkout <name>` to create a new branch with these settings
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
