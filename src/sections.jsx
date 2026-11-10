// Page sections shared across the site.
import { useEffect, useRef, useState } from 'react';
import { SITE } from './site.js';
import { services } from './content/services.js';
import { IMG, Img } from './images.jsx';
import { Icon, CountUp, Horizon, Starfield, prefersReducedMotion, usePointerTilt, useScrollVar } from './shared.jsx';

/* ---------- inner-page hero ---------- */
export function PageHero({ eyebrow, title, lead, children, aside }) {
  const ref = useRef(null);
  useScrollVar(ref);
  return <section className={`page-hero${aside ? ' with-aside' : ''}`} ref={ref}>
    <Starfield density={0.00008} />
    <div className="page-hero-inner">
      <div className="page-hero-copy">
        {eyebrow && <p className="eyebrow seq" style={{ '--d': 0 }}>{eyebrow}</p>}
        <h1><span className="line seq" style={{ '--d': 1 }}><span>{title}</span></span></h1>
        {lead && <p className="hero-sub seq" style={{ '--d': 2 }}>{lead}</p>}
        {children && <div className="hero-actions seq" style={{ '--d': 3 }}>{children}</div>}
      </div>
      {aside && <div className="page-hero-aside seq" style={{ '--d': 3 }}>{aside}</div>}
    </div>
  </section>;
}

/* ---------- FAQ list (native details/summary: works without JS and is readable by crawlers) ---------- */
export function FaqList({ faqs, title = 'Frequently asked questions', id = 'faq' }) {
  return <section className="section faq-wrap" id={id} aria-labelledby={`${id}-title`}>
    <div className="head" data-reveal>
      <p className="eyebrow">FAQ</p>
      <h2 id={`${id}-title`}>{title}</h2>
      <p>Something else? <a className="link" href="/contact/">Ask us directly <Icon n="arrow" /></a></p>
    </div>
    <div className="faq">
      {faqs.map(([q, a], i) => <details key={q} className="faq-item glass" data-reveal style={{ '--d': i }} open={i === 0}>
        <summary><h3>{q}</h3><span className="faq-sign" aria-hidden="true"><Icon n="plus" /></span></summary>
        <div className="faq-a"><p>{a}</p></div>
      </details>)}
    </div>
  </section>;
}

/* ---------- call to action band ---------- */
export function CtaBand({ title = 'Tell us what you need built.', text = 'We reply within one working day with next steps, usually a short call.', primary = ['Start a project', '/contact/'], secondary = ['Hire remote developers', '/hire-remote-developers/'] }) {
  return <section className="section cta-band" aria-labelledby="cta-title">
    <div className="cta-card glass" data-reveal data-spot>
      <h2 id="cta-title">{title}</h2>
      <p>{text}</p>
      <div className="hero-actions">
        <a className="btn btn-primary" href={primary[1]}>{primary[0]} <Icon n="arrow" /></a>
        {secondary && <a className="btn btn-glass" href={secondary[1]}>{secondary[0]}</a>}
      </div>
    </div>
  </section>;
}

/* ---------- capability cards linking to each service page ---------- */
const WIDE = new Set(['web-development', 'cloud-hosting-support']);
export const SHORT = {
  'web-development': 'Company sites, online shops, booking systems, portals and dashboards that load fast and are easy to update.',
  'mobile-app-development': 'Android and iOS apps, from first prototype to app store release and the updates after.',
  'custom-software-development': 'Management systems, internal tools, APIs and integrations with the tools you already use.',
  'ai-automation': 'Assistants that answer from your documents, document processing and automated workflows.',
  'ui-ux-design': 'User research, flows and interfaces that engineers can build from directly.',
  'cloud-hosting-support': 'Hosting, monitoring, backups, security updates and fixes once your product is live.',
};
export function Capabilities({ exclude }) {
  const list = services.filter((s) => s.slug !== exclude);
  return <div className={`bento${exclude ? ' bento-related' : ''}`}>
    {list.map((s, i) => <a href={`/${s.slug}/`} className={`cap glass${!exclude && WIDE.has(s.slug) ? ' wide' : ''}`} key={s.slug} data-reveal data-spot style={{ '--d': i % 3 }}>
      <span className="cap-icon"><Icon n={s.icon} /></span>
      <h3>{s.name}</h3><p>{SHORT[s.slug]}</p>
      <div className="tags">{s.stack.slice(0, 4).map((x) => <span key={x}>{x}</span>)}</div>
      <span className="link cap-more">{s.name} services <Icon n="arrow" /></span>
    </a>)}
  </div>;
}

