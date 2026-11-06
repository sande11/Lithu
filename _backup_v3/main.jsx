import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import mark from '../assets/icon-cropped.png';
import vepiLogo from '../assets/vepifind.png';
import vepiHome from '../assets/vepifind/home_and_best_fit.png';
import vepiLetter from '../assets/vepifind/cover_letter.png';
import vepiTips from '../assets/vepifind/tips.png';
import beloLogo from '../assets/posters/belo.png';
import hosprLogo from '../assets/posters/hospr.png';

const EMAIL = 'sandetechnologiesmw@gmail.com';
const PHONE = '+265 996 534 912';

const stack = ['Flutter', 'Swift', 'Kotlin', 'React', 'Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Firebase', 'AWS'];
const ribbon = ['Mobile apps', 'Web platforms', 'Custom software', 'AI & automation', 'Product design', 'Remote engineers', 'Cloud & support'];

const roles = [
  ['Mobile engineer', 'iOS, Android and cross-platform apps'],
  ['Full-stack web engineer', 'Web apps, dashboards and portals'],
  ['Backend & API engineer', 'APIs, databases, integrations'],
  ['AI & automation engineer', 'LLM features, data pipelines, workflows'],
  ['UI/UX designer', 'Research, flows and production-ready screens'],
  ['QA engineer', 'Test plans, automation and release checks'],
];

const capabilities = [
  { t: 'Web platforms', d: 'Company sites, e-commerce, booking systems, portals and dashboards that load fast and are easy to update.', tags: ['React', 'Next.js', 'CMS', 'SEO'], icon: 'web', wide: true },
  { t: 'Mobile apps', d: 'Android and iOS apps, from first prototype to app store release and the updates after.', tags: ['Flutter', 'Swift', 'Kotlin'], icon: 'phone' },
  { t: 'Custom software', d: 'Internal tools, records systems, APIs and integrations with the tools you already use.', tags: ['Node.js', 'Python', 'PostgreSQL'], icon: 'code' },
  { t: 'AI & automation', d: 'Assistants that answer from your documents, smart recommendations and automated workflows.', tags: ['LLM APIs', 'RAG', 'Automation'], icon: 'spark' },
  { t: 'Product design', d: 'User research, UX flows and interfaces engineers can build from directly.', tags: ['Figma', 'Prototyping'], icon: 'pen' },
  { t: 'Cloud & support', d: 'Hosting, monitoring, maintenance and improvements once your product is live.', tags: ['Firebase', 'AWS', 'CI/CD'], icon: 'cloud', wide: true },
];

const steps = [
  ['Scope', 'A call to understand the problem and constraints. You get a written plan, timeline and quote.'],
  ['Design', 'Screens you can click through before code is written, so changes are cheap.'],
  ['Build', 'Short cycles with a demo at the end of each one. You see progress every week.'],
  ['Launch & support', 'Release, monitoring and a support plan. We stay on for the next version.'],
];

const engagementLabels = { agency: 'Agency project', team: 'Remote tech team', products: 'Product partnership' };

/* ---------- icons ---------- */
const I = {
  arrow: <path d="M6 14 14 6M7.5 6H14v6.5" />,
  plus: <path d="M10 5v10M5 10h10" />,
  check: <path d="m5 10.5 3.2 3L15 6.5" />,
  chev: <path d="m8 5 5 5-5 5" />,
  web: <><rect x="2.5" y="4" width="15" height="12" rx="2" /><path d="M2.5 7.5h15M5 5.8h.01M7 5.8h.01" /></>,
  phone: <><rect x="6" y="2.5" width="8" height="15" rx="2" /><path d="M9 15h2" /></>,
  code: <path d="m7 6-4 4 4 4M13 6l4 4-4 4M11 4.5 9 15.5" />,
  spark: <path d="M10 2.5v4M10 13.5v4M2.5 10h4M13.5 10h4M5 5l2.2 2.2M12.8 12.8 15 15M15 5l-2.2 2.2M7.2 12.8 5 15" />,
  pen: <path d="m4 16 1-4 8-8 3 3-8 8-4 1ZM11.5 5.5l3 3" />,
  cloud: <path d="M6 15.5h8.5a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 5.3 9.3 3.2 3.2 0 0 0 6 15.5Z" />,
};
const Icon = ({ n, className }) => <svg className={className} viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{I[n]}</svg>;

