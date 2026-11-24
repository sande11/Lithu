// Enquiries API, deployed as the Neon Function "api" (see neon.ts).
//
//   POST /enquiries        Public. The contact form sends each enquiry here as well as to
//                          Netlify Forms. Saves it in Postgres; an optional attached file goes
//                          to the private "assets" bucket.
//   GET  /admin/enquiries  Staff only. Needs a Neon Auth JWT (Authorization: Bearer) for a
//                          user whose Neon Auth role is "admin". Grant it with:
//                          neon neon-auth user set-role <user-id> --roles admin
//   GET  /health           Checks the database connection.
//
// Neon injects DATABASE_URL, NEON_AUTH_* and AWS_* (object storage) at runtime.
import { randomUUID } from "node:crypto";
import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { Pool } from "pg";
import { attachDatabasePool } from "@neon/functions";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = "assets";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ENGAGEMENTS = ["Agency project", "Remote tech team", "Product partnership"];
// Attachments are accepted by extension; the stored Content-Type comes from this map,
// never from the browser.
const FILE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  odt: "application/vnd.oasis.opendocument.text",
  rtf: "application/rtf",
  txt: "text/plain",
  csv: "text/csv",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};
const DEFAULT_ORIGINS = [
  "https://sandetechnologies.com",
  "https://www.sandetechnologies.com",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
];
const origins = new Set(
  DEFAULT_ORIGINS.concat((process.env.ALLOWED_ORIGINS ?? "").split(",")).map((o) => o.trim()).filter(Boolean),
);

for (const key of ["DATABASE_URL", "NEON_AUTH_JWKS_URL", "NEON_AUTH_BASE_URL"]) {
  if (!process.env[key]) throw new Error(`${key} is not set`);
}

// One small pool per isolate, reused across requests.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
const s3 = new S3Client({ forcePathStyle: true }); // Neon Object Storage needs path-style URLs
const jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));
const issuer = new URL(process.env.NEON_AUTH_BASE_URL!).origin;

type Admin = { id: string; email: string };
const app = new Hono<{ Variables: { admin: Admin } }>();

app.use(
  "*",
  cors({
    origin: (origin) => (origins.has(origin) ? origin : null),
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["authorization", "content-type"],
    maxAge: 600,
  }),
);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "server_error" }, 500);
});

app.get("/", (c) => c.json({ ok: true, service: "sande-enquiries-api" }));

app.get("/health", async (c) => {
  await pool.query("SELECT 1");
  return c.json({ ok: true, database: "up" });
});

// ---------- public: receive an enquiry ----------

const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeFileName(name: string, ext: string) {
  const base = name.replace(/\.[^.]*$/, "").normalize("NFKD").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return `${(base || "attachment").slice(0, 80)}.${ext}`;
}

