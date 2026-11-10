// Build-time entry: renders each route to HTML and supplies its head tags.
import { renderToString } from 'react-dom/server';
import { routes } from './routes.js';
import { pages } from './pages/index.js';
import { headFor } from './seo.js';
import { SITE } from './site.js';
import { IMG } from './images.jsx';
import { apps, appSchema, remoteFaqs, vepifindFaqs, contactFaqs, outsourcingFaqs } from './content/pages.js';

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
      apps: [appSchema(apps[0], {
        isAccessibleForFree: true,
        image: abs(IMG.vepiIcon.src),
        screenshot: [IMG.bestFit, IMG.letter, IMG.prep, IMG.track].map((i) => abs(i.src)),
        featureList: ['Job listings from multiple sources', 'Best-fit job matching', 'AI cover letters', 'Application tracking', 'Interview practice'],
      })],
    };
    case 'products': return { apps: apps.map((a) => appSchema(a, { image: abs(IMG[`${a.key === 'vepifind' ? 'vepi' : a.key}Icon`].src) })) };
    default: return {};
  }
}

// Images to list in the sitemap for each page.
export function sitemapImages(route) {
  if (route.page === 'vepifind') return [IMG.vepiIcon, IMG.bestFit, IMG.letter, IMG.prep, IMG.track, IMG.tips, IMG.saved].map((i) => ({ loc: abs(i.src), title: i.alt }));
  if (route.page === 'products') return [IMG.vepiIcon, IMG.beloIcon, IMG.hosprIcon].map((i) => ({ loc: abs(i.src), title: i.alt }));
  return [];
}
