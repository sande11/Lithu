// The editable site content: what each part looks like and the rules it must follow.
// One definition used by the admin (form checks), the API (it refuses anything invalid)
// and the build (it refuses to publish invalid content). Plain JS + zod, no React.
import { z } from 'zod';
import { LINK_KINDS } from './links.js';

export { LINK_KINDS, isStoreLink } from './links.js';

export const CONTENT_KEYS = ['stack', 'hours', 'products', 'services'];

// Icons a service can show (names from src/shared/icons.jsx).
export const SERVICE_ICONS = ['web', 'phone', 'code', 'spark', 'pen', 'cloud', 'bell', 'target', 'bookmark', 'doc', 'mic', 'list', 'bulb', 'shield', 'clock', 'pin', 'bolt', 'mail'];

// schema.org applicationCategory values Google recognises for apps.
export const APP_CATEGORIES = [
  'BusinessApplication', 'CommunicationApplication', 'DesignApplication', 'DeveloperApplication',
  'EducationalApplication', 'EntertainmentApplication', 'FinanceApplication', 'GameApplication',
  'HealthApplication', 'LifestyleApplication', 'MultimediaApplication', 'ReferenceApplication',
  'SecurityApplication', 'ShoppingApplication', 'SocialNetworkingApplication', 'SportsApplication',
  'TravelApplication', 'UtilitiesApplication',
];

// Addresses the site already uses; a new service can't take one of them.
export const RESERVED_SLUGS = ['services', 'products', 'about', 'contact', 'thank-you', 'admin', 'hire-remote-developers', 'software-development-outsourcing-africa', 'assets', 'media', 'og', '404'];

const tooLong = (max) => ({ error: `Keep it to ${max} characters or fewer` });
const req = (max) => z.string().trim().min(1, { error: 'Required' }).max(max, tooLong(max));
const sameIgnoringCase = (list) => new Set(list.map((x) => String(x).toLowerCase())).size !== list.length;

export const slugSchema = z.string().trim().max(60, tooLong(60))
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { error: 'Use lowercase letters, numbers and single hyphens' });
// A path on this site ("/products/vepifind/") or a full https:// address.
export const hrefSchema = z.string().trim().max(300, tooLong(300))
  .regex(/^(\/[^\s]*|https:\/\/[^\s]+)$/, { error: 'Use a site path like /contact/ or a full https:// address' });
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { error: 'Use 24-hour time, like 08:00' });
// An uploaded image (see the media table) plus the alt text search engines and screen readers read.
const mediaSchema = z.object({
  key: z.string().regex(/^media\/[0-9a-f-]{36}\.(webp|png|jpg)$/, { error: 'Upload an image' }),
  alt: req(150),
});

export const isTimeZone = (tz) => { try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; } catch { return false; } };

// ---------- tech stack: the "stack we ship with" row on the home page ----------
export const stackSchema = z.array(req(40)).min(1, { error: 'Add at least one technology' }).max(40, { error: 'Up to 40 technologies' })
  .refine((list) => !sameIgnoringCase(list), { error: 'Each technology can only be listed once' });

// ---------- working hours: the live hours band, contact details and Google business data ----------
export const hoursSchema = z.object({
  days: z.array(z.number().int().min(0).max(6)).min(1, { error: 'Pick at least one working day' }).max(7)
    .refine((d) => new Set(d).size === d.length, { error: 'Each day only once' }), // 0 = Sunday … 6 = Saturday
  open: timeSchema,
  close: timeSchema,
  timeZone: z.string().refine(isTimeZone, { error: 'Pick a time zone' }),
  zoneLabel: req(12), // e.g. CAT
  zoneName: req(60), // e.g. Central Africa Time
  city: req(60), // e.g. Lilongwe
}).refine((h) => h.close > h.open, { error: 'Closing time must be after opening time', path: ['close'] });

