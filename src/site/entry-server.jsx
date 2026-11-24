// Build-time entry: renders each route to HTML and supplies its head tags.
import { renderToString } from 'react-dom/server';
import { routes } from './routes.js';
import { pages } from './pages/index.js';
import { headFor } from './seo.js';
import { SITE } from './site.js';
import { IMG } from './images.jsx';
import { appSchema, remoteFaqs, vepifindFaqs, contactFaqs, outsourcingFaqs } from './content/pages.js';
import { products, allServices } from './content/cms.js';

export { routes, headFor };

export function render(route) {
  const Page = pages[route.page];
  return renderToString(<Page route={route} {...(route.props || {})} />);
}

const abs = (src) => SITE.url + src;

// Extra structured data per page (FAQs and app details).
export function extraFor(route) {
  switch (route.page) {
    case 'remote': return { faqs: remoteFaqs };
    case 'contact': return { faqs: contactFaqs };
    case 'outsourcing': return { faqs: outsourcingFaqs };
    case 'vepifind': return {
      faqs: vepifindFaqs,
      apps: products.filter((p) => p.key === 'vepifind').map((p) => appSchema(p, {
        isAccessibleForFree: true,
        image: abs(IMG.vepiIcon.src),
        screenshot: [IMG.bestFit, IMG.letter, IMG.prep, IMG.track].map((i) => abs(i.src)),
        featureList: ['Job listings from multiple sources', 'Best-fit job matching', 'AI cover letters', 'Application tracking', 'Interview practice'],
      })),
    };
    case 'products': return { apps: products.map((p) => appSchema(p, { image: abs(p.icon.src) })) };
    default: return {};
  }
}

// Images to list in the sitemap for each page.
export function sitemapImages(route) {
  if (route.page === 'vepifind') return [IMG.vepiIcon, IMG.bestFit, IMG.letter, IMG.prep, IMG.track, IMG.tips, IMG.saved].map((i) => ({ loc: abs(i.src), title: i.alt }));
  if (route.page === 'products') return products.map((p) => ({ loc: abs(p.icon.src), title: p.icon.alt }));
  return [];
}

// Netlify redirects for services hidden in /admin/: their old address goes to /services/
// (301), so links and search rankings carry over instead of hitting a 404.
export function serviceRedirects() {
  return allServices.filter((s) => !s.visible).flatMap((s) => [`/${s.slug} /services/ 301`, `/${s.slug}/ /services/ 301`]);
}
