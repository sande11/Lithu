import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import vepiLogo from '../assets/vepifind.png';
import vepiHome from '../assets/vepifind/home_and_best_fit.png';
import vepiLetter from '../assets/vepifind/cover_letter.png';
import vepiTips from '../assets/vepifind/tips.png';
import beloLogo from '../assets/posters/belo.png';
import hosprLogo from '../assets/posters/hospr.png';
import { EMAIL, PHONE, Icon, SiteHeader, SiteFooter, useReveal, useSpotlight, usePointerTilt, useScrollVar, CountUp, Starfield, Horizon, prefersReducedMotion, initPage } from './shared.jsx';

const stack = ['Flutter', 'Swift', 'Kotlin', 'React', 'Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Firebase', 'AWS'];

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
        <div className="dash-head"><strong>Overview</strong><span><i className="live" /> Live</span></div>
        <div className="kpis">
          <div><small>Bookings</small><strong><CountUp value="1,284" delay={1500} /></strong><em>+12.4%</em></div>
          <div><small>Revenue (MWK)</small><strong><CountUp value="24.6M" delay={1650} /></strong><em>+8.1%</em></div>
          <div><small>Repeat customers</small><strong><CountUp value="64%" delay={1800} /></strong><em>+3.2%</em></div>
        </div>
        <div className="dash-grid">
          <div className="chart">
            <div className="chart-head"><small>Bookings over time</small><span><i className="k1" />This year <i className="k2" />Last year</span></div>
            <svg viewBox="0 0 400 140" preserveAspectRatio="none">
              <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3fd0ff" stopOpacity=".35" /><stop offset="1" stopColor="#3fd0ff" stopOpacity="0" /></linearGradient></defs>
              {[30, 65, 100].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} className="gl" />)}
              <path className="l2" pathLength="1" d="M0 110 C40 104 60 96 95 98 S150 80 190 86 255 70 290 74 350 60 400 58" />
              <path className="area" d="M0 120 C30 110 55 92 90 88 S140 96 175 70 S230 64 260 50 S330 40 400 18 V140 H0Z" />
              <path className="l1" pathLength="1" d="M0 120 C30 110 55 92 90 88 S140 96 175 70 S230 64 260 50 S330 40 400 18" />
              <circle cx="400" cy="18" r="4" className="pt" />
              <circle cx="400" cy="18" r="4" className="pt-ring" />
            </svg>
          </div>
          <div className="activity">
            <small>Latest activity</small>
            {[['Payment received', 'Airtel Money', 'ok'], ['New booking', '10:30, Room 4', 'b'], ['Invoice sent', 'Order #2041', 'v'], ['Customer added', 'Web sign-up', 'b']].map(([a, b, c], i) => <div key={a} style={{ '--i': i }}><i className={c} /><p><strong>{a}</strong><span>{b}</span></p></div>)}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

function ChatPhone() {
  // Messages arrive one by one, with a typing indicator before the reply.
  const [step, setStep] = useState(prefersReducedMotion() ? 5 : 0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const times = [1900, 3000, 4100, 5500, 6300];
    const ts = times.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => ts.forEach(clearTimeout);
  }, []);
  return <div className="phone phone-chat" aria-hidden="true">
    <div className="chat">
      <div className="chat-top"><b>#</b><div><strong>product-team</strong><span>Your workspace</span></div></div>
      {step >= 1 && <div className="msg pop"><i className="av a1">ME</i><div><small>Mobile engineer · Sande Technologies</small><p>Build 1.4 is on TestFlight. Release notes in the ticket.</p></div></div>}
      {step >= 2 && <div className="msg mine pop"><div><small>You</small><p>Nice. Can we demo it on Friday?</p></div></div>}
      {step === 3 && <div className="msg pop"><i className="av a2">QA</i><div className="typing"><span /><span /><span /></div></div>}
      {step >= 4 && <div className="msg pop"><i className="av a2">QA</i><div><small>QA engineer · Sande Technologies</small><p>Regression suite passed. No blockers.</p></div></div>}
      {step >= 5 && <div className="standup pop"><span className="live" />Daily standup, 09:00<em>Join</em></div>}
    </div>
  </div>;
}

function Showcase() {
  return <div className="showcase">
    <Horizon />
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

/* ---------- live working-hours band ----------
   Our office hours are 08:00–17:00 CAT (UTC+2), Monday to Friday.
   We compare them with the visitor's own 08:00–17:00 to show the shared hours. */
const OUR_START_UTC = 6, OUR_END_UTC = 15;
const fmtTime = (d, tz) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, ...(tz ? { timeZone: tz } : {}) }).format(d);
const tzOffsetHours = (d, tz) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(d).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return Math.round((asUtc - Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes())) / 36e5 * 4) / 4;
};
// Our working window expressed on the visitor's local 24h day, split if it wraps midnight.
const ourWindowLocal = (off) => {
  const a = ((OUR_START_UTC + off) % 24 + 24) % 24, b = a + (OUR_END_UTC - OUR_START_UTC);
  return b <= 24 ? [[a, b]] : [[a, 24], [0, b - 24]];
};
const overlapHours = (wins) => wins.reduce((sum, [a, b]) => sum + Math.max(0, Math.min(b, 17) - Math.max(a, 8)), 0);

