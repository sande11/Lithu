import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { HomeHeroScene, Showcase, TimeBand, Modes, ProductShowcase, TeamBuilder, Capabilities, Process, ContactSection } from '../sections.jsx';

const STACK = ['Flutter', 'Swift', 'Kotlin', 'React', 'Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Firebase', 'AWS'];

export default function Home({ route }) {
  return <Layout route={route}>
    <HomeHeroScene>
      <div className="hero-copy">
        <a className="announce seq" style={{ '--d': 0 }} href="/products/vepifind/"><span className="announce-new">Now building</span>VepiFind, an AI job search app <Icon n="chev" /></a>
        <h1><span className="line seq" style={{ '--d': 1 }}><span>We build our own products.</span></span><span className="line grad seq" style={{ '--d': 2 }}><span>And we’ll build yours.</span></span></h1>
        <p className="hero-sub seq" style={{ '--d': 3 }}>Sande Technologies is a software development company in Lilongwe, Malawi, working with clients across Africa and worldwide. We ship our own apps, and the same team builds for clients: as a tech agency delivering your website, app or system end to end, or as remote developers working inside your company.</p>
        <div className="hero-actions seq" style={{ '--d': 4 }}>
          <a className="btn btn-primary" href="/contact/">Start a project <Icon n="arrow" /></a>
          <a className="btn btn-glass" href="/hire-remote-developers/">Hire remote developers</a>
        </div>
      </div>
      <Showcase />
    </HomeHeroScene>

    <section className="stack" aria-label="Technologies we build with">
      <p data-reveal>The stack we ship with</p>
      <div className="stack-row">{STACK.map((s, i) => <span key={s} data-reveal style={{ '--d': i }}>{s}</span>)}</div>
    </section>

    <TimeBand />
    <Modes />

    <section className="section" id="services" aria-labelledby="services-title">
      <div className="head split" data-reveal>
        <div><p className="eyebrow">Tech agency</p><h2 id="services-title">Software development services</h2></div>
        <p>Bring a brief, an idea or a system that isn’t working. We scope it, give you a plan and a fixed price, and deliver it. <a className="link" href="/services/">All services <Icon n="arrow" /></a></p>
      </div>
      <Capabilities />
    </section>

    <section className="section products" id="products" aria-labelledby="products-title">
      <div className="head" data-reveal>
        <p className="eyebrow">Our products</p>
        <h2 id="products-title">Apps we build and run</h2>
        <p>Software made for problems we see around us, built by the same team you’d work with. <a className="link" href="/products/">All products <Icon n="arrow" /></a></p>
      </div>
      <ProductShowcase />
    </section>

    <section className="section team" id="team" aria-labelledby="team-title">
      <div className="team-copy" data-reveal>
        <p className="eyebrow">Remote developers</p>
        <h2 id="team-title">Engineers who work like they’re on your payroll.</h2>
        <p>Tell us the roles you need. We match people from our team, they onboard into your tools and work your sprint, and you scale up or down as the roadmap changes.</p>
        <ul className="ticks">
          <li><Icon n="check" /> They use your chat, issue tracker, repos and rituals</li>
          <li><Icon n="check" /> Central Africa Time (UTC+2) overlaps most of the UK and European workday, plus US East Coast mornings</li>
          <li><Icon n="check" /> One point of contact for scheduling, reporting and replacements</li>
          <li><Icon n="check" /> The code and IP belong to you</li>
        </ul>
        <div className="link-row">
          <a className="link" href="/hire-remote-developers/">How hiring remote developers works <Icon n="arrow" /></a>
          <a className="link" href="/software-development-outsourcing-africa/">Outsourcing to Africa <Icon n="arrow" /></a>
        </div>
      </div>
      <TeamBuilder />
    </section>

    <Process />
    <ContactSection />
  </Layout>;
}
