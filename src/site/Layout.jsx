import { SiteHeader, SiteFooter, Breadcrumbs, useReveal, useSpotlight } from './shared.jsx';

export function Layout({ route, children }) {
  useReveal();
  useSpotlight();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader current={route.path} />
    <main id="main">
      {route.breadcrumbs && <Breadcrumbs trail={route.breadcrumbs} />}
      {children}
    </main>
    <SiteFooter />
  </>;
}
