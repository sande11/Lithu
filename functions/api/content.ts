// Site content edited in /admin/ and read by the Netlify build.
//   GET  /content               Public. Everything the build needs to pre-render the site.
//   GET  /admin/content         Staff. All content (including hidden items) with versions.
//   PUT  /admin/content/:key    Staff. Save one of stack | hours | products | services.
//   POST /admin/media           Staff. Upload a product image.
//   POST /admin/publish         Staff. Ask Netlify to rebuild the site with the saved content.
//   GET  /admin/summary         Staff. Numbers for the dashboard.
import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET, pool, s3, signedUrl, type Env } from "./lib";
import { safeFileName } from "./enquiries";
import { CONTENT_KEYS, contentSchemas, issueList } from "../../src/shared/content-schema.js";
import { hoursText, utcOffset } from "../../src/shared/hours.js";

type Media = { key: string; alt: string };
type Product = { visible: boolean; icon: Media; screenshots: Media[] };
type Service = { slug: string; visible: boolean };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES: Record<string, { type: string; ext: string; magic: (b: Uint8Array) => boolean }> = {
  "image/png": { type: "image/png", ext: "png", magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  "image/jpeg": { type: "image/jpeg", ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/webp": { type: "image/webp", ext: "webp", magic: (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP" },
};
const HOOK_PREFIX = "https://api.netlify.com/build_hooks/";

const mediaKeysOf = (products: Product[]) => products.flatMap((p) => [p.icon.key, ...p.screenshots.map((s) => s.key)]);

async function loadContent() {
  const { rows } = await pool.query("SELECT key, value, version, updated_at, updated_by FROM site_content");
  return Object.fromEntries(rows.map((r) => [r.key, r]));
}

// Signed links and sizes for the given media keys.
async function mediaMap(keys: string[]) {
  if (!keys.length) return {};
  const { rows } = await pool.query("SELECT key, file_name, content_type, width, height FROM media WHERE key = ANY($1)", [keys]);
  const entries = await Promise.all(rows.map(async (m) => [m.key, {
    url: await signedUrl(m.key, 900), fileName: m.file_name, contentType: m.content_type, width: m.width, height: m.height,
  }]));
  return Object.fromEntries(entries);
}

export const content = new Hono<Env>();

// ---------- public: for the build ----------
content.get("/content", async (c) => {
  const all = await loadContent();
  for (const key of CONTENT_KEYS) if (!all[key]) return c.json({ error: "not_seeded", message: `No ${key} content yet. Run npm run db:seed.` }, 503);
  const products = (all.products.value as Product[]).filter((p) => p.visible);
  c.header("Cache-Control", "no-store");
  return c.json({
    stack: all.stack.value,
    hours: all.hours.value,
    products,
    services: all.services.value, // hidden ones too: the build redirects their old addresses
    media: await mediaMap(mediaKeysOf(products)),
    updatedAt: CONTENT_KEYS.map((k) => all[k].updated_at as Date).sort((a, b) => +a - +b).pop(),
  });
});

// ---------- staff ----------
content.get("/admin/content", async (c) => {
  const all = await loadContent();
  const out: Record<string, unknown> = {};
  for (const key of CONTENT_KEYS) {
    if (all[key]) out[key] = { value: all[key].value, version: all[key].version, updatedAt: all[key].updated_at, updatedBy: all[key].updated_by };
  }
  const products = (all.products?.value ?? []) as Product[];
  return c.json({ content: out, media: await mediaMap(mediaKeysOf(products)) });
});

content.put("/admin/content/:key", async (c) => {
  const key = c.req.param("key");
  if (!CONTENT_KEYS.includes(key)) return c.json({ error: "not_found" }, 404);
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.version !== "number") return c.json({ error: "bad_request", message: "Send { value, version }." }, 400);

  const parsed = contentSchemas[key as keyof typeof contentSchemas].safeParse(body.value);
  if (!parsed.success) return c.json({ error: "invalid", issues: issueList(parsed.error) }, 400);
  const value = parsed.data;

  if (key === "products") {
    const keys = [...new Set(mediaKeysOf(value as Product[]))];
    const { rows } = await pool.query("SELECT key FROM media WHERE key = ANY($1)", [keys]);
    if (rows.length !== keys.length) return c.json({ error: "invalid", issues: [{ path: "", message: "An image is missing. Upload it again." }] }, 400);
  }
  if (key === "services") {
    // Service pages are public addresses: hide a service instead of deleting it, so its old
    // address keeps redirecting to /services/ and search rankings aren't thrown away.
    const { rows } = await pool.query("SELECT value FROM site_content WHERE key = 'services'");
    const before = ((rows[0]?.value ?? []) as Service[]).map((s) => s.slug);
    const after = new Set((value as Service[]).map((s) => s.slug));
    const removed = before.filter((s) => !after.has(s));
    if (removed.length) {
      return c.json({ error: "invalid", issues: [{ path: "", message: `Services can’t be deleted or renamed (${removed.map((s) => `/${s}/`).join(", ")}). Hide them instead.` }] }, 400);
    }
  }

  const { rows } = await pool.query(
    `UPDATE site_content SET value = $1, version = version + 1, updated_at = now(), updated_by = $2
     WHERE key = $3 AND version = $4 RETURNING version, updated_at`,
    [JSON.stringify(value), c.get("admin").email, key, body.version],
  );
  if (!rows.length) return c.json({ error: "conflict", message: "Someone saved this since you opened it. Reload to see their changes, then make yours again." }, 409);
  return c.json({ value, version: rows[0].version, updatedAt: rows[0].updated_at });
});