/* ---------- process ---------- */
export const STEPS = [
  ['Scope', 'A call to understand the problem and constraints. You get a written plan, timeline and quote.'],
  ['Design', 'Screens you can click through before code is written, so changes are cheap.'],
  ['Build', 'Short cycles with a demo at the end of each one. You see progress every week.'],
  ['Launch & support', 'Release, monitoring and a support plan. We stay on for the next version.'],
];
export function Process({ title = 'How a project runs', text = 'The same four stages whether we’re building for you or for ourselves.', steps = STEPS, id = 'process' }) {
  return <section className="section" id={id} aria-labelledby={`${id}-title`}>
    <div className="head center" data-reveal>
      <p className="eyebrow">Process</p>
      <h2 id={`${id}-title`}>{title}</h2>
      <p>{text}</p>
    </div>
    <ol className="steps" data-reveal="steps">
      {steps.map(([t, d], i) => <li key={t} style={{ '--i': i }}>
        <div className="step-top" aria-hidden="true"><span className="step-n">{i + 1}</span>{i < steps.length - 1 && <span className="step-link"><i /></span>}</div>
        <div className="step-card glass" data-spot><h3>{t}</h3><p>{d}</p></div>
      </li>)}
    </ol>
  </section>;
}

/* ---------- hero showcase (home) ---------- */
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
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) { setStep(5); return; }
    const ts = [1900, 3000, 4100, 5500, 6300].map((t, i) => setTimeout(() => setStep(i + 1), t));
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

export function Showcase() {
  return <div className="showcase">
    <Horizon />
    <div className="tag-float tf-left"><span className="tf-dot" /><small>Our product</small><strong>VepiFind career app</strong></div>
    <div className="tag-float tf-center"><span className="tf-dot" /><small>Agency project</small><strong>A client’s booking portal</strong></div>
    <div className="tag-float tf-right"><span className="tf-dot" /><small>Remote tech team</small><strong>Working in your chat and sprint</strong></div>
    <div className="stage">
      <Dashboard />
      <div className="phone phone-left" aria-hidden="true"><Img img={IMG.bestFit} decorative lazy={false} fetchPriority="low" /></div>
      <ChatPhone />
    </div>
  </div>;
}

export function HomeHeroScene({ children }) {
  const ref = useRef(null);
  useScrollVar(ref);
  usePointerTilt(ref);
  return <section className="hero" id="top" ref={ref}><Starfield />{children}</section>;
}

/* ---------- live working-hours band ----------
   Our hours are 08:00–17:00 CAT (UTC+2), Monday to Friday. We compare them with the
   visitor's own 08:00–17:00 to show the shared hours. Times are filled in after load
   (the pre-rendered HTML shows the fixed hours), so server and browser output match. */
const OUR_START_UTC = 6, OUR_END_UTC = 15;
const fmtTime = (d, tz) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, ...(tz ? { timeZone: tz } : {}) }).format(d);
const tzOffsetHours = (d, tz) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(d).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return Math.round((asUtc - Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes())) / 36e5 * 4) / 4;
};
const ourWindowLocal = (off) => {
  const a = ((OUR_START_UTC + off) % 24 + 24) % 24, b = a + (OUR_END_UTC - OUR_START_UTC);
  return b <= 24 ? [[a, b]] : [[a, 24], [0, b - 24]];
};
const overlapHours = (wins) => wins.reduce((sum, [a, b]) => sum + Math.max(0, Math.min(b, 17) - Math.max(a, 8)), 0);