app.post("/enquiries", async (c) => {
  const origin = c.req.header("origin");
  if (origin && !origins.has(origin)) return c.json({ error: "origin_not_allowed" }, 403);
  const length = Number(c.req.header("content-length") || 0);
  if (length > MAX_FILE_BYTES + 256 * 1024) return c.json({ error: "too_large", message: "Attachments can be up to 10 MB." }, 413);

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ error: "bad_request", message: "Send the enquiry as form data." }, 400);
  }

  // Same honeypot as the Netlify form: bots fill it, people never see it. Accept and drop.
  if (text(form.get("bot-field"))) return c.json({ ok: true }, 201);

  const enquiry = {
    engagement: text(form.get("engagement")),
    name: text(form.get("name")),
    email: text(form.get("email")),
    company: text(form.get("company")),
    message: text(form.get("message")),
    page: text(form.get("page")).slice(0, 300),
  };
  const problems: string[] = [];
  if (!ENGAGEMENTS.includes(enquiry.engagement)) problems.push("engagement");
  if (!enquiry.name || enquiry.name.length > 200) problems.push("name");
  if (!EMAIL_RE.test(enquiry.email) || enquiry.email.length > 254) problems.push("email");
  if (enquiry.company.length > 200) problems.push("company");
  if (!enquiry.message || enquiry.message.length > 10000) problems.push("message");
  if (problems.length) return c.json({ error: "invalid", fields: problems }, 400);

  let attachment: { key: string; name: string; type: string; size: number } | null = null;
  const file = form.get("attachment");
  if (file instanceof File && file.size > 0) {
    const ext = (file.name.match(/\.([A-Za-z0-9]+)$/)?.[1] ?? "").toLowerCase();
    const type = FILE_TYPES[ext];
    if (!type) return c.json({ error: "file_type", message: "Attach a PDF, Office document, text file or image." }, 400);
    if (file.size > MAX_FILE_BYTES) return c.json({ error: "too_large", message: "Attachments can be up to 10 MB." }, 413);
    const name = safeFileName(file.name, ext);
    const key = `enquiries/${new Date().toISOString().slice(0, 7)}/${randomUUID()}/${name}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: new Uint8Array(await file.arrayBuffer()),
        ContentType: type,
        ContentDisposition: `attachment; filename="${name}"`,
      }),
    );
    attachment = { key, name, type, size: file.size };
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO enquiries (engagement, name, email, company, message, page,
                              attachment_key, attachment_name, attachment_type, attachment_size)
       VALUES ($1, $2, $3, NULLIF($4, ''), $5, NULLIF($6, ''), $7, $8, $9, $10)
       RETURNING id, created_at`,
      [enquiry.engagement, enquiry.name, enquiry.email, enquiry.company, enquiry.message, enquiry.page,
       attachment?.key ?? null, attachment?.name ?? null, attachment?.type ?? null, attachment?.size ?? null],
    );
    return c.json({ ok: true, id: String(rows[0].id), attachment: Boolean(attachment) }, 201);
  } catch (err) {
    // Don't leave an orphaned file behind if the row couldn't be saved.
    if (attachment) await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: attachment.key })).catch(() => {});
    throw err;
  }
});

// ---------- staff only: read enquiries ----------

const requireAdmin: MiddlewareHandler<{ Variables: { admin: Admin } }> = async (c, next) => {
  const header = c.req.header("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return c.json({ error: "unauthorized" }, 401);
  let userId: string | undefined;
  try {
    const { payload } = await jwtVerify(header.slice(7), jwks, { issuer });
    userId = payload.sub;
  } catch {
    return c.json({ error: "unauthorized" }, 401);
  }
  if (!userId) return c.json({ error: "unauthorized" }, 401);

  // The JWT's own "role" claim is always "authenticated", so read the Neon Auth role
  // from the user record (set with `neon neon-auth user set-role`).
  const { rows } = await pool.query(`SELECT email, role, banned FROM neon_auth."user" WHERE id = $1`, [userId]);
  const user = rows[0];
  const roles = String(user?.role ?? "").split(",").map((r) => r.trim());
  if (!user || user.banned || !roles.includes("admin")) {
    return c.json({ error: "forbidden", userId, email: user?.email ?? null }, 403);
  }
  c.set("admin", { id: userId, email: user.email });
  await next();
};

app.get("/admin/enquiries", requireAdmin, async (c) => {
  const limit = Math.min(Math.max(Number(c.req.query("limit")) || 50, 1), 200);
  const before = c.req.query("before");
  const { rows } = await pool.query(
    `SELECT id, created_at, engagement, name, email, company, message, page,
            attachment_key, attachment_name, attachment_type, attachment_size
     FROM enquiries
     WHERE ($1::bigint IS NULL OR id < $1::bigint)
     ORDER BY id DESC
     LIMIT $2`,
    [before && /^\d+$/.test(before) ? before : null, limit],
  );
  const enquiries = await Promise.all(
    rows.map(async (r) => ({
      id: String(r.id),
      createdAt: r.created_at,
      engagement: r.engagement,
      name: r.name,
      email: r.email,
      company: r.company,
      message: r.message,
      page: r.page,
      attachment: r.attachment_key
        ? {
            name: r.attachment_name,
            type: r.attachment_type,
            size: r.attachment_size,
            // Short-lived signed link; the bucket itself stays private.
            url: await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: r.attachment_key }), { expiresIn: 600 }),
          }
        : null,
    })),
  );
  return c.json({ admin: c.get("admin"), enquiries, hasMore: rows.length === limit });
});

export default app;