function TimeBand() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 20000); return () => clearInterval(t); }, []);
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const city = userTz.split('/').pop().replace(/_/g, ' ');
  const userOff = tzOffsetHours(now, userTz);
  const ourOff = 2;
  const ours = ourWindowLocal(userOff);
  const shared = overlapHours(ours);
  const sameZone = Math.abs(userOff - ourOff) < .01;
  const utcH = now.getUTCHours() + now.getUTCMinutes() / 60;
  const lilongweDay = new Date(now.getTime() + ourOff * 36e5).getUTCDay();
  const open = lilongweDay >= 1 && lilongweDay <= 5 && utcH >= OUR_START_UTC && utcH < OUR_END_UTC;
  const opensMonday = lilongweDay === 6 || lilongweDay === 0 || (lilongweDay === 5 && utcH >= OUR_END_UTC);
  const nowLocalH = ((utcH + userOff) % 24 + 24) % 24;
  const pct = (h) => `${(h / 24) * 100}%`;
  return <section className="timeband" aria-labelledby="tb-title">
    <div className="tb-top" data-reveal>
      <div>
        <p className="eyebrow">Working hours</p>
        <h2 id="tb-title">Our working day, next to yours.</h2>
      </div>
      <p>Monday to Friday, 08:00–17:00 Central Africa Time (UTC+2). The times below update live for where you are.</p>
    </div>
    <div className="tb glass" data-reveal data-spot style={{ '--d': 1 }}>
      <div className="tb-cell">
        <span className={`tb-status ${open ? 'open' : ''}`}><i />{open ? 'Open now' : `Closed · opens ${opensMonday ? 'Monday ' : ''}08:00 CAT`}</span>
        <strong className="tb-time">{fmtTime(now, 'Africa/Blantyre')}</strong>
        <small>Lilongwe (CAT, UTC+2)</small>
      </div>
      <div className="tb-cell">
        <span className="tb-status muted"><i />Your time</span>
        <strong className="tb-time">{fmtTime(now, userTz)}</strong>
        <small>{city}</small>
      </div>
      <div className="tb-cell tb-wide">
        <div className="tb-head">
          <strong className="tb-time">{sameZone ? '9 h' : shared > 0 ? `${shared % 1 ? shared.toFixed(1) : shared} h` : 'Overnight'}</strong>
          <small>{sameZone ? 'We share your time zone' : shared > 0 ? 'Of your working day overlaps ours, Monday to Friday' : 'We work while you sleep: hand over at night, review in the morning'}</small>
        </div>
        <div className="tb-track" aria-hidden="true">
          <span className="tb-yours" style={{ left: pct(8), width: pct(9) }} />
          {ours.map(([a, b], i) => <span key={i} className="tb-ours" style={{ left: pct(a), width: pct(b - a) }} />)}
          <span className="tb-now" style={{ left: pct(nowLocalH) }} />
        </div>
        <div className="tb-scale" aria-hidden="true"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
        <div className="tb-legend" aria-hidden="true"><span><i className="y" />Your 08:00–17:00</span><span><i className="o" />Our 08:00–17:00 CAT</span></div>
      </div>
    </div>
  </section>;
}

/* ---------- mode visuals (animate when their card scrolls in) ---------- */
const ModeProducts = () => <div className="mv mv-products" aria-hidden="true">
  <div className="app-row">
    <span><img src={vepiLogo} alt="" /><em className="ok">In development</em></span>
    <span><img src={beloLogo} alt="" /><em>Coming soon</em></span>
    <span><img src={hosprLogo} alt="" /><em>In development</em></span>
  </div>
</div>;
const ModeTeam = () => <div className="mv mv-team" aria-hidden="true">
  <div className="tz"><span>Lilongwe</span><div className="bar"><i style={{ left: '25%', width: '37.5%' }} /></div></div>
  <div className="tz"><span>London</span><div className="bar"><i style={{ left: '33.3%', width: '37.5%' }} /></div></div>
  <div className="tz"><span>New York</span><div className="bar"><i style={{ left: '54.2%', width: '37.5%' }} /></div></div>
  <div className="tz-note">08:00–17:00 local, shown on one UTC day</div>
