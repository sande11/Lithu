// Applies the SQL files in db/migrations/ that haven't run yet, in name order, each in its
// own transaction. Uses the direct (unpooled) connection, as Neon recommends for migrations.
// Run with: npm run db:migrate   (reads .env.local or .env, written by `neon deploy`)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pg from 'pg';

const root = resolve(import.meta.dirname, '..');
for (const file of ['.env.local', '.env']) if (existsSync(join(root, file))) process.loadEnvFile(join(root, file));

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL_UNPOOLED is not set. Run `neon env pull` first.'); process.exit(1); }

const dir = join(root, 'db/migrations');
const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  const done = new Set((await client.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name));
  const pending = files.filter((f) => !done.has(f));
  for (const name of pending) {
    await client.query('BEGIN');
    try {
      await client.query(readFileSync(join(dir, name), 'utf8'));
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
      await client.query('COMMIT');
      console.log(`Applied ${name}`);
    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(`${name} failed: ${err.message}`);
    }
  }
  console.log(pending.length ? `Done: ${pending.length} migration(s) applied.` : 'Database is up to date.');
} finally {
  await client.end();
}