content.post("/admin/media", async (c) => {
  if (Number(c.req.header("content-length") || 0) > MAX_IMAGE_BYTES + 64 * 1024) return c.json({ error: "too_large", message: "Images can be up to 5 MB." }, 413);
  const form = await c.req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !file.size) return c.json({ error: "bad_request", message: "Choose an image." }, 400);
  if (file.size > MAX_IMAGE_BYTES) return c.json({ error: "too_large", message: "Images can be up to 5 MB." }, 413);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = Object.values(IMAGE_TYPES).find((t) => t.magic(bytes));
  if (!kind) return c.json({ error: "file_type", message: "Upload a WebP, PNG or JPEG image." }, 400);
  const width = Number(form!.get("width")), height = Number(form!.get("height"));
  if (![width, height].every((n) => Number.isInteger(n) && n > 0 && n <= 8000)) return c.json({ error: "bad_request", message: "Image size is missing." }, 400);

  const id = randomUUID();
  const key = `media/${id}.${kind.ext}`;
  const fileName = safeFileName(file.name, kind.ext);
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: kind.type }));
  await pool.query(
    "INSERT INTO media (id, key, file_name, content_type, width, height, size, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [id, key, fileName, kind.type, width, height, file.size, c.get("admin").email],
  );
  return c.json({ key, url: await signedUrl(key, 900), fileName, contentType: kind.type, width, height }, 201);
});

content.post("/admin/publish", async (c) => {
  const hook = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!hook || !hook.startsWith(HOOK_PREFIX)) return c.json({ error: "not_configured" }, 501);
  const email = c.get("admin").email;
  let ok = false, detail = "";
  try {
    const res = await fetch(`${hook}?trigger_title=${encodeURIComponent(`Content published from /admin by ${email}`)}`, { method: "POST" });
    ok = res.ok;
    detail = `Netlify answered ${res.status}`;
  } catch (err) {
    detail = `Could not reach Netlify: ${(err as Error).message}`;
  }
  const { rows } = await pool.query("INSERT INTO publishes (requested_by, ok, detail) VALUES ($1, $2, $3) RETURNING requested_at", [email, ok, detail]);
  return c.json({ ok, detail, requestedAt: rows[0].requested_at }, ok ? 200 : 502);
});

content.get("/admin/summary", async (c) => {
  const [counts, recent, all, publish] = await Promise.all([
    pool.query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS week FROM enquiries`),
    pool.query(`SELECT id, created_at, name, company, engagement FROM enquiries ORDER BY id DESC LIMIT 5`),
    loadContent(),
    pool.query(`SELECT requested_at, requested_by, ok FROM publishes ORDER BY id DESC LIMIT 1`),
  ]);
  const products = (all.products?.value ?? []) as Product[];
  const services = (all.services?.value ?? []) as Service[];
  // Edits made in the admin (not the starting content) since the last successful publish.
  const edits = CONTENT_KEYS.map((k) => all[k]).filter((r) => r && r.updated_by !== "seed");
  const lastEdit = edits.map((r) => r.updated_at as Date).sort((a, b) => +a - +b).pop() ?? null;
  const lastOk = (await pool.query(`SELECT max(requested_at) AS at FROM publishes WHERE ok`)).rows[0].at as Date | null;
  return c.json({
    enquiries: {
      total: counts.rows[0].total,
      lastWeek: counts.rows[0].week,
      recent: recent.rows.map((r) => ({ id: String(r.id), createdAt: r.created_at, name: r.name, company: r.company, engagement: r.engagement })),
    },
    content: {
      products: { visible: products.filter((p) => p.visible).length, total: products.length },
      services: { visible: services.filter((s) => s.visible).length, total: services.length },
      stack: ((all.stack?.value ?? []) as string[]).length,
      hours: all.hours ? hoursText(all.hours.value, utcOffset(new Date(), all.hours.value.timeZone)) : null,
    },
    publish: {
      configured: Boolean(process.env.NETLIFY_BUILD_HOOK_URL?.startsWith(HOOK_PREFIX)),
      last: publish.rows[0] ? { at: publish.rows[0].requested_at, by: publish.rows[0].requested_by, ok: publish.rows[0].ok } : null,
      lastEditAt: lastEdit,
      pending: Boolean(lastEdit && (!lastOk || lastEdit > lastOk)),
    },
  });
});