</div>;
const ModeAgency = () => <div className="mv mv-agency" aria-hidden="true">
  {[['Scope', 'done'], ['Design', 'done'], ['Build', 'now'], ['Launch', '']].map(([s, st], i) => <div key={s} className={`ms ${st}`} style={{ '--i': i }}><i>{st === 'done' ? <Icon n="check" /> : null}</i><span>{s}</span></div>)}
</div>;

const modes = [
  { id: 'products', V: ModeProducts, name: 'Our products', title: 'Software we build and run ourselves.', text: 'VepiFind, Belo and Hospr are designed, built and operated by our team. Owning products keeps us honest about what it takes to ship and support real software.', fit: 'Users, partners and investors', how: 'Use the apps, or talk to us about partnerships', link: '#products', cta: 'See our products' },
  { id: 'team', V: ModeTeam, name: 'Remote tech team', title: 'Our engineers, working inside your company.', text: 'Add designers and developers without hiring in-house. They join your tools, your standups and your sprint, and report to you.', fit: 'Startups and teams with a backlog to clear', how: 'Monthly engagement, sized to your roadmap', link: '#team', cta: 'Build your team' },
  { id: 'agency', V: ModeAgency, name: 'Tech agency', title: 'Hand us the project. We deliver it.', text: 'Websites, mobile apps and business systems, taken from first conversation to launch, with support after go-live.', fit: 'Businesses that need something built, not a team to manage', how: 'Fixed scope or milestone-based pricing', link: '#agency', cta: 'See what we build' },
];

