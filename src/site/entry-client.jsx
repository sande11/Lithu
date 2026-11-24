// Browser entry. Pages arrive pre-rendered as HTML; this loads the code for the current page
// and attaches it (hydration) so animations and forms come alive. In `npm run dev` there is no
// pre-rendered HTML, so it renders the page from scratch instead.
import '@fontsource-variable/sora';
import '@fontsource-variable/figtree';
import './styles.css';
import './vepifind.css';
import './pages.css';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { routeByPath } from './routes.js';
import { initPage } from './shared.jsx';

const loaders = {
  home: () => import('./pages/Home.jsx'),
  services: () => import('./pages/Services.jsx'),
  service: () => import('./pages/Service.jsx'),
  remote: () => import('./pages/Remote.jsx'),
  products: () => import('./pages/Products.jsx'),
  vepifind: () => import('./pages/VepiFind.jsx'),
  about: () => import('./pages/About.jsx'),
  contact: () => import('./pages/Contact.jsx'),
  legal: () => import('./pages/Legal.jsx'),
  notfound: () => import('./pages/NotFound.jsx'),
  thanks: () => import('./pages/ThankYou.jsx'),
  outsourcing: () => import('./pages/Outsourcing.jsx'),
};

const root = document.getElementById('root');
const prerendered = !!root.dataset.path;
const path = root.dataset.path || location.pathname.replace(/\/?$/, '/').replace(/^\/index\.html\/$/, '/');
const route = routeByPath[path] || routeByPath['/404'];

initPage();
loaders[route.page]().then(({ default: Page }) => {
  const el = <Page route={route} {...(route.props || {})} />;
  if (prerendered) hydrateRoot(root, el); else createRoot(root).render(el);
});
