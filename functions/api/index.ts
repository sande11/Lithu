// The site's API, deployed as the Neon Function "api" (see neon.ts).
//   enquiries.ts  contact form enquiries (public POST, staff inbox)
//   content.ts    stack, hours, products and services edited in /admin/ and read by the build
//   lib.ts        database, storage, allowed origins and the staff-only guard
// Every /admin/* route needs a Neon Auth JWT for a user with the Neon Auth role "admin":
//   neon neon-auth user set-role <user-id> --roles admin
import { Hono } from "hono";
import { cors } from "hono/cors";
import { isAllowedOrigin, pool, requireAdmin, type Env } from "./lib";
import { enquiries } from "./enquiries";
import { content } from "./content";

const app = new Hono<Env>();

app.use(
  "*",
  cors({
    origin: (origin) => (isAllowedOrigin(origin) ? origin : null),
    allowMethods: ["GET", "POST", "PUT", "OPTIONS"],
    allowHeaders: ["authorization", "content-type"],
    maxAge: 600,
  }),
);
app.use("/admin/*", requireAdmin);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "server_error" }, 500);
});

app.get("/", (c) => c.json({ ok: true, service: "sande-site-api" }));
app.get("/health", async (c) => {
  await pool.query("SELECT 1");
  return c.json({ ok: true, database: "up" });
});

app.route("/", enquiries);
app.route("/", content);

export default app;
