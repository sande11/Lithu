// Enquiries from the contact form.
//   POST /enquiries        Public. The form sends each enquiry here as well as to Netlify Forms.
//   GET  /admin/enquiries  Staff only (guarded in index.ts).
import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET, pool, s3, signedUrl, isAllowedOrigin, type Env } from "./lib";

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

const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function safeFileName(name: string, ext: string) {
  const base = name.replace(/\.[^.]*$/, "").normalize("NFKD").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return `${(base || "file").slice(0, 80)}.${ext}`;
}

export const enquiries = new Hono<Env>();

enquiries.post("/enquiries", async (c) => {
  const origin = c.req.header("origin");
  if (origin && !isAllowedOrigin(origin)) return c.json({ error: "origin_not_allowed" }, 403);
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

enquiries.get("/admin/enquiries", async (c) => {
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
  const list = await Promise.all(
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
        ? { name: r.attachment_name, type: r.attachment_type, size: r.attachment_size, url: await signedUrl(r.attachment_key) }
        : null,
    })),
  );
  return c.json({ admin: c.get("admin"), enquiries: list, hasMore: rows.length === limit });
});
