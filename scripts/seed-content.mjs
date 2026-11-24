// Fills an empty database with the starting site content from db/seed/content.json (the
// stack, hours, products and services the site had before the admin existed), uploading the
// product images to the "assets" bucket. Content that already exists is never overwritten,
// so it is safe to run again. Run with: npm run db:seed (after npm run db:migrate)
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { contentSchemas } from '../src/shared/content-schema.js';

const root = resolve(import.meta.dirname, '..');
for (const file of ['.env.local', '.env']) if (existsSync(join(root, file))) process.loadEnvFile(join(root, file));
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL_UNPOOLED is not set. Run `neon env pull` first.'); process.exit(1); }

const seed = JSON.parse(readFileSync(join(root, 'db/seed/content.json'), 'utf8'));
const db = new pg.Client({ connectionString: url });
const s3 = new S3Client({ forcePathStyle: true });
await db.connect();

try {
  const existing = new Set((await db.query('SELECT key FROM site_content')).rows.map((r) => r.key));

  // Upload a seed image once and return its { key, alt } reference.
  const upload = async ({ file, alt, width, height }) => {
    const bytes = readFileSync(join(root, file));
    const id = randomUUID();
    const key = `media/${id}.webp`;
    await s3.send(new PutObjectCommand({ Bucket: 'assets', Key: key, Body: bytes, ContentType: 'image/webp' }));
    await db.query('INSERT INTO media (id, key, file_name, content_type, width, height, size, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, key, basename(file), 'image/webp', width, height, statSync(join(root, file)).size, 'seed']);
    return { key, alt };
  };

  for (const key of ['stack', 'hours', 'products', 'services']) {
    if (existing.has(key)) { console.log(`${key}: already in the database, left as is`); continue; }
    let value = seed[key];
    if (key === 'products') {
      value = [];
      for (const p of seed.products) {
        value.push({ ...p, icon: await upload(p.icon), screenshots: await Promise.all(p.screenshots.map(upload)) });
      }
    }
    value = contentSchemas[key].parse(value);
    await db.query('INSERT INTO site_content (key, value, updated_by) VALUES ($1, $2, $3)', [key, JSON.stringify(value), 'seed']);
    console.log(`${key}: seeded`);
  }
} finally {
  await db.end();
}