function Logo() {
  return <span className="logo"><span className="logo-chip"><img src={mark} alt="" /></span><span className="logo-word">Sande Tech</span></span>;
}

/* ---------- hero showcase ---------- */
function Dashboard() {
  return <div className="dash" aria-hidden="true">
    <div className="dash-bar"><i /><i /><i /><span>portal.yourbusiness.com</span></div>
    <div className="dash-body">
      <aside className="dash-side">
        <div className="dash-brand"><span />Your Business</div>
        {['Overview', 'Bookings', 'Customers', 'Payments', 'Reports', 'Settings'].map((x, i) => <div key={x} className={i === 0 ? 'on' : ''}><b />{x}</div>)}
      </aside>
      <div className="dash-main">
        <div className="dash-head"><strong>Overview</strong><span>This week</span></div>
        <div className="kpis">
          <div><small>Bookings</small><strong>1,284</strong><em>+12.4%</em></div>
          <div><small>Revenue (MWK)</small><strong>24.6M</strong><em>+8.1%</em></div>
          <div><small>Repeat customers</small><strong>64%</strong><em>+3.2%</em></div>
        </div>
        <div className="dash-grid">
          <div className="chart">
            <div className="chart-head"><small>Bookings over time</small><span><i className="k1" />This year <i className="k2" />Last year</span></div>
            <svg viewBox="0 0 400 140" preserveAspectRatio="none">
              <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3fd0ff" stopOpacity=".35" /><stop offset="1" stopColor="#3fd0ff" stopOpacity="0" /></linearGradient></defs>
              {[30, 65, 100].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} className="gl" />)}
              <path className="l2" d="M0 110 C40 104 60 96 95 98 S150 80 190 86 255 70 290 74 350 60 400 58" />
              <path className="area" d="M0 120 C30 110 55 92 90 88 S140 96 175 70 230 64 260 50 320 44 350 28 400 18 V140 H0Z" />
              <path className="l1" d="M0 120 C30 110 55 92 90 88 S140 96 175 70 230 64 260 50 320 44 350 28 400 18" />
              <circle cx="260" cy="50" r="4" className="pt" />
            </svg>
          </div>
          <div className="activity">
            <small>Latest activity</small>
            {[['Payment received', 'Airtel Money', 'ok'], ['New booking', '10:30, Room 4', 'b'], ['Invoice sent', 'Order #2041', 'v'], ['Customer added', 'Web sign-up', 'b']].map(([a, b, c]) => <div key={a}><i className={c} /><p><strong>{a}</strong><span>{b}</span></p></div>)}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

function ChatPhone() {
  return <div className="phone phone-chat" aria-hidden="true">
    <div className="chat">
      <div className="chat-top"><b>#</b><div><strong>product-team</strong><span>Your workspace</span></div></div>
      <div className="msg"><i className="av a1">ME</i><div><small>Mobile engineer · Sande Tech</small><p>Build 1.4 is on TestFlight. Release notes in the ticket.</p></div></div>
      <div className="msg mine"><div><small>You</small><p>Nice. Can we demo it on Friday?</p></div></div>
      <div className="msg"><i className="av a2">QA</i><div><small>QA engineer · Sande Tech</small><p>Regression suite passed. No blockers.</p></div></div>
      <div className="standup"><span className="live" />Daily standup, 09:00<em>Join</em></div>
    </div>
  </div>;
}

function Showcase() {
  return <div className="showcase">
    <div className="horizon" aria-hidden="true"><div className="horizon-glow" /><div className="horizon-ring" /></div>
    <div className="tag-float tf-left"><span className="tf-dot" /><small>Our product</small><strong>VepiFind career app</strong></div>
    <div className="tag-float tf-center"><span className="tf-dot" /><small>Agency project</small><strong>A client’s booking portal</strong></div>
    <div className="tag-float tf-right"><span className="tf-dot" /><small>Remote tech team</small><strong>Working in your chat and sprint</strong></div>
    <div className="stage">
      <Dashboard />
      <div className="phone phone-left" aria-hidden="true"><img src={vepiHome} alt="" /></div>
      <ChatPhone />
    </div>
  </div>;
}

