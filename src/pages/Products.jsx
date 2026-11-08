import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { PageHero, ProductShowcase, CtaBand } from '../sections.jsx';

export default function Products({ route }) {
  return <Layout route={route}>
    <PageHero eyebrow="Our products" title="Apps designed, built and run by Sande Technologies"
      lead="Alongside client work we build our own software for problems we see in Malawi: finding work, shopping online and managing healthcare records.">
      <a className="btn btn-primary" href="/products/vepifind/">Explore VepiFind <Icon n="arrow" /></a>
      <a className="btn btn-glass" href="/contact/">Talk about partnerships</a>
    </PageHero>

    <section className="section products" aria-labelledby="apps-title">
      <div className="head" data-reveal>
        <h2 id="apps-title">Our apps</h2>
        <p>Each product is built by the same people who build software for our clients.</p>
      </div>
      <ProductShowcase headingLevel={3} />
    </section>

    <section className="section" aria-labelledby="why-title">
      <div className="two-col">
        <div data-reveal>
          <h2 id="why-title" className="h2-sm">Why a software agency builds its own products</h2>
          <p className="muted-p">Running our own apps means we deal with the same things our clients do: real users, app store reviews, hosting costs, support requests and updates after launch. That experience goes straight into the <a className="link inline" href="/mobile-app-development/">mobile apps</a> and <a className="link inline" href="/web-development/">websites</a> we build for others.</p>
        </div>
        <div className="glass prose-card" data-reveal data-spot style={{ '--d': 1 }}>
          <h2 className="h2-sm">Partner with us</h2>
          <p className="muted-p">Interested in distributing, investing in, or piloting one of our products with your organisation? We’d like to hear from you.</p>
          <a className="link" href="/contact/">Contact us about our products <Icon n="arrow" /></a>
        </div>
      </div>
    </section>

    <CtaBand title="Have an app idea of your own?" text="We can design, build and launch it with you, from first version to app store release." primary={['Start a project', '/contact/']} secondary={['Mobile app development', '/mobile-app-development/']} />
  </Layout>;
}