function App() {
  const [picked, setPicked] = useState(['Mobile engineer', 'Full-stack web engineer']);
  const [engagement, setEngagement] = useState('agency');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [flash, setFlash] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => { document.title = 'Sande Technologies — Software products, remote tech teams and agency builds'; }, []);
  useScrollVar(heroRef);
  usePointerTilt(heroRef);
  useReveal();
  useSpotlight();

  const toggleRole = (r) => setPicked((p) => p.includes(r) ? p.filter((x) => x !== r) : [...p, r]);
  const requestTeam = () => {
    setEngagement('team');
    setMessage(`We'd like a remote team with: ${picked.join(', ')}.\n\nWhat we're working on: `);
    setStatus(null);
    document.getElementById('contact')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    setTimeout(() => { document.getElementById('msg')?.focus({ preventScroll: true }); setFlash(true); setTimeout(() => setFlash(false), 1600); }, 700);
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
    <SiteHeader links={[['Products', '#products'], ['Remote teams', '#team'], ['Agency', '#agency'], ['Process', '#process']]} cta={['Start a project', '#contact']} />

    <main>
      <section className="hero" id="top" ref={heroRef}>
        <Starfield />
        <div className="hero-copy">
          <a className="announce seq" style={{ '--d': 0 }} href="/vepifind.html"><span className="announce-new">Now building</span>VepiFind, an AI career app <Icon n="chev" /></a>
          <h1><span className="line seq" style={{ '--d': 1 }}><span>We build our own products.</span></span><span className="line grad seq" style={{ '--d': 2 }}><span>And we’ll build yours.</span></span></h1>
          <p className="hero-sub seq" style={{ '--d': 3 }}>Sande Technologies is a software development company in Lilongwe, Malawi. We ship our own apps, and the same team builds for clients: as a tech agency delivering your project end to end, or as a remote engineering team working inside your company.</p>
          <div className="hero-actions seq" style={{ '--d': 4 }}>
            <a className="btn btn-primary" href="#contact">Start a project <Icon n="arrow" /></a>
            <a className="btn btn-glass" href="#team">Hire a remote team</a>
          </div>
        </div>
        <Showcase />
      </section>

      <section className="stack" aria-label="Technologies we build with">
        <p data-reveal>The stack we ship with</p>
        <div className="stack-row">{stack.map((s, i) => <span key={s} data-reveal style={{ '--d': i }}>{s}</span>)}</div>
      </section>

      <TimeBand />

      <section className="section" aria-labelledby="modes-title">
        <div className="head center" data-reveal>
          <p className="eyebrow">How to work with us</p>
          <h2 id="modes-title">One team. Three ways to work with it.</h2>
          <p>Use what we’ve built, add our engineers to your team, or hand us a whole project. You get the same people and the same standards either way.</p>
        </div>
        <div className="modes">
          {modes.map(({ id, V, ...m }, i) => <article className={`mode mode-${id}`} key={id} data-reveal data-spot style={{ '--d': i }}>
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
        <div className="head" data-reveal>
          <p className="eyebrow">Our products</p>
          <h2 id="products-title">Products we build and run</h2>
          <p>Software made for problems we see around us, built by the same team you’d work with.</p>
        </div>
        <div className="vepi glass" data-reveal data-spot>
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
          <article className="glass" data-reveal data-spot style={{ '--d': 0 }}><img src={beloLogo} alt="" /><div><h3>Belo <span className="pill">Coming soon</span></h3><p>An e-commerce app with personalised shopping, secure payments and delivery tracking.</p></div></article>
          <article className="glass" data-reveal data-spot style={{ '--d': 1 }}><img src={hosprLogo} alt="" /><div><h3>Hospr <span className="pill">In development</span></h3><p>Hospital management with a digital health passport for records, appointments and prescriptions.</p></div></article>
        </div>
      </section>

      <section className="section team" id="team" aria-labelledby="team-title">
        <div className="team-copy" data-reveal>
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
        <div className="builder glass" data-reveal="right" data-spot>
          <div className="builder-head"><h3>Build your team</h3><span key={picked.length} className="bump">{picked.length} {picked.length === 1 ? 'role' : 'roles'} selected</span></div>
          <div className="roles">
            {roles.map(([r, d]) => { const on = picked.includes(r); return <button type="button" key={r} className={on ? 'role on' : 'role'} aria-pressed={on} onClick={() => toggleRole(r)}>
              <span className="role-box" key={on ? 'on' : 'off'}><Icon n={on ? 'check' : 'plus'} /></span><span><strong>{r}</strong><small>{d}</small></span></button>; })}
          </div>
          <button type="button" className="btn btn-primary wide" disabled={!picked.length} onClick={requestTeam}>{picked.length ? 'Request this team' : 'Pick at least one role'} <Icon n="arrow" /></button>
        </div>
      </section>

      <section className="section" id="agency" aria-labelledby="agency-title">
        <div className="head split" data-reveal>
          <div><p className="eyebrow">Tech agency</p><h2 id="agency-title">What we build for clients</h2></div>
          <p>Bring a brief, an idea or a system that isn’t working. We scope it, give you a plan and a price, and deliver it.</p>
        </div>
        <div className="bento">
          {capabilities.map((c, i) => <article className={`cap glass${c.wide ? ' wide' : ''}`} key={c.t} data-reveal data-spot style={{ '--d': i % 3 }}>
            <span className="cap-icon"><Icon n={c.icon} /></span>
            <h3>{c.t}</h3><p>{c.d}</p>
            <div className="tags">{c.tags.map((x) => <span key={x}>{x}</span>)}</div>
          </article>)}
        </div>
      </section>

      <section className="section" id="process" aria-labelledby="process-title">
        <div className="head center" data-reveal>
          <p className="eyebrow">Process</p>
          <h2 id="process-title">How a project runs</h2>
          <p>The same four stages whether we’re building for you or for ourselves.</p>
        </div>
        <ol className="steps" data-reveal="steps">
          <span className="steps-line" aria-hidden="true" />
          {steps.map(([t, d], i) => <li key={t} className="glass" data-spot style={{ '--i': i }}><span className="step-n">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <Horizon className="small" />
        <div className="head center" data-reveal>
          <h2 id="contact-title">Tell us what you need built.</h2>
          <p>We reply within one working day with next steps, usually a short call.</p>
        </div>
        <div className="contact-grid">
          <ul className="contact-list glass" data-reveal data-spot>
            <li><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><span>Phone</span><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></li>
            <li><span>Office</span>Gateway Mall, Lilongwe, Malawi</li>
            <li><span>Hours</span>Monday to Friday, 08:00–17:00 CAT</li>
          </ul>
          <form className="glass" onSubmit={submit} noValidate data-reveal style={{ '--d': 1 }}>
            <fieldset className="seg"><legend>I’m interested in</legend><div style={{ '--n': ['agency', 'team', 'products'].indexOf(engagement) }}>
              <span className="seg-thumb" aria-hidden="true" />
              {['agency', 'team', 'products'].map((k) => <label key={k} className={engagement === k ? 'on' : ''}><input type="radio" name="engagement" value={k} checked={engagement === k} onChange={() => setEngagement(k)} />{engagementLabels[k]}</label>)}
            </div></fieldset>
            <div className="row">
              <label>Name<input name="name" autoComplete="name" /></label>
              <label>Email<input name="email" type="email" autoComplete="email" /></label>
            </div>
            <label><span>Company <span className="opt">(optional)</span></span><input name="company" autoComplete="organization" /></label>
            <label>What do you need?<textarea id="msg" className={flash ? 'flash' : ''} rows="5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A few lines about the project, the team you need, or the problem you’re solving" /></label>
            {status && <p className={`form-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.text}</p>}
            <button className="btn btn-primary" type="submit">Send enquiry <Icon n="arrow" /></button>
          </form>
        </div>
      </section>
    </main>

    <SiteFooter links={[['Products', '#products'], ['VepiFind', '/vepifind.html'], ['Remote teams', '#team'], ['Agency', '#agency'], ['Contact', '#contact'], ['VepiFind privacy', '/vepifind-privacy-policy.html']]} />
  </>;
}

initPage();
createRoot(document.getElementById('root')).render(<App />);
