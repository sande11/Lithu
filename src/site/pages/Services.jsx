import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { PageHero, Capabilities, Process, CtaBand } from '../sections.jsx';

export default function Services({ route }) {
  return <Layout route={route}>
    <PageHero eyebrow="Services" title="Software development services from Malawi"
      lead="Websites, mobile apps, custom systems and AI, designed and built by one team in Lilongwe. Hire us for a whole project as your tech agency, or add our developers to your own team.">
      <a className="btn btn-primary" href="/contact/">Get a quote <Icon n="arrow" /></a>
      <a className="btn btn-glass" href="/hire-remote-developers/">Hire remote developers</a>
    </PageHero>

    <section className="section" aria-labelledby="all-services">
      <div className="head" data-reveal>
        <h2 id="all-services">What we build</h2>
        <p>Choose a service to see what’s included, who it’s for and how it works.</p>
      </div>
      <Capabilities />
    </section>

    <section className="section" aria-labelledby="engage-title">
      <div className="head" data-reveal>
        <h2 id="engage-title">Two ways to work with us</h2>
        <p>Every service is available either way. Pick the one that fits how your organisation works.</p>
      </div>
      <div className="two-col">
        <article className="glass prose-card" data-reveal data-spot>
          <h3>A project, delivered end to end</h3>
          <p>You tell us what you need and we take responsibility for the result: scope, design, build, launch and support. You get a fixed quote or milestone pricing agreed before work starts.</p>
          <a className="link" href="/contact/">Request a project quote <Icon n="arrow" /></a>
        </article>
        <article className="glass prose-card" data-reveal data-spot style={{ '--d': 1 }}>
          <h3>Developers inside your team</h3>
          <p>Our engineers and designers join your tools and your sprint and take direction from you, month to month. Ideal when you already have a product and a backlog.</p>
          <a className="link" href="/hire-remote-developers/">How hiring remote developers works <Icon n="arrow" /></a>
          <a className="link" href="/software-development-outsourcing-africa/">Outsourcing to Africa from the UK or Europe <Icon n="arrow" /></a>
        </article>
      </div>
    </section>

    <Process />
    <CtaBand />
  </Layout>;
}
