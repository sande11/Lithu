// Every page on the site. The build renders each route to its own static HTML file
// (dist/<path>/index.html) with the title, description, canonical URL, social tags and
// structured data below, and lists it in sitemap.xml. Plain data only (no JSX), so Node
// scripts can import it too.
import { services } from './content/services.js';

const HOME = ['Home', '/'];
const SERVICES = ['Services', '/services/'];
const PRODUCTS = ['Products', '/products/'];
const VEPIFIND = ['VepiFind', '/products/vepifind/'];

export const routes = [
  {
    path: '/', page: 'home', og: 'home', changefreq: 'weekly', priority: 1.0,
    title: 'Software Development in Malawi & Africa | Sande Technologies',
    description: 'Software development company in Lilongwe, Malawi, working across Africa and worldwide: our own apps, web and mobile projects, and remote developers.',
    keywords: ['software development company Malawi', 'software development company Africa', 'software company Lilongwe', 'app developers Malawi', 'remote developers Africa'],
  },
  {
    path: '/services/', page: 'services', og: 'services', type: 'CollectionPage', priority: 0.9,
    title: 'Software Development Services in Africa | Sande Technologies',
    description: 'Web development, mobile apps, custom software, AI, UI/UX design and cloud support from Sande Technologies in Lilongwe, Malawi, for clients across Africa.',
    keywords: ['software development services Malawi', 'IT company Lilongwe', 'tech agency Malawi'],
    breadcrumbs: [HOME, SERVICES],
  },
  ...services.map((s) => ({
    path: `/${s.slug}/`, page: 'service', props: { slug: s.slug }, og: s.slug, priority: 0.9,
    title: s.title, description: s.description, keywords: s.keywords,
    breadcrumbs: [HOME, SERVICES, [s.name, `/${s.slug}/`]],
    service: s,
  })),
  {
    path: '/hire-remote-developers/', page: 'remote', og: 'hire-remote-developers', priority: 0.9,
    title: 'Hire Remote Developers from Africa | Sande Technologies',
    description: 'Hire remote developers, designers and QA engineers from our team in Malawi. Working hours that overlap the UK and European day. Monthly engagements.',
    keywords: ['hire remote developers', 'hire African developers', 'remote software developers Africa', 'offshore development team Malawi', 'dedicated development team', 'nearshore developers UK Europe'],
    breadcrumbs: [HOME, ['Hire remote developers', '/hire-remote-developers/']],
  },
  {
    path: '/software-development-outsourcing-africa/', page: 'outsourcing', og: 'outsourcing', priority: 0.9,
    title: 'Outsource Software Development to Africa | Sande Technologies',
    description: 'Outsource software development to our team in Malawi: projects or dedicated developers for companies in Africa, the UK and Europe, on hours that match yours.',
    keywords: ['software development outsourcing Africa', 'outsource software development to Africa', 'nearshore developers UK', 'nearshore software development Europe', 'African software developers', 'software outsourcing Malawi'],
    breadcrumbs: [HOME, ['Outsourcing to Africa', '/software-development-outsourcing-africa/']],
  },
  {
    path: '/products/', page: 'products', og: 'products', type: 'CollectionPage', priority: 0.8,
    title: 'Our Products: Apps Built in Malawi | Sande Technologies',
    description: 'Software designed, built and run by Sande Technologies: VepiFind, an AI job search app for Malawi, Belo for online shopping, and Hospr for hospital management.',
    keywords: ['apps made in Malawi', 'Malawian software products', 'VepiFind', 'Belo app', 'Hospr'],
    breadcrumbs: [HOME, PRODUCTS],
  },
  {
    path: '/products/vepifind/', page: 'vepifind', og: 'vepifind', priority: 0.8,
    title: 'VepiFind: AI Job Search App for Malawi | Sande Technologies',
    description: 'VepiFind brings jobs in Malawi from multiple sources into one app, with best-fit matches, AI cover letters, application tracking and interview practice.',
    keywords: ['job search app Malawi', 'jobs in Malawi', 'job vacancies Malawi app', 'AI cover letter generator', 'VepiFind'],
    breadcrumbs: [HOME, PRODUCTS, VEPIFIND],
  },
  {
    path: '/products/vepifind/privacy-policy/', page: 'legal', props: { doc: 'privacy' }, og: 'vepifind', priority: 0.3, changefreq: 'yearly',
    title: 'VepiFind Privacy Policy | Sande Technologies',
    description: 'How the VepiFind job search app, made by Sande Technologies, collects, uses and protects your personal information, and the choices you have.',
    breadcrumbs: [HOME, PRODUCTS, VEPIFIND, ['Privacy policy', '/products/vepifind/privacy-policy/']],
  },
  {
    path: '/products/vepifind/terms/', page: 'legal', props: { doc: 'terms' }, og: 'vepifind', priority: 0.3, changefreq: 'yearly',
    title: 'VepiFind Terms of Service | Sande Technologies',
    description: 'The terms that apply when you download and use VepiFind, the job search app for Malawi made by Sande Technologies.',
    breadcrumbs: [HOME, PRODUCTS, VEPIFIND, ['Terms of service', '/products/vepifind/terms/']],
  },
  {
    path: '/about/', page: 'about', og: 'about', type: 'AboutPage', priority: 0.7,
    title: 'About Sande Technologies | Software Company in Lilongwe',
    description: 'Sande Technologies is a software company in Lilongwe, Malawi, founded by Kelvin Sande. We build our own apps and work with clients as an agency and remote team.',
    keywords: ['Sande Technologies', 'Sande Tech', 'software company Lilongwe', 'Kelvin Sande'],
    breadcrumbs: [HOME, ['About', '/about/']],
  },
  {
    path: '/contact/', page: 'contact', og: 'contact', type: 'ContactPage', priority: 0.8,
    title: 'Contact Sande Technologies | Start a Software Project',
    description: 'Tell Sande Technologies about your website, app, software project or the remote developers you need. We reply within one working day. Based in Lilongwe, Malawi.',
    keywords: ['contact software developers Malawi', 'get a website quote Malawi', 'hire app developers Lilongwe'],
    breadcrumbs: [HOME, ['Contact', '/contact/']],
  },
  {
    path: '/thank-you/', page: 'thanks', og: 'contact', noindex: true, sitemap: false,
    title: 'Thank you | Sande Technologies',
    description: 'Your enquiry has reached Sande Technologies. We reply within one working day.',
  },
  {
    path: '/404', file: '404.html', page: 'notfound', og: 'home', noindex: true, sitemap: false,
    title: 'Page not found | Sande Technologies',
    description: 'The page you were looking for has moved or no longer exists. Find our services, products and contact details here.',
  },
];

export const routeByPath = Object.fromEntries(routes.map((r) => [r.path, r]));
