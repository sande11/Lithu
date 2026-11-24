import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { serviceBySlug } from '../content/cms.js';
import { PageHero, FaqList, CtaBand, Process } from '../sections.jsx';

export default function Service({ route, slug }) {
  const s = serviceBySlug[slug];
  const phrase = s.phrase; // lower-case, used mid-sentence ("How a … project runs")
  const related = s.related.map((r) => serviceBySlug[r]).filter(Boolean); // hidden services drop out
  return <Layout route={route}>
    <PageHero eyebrow={s.name} title={s.h1} lead={s.lead}
      aside={<div className="service-badge glass" data-spot>
        <span className="cap-icon big" aria-hidden="true"><Icon n={s.icon} /></span>
        <p className="badge-title">{s.name}</p>
        <ul className="badge-list">{s.included.slice(0, 3).map((x) => <li key={x}><Icon n="check" /> {x}</li>)}</ul>
      </div>}>
      <a className="btn btn-primary" href="/contact/">Get a quote <Icon n="arrow" /></a>
      <a className="btn btn-glass" href="#faq">Common questions</a>
    </PageHero>

    <section className="section" aria-labelledby="what-title">
      <div className="head" data-reveal><h2 id="what-title">{s.whatTitle}</h2></div>
      <div className="feature-grid">
        {s.what.map(([t, d], i) => <article key={t} className="glass feature" data-reveal data-spot style={{ '--d': i % 3 }}>
          <h3>{t}</h3><p>{d}</p>
        </article>)}
      </div>
      {s.proof && <p className="proof glass" data-reveal><Icon n="check" /> <span>{s.proof.text} <a className="link" href={s.proof.href}>{s.proof.label} <Icon n="arrow" /></a></span></p>}
    </section>

    <section className="section" aria-labelledby="for-title">
      <div className="two-col">
        <div data-reveal>
          <h2 id="for-title" className="h2-sm">{s.forTitle}</h2>
          <ul className="ticks">{s.for.map((x) => <li key={x}><Icon n="check" /> {x}</li>)}</ul>
        </div>
        <div className="glass prose-card" data-reveal data-spot style={{ '--d': 1 }}>
          <h2 className="h2-sm">{s.includedTitle}</h2>
          <ul className="ticks">{s.included.map((x) => <li key={x}><Icon n="check" /> {x}</li>)}</ul>
          <h3 className="stack-h">Tools and technologies</h3>
          <div className="tags">{s.stack.map((x) => <span key={x}>{x}</span>)}</div>
        </div>
      </div>
    </section>

    <Process title={`How ${/^A/.test(phrase) ? 'an' : 'a'} ${phrase} project runs`} />

    <section className="section" aria-labelledby="engage-title">
      <div className="engage glass" data-reveal data-spot>
        <div><h2 id="engage-title" className="h2-sm">A project, or developers on your team</h2>
        <p>Hire us to deliver your {phrase} project end to end with a fixed scope and price, or add our specialists to your own team month to month.</p></div>
        <a className="btn btn-glass" href="/hire-remote-developers/">Hire remote developers <Icon n="arrow" /></a>
      </div>
    </section>

    <FaqList faqs={s.faqs} title={`${s.name}: common questions`} />

    <section className="section" aria-labelledby="related-title">
      <div className="head" data-reveal><h2 id="related-title">Related services</h2></div>
      <div className="related">
        {related.map((r, i) => <a key={r.slug} href={`/${r.slug}/`} className="glass related-card" data-reveal data-spot style={{ '--d': i }}>
          <span className="cap-icon"><Icon n={r.icon} /></span>
          <span><strong>{r.name}</strong><small>{r.short}</small></span>
          <Icon n="arrow" className="related-arrow" />
        </a>)}
      </div>
    </section>

    <CtaBand title={`Talk to us about your ${phrase} project.`} />
  </Layout>;
}
