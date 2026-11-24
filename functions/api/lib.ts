// Shared pieces of the API: database pool, object storage client, allowed origins and the
// staff-only guard. Neon injects DATABASE_URL, NEON_AUTH_* and AWS_* at runtime.
import type { MiddlewareHandler } from "hono";
import { Pool } from "pg";
import { attachDatabasePool } from "@neon/functions";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

for (const key of ["DATABASE_URL", "NEON_AUTH_JWKS_URL", "NEON_AUTH_BASE_URL"]) {
  if (!process.env[key]) throw new Error(`${key} is not set`);
}

export const BUCKET = "assets";

// One small pool per isolate, reused across requests.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
export const s3 = new S3Client({ forcePathStyle: true }); // Neon Object Storage needs path-style URLs

// Short-lived signed link to a private object.
export const signedUrl = (key: string, seconds = 600, download?: string) =>
  getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key, ...(download ? { ResponseContentDisposition: `attachment; filename="${download}"` } : {}) }), { expiresIn: seconds });

const DEFAULT_ORIGINS = ["https://sandetechnologies.com", "https://www.sandetechnologies.com"];
const origins = new Set(
  DEFAULT_ORIGINS.concat((process.env.ALLOWED_ORIGINS ?? "").split(",")).map((o) => o.trim()).filter(Boolean),
);
// Local development on any port: Vite moves to 5174, 5175… when 5173 is busy, and Neon Auth
// already accepts every localhost port, so a fixed port list let sign-in work while every API
// call was blocked. Safe because staff routes need a bearer token, not cookies.
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;
export const isAllowedOrigin = (origin: string) => origins.has(origin) || LOCAL.test(origin);

export type Admin = { id: string; email: string };
export type Env = { Variables: { admin: Admin } };

const jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));
const issuer = new URL(process.env.NEON_AUTH_BASE_URL!).origin;

// Staff only: a valid Neon Auth JWT for a user whose Neon Auth role is "admin". The JWT's own
// "role" claim is always "authenticated", so the role is read from the user record (set with
// `neon neon-auth user set-role <id> --roles admin`).
export const requireAdmin: MiddlewareHandler<Env> = async (c, next) => {
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
  const { rows } = await pool.query(`SELECT email, role, banned FROM neon_auth."user" WHERE id = $1`, [userId]);
  const user = rows[0];
  const roles = String(user?.role ?? "").split(",").map((r) => r.trim());
  if (!user || user.banned || !roles.includes("admin")) {
    return c.json({ error: "forbidden", userId, email: user?.email ?? null }, 403);
  }
  c.set("admin", { id: userId, email: user.email });
  await next();
};
