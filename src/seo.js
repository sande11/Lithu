// Builds the <head> tags and schema.org structured data for a route. Used by the build only.
import { SITE, abs } from './site.js';
import { services } from './content/services.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ORG = `${SITE.url}/#organization`;
const WEBSITE = `${SITE.url}/#website`;

export const ogImage = (route) => `/og/${route.og || 'home'}.jpg`;

function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG,
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: abs('/icon-512.png'), width: 512, height: 512 },
    image: abs('/og/home.jpg'),
    description: 'Software development company in Lilongwe, Malawi, serving clients across Africa and worldwide. It builds its own products and works with clients as a tech agency, an outsourcing partner and a remote engineering team.',
    email: SITE.email,
    telephone: SITE.phoneE164,
    founder: { '@type': 'Person', name: SITE.founder },
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressCountry: SITE.countryCode },
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'Place', name })),
    knowsAbout: services.map((s) => s.name).concat(['Remote software development teams']),
    contactPoint: [{
      '@type': 'ContactPoint', contactType: 'sales', email: SITE.email, telephone: SITE.phoneE164,
      areaServed: 'Worldwide', availableLanguage: ['English'],
      hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    }],
    ...(SITE.social.length ? { sameAs: SITE.social } : {}),
  };
}

const website = () => ({ '@type': 'WebSite', '@id': WEBSITE, url: `${SITE.url}/`, name: SITE.name, alternateName: SITE.alternateName, inLanguage: 'en', publisher: { '@id': ORG } });

function breadcrumbList(route) {
  return {
    '@type': 'BreadcrumbList', '@id': `${abs(route.path)}#breadcrumb`,
    itemListElement: route.breadcrumbs.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
  };
}

const faqPage = (url, faqs) => ({
  '@type': 'FAQPage', '@id': `${url}#faq`,
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

export function schemaFor(route, extra = {}) {
  const url = abs(route.path);
  const graph = [organization(), website()];
  const page = {
    '@type': route.type || 'WebPage', '@id': `${url}#webpage`, url, name: route.title, description: route.description,
    isPartOf: { '@id': WEBSITE }, about: { '@id': ORG }, inLanguage: 'en',
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(ogImage(route)) },
  };
  if (route.breadcrumbs) { graph.push(breadcrumbList(route)); page.breadcrumb = { '@id': `${url}#breadcrumb` }; }
  graph.push(page);

  if (route.service) {
    const s = route.service;
    graph.push({
      '@type': 'Service', '@id': `${url}#service`, name: s.name, serviceType: s.name, description: s.description, url,
      provider: { '@id': ORG }, areaServed: SITE.areaServed.map((name) => ({ '@type': 'Place', name })),
    });
    graph.push(faqPage(url, s.faqs));
  }
  if (extra.faqs) graph.push(faqPage(url, extra.faqs));
  if (route.page === 'outsourcing') {
    graph.push({ '@type': 'Service', '@id': `${url}#service`, name: 'Software development outsourcing', serviceType: 'Software development outsourcing', description: route.description, url, provider: { '@id': ORG },
      areaServed: ['Africa', 'United Kingdom', 'Europe'].map((name) => ({ '@type': 'Place', name })) });
  }
  if (route.page === 'remote') {
    graph.push({ '@type': 'Service', '@id': `${url}#service`, name: 'Remote software development team', serviceType: 'Staff augmentation', description: route.description, url, provider: { '@id': ORG }, areaServed: { '@type': 'Place', name: 'Worldwide' } });
  }
  if (extra.apps) graph.push(...extra.apps);
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function headFor(route, { faqs, apps, fontPreloads = [] } = {}) {
  const url = route.noindex ? null : abs(route.path);
  const img = abs(ogImage(route));
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<meta name="robots" content="${route.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}" />`,
    url && `<link rel="canonical" href="${url}" />`,
    url && `<link rel="alternate" hreflang="en" href="${url}" />`,
    url && `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE.name}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(route.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<meta name="twitter:image:alt" content="${esc(route.title)}" />`,
    SITE.googleSiteVerification && `<meta name="google-site-verification" content="${esc(SITE.googleSiteVerification)}" />`,
    SITE.bingSiteVerification && `<meta name="msvalidate.01" content="${esc(SITE.bingSiteVerification)}" />`,
    ...fontPreloads.map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin />`),
    `<script type="application/ld+json">${JSON.stringify(schemaFor(route, { faqs, apps })).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
}
