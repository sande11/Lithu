import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import mark from '../assets/icon-cropped.png';
import vepiLogo from '../assets/vepifind.png';
import vepiScreen from '../assets/vepifind/home_and_best_fit.png';
import beloLogo from '../assets/posters/belo.png';
import hosprLogo from '../assets/posters/hospr.png';

const EMAIL = 'sandetechnologiesmw@gmail.com';
const PHONE = '+265 996 534 912';

const modes = [
  {
    id: 'products',
    name: 'Our products',
    title: 'We build and run our own software.',
    text: 'VepiFind, Belo and Hospr are designed, built and operated by our team. Owning products keeps us honest about what it takes to ship and support real software.',
    fit: 'Users, partners and investors',
    model: 'Use the apps, or talk to us about partnerships',
    link: '#products',
    linkText: 'See our products',
  },
  {
    id: 'team',
    name: 'Remote tech team',
    title: 'Our engineers, working inside your company.',
    text: 'Add designers and developers to your roadmap without hiring in-house. They join your tools, your standups and your sprint, and report to you.',
    fit: 'Startups and companies with a backlog to clear',
    model: 'Monthly engagement, sized to your roadmap',
    link: '#team',
    linkText: 'Build your team',
  },
  {
    id: 'agency',
    name: 'Tech agency',
    title: 'Hand us the project. We deliver it end to end.',
    text: 'Websites, mobile apps and business systems, taken from first conversation to launch, with support after go-live.',
    fit: 'Businesses that need something built, not a team to manage',
    model: 'Fixed scope or milestone-based pricing',
    link: '#agency',
    linkText: 'See what we build',
  },
];

const roles = [
  ['Mobile engineer', 'iOS, Android and cross-platform apps'],
  ['Full-stack web engineer', 'Web apps, dashboards and portals'],
  ['Backend & API engineer', 'APIs, databases, integrations'],
  ['AI & automation engineer', 'LLM features, data pipelines, workflows'],
  ['UI/UX designer', 'Research, flows and production-ready screens'],
  ['QA engineer', 'Test plans, automation and release checks'],
];

const capabilities = [
  ['Web platforms', 'Company sites, e-commerce, portals and dashboards that load fast and are easy to update.', ['React', 'Next.js', 'CMS', 'SEO']],
  ['Mobile apps', 'Android and iOS apps, from first prototype to app store release and updates after.', ['Flutter', 'Swift', 'Kotlin']],
  ['Custom software', 'Internal tools, booking and records systems, APIs and integrations with the tools you already use.', ['Node.js', 'Python', 'PostgreSQL']],
  ['AI & automation', 'Chat assistants, document search, smart recommendations and automated workflows.', ['LLM APIs', 'RAG', 'Automation']],
  ['Product design', 'User research, UX flows and interface design that engineers can build from directly.', ['Figma', 'Prototyping']],
  ['Cloud & support', 'Hosting, monitoring, maintenance and improvements once your product is live.', ['Firebase', 'AWS', 'CI/CD']],
];

const steps = [
  ['Scope', 'A call to understand the problem, the people using it and the constraints. You get a written plan, timeline and quote.'],
  ['Design', 'Flows and screens you can click through before any code is written, so decisions are cheap to change.'],
  ['Build', 'Work in short cycles with a demo at the end of each one. You see progress weekly, not at the end.'],
  ['Launch & support', 'Release, monitoring and a support plan. We stay on for fixes, updates and the next version.'],
];

const engagementLabels = { team: 'Remote tech team', agency: 'Agency project', products: 'Product partnership' };

const Arrow = () => <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 14 14 6M7.5 6H14v6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Plus = () => <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const Check = () => <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10.5 3.2 3L15 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Menu = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const Close = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;

function Logo({ light = true }) {
  return <span className={light ? 'logo' : 'logo dark'}>
    <span className="logo-chip"><img src={mark} alt="" /></span>
    <span className="logo-word">Sande Tech</span>
  </span>;
}

