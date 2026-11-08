import { useEffect, useRef, useState } from 'react';
import { Layout } from '../Layout.jsx';
import { IMG, Img } from '../images.jsx';
import { vepifindFaqs } from '../content/pages.js';
import { EMAIL, Icon, usePointerTilt, useScrollVar, Starfield, Horizon, prefersReducedMotion } from '../shared.jsx';
import { FaqList } from '../sections.jsx';

// Set this to the APK or Play Store URL when the app is ready to download.
const DOWNLOAD_URL = null;

const launchMail = `mailto:${EMAIL}?subject=${encodeURIComponent('VepiFind launch updates')}&body=${encodeURIComponent('Hi Sande Technologies,\n\nPlease let me know when VepiFind is available to download.\n\nThanks!')}`;
const askMail = `mailto:${EMAIL}?subject=${encodeURIComponent('VepiFind question')}`;

const features = [
  { icon: 'target', img: IMG.bestFit, title: 'Best-fit job matching', text: 'VepiFind compares each listing with your skills and experience and puts the closest matches at the top of your feed.', points: ['Personalised “Best fit” list', 'Based on your skills and experience', 'Less scrolling, more applying'] },
  { icon: 'bell', img: IMG.saved, title: 'Fresh jobs, every day', text: 'Listings from multiple sources arrive in one feed. Save the ones you like and get notified when new roles match your preferences.', points: ['Updates from multiple job sources', 'Alerts filtered by industry, location and level', 'Save jobs to come back to'] },
  { icon: 'doc', img: IMG.letter, title: 'Cover letters in seconds', text: 'VepiFind reads the job description and your profile and drafts a cover letter for that role. Review it, edit it and apply from your phone.', points: ['Tailored to each job description', 'Edit before you send', 'Apply directly in the app'] },
  { icon: 'mic', img: IMG.prep, title: 'Practice the interview', text: 'Get likely interview questions for the specific role, with example answers to help you prepare.', points: ['Questions generated for each job', 'Example answers to learn from', 'Practise anywhere, any time'] },
  { icon: 'list', img: IMG.track, title: 'Track every application', text: 'See every job you’ve applied for in one place, with its status, so nothing slips.', points: ['All applications in one list', 'Status at a glance', 'Follow-up reminders'] },
  { icon: 'bulb', img: IMG.tips, title: 'Interview tips from recruiters', text: 'Short, practical advice on researching companies, answering common questions and following up.', points: ['Expert advice in short reads', 'Preparation and practice guides', 'Quick reads you can finish on the bus'] },
];

const notes = [
  { icon: 'target', title: 'New best-fit match', text: 'Primary ICT Teacher · St Andrews International' },
  { icon: 'doc', title: 'Cover letter ready', text: 'Tailored to the job description. Review and send.' },
  { icon: 'list', title: 'Application tracked', text: 'Dispatch Clerk · Chibuku Products Limited' },
  { icon: 'mic', title: 'Interview practice', text: 'New questions for Primary ICT Teacher' },
];

const howSteps = [
  ['Download and sign up', 'Install the app and create your profile with your skills, experience and preferences.'],
  ['Browse your matches', 'Start with your Best fit list, or browse every open position.'],
  ['Apply in minutes', 'Generate a cover letter, review it and apply directly from your phone.'],
  ['Track and prepare', 'Follow each application and practise for the interview when you get the call.'],
];

const why = [
  ['phone', 'Mobile first', 'Everything happens on your phone. No computer, no printing, no queues.'],
  ['spark', 'AI does the busywork', 'Matching, cover letters and interview questions are drafted for you to review.'],
  ['clock', 'Hours back every week', 'Spend less time filling in applications and more time preparing for interviews.'],
  ['bolt', 'Stronger applications', 'Every letter is written for the specific role instead of one copy for everything.'],
  ['shield', 'Private and secure', 'Your personal information is encrypted and kept private.'],
  ['pin', 'Made for Malawi', 'Built around the Malawian job market, local employers and local job sources.'],
];