export function TimeBand() {
  const [now, setNow] = useState(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 20000); return () => clearInterval(t); }, []);
  const ready = !!now;
  const userTz = ready ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : 'Africa/Blantyre';
  const city = ready ? userTz.split('/').pop().replace(/_/g, ' ') : 'Your city';
  const userOff = ready ? tzOffsetHours(now, userTz) : 2;
  const ourOff = 2;
  const ours = ourWindowLocal(userOff);
  const shared = overlapHours(ours);
  const sameZone = Math.abs(userOff - ourOff) < .01;
  const utcH = ready ? now.getUTCHours() + now.getUTCMinutes() / 60 : 10;
  const lilongweDay = ready ? new Date(now.getTime() + ourOff * 36e5).getUTCDay() : 1;
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
        <span className={`tb-status ${ready && open ? 'open' : ''}`}><i />{!ready ? 'Mon–Fri, 08:00–17:00 CAT' : open ? 'Open now' : `Closed · opens ${opensMonday ? 'Monday ' : ''}08:00 CAT`}</span>
        <strong className="tb-time">{ready ? fmtTime(now, 'Africa/Blantyre') : '08:00'}</strong>
        <small>Lilongwe (CAT, UTC+2)</small>
      </div>
      <div className="tb-cell">
        <span className="tb-status muted"><i />Your time</span>
        <strong className="tb-time">{ready ? fmtTime(now, userTz) : '--:--'}</strong>
        <small>{city}</small>
      </div>
      <div className="tb-cell tb-wide">
        <div className="tb-head">
          <strong className="tb-time">{!ready ? '7 h' : sameZone ? '9 h' : shared > 0 ? `${shared % 1 ? shared.toFixed(1) : shared} h` : 'Overnight'}</strong>
          <small>{!ready ? 'Overlap with a UK working day, Monday to Friday' : sameZone ? 'We share your time zone' : shared > 0 ? 'Of your working day overlaps ours, Monday to Friday' : 'We work while you sleep: hand over at night, review in the morning'}</small>
        </div>
        <div className="tb-track" aria-hidden="true">
          <span className="tb-yours" style={{ left: pct(8), width: pct(9) }} />
          {ours.map(([a, b], i) => <span key={i} className="tb-ours" style={{ left: pct(a), width: pct(b - a) }} />)}
          {ready && <span className="tb-now" style={{ left: pct(nowLocalH) }} />}
        </div>
        <div className="tb-scale" aria-hidden="true"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
        <div className="tb-legend" aria-hidden="true"><span><i className="y" />Your 08:00–17:00</span><span><i className="o" />Our 08:00–17:00 CAT</span></div>
      </div>
    </div>
  </section>;
}

/* ---------- three ways to work with us ---------- */
const ModeProducts = () => <div className="mv mv-products" aria-hidden="true">
  <div className="app-row">
    <span><Img img={IMG.vepiIcon} decorative /><em className="ok">In development</em></span>
    <span><Img img={IMG.beloIcon} decorative /><em>Coming soon</em></span>
    <span><Img img={IMG.hosprIcon} decorative /><em>In development</em></span>
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

