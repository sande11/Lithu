// Downloads the content edited in /admin/ (stack, hours, products, services) from the Neon
// API before every build, so the public pages are pre-rendered from it exactly as before:
//   src/site/content/cms.json   the content the site imports
//   public/media/               product images, copied into the site at /media/
// Both are generated (git-ignored). The build stops if the API can't be reached or the content
// is invalid, so a broken fetch never publishes an empty or half-built site; Netlify keeps
// serving the previous deploy. `--allow-stale` (used by `npm run dev`) keeps the last
// downloaded copy instead when offline.
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { neonUrls } from './neon-env.mjs';
import { contentSchemas } from '../src/shared/content-schema.js';
import { utcOffset } from '../src/shared/hours.js';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'src/site/content/cms.json');
const mediaDir = join(root, 'public/media');
const allowStale = process.argv.includes('--allow-stale');
for (const file of ['.env.local', '.env']) if (existsSync(join(root, file))) process.loadEnvFile(join(root, file));

function stop(message) {
  if (allowStale && existsSync(out)) { console.warn(`⚠ ${message}\n  Using the content downloaded last time.`); process.exit(0); }
  console.error(`✖ ${message}`);
  process.exit(1);
}

async function get(url, attempts = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(() => '')}`.trim());
      return res;
    } catch (err) {
      if (i >= attempts) throw err;
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

const { api } = neonUrls(process.env);
if (!api) stop('No Neon API address. Set VITE_NEON_API_URL, or run `neon env pull` to write .env.local.');

let data;
try {
  data = await (await get(`${api}/content`)).json();
} catch (err) {
  stop(`Couldn't download the site content from ${api}/content: ${err.message}`);
}

// Refuse to build from content the admin could never have saved.
for (const key of Object.keys(contentSchemas)) {
  const parsed = contentSchemas[key].safeParse(key === 'products' ? data.products : data[key]);
  if (!parsed.success) stop(`The ${key} content is invalid: ${parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
}

// Copy each image in use to public/media/<original-name>-<id>.<ext>. Keys never change content,
// so a file that is already there is kept, and the name can be cached for a year.
mkdirSync(mediaDir, { recursive: true });
const wanted = new Map();
const image = (ref) => {
  const m = data.media[ref.key];
  if (!m) stop(`Image ${ref.key} is missing from the media list.`);
  const id = ref.key.slice('media/'.length, 'media/'.length + 8);
  const file = `${m.fileName.replace(/\.[^.]+$/, '')}-${id}.${ref.key.split('.').pop()}`;
  wanted.set(file, m.url);
  return { src: `/media/${file}`, width: m.width, height: m.height, alt: ref.alt };
};
const products = data.products.map((p) => ({ ...p, icon: image(p.icon), screenshots: p.screenshots.map(image) }));

let downloaded = 0;
for (const [file, url] of wanted) {
  if (existsSync(join(mediaDir, file))) continue;
  try {
    writeFileSync(join(mediaDir, file), Buffer.from(await (await get(url)).arrayBuffer()));
    downloaded++;
  } catch (err) {
    stop(`Couldn't download image ${file}: ${err.message}`);
  }
}
for (const file of readdirSync(mediaDir)) if (!wanted.has(file)) rmSync(join(mediaDir, file));

const content = {
  stack: data.stack,
  // The UTC offset is fixed at build time so the pre-rendered page and the browser agree.
  hours: { ...data.hours, utcOffset: utcOffset(new Date(), data.hours.timeZone) },
  products,
  services: data.services,
  // Which saved version of each part this build uses; prerender stamps it into /admin/ so the
  // admin can tell whether the live site has every saved change.
  versions: data.versions ?? null,
};
writeFileSync(out, JSON.stringify(content, null, 2) + '\n');
console.log(`Site content from Neon: ${data.services.filter((s) => s.visible).length} services, ${products.length} products, ${data.stack.length} stack items; ${wanted.size} images (${downloaded} new).`);
