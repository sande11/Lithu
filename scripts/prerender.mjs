// Runs after `vite build` (browser bundle) and `vite build --ssr` (render bundle).
// Writes one static HTML file per route, plus sitemap.xml and robots.txt, into dist/.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, '.ssr');
const ssr = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const { SITE } = await import(pathToFileURL(join(root, 'src/site.js')).href);

let template = readFileSync(join(dist, 'index.html'), 'utf8');
// Inline the stylesheet (about 10 KB compressed) so the first paint doesn't wait for a second request.
template = template.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (m, href) =>
  `<style>${readFileSync(join(dist, href), 'utf8').replace(/<\/style/gi, '<\\/style')}</style>`);
const assets = readdirSync(join(dist, 'assets'));
// Preload the two Latin font files used above the fold.
const fontPreloads = ['sora-latin-wght-normal', 'figtree-latin-wght-normal']
  .map((name) => assets.find((f) => f.startsWith(name) && f.endsWith('.woff2')))
  .filter(Boolean).map((f) => `/assets/${f}`);
// Map page keys to their JS chunk so the browser can start fetching it immediately.
const chunkFor = (page) => {
  const name = { home: 'Home', services: 'Services', service: 'Service', remote: 'Remote', products: 'Products', vepifind: 'VepiFind', about: 'About', contact: 'Contact', legal: 'Legal', notfound: 'NotFound', thanks: 'ThankYou', outsourcing: 'Outsourcing' }[page];
  const f = assets.find((a) => a.startsWith(`${name}-`) && a.endsWith('.js'));
  return f ? `/assets/${f}` : null;
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const today = new Date().toISOString().slice(0, 10);
const written = [];

for (const route of ssr.routes) {
  const body = ssr.render(route);
  const chunk = chunkFor(route.page);
  const head = ssr.headFor(route, { ...ssr.extraFor(route), fontPreloads })
    + (chunk ? `\n    <link rel="modulepreload" href="${chunk}" />` : '');
  const html = template
    .replace('<!--app-head-->', head)
    .replace('<div id="root"><!--app-html--></div>',
      `<div id="root" data-path="${esc(route.path)}">${body}</div>`);
  const out = route.file ? join(dist, route.file) : join(dist, route.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  written.push(route.file || route.path);
}

// sitemap.xml: every indexable page, with images for the product pages.
const urls = ssr.routes.filter((r) => r.sitemap !== false && !r.noindex).map((r) => {
  const imgs = ssr.sitemapImages(r).map((i) => `\n    <image:image><image:loc>${i.loc}</image:loc><image:title>${esc(i.title)}</image:title></image:image>`).join('');
  return `  <url>\n    <loc>${SITE.url}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq || 'monthly'}</changefreq>\n    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>${imgs}\n  </url>`;
});
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`);

writeFileSync(join(dist, 'robots.txt'), `# ${SITE.name}\nUser-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

// Remove the temporary render bundle (harmless if it can't be removed; it's in .gitignore).
try { if (existsSync(ssrDir)) rmSync(ssrDir, { recursive: true, force: true }); } catch {}
console.log(`Pre-rendered ${written.length} pages:\n  ${written.join('\n  ')}\nWrote sitemap.xml (${urls.length} URLs) and robots.txt.`);