function Notifications() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) { setN(2); return; }
    const first = setTimeout(() => setN(1), 1500);
    const loop = setInterval(() => setN((x) => x + 1), 2800);
    return () => { clearTimeout(first); clearInterval(loop); };
  }, []);
  const shown = [n - 2, n - 1, n].filter((k) => k >= 0);
  return <div className="notes" aria-hidden="true">
    {shown.map((k, i) => { const it = notes[k % notes.length]; return <div className="note" key={k} style={{ '--pos': shown.length - 1 - i }}>
      <span className="note-icon"><Icon n={it.icon} /></span>
      <div><small>VepiFind · now</small><strong>{it.title}</strong><p>{it.text}</p></div>
    </div>; })}
  </div>;
}

function FeatureTour() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (i) => refs.current[i]?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  return <div className="tour">
    <div className="tour-list">
      {features.map((f, i) => <article key={f.title} data-i={i} ref={(el) => (refs.current[i] = el)} className={`tour-item${active === i ? ' on' : ''}`}>
        <span className="cap-icon"><Icon n={f.icon} /></span>
        <h3>{f.title}</h3>
        <p>{f.text}</p>
        <ul className="ticks">{f.points.map((p) => <li key={p}><Icon n="check" /> {p}</li>)}</ul>
        <div className="phone tour-inline"><Img img={f.img} /></div>
      </article>)}
    </div>
    <div className="tour-stage" aria-hidden="true">
      <div className="tour-sticky">
        <div className="tour-glow" />
        <div className="tour-orbit" />
        <div className="phone tour-phone">
          {features.map((f, i) => <Img key={f.title} img={f.img} decorative className={active === i ? 'on' : ''} />)}
        </div>
        <div className="tour-dots">
          {features.map((f, i) => <button key={f.title} type="button" tabIndex={-1} className={active === i ? 'on' : ''} onClick={() => go(i)}><span>{f.title}</span></button>)}
        </div>
      </div>
    </div>
  </div>;
}