/* ---------- mode visuals ---------- */
function ModeProducts() {
  return <div className="mv mv-products" aria-hidden="true">
    <div className="app-row">
      <span><img src={vepiLogo} alt="" /><em className="ok">In development</em></span>
      <span><img src={beloLogo} alt="" /><em>Coming soon</em></span>
      <span><img src={hosprLogo} alt="" /><em>In development</em></span>
    </div>
  </div>;
}
function ModeTeam() {
  return <div className="mv mv-team" aria-hidden="true">
    <div className="tz"><span>Lilongwe</span><div className="bar"><i style={{ left: '25%', width: '37.5%' }} /></div></div>
    <div className="tz"><span>London</span><div className="bar"><i style={{ left: '33.3%', width: '37.5%' }} /></div></div>
    <div className="tz"><span>New York</span><div className="bar"><i style={{ left: '54.2%', width: '37.5%' }} /></div></div>
    <div className="tz-note">08:00–17:00 local, shown on one UTC day</div>
  </div>;
}
function ModeAgency() {
  return <div className="mv mv-agency" aria-hidden="true">
    {[['Scope', 'done'], ['Design', 'done'], ['Build', 'now'], ['Launch', '']].map(([s, st]) => <div key={s} className={`ms ${st}`}><i>{st === 'done' ? <Icon n="check" /> : null}</i><span>{s}</span></div>)}
  </div>;
}

