import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { SITE } from '../site.js';
import { PageHero, Modes, CtaBand } from '../sections.jsx';

const VALUES = [
  ['Useful over impressive', 'We build what solves the problem in front of us, and we explain our choices in plain language.'],
  ['Honest about time and cost', 'You get a written scope and price before work starts, and early warning if anything changes.'],
  ['Built to last', 'Clean code, documentation and handover, so your software keeps working after we hand it over.'],
  ['Work in the open', 'Weekly demos, shared task lists and direct access to the people doing the work.'],
];

export default function About({ route }) {
  return <Layout route={route}>
    <PageHero eyebrow="About us" title="About Sande Technologies"
      lead={`Sande Technologies is a software development company based in ${SITE.city}, ${SITE.country}. We design and build our own products, and we build software for clients as a tech agency and as a remote engineering team.`}>
      <a className="btn btn-primary" href="/contact/">Work with us <Icon n="arrow" /></a>
      <a className="btn btn-glass" href="/services/">Our services</a>
    </PageHero>

    <section className="section" aria-labelledby="story-title">
      <div className="two-col">
        <div data-reveal>
          <h2 id="story-title" className="h2-sm">Our story</h2>
          <p className="muted-p">Sande Technologies was founded by {SITE.founder} to make good software accessible to businesses and communities in Malawi. We started by building websites and apps for local organisations, and we now also build our own products, like the <a className="link inline" href="/products/vepifind/">VepiFind job search app</a>.</p>
          <p className="muted-p">Our mission is to empower businesses and communities through technology that is accessible, useful and built to last.</p>
        </div>
        <div className="glass prose-card" data-reveal data-spot style={{ '--d': 1 }}>
          <h2 className="h2-sm">At a glance</h2>
          <dl className="facts">
            <div><dt>Based in</dt><dd>{SITE.city}, {SITE.country}</dd></div>
            <div><dt>Works with</dt><dd>Clients in Malawi and remotely in the UK, Europe and the US</dd></div>
            <div><dt>Working hours</dt><dd>{SITE.hours}</dd></div>
            <div><dt>What we do</dt><dd><a className="link inline" href="/services/">Software development services</a>, <a className="link inline" href="/hire-remote-developers/">remote developers</a> and <a className="link inline" href="/products/">our own products</a></dd></div>
          </dl>
        </div>
      </div>
    </section>

    <Modes />

    <section className="section" aria-labelledby="values-title">
      <div className="head" data-reveal><h2 id="values-title">How we work</h2></div>
      <div className="feature-grid even">
        {VALUES.map(([t, d], i) => <article key={t} className="glass feature" data-reveal data-spot style={{ '--d': i % 2 }}><h3>{t}</h3><p>{d}</p></article>)}
      </div>
    </section>

    <CtaBand />
  </Layout>;
}
