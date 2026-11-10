import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { services } from '../content/services.js';

export default function NotFound({ route }) {
  return <Layout route={route}>
    <section className="page-hero notfound">
      <div className="page-hero-inner">
        <div className="page-hero-copy">
          <p className="eyebrow">Error 404</p>
          <h1>This page isn’t here</h1>
          <p className="hero-sub">The page may have moved when we redesigned the site, or the link may be mistyped. These pages should help:</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/">Go to the home page <Icon n="arrow" /></a>
            <a className="btn btn-glass" href="/contact/">Contact us</a>
          </div>
        </div>
      </div>
    </section>
    <section className="section" aria-labelledby="nf-links">
      <div className="head"><h2 id="nf-links" className="h2-sm">Popular pages</h2></div>
      <ul className="nf-list">
        {services.map((s) => <li key={s.slug}><a className="link" href={`/${s.slug}/`}>{s.name}</a></li>)}
        <li><a className="link" href="/hire-remote-developers/">Hire remote developers</a></li>
        <li><a className="link" href="/products/vepifind/">VepiFind job search app</a></li>
        <li><a className="link" href="/about/">About Sande Technologies</a></li>
      </ul>
    </section>
  </Layout>;
}