const modes = [
  { id: 'products', V: ModeProducts, name: 'Our products', title: 'Software we build and run ourselves.', text: 'VepiFind, Belo and Hospr are designed, built and operated by our team. Owning products keeps us honest about what it takes to ship and support real software.', fit: 'Users, partners and investors', how: 'Use the apps, or talk to us about partnerships', link: '#products', cta: 'See our products' },
  { id: 'team', V: ModeTeam, name: 'Remote tech team', title: 'Our engineers, working inside your company.', text: 'Add designers and developers without hiring in-house. They join your tools, your standups and your sprint, and report to you.', fit: 'Startups and teams with a backlog to clear', how: 'Monthly engagement, sized to your roadmap', link: '#team', cta: 'Build your team' },
  { id: 'agency', V: ModeAgency, name: 'Tech agency', title: 'Hand us the project. We deliver it.', text: 'Websites, mobile apps and business systems, taken from first conversation to launch, with support after go-live.', fit: 'Businesses that need something built, not a team to manage', how: 'Fixed scope or milestone-based pricing', link: '#agency', cta: 'See what we build' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [picked, setPicked] = useState(['Mobile engineer', 'Full-stack web engineer']);
  const [engagement, setEngagement] = useState('agency');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => { document.title = 'Sande Tech — Software products, remote tech teams and agency builds'; }, []);

  // Scroll-linked lighting: the showcase tilts flat and the horizon brightens as you scroll.
  useEffect(() => {
    const el = heroRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el?.style.setProperty('--p', 1); return; }
    let raf = 0;
    const update = () => { raf = 0; const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.55))); el.style.setProperty('--p', p.toFixed(3)); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleRole = (r) => setPicked((p) => p.includes(r) ? p.filter((x) => x !== r) : [...p, r]);
  const requestTeam = () => {
    setEngagement('team');
    setMessage(`We'd like a remote team with: ${picked.join(', ')}.\n\nWhat we're working on: `);
    setStatus(null);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('msg')?.focus({ preventScroll: true }), 700);
  };
  const submit = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = (d.get('name') || '').trim(), email = (d.get('email') || '').trim(), company = (d.get('company') || '').trim();
    if (!name || !email || !message.trim()) { setStatus({ type: 'error', text: 'Add your name, email and a short description so we can reply.' }); return; }
    const subject = `${engagementLabels[engagement]} enquiry from ${name}${company ? ` (${company})` : ''}`;
    const body = `${message}\n\n—\nName: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ''}\nInterested in: ${engagementLabels[engagement]}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus({ type: 'ok', text: `Your email app should open with the enquiry ready to send. If it doesn't, email us at ${EMAIL}.` });
  };

  return <>
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" aria-label="Sande Tech home" onClick={closeMenu}><Logo /></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
        </button>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main">
          <a href="#products" onClick={closeMenu}>Products</a>
          <a href="#team" onClick={closeMenu}>Remote teams</a>
          <a href="#agency" onClick={closeMenu}>Agency</a>
          <a href="#process" onClick={closeMenu}>Process</a>
          <a className="btn btn-primary btn-sm" href="#contact" onClick={closeMenu}>Start a project</a>
        </nav>
      </div>
    </header>

    <main>
      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-copy">
          <a className="announce" href="#products"><span className="announce-new">Now building</span>VepiFind, an AI career app <Icon n="chev" /></a>
          <h1>We build our own products.<span>And we’ll build yours.</span></h1>
          <p className="hero-sub">Sande Tech is a software development company in Lilongwe, Malawi. We ship our own apps, and the same team builds for clients: as a tech agency delivering your project end to end, or as a remote engineering team working inside your company.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">Start a project <Icon n="arrow" /></a>
            <a className="btn btn-glass" href="#team">Hire a remote team</a>
          </div>
        </div>
        <Showcase />
      </section>

      <section className="stack" aria-label="Technologies we build with">
        <p>The stack we ship with</p>
        <div className="stack-row">{stack.map((s) => <span key={s}>{s}</span>)}</div>
      </section>

      <div className="ribbons" aria-hidden="true">
        <div className="ribbon r-back"><div className="track">{[...ribbon, ...ribbon, ...ribbon].map((w, i) => <span key={i}>{w}<i>✦</i></span>)}</div></div>
        <div className="ribbon r-front"><div className="track">{[...ribbon, ...ribbon, ...ribbon].map((w, i) => <span key={i}>{w}<i>✦</i></span>)}</div></div>
      </div>

      <section className="section" aria-labelledby="modes-title">
        <div className="head center">
          <p className="eyebrow">How to work with us</p>
          <h2 id="modes-title">One team. Three ways to work with it.</h2>
          <p>Use what we’ve built, add our engineers to your team, or hand us a whole project. You get the same people and the same standards either way.</p>
        </div>
        <div className="modes">
          {modes.map(({ id, V, ...m }) => <article className={`mode mode-${id}`} key={id}>
            <V />
            <div className="mode-body">
              <p className="mode-name">{m.name}</p>
              <h3>{m.title}</h3>
              <p className="mode-text">{m.text}</p>
              <dl><div><dt>Best for</dt><dd>{m.fit}</dd></div><div><dt>How it works</dt><dd>{m.how}</dd></div></dl>
              <a className="link" href={m.link}>{m.cta} <Icon n="arrow" /></a>
            </div>
          </article>)}
        </div>
      </section>

      <section className="section products" id="products" aria-labelledby="products-title">
        <div className="head">
          <p className="eyebrow">Our products</p>
          <h2 id="products-title">Products we build and run</h2>
          <p>Software made for problems we see around us, built by the same team you’d work with.</p>
        </div>
        <div className="vepi glass">
          <div className="vepi-copy">
            <div className="pid"><img src={vepiLogo} alt="" /><div><h3>VepiFind</h3><span className="pill ok">In development</span></div></div>
            <p>A career app that pulls job listings from multiple sources, matches them to your profile and helps you apply with a stronger CV and cover letter.</p>
            <ul className="ticks">
              <li><Icon n="check" /> Job listings from multiple sources in one feed</li>
              <li><Icon n="check" /> Personalised “best fit” recommendations</li>
              <li><Icon n="check" /> Cover letter drafts and CV improvements</li>
              <li><Icon n="check" /> Application tracking and interview prep</li>
            </ul>
            <a className="btn btn-primary" href="/vepifind.html">Explore VepiFind <Icon n="arrow" /></a>
          </div>
          <div className="fan" aria-hidden="true">
            <div className="fan-glow" />
            <div className="phone fp1"><img src={vepiLetter} alt="" /></div>
            <div className="phone fp2"><img src={vepiHome} alt="" /></div>
            <div className="phone fp3"><img src={vepiTips} alt="" /></div>
          </div>
        </div>
        <div className="more">
          <article className="glass"><img src={beloLogo} alt="" /><div><h3>Belo <span className="pill">Coming soon</span></h3><p>An e-commerce app with personalised shopping, secure payments and delivery tracking.</p></div></article>
          <article className="glass"><img src={hosprLogo} alt="" /><div><h3>Hospr <span className="pill">In development</span></h3><p>Hospital management with a digital health passport for records, appointments and prescriptions.</p></div></article>
        </div>
      </section>

      <section className="section team" id="team" aria-labelledby="team-title">
        <div className="team-copy">
          <p className="eyebrow">Remote tech team</p>
          <h2 id="team-title">Engineers who work like they’re on your payroll.</h2>
          <p>Tell us the roles you need. We match people from our team, they onboard into your tools and work your sprint, and you scale up or down as the roadmap changes.</p>
          <ul className="ticks">
            <li><Icon n="check" /> They use your chat, issue tracker, repos and rituals</li>
            <li><Icon n="check" /> Central Africa Time (UTC+2) overlaps most of the UK and European workday, plus US East Coast mornings</li>
            <li><Icon n="check" /> One point of contact for scheduling, reporting and replacements</li>
            <li><Icon n="check" /> The code and IP belong to you</li>
          </ul>
        </div>
        <div className="builder glass">
          <div className="builder-head"><h3>Build your team</h3><span>{picked.length} {picked.length === 1 ? 'role' : 'roles'} selected</span></div>
          <div className="roles">
            {roles.map(([r, d]) => { const on = picked.includes(r); return <button type="button" key={r} className={on ? 'role on' : 'role'} aria-pressed={on} onClick={() => toggleRole(r)}>
              <span className="role-box"><Icon n={on ? 'check' : 'plus'} /></span><span><strong>{r}</strong><small>{d}</small></span></button>; })}
          </div>
          <button type="button" className="btn btn-primary wide" disabled={!picked.length} onClick={requestTeam}>{picked.length ? 'Request this team' : 'Pick at least one role'} <Icon n="arrow" /></button>
        </div>
      </section>

      <section className="section" id="agency" aria-labelledby="agency-title">
        <div className="head split">
          <div><p className="eyebrow">Tech agency</p><h2 id="agency-title">What we build for clients</h2></div>
          <p>Bring a brief, an idea or a system that isn’t working. We scope it, give you a plan and a price, and deliver it.</p>
        </div>
        <div className="bento">
          {capabilities.map((c) => <article className={`cap glass${c.wide ? ' wide' : ''}`} key={c.t}>
            <span className="cap-icon"><Icon n={c.icon} /></span>
            <h3>{c.t}</h3><p>{c.d}</p>
            <div className="tags">{c.tags.map((x) => <span key={x}>{x}</span>)}</div>
          </article>)}
        </div>
      </section>

      <section className="section" id="process" aria-labelledby="process-title">
        <div className="head center">
          <p className="eyebrow">Process</p>
          <h2 id="process-title">How a project runs</h2>
          <p>The same four stages whether we’re building for you or for ourselves.</p>
        </div>
        <ol className="steps">
          {steps.map(([t, d], i) => <li key={t} className="glass"><span className="step-n">{i + 1}</span><h3>{t}</h3><p>{d}</p>{i < steps.length - 1 && <span className="step-chev" aria-hidden="true"><Icon n="chev" /></span>}</li>)}
        </ol>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="horizon small" aria-hidden="true"><div className="horizon-glow" /><div className="horizon-ring" /></div>
        <div className="head center">
          <h2 id="contact-title">Tell us what you need built.</h2>
          <p>We reply within one working day with next steps, usually a short call.</p>
        </div>
        <div className="contact-grid">
          <ul className="contact-list glass">
            <li><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><span>Phone</span><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></li>
            <li><span>Office</span>Gateway Mall, Lilongwe, Malawi</li>
            <li><span>Hours</span>Monday to Friday, 08:00–17:00 CAT</li>
          </ul>
          <form className="glass" onSubmit={submit} noValidate>
            <fieldset className="seg"><legend>I’m interested in</legend><div>
              {['agency', 'team', 'products'].map((k) => <label key={k} className={engagement === k ? 'on' : ''}><input type="radio" name="engagement" value={k} checked={engagement === k} onChange={() => setEngagement(k)} />{engagementLabels[k]}</label>)}
            </div></fieldset>
            <div className="row">
              <label>Name<input name="name" autoComplete="name" /></label>
              <label>Email<input name="email" type="email" autoComplete="email" /></label>
            </div>
            <label><span>Company <span className="opt">(optional)</span></span><input name="company" autoComplete="organization" /></label>
            <label>What do you need?<textarea id="msg" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A few lines about the project, the team you need, or the problem you’re solving" /></label>
            {status && <p className={`form-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.text}</p>}
            <button className="btn btn-primary" type="submit">Send enquiry <Icon n="arrow" /></button>
          </form>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="footer-top">
        <Logo />
        <nav aria-label="Footer"><a href="#products">Products</a><a href="#team">Remote teams</a><a href="#agency">Agency</a><a href="#contact">Contact</a><a href="/vepifind-privacy-policy.html">VepiFind privacy</a></nav>
      </div>
      <div className="footer-word" aria-hidden="true">Sande Tech</div>
      <p className="footer-legal">© {new Date().getFullYear()} Sande Technologies. Software products, remote tech teams and agency builds.</p>
    </footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