function HeroVisual() {
  return <div className="hero-visual" aria-label="Sande Tech works three ways: our own products, remote tech teams and agency projects" role="img">
    <svg className="wires" viewBox="0 0 640 560" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M270 290 L205 225 L130 225 L130 158" />
      <path pathLength="1" d="M270 290 L345 215 L414 215" />
      <path pathLength="1" d="M270 290 L330 360 L452 360 L452 404" />
      <circle cx="205" cy="225" r="4" /><circle cx="345" cy="215" r="4" /><circle cx="330" cy="360" r="4" />
    </svg>

    <div className="orbit o1" /><div className="orbit o2" /><div className="orbit o3" />
    <div className="core"><span className="core-glow" /><span className="core-chip"><img src={mark} alt="" /></span></div>

    <div className="node n1"><Plus /></div>
    <div className="node n2"><Plus /></div>
    <div className="node n3"><Plus /></div>

    <a className="float-card fc-products" href="#products">
      <span className="fc-label">Our products</span>
      <span className="fc-apps">
        <img src={vepiLogo} alt="" /><img src={beloLogo} alt="" /><img src={hosprLogo} alt="" />
      </span>
      <strong>VepiFind, Belo, Hospr</strong>
    </a>

    <a className="float-card fc-team" href="#team">
      <span className="fc-label">Remote tech team</span>
      <span className="avatars"><i>MA</i><i>FE</i><i>UX</i><i>QA</i></span>
      <strong>Joined your sprint</strong>
      <small><span className="live" /> Standup in your time zone</small>
    </a>

    <a className="float-card fc-agency" href="#agency">
      <span className="fc-label">Agency project</span>
      <strong>Your app, release 1.0</strong>
      <span className="progress"><span /></span>
      <small>Build 4 of 5 shipped</small>
    </a>

    <div className="badge" aria-hidden="true">
      <svg viewBox="0 0 120 120"><defs><path id="circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
        <text><textPath href="#circ" textLength="272" lengthAdjust="spacing">Built in Malawi · Shipped worldwide ·</textPath></text></svg>
      <span><Arrow /></span>
    </div>
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [picked, setPicked] = useState(['Mobile engineer', 'Full-stack web engineer']);
  const [engagement, setEngagement] = useState('agency');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => { document.title = 'Sande Tech — Software products, remote tech teams and agency builds'; }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleRole = (role) => setPicked((p) => p.includes(role) ? p.filter((r) => r !== role) : [...p, role]);

  const requestTeam = () => {
    setEngagement('team');
    setMessage(`We'd like a remote team with: ${picked.join(', ')}.\n\nWhat we're working on: `);
    setStatus(null);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('msg')?.focus({ preventScroll: true }), 600);
  };

  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get('name') || '').trim();
    const email = (data.get('email') || '').trim();
    const company = (data.get('company') || '').trim();
    if (!name || !email || !message.trim()) {
      setStatus({ type: 'error', text: 'Add your name, email and a short description so we can reply.' });
      return;
    }
    const subject = `${engagementLabels[engagement]} enquiry from ${name}${company ? ` (${company})` : ''}`;
    const body = `${message}\n\n—\nName: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ''}\nInterested in: ${engagementLabels[engagement]}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus({ type: 'ok', text: `Your email app should open with the message ready to send. If it doesn't, email us at ${EMAIL}.` });
  };

  return <>
    <div className="page">
      <section className="hero-frame" id="top">
        <div className="hero-bgword" aria-hidden="true">SANDE</div>
        <div className="hero-grid" aria-hidden="true" />

        <header className="site-header">
          <a href="#top" aria-label="Sande Tech home" onClick={closeMenu}><Logo /></a>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <Close /> : <Menu />}</button>
          <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main">
            <div className="nav-pill">
              <a href="#products" onClick={closeMenu}>Products</a>
              <a href="#team" onClick={closeMenu}>Remote teams</a>
              <a href="#agency" onClick={closeMenu}>Agency</a>
              <a href="#process" onClick={closeMenu}>Process</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
            </div>
            <a className="btn btn-light" href="#contact" onClick={closeMenu}>Start a project <span className="btn-dot"><Arrow /></span></a>
          </nav>
        </header>

        <div className="hero">
          <div className="hero-copy">
            <p className="hero-tag"><span className="live" /> Software development company, Lilongwe, Malawi</p>
            <h1>We build our own products. And we’ll build yours.</h1>
            <p className="hero-sub">Sande Tech designs, builds and runs software. We ship our own apps, and the same team takes on client work: as a tech agency delivering your project end to end, or as a remote engineering team working inside your company.</p>
            <div className="hero-actions">
              <a className="btn btn-light" href="#contact">Start a project <span className="btn-dot"><Arrow /></span></a>
              <a className="btn btn-ghost" href="#team">Hire a remote team</a>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="modes" aria-labelledby="modes-title">
        <div className="section-head">
          <h2 id="modes-title">One team. Three ways to work with it.</h2>
          <p>Whether you want to use what we’ve built, borrow our engineers, or hand over a whole project, you get the same people and the same standards.</p>
        </div>
        <div className="mode-panel">
          {modes.map((m) => <article className={`mode mode-${m.id}`} key={m.id}>
            <div className="mode-icon" aria-hidden="true"><span /><span /><span /></div>
            <p className="mode-name">{m.name}</p>
            <h3>{m.title}</h3>
            <p className="mode-text">{m.text}</p>
            <dl>
              <div><dt>Best for</dt><dd>{m.fit}</dd></div>
              <div><dt>How it works</dt><dd>{m.model}</dd></div>
            </dl>
            <a className="link" href={m.link}>{m.linkText} <Arrow /></a>
          </article>)}
        </div>
      </section>

      <section className="dark-frame products" id="products" aria-labelledby="products-title">
        <div className="section-head on-dark">
          <h2 id="products-title">Products we build and run</h2>
          <p>Our own software, made for problems we see around us. Each one is built by the same team you’d work with.</p>
        </div>

        <div className="vepi">
          <div className="vepi-copy">
            <div className="product-id"><img src={vepiLogo} alt="" /><div><h3>VepiFind</h3><span className="status">In development</span></div></div>
            <p>A career app that pulls job listings from multiple sources, matches them to your profile and helps you apply with a stronger CV and cover letter.</p>
            <ul className="ticks">
              <li><Check /> Job listings from multiple sources in one feed</li>
              <li><Check /> Personalised “best fit” recommendations</li>
              <li><Check /> CV optimisation and cover letter drafts</li>
              <li><Check /> Application tracking and interview prep</li>
            </ul>
            <a className="btn btn-light" href="/vepifind.html">Explore VepiFind <span className="btn-dot"><Arrow /></span></a>
          </div>
          <div className="vepi-visual" aria-hidden="true">
            <div className="ring" />
            <div className="phone"><img src={vepiScreen} alt="" /></div>
            <div className="chip chip-a">Best fit: 3 new roles</div>
            <div className="chip chip-b"><Check /> CV updated</div>
          </div>
        </div>

        <div className="more-products">
          <article>
            <img src={beloLogo} alt="" />
            <div><h3>Belo</h3><p>An e-commerce app with personalised shopping, secure payments and delivery tracking.</p></div>
            <span className="status muted">Coming soon</span>
          </article>
          <article>
            <img src={hosprLogo} alt="" />
            <div><h3>Hospr</h3><p>Hospital management with a digital health passport for patient records, appointments and prescriptions.</p></div>
            <span className="status muted">In development</span>
          </article>
        </div>
      </section>

      <section className="team" id="team" aria-labelledby="team-title">
        <div className="team-copy">
          <p className="section-label">Remote tech team</p>
          <h2 id="team-title">Engineers who work like they’re on your payroll.</h2>
          <p>Tell us the roles you need. We match people from our team, they onboard into your tools and work your sprint, and you can scale up or down as the roadmap changes.</p>
          <ul className="ticks dark-ticks">
            <li><Check /> They use your Slack, Jira, GitHub and your rituals</li>
            <li><Check /> Central Africa Time (UTC+2) overlaps the full UK and European workday and US East Coast mornings</li>
            <li><Check /> One point of contact for scheduling, reporting and replacements</li>
            <li><Check /> Code and IP belong to you</li>
          </ul>
        </div>

        <div className="builder" aria-labelledby="builder-title">
          <div className="builder-head">
            <h3 id="builder-title">Build your team</h3>
            <span>{picked.length} {picked.length === 1 ? 'role' : 'roles'} selected</span>
          </div>
          <div className="role-list">
            {roles.map(([r, d]) => {
              const on = picked.includes(r);
              return <button type="button" key={r} className={on ? 'role on' : 'role'} aria-pressed={on} onClick={() => toggleRole(r)}>
                <span className="role-box">{on ? <Check /> : <Plus />}</span>
                <span><strong>{r}</strong><small>{d}</small></span>
              </button>;
            })}
          </div>
          <button type="button" className="btn btn-dark wide" disabled={!picked.length} onClick={requestTeam}>
            {picked.length ? 'Request this team' : 'Pick at least one role'} <span className="btn-dot"><Arrow /></span>
          </button>
        </div>
      </section>

      <section className="agency" id="agency" aria-labelledby="agency-title">
        <div className="section-head split">
          <div>
            <p className="section-label">Tech agency</p>
            <h2 id="agency-title">What we build for clients</h2>
          </div>
          <p>Bring a brief, an idea or a broken system. We’ll scope it, give you a fixed plan and price, and deliver it.</p>
        </div>
        <div className="cap-grid">
          {capabilities.map(([t, d, tags]) => <article className="cap" key={t}>
            <h3>{t}</h3>
            <p>{d}</p>
            <div className="tags">{tags.map((x) => <span key={x}>{x}</span>)}</div>
          </article>)}
        </div>
      </section>

      <section className="dark-frame process" id="process" aria-labelledby="process-title">
        <div className="section-head on-dark">
          <h2 id="process-title">How a project runs</h2>
          <p>The same four stages whether we’re building for you or for ourselves.</p>
        </div>
        <ol className="steps">
          {steps.map(([t, d], i) => <li key={t}><span className="step-n">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <h2 id="contact-title">Tell us what you need built.</h2>
          <p>We reply within one working day with next steps, usually a short call.</p>
          <ul className="contact-list">
            <li><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><span>Phone</span><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></li>
            <li><span>Office</span>Gateway Mall, Lilongwe, Malawi</li>
          </ul>
        </div>

        <form onSubmit={submit} noValidate>
          <fieldset className="seg">
            <legend>I’m interested in</legend>
            <div>
              {['agency', 'team', 'products'].map((k) => <label key={k} className={engagement === k ? 'on' : ''}>
                <input type="radio" name="engagement" value={k} checked={engagement === k} onChange={() => setEngagement(k)} />
                {engagementLabels[k]}
              </label>)}
            </div>
          </fieldset>
          <div className="row">
            <label>Name<input name="name" autoComplete="name" /></label>
            <label>Email<input name="email" type="email" autoComplete="email" /></label>
          </div>
          <label><span>Company <span className="opt">(optional)</span></span><input name="company" autoComplete="organization" /></label>
          <label>What do you need?<textarea id="msg" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A few lines about the project, the team you need, or the problem you’re solving" /></label>
          {status && <p className={`form-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.text}</p>}
          <button className="btn btn-dark" type="submit">Send enquiry <span className="btn-dot"><Arrow /></span></button>
        </form>
      </section>
    </div>

    <footer className="footer">
      <div className="footer-top">
        <Logo />
        <nav aria-label="Footer">
          <a href="#products">Products</a><a href="#team">Remote teams</a><a href="#agency">Agency</a><a href="#contact">Contact</a>
          <a href="/vepifind-privacy-policy.html">VepiFind privacy</a>
        </nav>
      </div>
      <div className="footer-word" aria-hidden="true"><span>Sande Tech</span></div>
      <p className="footer-legal">© {new Date().getFullYear()} Sande Technologies. Software products, remote tech teams and agency builds.</p>
    </footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
