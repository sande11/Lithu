import { defineConfig } from "@neon/config/v1";

// Neon services for this site. Apply with `neon deploy --env .env.local`.
// - auth: staff sign-in for the /admin/ enquiries inbox (Managed Better Auth)
// - functions.api: the enquiries API the browser calls (functions/api.ts)
// - buckets.assets: private storage for files attached to enquiries
export default defineConfig({
  auth: true,
  functions: {
    api: {
      name: "Enquiries API",
      source: "./functions/api.ts",
      env: {
        // Optional comma-separated list of extra site origins allowed to call the API
        // (e.g. a Netlify deploy preview). The defaults live in functions/api.ts.
        ALLOWED_ORIGINS: { value: process.env.ALLOWED_ORIGINS, required: false },
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
