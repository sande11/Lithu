// Where a product link can go. Plain data with no dependencies, so the public site can use it
// without pulling in zod. The rules for each kind live in content-schema.js.
export const LINK_KINDS = {
  'google-play': { name: 'Google Play', label: 'Get it on Google Play', host: 'play.google.com', example: 'https://play.google.com/store/apps/details?id=…' },
  'app-store': { name: 'App Store', label: 'Download on the App Store', host: 'apps.apple.com', example: 'https://apps.apple.com/app/…' },
  'web-app': { name: 'Web app', label: 'Open the web app', example: 'https://app.example.com' },
  website: { name: 'Website or page', label: 'Visit the website', example: '/products/vepifind/ or https://…' },
};

// App store listings: where the app can be installed.
export const isStoreLink = (l) => l.kind === 'google-play' || l.kind === 'app-store';