export default function VepiFind({ route }) {
  const heroRef = useRef(null);
  useScrollVar(heroRef);
  usePointerTilt(heroRef);

  return <Layout route={route}>
      <section className="v-hero" ref={heroRef} id="top">
        <Starfield />
        <div className="v-hero-inner">
          <div className="v-copy">
            <a className="announce seq" style={{ '--d': 0 }} href="/products/"><span className="v-badge"><Img img={IMG.vepiIcon} decorative lazy={false} /></span>VepiFind by Sande Technologies <Icon n="chev" /></a>
            <h1><span className="line seq" style={{ '--d': 1 }}><span>VepiFind: find the right job in Malawi.</span></span><span className="line grad seq" style={{ '--d': 2 }}><span>Apply in minutes, not hours.</span></span></h1>
            <p className="hero-sub seq" style={{ '--d': 3 }}>VepiFind brings job listings from multiple sources into one feed, matches them to your profile, and helps you write cover letters, track applications and prepare for interviews. All from your phone.</p>
            <div className="hero-actions seq" style={{ '--d': 4 }}>
              {DOWNLOAD_URL
                ? <a className="btn btn-primary" href={DOWNLOAD_URL}>Download for Android <Icon n="arrow" /></a>
                : <a className="btn btn-primary" href={launchMail}>Get launch updates <Icon n="mail" /></a>}
              <a className="btn btn-glass" href="#features">See features</a>
            </div>
            <ul className="v-facts seq" style={{ '--d': 5 }}>
              <li><Icon n="check" /> Free to use</li>
              <li><Icon n="phone" /> Android first, iOS in development</li>
              <li><Icon n="pin" /> Built for the Malawian job market</li>
            </ul>
          </div>
          <div className="v-visual">
            <Horizon className="v-horizon" band={0.45} />
            <div className="v-ring r1" /><div className="v-ring r2" />
            <div className="phone v-phone"><Img img={IMG.bestFit} lazy={false} fetchPriority="high" /></div>
            <Notifications />
          </div>
        </div>
      </section>

      <section className="section" id="features" aria-labelledby="features-title">
        <div className="head center" data-reveal>
          <p className="eyebrow">Features</p>
          <h2 id="features-title">Everything your job search needs, in one app.</h2>
          <p>From finding the right role to walking into the interview prepared. These are real screens from the app.</p>
        </div>
        <FeatureTour />
      </section>

      <section className="section" aria-labelledby="soon-title">
        <div className="head" data-reveal>
          <p className="eyebrow">Coming next</p>
          <h2 id="soon-title">In development</h2>
          <p>Two features we’re building to take even more work out of applying.</p>
        </div>
        <div className="soon">
          <article className="soon-card" data-reveal data-spot style={{ '--d': 0 }}>
            <span className="cap-icon"><Icon n="doc" /></span>
            <h3>AI CV generator <span className="pill">In development</span></h3>
            <p>Create a professional, ATS-friendly CV in minutes. Pick a template and let VepiFind adjust it for each application.</p>
          </article>
          <article className="soon-card" data-reveal data-spot style={{ '--d': 1 }}>
            <span className="cap-icon"><Icon n="bolt" /></span>
            <h3>Apply to all <span className="pill">In development</span></h3>
            <p>Apply to every job in your Best fit list with one tap, each with its own tailored cover letter.</p>
          </article>
        </div>
      </section>

      <section className="section" id="how" aria-labelledby="how-title">
        <div className="head center" data-reveal>
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">Four steps from download to interview</h2>
        </div>
        <ol className="steps" data-reveal="steps">
          {howSteps.map(([t, d], i) => <li key={t} style={{ '--i': i }}>
            <div className="step-top" aria-hidden="true"><span className="step-n">{i + 1}</span>{i < howSteps.length - 1 && <span className="step-link"><i /></span>}</div>
            <div className="step-card glass" data-spot><h3>{t}</h3><p>{d}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="head split" data-reveal>
          <div><p className="eyebrow">Why VepiFind</p><h2 id="why-title">The faster way to look for work</h2></div>
          <p>Built by Sande Technologies in Lilongwe for people looking for work in Malawi.</p>
        </div>
        <div className="why">
          {why.map(([ic, t, d], i) => <article className="cap glass" key={t} data-reveal data-spot style={{ '--d': i % 3 }}>
            <span className="cap-icon"><Icon n={ic} /></span><h3>{t}</h3>
            <p>{d}{ic === 'shield' && <> <a className="link" href="/products/vepifind/privacy-policy/">Read the VepiFind privacy policy</a></>}</p>
          </article>)}
        </div>
      </section>

      <FaqList faqs={vepifindFaqs} title="VepiFind: questions, answered" />

      <section className="section" aria-labelledby="legal-title">
        <div className="head" data-reveal>
          <h2 id="legal-title" className="h2-sm">Privacy and terms</h2>
          <p>Read how VepiFind handles your data in the <a className="link inline" href="/products/vepifind/privacy-policy/">VepiFind privacy policy</a>, and the rules for using the app in the <a className="link inline" href="/products/vepifind/terms/">VepiFind terms of service</a>. VepiFind is made by <a className="link inline" href="/about/">Sande Technologies</a>, which also builds <a className="link inline" href="/mobile-app-development/">mobile apps for clients</a>.</p>
        </div>
      </section>

      <section className="contact v-cta" id="get" aria-labelledby="get-title">
        <div className="contact-sky" aria-hidden="true"><Horizon className="small" band={0.62} /></div>
        <div className="head center" data-reveal>
          <Img className="v-cta-logo" img={IMG.vepiIcon} decorative />
          <h2 id="get-title">Be first to get VepiFind.</h2>
          <p>VepiFind launches on Android first, with iOS in development. Email us and we’ll let you know the moment it’s ready to download.</p>
          <div className="hero-actions">
            {DOWNLOAD_URL
              ? <a className="btn btn-primary" href={DOWNLOAD_URL}>Download for Android <Icon n="arrow" /></a>
              : <a className="btn btn-primary" href={launchMail}>Get launch updates <Icon n="mail" /></a>}
            <a className="btn btn-glass" href={askMail}>Ask a question</a>
          </div>
        </div>
      </section>
  </Layout>;
}