// ---------- products: the products slideshow, the products page and app structured data ----------
// Where a product link goes (kinds in links.js). The first link is the main button; store links
// must point at that store, the others at any https:// address ("website" also takes a site path).
const httpsHost = (href) => { try { const u = new URL(href); return u.protocol === 'https:' ? u.hostname : null; } catch { return null; } };
const linkSchema = z.object({
  kind: z.enum(Object.keys(LINK_KINDS), { error: 'Pick where the link goes' }),
  href: hrefSchema,
  label: req(60),
}).superRefine((l, ctx) => {
  if (l.kind === 'website') return;
  const { host, name } = LINK_KINDS[l.kind];
  const actual = httpsHost(l.href);
  if (!actual) ctx.addIssue({ code: 'custom', path: ['href'], message: 'Use a full https:// address' });
  else if (host && actual !== host) ctx.addIssue({ code: 'custom', path: ['href'], message: `${name} links start with https://${host}/` });
});

export const productSchema = z.object({
  key: slugSchema,
  name: req(60),
  status: req(40), // e.g. In development, Coming soon, Live
  statusHighlight: z.boolean(), // show the status in green
  summary: req(320),
  features: z.array(req(120)).max(6, { error: 'Up to 6 features' }),
  category: z.enum(APP_CATEGORIES, { error: 'Pick a category' }),
  os: req(60), // e.g. Android, iOS, Web
  links: z.array(linkSchema).max(4, { error: 'Up to 4 links' })
    .refine((list) => !sameIgnoringCase(list.map((l) => l.href)), { error: 'The same address is listed twice' }),
  icon: mediaSchema,
  screenshots: z.array(mediaSchema).max(3, { error: 'Up to 3 screenshots' }),
  visible: z.boolean(),
});
export const productsSchema = z.array(productSchema).max(12, { error: 'Up to 12 products' })
  .refine((list) => !sameIgnoringCase(list.map((p) => p.key)), { error: 'Two products have the same key' });

// ---------- services: one pre-rendered page each at /<slug>/, plus cards and footer links ----------
const pair = (a, b) => z.tuple([req(a), req(b)]);
export const serviceSchema = z.object({
  slug: slugSchema,
  name: req(60),
  icon: z.enum(SERVICE_ICONS, { error: 'Pick an icon' }),
  short: req(200), // card text in the services grid and related services
  phrase: req(60), // mid-sentence name: "How a … project runs"
  wide: z.boolean(), // takes a double-width card in the home page services grid
  visible: z.boolean(),
  title: req(80), // <title>, shown in Google results
  description: req(200), // meta description, shown in Google results
  keywords: z.array(req(80)).max(20),
  h1: req(120),
  lead: req(400),
  whatTitle: req(100),
  what: z.array(pair(80, 300)).min(1, { error: 'Add at least one item' }).max(12),
  forTitle: req(100),
  for: z.array(req(200)).min(1, { error: 'Add at least one item' }).max(12),
  includedTitle: req(100),
  included: z.array(req(200)).min(1, { error: 'Add at least one item' }).max(12),
  stack: z.array(req(40)).max(16),
  faqs: z.array(pair(200, 800)).max(12),
  related: z.array(slugSchema).max(6),
  proof: z.object({ text: req(300), href: hrefSchema, label: req(80) }).nullable(),
});
export const servicesSchema = z.array(serviceSchema).min(1).max(30).superRefine((list, ctx) => {
  const slugs = list.map((s) => s.slug);
  if (sameIgnoringCase(slugs)) ctx.addIssue({ code: 'custom', message: 'Two services have the same address' });
  list.forEach((s, i) => {
    if (RESERVED_SLUGS.includes(s.slug)) ctx.addIssue({ code: 'custom', path: [i, 'slug'], message: `/${s.slug}/ is already used by another page` });
    s.related.forEach((r, j) => {
      if (r === s.slug || !slugs.includes(r)) ctx.addIssue({ code: 'custom', path: [i, 'related', j], message: 'Pick another existing service' });
    });
  });
  if (!list.some((s) => s.visible)) ctx.addIssue({ code: 'custom', message: 'Keep at least one service visible' });
});

export const contentSchemas = { stack: stackSchema, hours: hoursSchema, products: productsSchema, services: servicesSchema };

// Zod issues → [{ path: 'what.0.1', message }] for showing next to form fields.
export const issueList = (error) => error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
