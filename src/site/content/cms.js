// Content edited in /admin/: tech stack, working hours, products and services. It lives in
// the Neon database; scripts/fetch-content.mjs downloads it into cms.json before every build
// and `npm run dev`, so pages are pre-rendered from it like any other content.
import cms from './cms.json';
import { hoursText } from '../../shared/hours.js';

export const stack = cms.stack;

export const hours = cms.hours;
// "Monday to Friday, 08:00–17:00 CAT (UTC+2)"
export const hoursLine = hoursText(hours, hours.utcOffset);

export const products = cms.products;

// Hidden services get no page; their old address redirects to /services/ (see prerender.mjs).
export const allServices = cms.services;
export const services = cms.services.filter((s) => s.visible);
export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
