// Copy and data shared between the page components and the build (structured data).
import { SITE } from '../site.js';

export const remoteFaqs = [
  ['How quickly can a developer start?', 'It depends on the roles and skills you need. On the first call we confirm who is available and agree a start date before you commit.'],
  ['How long do engagements last?', 'Engagements run month to month. Most clients start with one or two people and adjust the team as their roadmap changes.'],
  ['Who manages the developers day to day?', 'You do. They work in your tools, attend your stand-ups and take priorities from your product owner. We handle contracts, equipment, reporting and replacements.'],
  ['Which time zone do you work in?', 'Central Africa Time (UTC+2), with no daylight saving. That is the same as Central European summer time and one hour ahead in winter, one to two hours ahead of the UK, and six to seven hours ahead of the US East Coast.'],
  ['Who owns the code?', 'You do. Code and other work produced for you belong to you, and we are happy to sign your NDA and IP agreements.'],
  ['Can we start with a small project first?', 'Yes. Starting with a short, well-defined piece of work is a good way to see how we work before adding people to your team.'],
];

export const outsourcingFaqs = [
  ['Why outsource software development to Africa?', 'African software teams combine working hours that line up with Europe, English as a working language and competitive rates. Our team in Malawi works on Central Africa Time (UTC+2), the same as Central European summer time and one to two hours ahead of the UK.'],
  ['Is outsourcing to Malawi reliable?', 'We work the way in-house teams do: a named team, weekly demos, a shared task board and direct access to the developers in your chat tool. You see progress every week instead of waiting for a final handover.'],
  ['Do you work with companies elsewhere in Africa?', 'Yes. We work remotely, so organisations anywhere in Africa can hire us for a project or a dedicated team. We build for African conditions: Android-first apps, low-data and offline-friendly design, and mobile money and SMS integrations.'],
  ['How is pricing structured?', 'Projects are priced as a fixed scope or by milestone, agreed in writing before work starts. Dedicated developers are billed monthly per person, with no long lock-in.'],
  ['Who owns the code and intellectual property?', 'You do. Everything we build for you belongs to you, and we are happy to sign your NDA and IP agreements before any work starts.'],
  ['What if the work needs to change during the project?', 'Changes are expected. We agree the impact on time and cost before starting a change, so there are no surprises on the invoice.'],
];

export const vepifindFaqs = [
  ['Is VepiFind free to use?', 'Yes. VepiFind is free to download and use. We want job searching to be accessible to everyone in Malawi.'],
  ['What kinds of jobs are on VepiFind?', 'Jobs across industries, including IT, healthcare, education, finance, retail and hospitality, from entry level to senior roles.'],
  ['How does the AI cover letter work?', 'VepiFind reads the job description and your profile and drafts a personalised cover letter. You can review and edit it before you apply.'],
  ['Can I use VepiFind on iPhone?', 'VepiFind is launching on Android first. An iOS version is in development.'],
  ['How often are new jobs added?', 'Every day. VepiFind collects listings from multiple sources and updates them continuously, so you see new roles as they’re posted.'],
];

export const contactFaqs = [
  ['What happens after I send an enquiry?', 'We reply within one working day, usually to book a short call. After the call you receive a written scope, timeline and quote, or a team proposal for remote developers.'],
  ['Do you work with clients outside Malawi?', 'Yes. We work remotely with clients in Malawi, the wider region, the UK, Europe and the US.'],
  ['Can we meet in person?', 'We work remotely by default. For clients in Lilongwe we can arrange to meet when a project needs it.'],
];

export const apps = [
  { key: 'vepifind', name: 'VepiFind', status: 'In development', category: 'BusinessApplication', os: 'Android', path: '/products/vepifind/',
    summary: 'An AI job search app for Malawi: listings from multiple sources in one feed, best-fit matches, AI cover letters, application tracking and interview practice.' },
  { key: 'belo', name: 'Belo', status: 'Coming soon', category: 'ShoppingApplication', os: 'Android',
    summary: 'An e-commerce app with personalised shopping, secure payments and delivery tracking.' },
  { key: 'hospr', name: 'Hospr', status: 'In development', category: 'HealthApplication', os: 'Android, Web',
    summary: 'Hospital management with a digital health passport for patient records, appointments and prescriptions.' },
];

export const appSchema = (app, extra = {}) => ({
  '@type': 'SoftwareApplication',
  '@id': `${SITE.url}/products/${app.key === 'vepifind' ? 'vepifind/' : ''}#${app.key}`,
  name: app.name,
  applicationCategory: app.category,
  operatingSystem: app.os,
  description: app.summary,
  publisher: { '@id': `${SITE.url}/#organization` },
  ...(app.path ? { url: SITE.url + app.path } : {}),
  ...extra,
});