const MODES = [
  { id: 'products', V: ModeProducts, name: 'Our products', title: 'Software we build and run ourselves.', text: 'VepiFind, Belo and Hospr are designed, built and operated by our team. Owning products keeps us honest about what it takes to ship and support real software.', fit: 'Users, partners and investors', how: 'Use the apps, or talk to us about partnerships', link: '/products/', cta: 'See our products' },
  { id: 'team', V: ModeTeam, name: 'Remote tech team', title: 'Our engineers, working inside your company.', text: 'Add designers and developers without hiring in-house. They join your tools, your standups and your sprint, and report to you.', fit: 'Startups and teams with a backlog to clear', how: 'Monthly engagement, sized to your roadmap', link: '/hire-remote-developers/', cta: 'Hire remote developers' },
  { id: 'agency', V: ModeAgency, name: 'Tech agency', title: 'Hand us the project. We deliver it.', text: 'Websites, mobile apps and business systems, taken from first conversation to launch, with support after go-live.', fit: 'Businesses that need something built, not a team to manage', how: 'Fixed scope or milestone-based pricing', link: '/services/', cta: 'See our services' },
];
export function Modes() {
  return <section className="section" aria-labelledby="modes-title">
    <div className="head center" data-reveal>
      <p className="eyebrow">How to work with us</p>
      <h2 id="modes-title">One team. Three ways to work with it.</h2>
      <p>Use what we’ve built, add our engineers to your team, or hand us a whole project. You get the same people and the same standards either way.</p>
    </div>
    <div className="modes">
      {MODES.map(({ id, V, ...m }, i) => <article className={`mode mode-${id}`} key={id} data-reveal data-spot style={{ '--d': i }}>
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
  </section>;
}

/* ---------- VepiFind feature + other products ---------- */
export function ProductShowcase({ headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return <>
    <div className="vepi glass" data-reveal data-spot>
      <div className="vepi-copy">
        <div className="pid"><Img img={IMG.vepiIcon} /><div><H>VepiFind</H><span className="pill ok">In development</span></div></div>
        <p>A job search app for Malawi that pulls listings from multiple sources, matches them to your profile and helps you apply with a stronger CV and cover letter.</p>
        <ul className="ticks">
          <li><Icon n="check" /> Job listings from multiple sources in one feed</li>
          <li><Icon n="check" /> Personalised “best fit” recommendations</li>
          <li><Icon n="check" /> Cover letter drafts and CV improvements</li>
          <li><Icon n="check" /> Application tracking and interview prep</li>
        </ul>
        <a className="btn btn-primary" href="/products/vepifind/">Explore the VepiFind app <Icon n="arrow" /></a>
      </div>
      <div className="fan">
        <div className="fan-glow" aria-hidden="true" />
        <div className="phone fp1"><Img img={IMG.letter} /></div>
        <div className="phone fp2"><Img img={IMG.bestFit} /></div>
        <div className="phone fp3"><Img img={IMG.tips} /></div>
      </div>
    </div>
    <div className="more">
      <article className="glass" data-reveal data-spot style={{ '--d': 0 }}><Img img={IMG.beloIcon} /><div><H>Belo <span className="pill">Coming soon</span></H><p>An e-commerce app with personalised shopping, secure payments and delivery tracking.</p></div></article>
      <article className="glass" data-reveal data-spot style={{ '--d': 1 }}><Img img={IMG.hosprIcon} /><div><H>Hospr <span className="pill">In development</span></H><p>Hospital management with a digital health passport for patient records, appointments and prescriptions.</p></div></article>
    </div>
  </>;
}

/* ---------- remote team builder (fills in the contact form on the same page) ---------- */
const ROLES = [
  ['Mobile engineer', 'iOS, Android and cross-platform apps'],
  ['Full-stack web engineer', 'Web apps, dashboards and portals'],
  ['Backend & API engineer', 'APIs, databases, integrations'],
  ['AI & automation engineer', 'LLM features, data pipelines, workflows'],
  ['UI/UX designer', 'Research, flows and production-ready screens'],
  ['QA engineer', 'Test plans, automation and release checks'],
];
export function TeamBuilder() {
  const [picked, setPicked] = useState(['Mobile engineer', 'Full-stack web engineer']);
  const toggle = (r) => setPicked((p) => p.includes(r) ? p.filter((x) => x !== r) : [...p, r]);
  const request = () => {
    window.dispatchEvent(new CustomEvent('sande:prefill', { detail: { engagement: 'team', message: `We'd like a remote team with: ${picked.join(', ')}.\n\nWhat we're working on: ` } }));
    document.getElementById('contact')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  return <div className="builder glass" data-reveal="right" data-spot>
    <div className="builder-head"><h3>Build your team</h3><span key={picked.length} className="bump">{picked.length} {picked.length === 1 ? 'role' : 'roles'} selected</span></div>
    <div className="roles">
      {ROLES.map(([r, d]) => { const on = picked.includes(r); return <button type="button" key={r} className={on ? 'role on' : 'role'} aria-pressed={on} onClick={() => toggle(r)}>
        <span className="role-box" key={on ? 'on' : 'off'}><Icon n={on ? 'check' : 'plus'} /></span><span><strong>{r}</strong><small>{d}</small></span></button>; })}
    </div>
    <button type="button" className="btn btn-primary wide" disabled={!picked.length} onClick={request}>{picked.length ? 'Request this team' : 'Pick at least one role'} <Icon n="arrow" /></button>
  </div>;
}

/* ---------- contact section with a Netlify form ----------
   Netlify detects the form in the pre-rendered HTML (data-netlify) and emails each submission.
   With JavaScript the form posts in the background and shows a confirmation in place; without
   it, the browser posts normally and lands on /thank-you/. If posting fails (e.g. running
   locally), it falls back to opening the visitor's email app. */
const ENGAGEMENTS = { agency: 'Agency project', team: 'Remote tech team', products: 'Product partnership' };
export function ContactSection({ title = 'Tell us what you need built.', headingLevel = 2, defaultEngagement = 'agency' }) {
  const [engagement, setEngagement] = useState(defaultEngagement);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [flash, setFlash] = useState(false);
  const [sending, setSending] = useState(false);
  useEffect(() => {
    const on = (e) => {
      setEngagement(e.detail.engagement); setMessage(e.detail.message); setStatus(null);
      setTimeout(() => { document.getElementById('msg')?.focus({ preventScroll: true }); setFlash(true); setTimeout(() => setFlash(false), 1600); }, 700);
    };
    window.addEventListener('sande:prefill', on);
    return () => window.removeEventListener('sande:prefill', on);
  }, []);
  const H = `h${headingLevel}`;
  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const name = (d.get('name') || '').trim(), email = (d.get('email') || '').trim(), company = (d.get('company') || '').trim();
    if (!name || !email || !message.trim()) { setStatus({ type: 'error', text: 'Add your name, email and a short description so we can reply.' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus({ type: 'error', text: 'Check your email address so we can reply.' }); return; }
    setSending(true);
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(d).toString() });
      if (!res.ok) throw new Error(String(res.status));
      setStatus({ type: 'ok', text: `Thanks, ${name}. Your enquiry is with us and we’ll reply to ${email} within one working day.` });
      form.reset(); setMessage('');
    } catch {
      const subject = `${ENGAGEMENTS[engagement]} enquiry from ${name}${company ? ` (${company})` : ''}`;
      const body = `${message}\n\n—\nName: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ''}\nInterested in: ${ENGAGEMENTS[engagement]}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ type: 'ok', text: `Your email app should open with the enquiry ready to send. If it doesn't, email us at ${SITE.email}.` });
    } finally { setSending(false); }
  };
  return <section className="contact" id="contact" aria-labelledby="contact-title">
    <div className="contact-sky" aria-hidden="true"><Horizon className="small" band={0.62} /></div>
    <div className="head center" data-reveal>
      <H id="contact-title">{title}</H>
      <p>We reply within one working day with next steps, usually a short call.</p>
    </div>
    <div className="contact-grid">
      <ul className="contact-list glass" data-reveal data-spot>
        <li><span>Email</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        <li><span>Phone</span><a href={`tel:${SITE.phoneE164}`}>{SITE.phone}</a></li>
        <li><span>WhatsApp</span><a href={SITE.whatsapp} target="_blank" rel="noopener">Message us on WhatsApp</a></li>
        <li><span>Location</span>{SITE.city}, {SITE.country}. We work with clients across Africa and remotely worldwide.</li>
        <li><span>Hours</span>{SITE.hours}</li>
      </ul>
      <form className="glass" name="contact" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} noValidate data-reveal style={{ '--d': 1 }}>
        <input type="hidden" name="form-name" value="contact" />
        <p className="hp" aria-hidden="true"><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
        <fieldset className="seg"><legend>I’m interested in</legend><div style={{ '--n': Object.keys(ENGAGEMENTS).indexOf(engagement) }}>
          <span className="seg-thumb" aria-hidden="true" />
          {Object.entries(ENGAGEMENTS).map(([k, label]) => <label key={k} className={engagement === k ? 'on' : ''}><input type="radio" name="engagement" value={label} checked={engagement === k} onChange={() => setEngagement(k)} />{label}</label>)}
        </div></fieldset>
        <div className="row">
          <label>Name<input name="name" autoComplete="name" required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        </div>
        <label><span>Company <span className="opt">(optional)</span></span><input name="company" autoComplete="organization" /></label>
        <label>What do you need?<textarea id="msg" name="message" className={flash ? 'flash' : ''} rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="A few lines about the project, the team you need, or the problem you’re solving" /></label>
        {status && <p className={`form-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.text}</p>}
        <button className="btn btn-primary" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send enquiry'} <Icon n="arrow" /></button>
      </form>
    </div>
  </section>;
}
