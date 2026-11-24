import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { outsourcingFaqs } from '../content/pages.js';
import { PageHero, TimeBand, Capabilities, Process, FaqList, ContactSection } from '../sections.jsx';

const WHY = [
  ['Working hours that line up with Europe', 'Central Africa Time (UTC+2) is the same as Central European summer time and one to two hours ahead of the UK, so meetings and quick questions happen during your working day.'],
  ['English as a working language', 'English is an official language in Malawi and the language of business and university education, so specs, stand-ups and documentation are straightforward.'],
  ['Competitive rates, same standards', 'Outsourcing to Africa costs less than hiring in London, Berlin or Amsterdam, without dropping code reviews, testing or documentation.'],
  ['A growing pool of tech talent', 'Africa has one of the youngest and fastest-growing workforces in the world, and a fast-growing community of software developers.'],
];

const MODELS = [
  { icon: 'list', title: 'Fixed-scope projects', text: 'Hand us a defined project: a website, app or system. We agree the scope, timeline and price up front and deliver it end to end.', link: ['Our software development services', '/services/'] },
  { icon: 'code', title: 'Dedicated development team', text: 'Developers, designers and QA who work only on your product, inside your tools and sprint, billed monthly per person.', link: ['Hire remote developers', '/hire-remote-developers/'] },
  { icon: 'cloud', title: 'Ongoing support and maintenance', text: 'Hand over an existing product for hosting, monitoring, fixes and small improvements, month to month.', link: ['Cloud hosting and support', '/cloud-hosting-support/'] },
];

const STEPS = [
  ['Discovery call', 'We learn what you need built, your timeline, budget and how your team works.'],
  ['Written proposal', 'A fixed-scope quote for a project, or a team plan with roles, rates and a start date.'],
  ['Kick-off', 'Access to your tools, a shared task board, agreed meeting times and a single point of contact.'],
  ['Delivery and reporting', 'Work in short cycles with a demo every week and a written progress note every month.'],
];

export default function Outsourcing({ route }) {
  return <Layout route={route}>
    <PageHero eyebrow="Outsourcing" title="Software development outsourcing to Africa"
      lead="Outsource your software development to Sande Technologies, a team in Lilongwe, Malawi. We build websites, mobile apps, custom systems and AI features for companies across Africa, the UK and Europe, as a full project or as a dedicated team that works alongside yours.">
      <a className="btn btn-primary" href="#contact">Get a proposal <Icon n="arrow" /></a>
      <a className="btn btn-glass" href="#nearshore">Nearshore for UK and Europe</a>
    </PageHero>

    <section className="section" aria-labelledby="why-title">
      <div className="head" data-reveal>
        <h2 id="why-title">Why outsource software development to Africa</h2>
        <p>Teams in Europe and beyond are looking past the usual outsourcing destinations. Africa offers time zones that match Europe’s, English-speaking developers and rates that make growing a product affordable.</p>
      </div>
      <div className="feature-grid even">
        {WHY.map(([t, d], i) => <article key={t} className="glass feature" data-reveal data-spot style={{ '--d': i % 2 }}><h3>{t}</h3><p>{d}</p></article>)}
      </div>
    </section>

    <section className="section" id="nearshore" aria-labelledby="nearshore-title">
      <div className="two-col">
        <div data-reveal>
          <p className="eyebrow">UK and Europe</p>
          <h2 id="nearshore-title" className="h2-sm" style={{ marginTop: 16 }}>Nearshore developers for UK and European companies</h2>
          <p className="muted-p">Malawi is in the same time band as Europe, not hours away like many outsourcing destinations. Your developers are online when you are, so a question at 10:00 in London gets an answer at 10:00, not the next morning.</p>
          <ul className="ticks" style={{ marginTop: 18 }}>
            <li><Icon n="check" /> Same time as Berlin, Paris and Amsterdam in summer, one hour ahead in winter</li>
            <li><Icon n="check" /> One to two hours ahead of London, so the whole UK working day overlaps</li>
            <li><Icon n="check" /> Stand-ups, reviews and calls at times that suit your team</li>
            <li><Icon n="check" /> Your contracts, NDA and IP terms; the code belongs to you</li>
          </ul>
        </div>
        <div className="glass prose-card" data-reveal data-spot style={{ '--d': 1 }}>
          <h3>How the working day lines up</h3>
          <dl className="facts">
            <div><dt>Lilongwe (CAT, UTC+2)</dt><dd>08:00–17:00</dd></div>
            <div><dt>London (GMT / BST)</dt><dd>06:00–15:00 in winter, 07:00–16:00 in summer</dd></div>
            <div><dt>Berlin, Paris, Amsterdam (CET / CEST)</dt><dd>07:00–16:00 in winter, 08:00–17:00 in summer</dd></div>
            <div><dt>Johannesburg, Lusaka, Harare</dt><dd>08:00–17:00, same time zone</dd></div>
            <div><dt>Nairobi, Dar es Salaam (EAT)</dt><dd>09:00–18:00, one hour ahead of us</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <TimeBand />

    <section className="section" id="africa" aria-labelledby="africa-title">
      <div className="two-col">
        <div data-reveal>
          <p className="eyebrow">Across Africa</p>
          <h2 id="africa-title" className="h2-sm" style={{ marginTop: 16 }}>A software partner for companies across Africa</h2>
          <p className="muted-p">We work remotely, so businesses, startups and NGOs anywhere on the continent can work with us, from Southern Africa to East and West Africa. Most of the region is in our time zone or one hour away, and we build for the conditions your users actually have.</p>
        </div>
        <div className="glass prose-card" data-reveal data-spot style={{ '--d': 1 }}>
          <h3>Built for African users</h3>
          <ul className="ticks">
            <li><Icon n="check" /> Android-first mobile apps that run well on low-cost phones</li>
            <li><Icon n="check" /> Low-data and offline-friendly design for patchy connections</li>
            <li><Icon n="check" /> Mobile money, card and SMS integrations through local providers</li>
            <li><Icon n="check" /> Clear, simple interfaces for first-time smartphone users</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="section" aria-labelledby="models-title">
      <div className="head" data-reveal>
        <h2 id="models-title">Ways to outsource to us</h2>
        <p>Choose the model that fits how much you want to manage yourself.</p>
      </div>
      <div className="related models">
        {MODELS.map((m, i) => <article key={m.title} className="glass prose-card" data-reveal data-spot style={{ '--d': i }}>
          <span className="cap-icon"><Icon n={m.icon} /></span>
          <h3>{m.title}</h3><p>{m.text}</p>
          <a className="link" href={m.link[1]}>{m.link[0]} <Icon n="arrow" /></a>
        </article>)}
      </div>
    </section>

    <section className="section" aria-labelledby="what-title">
      <div className="head" data-reveal>
        <h2 id="what-title">What you can outsource to us</h2>
        <p>Each service page explains what’s included and how we work.</p>
      </div>
      <Capabilities />
    </section>

    <Process id="how" title="How outsourcing with us works" text="From first call to working software, with progress you can see every week." steps={STEPS} />
    <FaqList faqs={outsourcingFaqs} title="Outsourcing to Africa: common questions" />
    <ContactSection title="Tell us what you want to outsource." />
  </Layout>;
}
