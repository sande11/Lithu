import { useEffect, useRef, useState } from 'react';
import mark from './assets/images/sande-technologies-logo-mark.png';
import { SITE } from './site.js';
import { services } from './content/cms.js';
import { Planet } from './planet.jsx';

export const EMAIL = SITE.email;
export const PHONE = SITE.phone;

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- icons (shared with the admin) ---------- */
import { Icon } from '../shared/icons.jsx';
export { Icon };

export function Logo() {
  return <span className="logo"><span className="logo-chip"><img src={mark} alt="" width="24" height="24" /></span><span className="logo-word">Sande Technologies</span></span>;
}

export const NAV = [
  ['Services', '/services/'],
  ['Remote developers', '/hire-remote-developers/'],
  ['Products', '/products/'],
  ['About', '/about/'],
];
const isCurrent = (href, current) => current === href || (href !== '/' && current?.startsWith(href)) || (href === '/services/' && services.some((s) => current === `/${s.slug}/`));

/* ---------- header with scroll state + progress bar ---------- */
export function SiteHeader({ current }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  const close = () => setOpen(false);
  return <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
    <div className="header-inner">
      <a href="/" aria-label="Sande Technologies home page" onClick={close}><Logo /></a>
      <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
      </button>
      <nav id="main-nav" className={open ? 'nav open' : 'nav'} aria-label="Main">
        {NAV.map(([label, href]) => <a key={href} href={href} onClick={close} aria-current={isCurrent(href, current) ? 'page' : undefined}>{label}</a>)}
        <a className="btn btn-primary btn-sm" href="/contact/" onClick={close}>Start a project</a>
      </nav>
      <span className="scroll-bar" ref={barRef} aria-hidden="true" />
    </div>
  </header>;
}

/* ---------- breadcrumbs (visible trail; the matching BreadcrumbList schema is added at build) ---------- */
export function Breadcrumbs({ trail }) {
  if (!trail || trail.length < 2) return null;
  return <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      {trail.map(([name, href], i) => <li key={href}>
        {i < trail.length - 1 ? <a href={href}>{name}</a> : <span aria-current="page">{name}</span>}
      </li>)}
    </ol>
  </nav>;
}

export function SiteFooter() {
  return <footer className="footer">
    <div className="footer-top" data-reveal>
      <div className="footer-brand">
        <a href="/" aria-label="Sande Technologies home page"><Logo /></a>
        <p>Software development company in {SITE.city}, {SITE.country}, working with clients across Africa and worldwide. We build our own products, deliver projects as a tech agency and provide remote developers.</p>
      </div>
      <nav className="footer-cols" aria-label="Footer">
        <div>
          <h2>Services</h2>
          <ul>{services.map((s) => <li key={s.slug}><a href={`/${s.slug}/`}>{s.name}</a></li>)}</ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            <li><a href="/hire-remote-developers/">Hire remote developers</a></li>
            <li><a href="/software-development-outsourcing-africa/">Outsourcing to Africa</a></li>
            <li><a href="/products/">Our products</a></li>
            <li><a href="/products/vepifind/">VepiFind job search app</a></li>
            <li><a href="/about/">About us</a></li>
            <li><a href="/contact/">Contact us</a></li>
          </ul>
        </div>
        <div>
          <h2>Get in touch</h2>
          <ul>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><a href={`tel:${SITE.phoneE164}`}>{SITE.phone}</a></li>
            <li><a href={SITE.whatsapp} rel="noopener" target="_blank">Message us on WhatsApp</a></li>
            <li>{SITE.city}, {SITE.country}</li>
          </ul>
        </div>
      </nav>
    </div>
    <div className="footer-word" data-reveal="word" aria-hidden="true">Sande Technologies</div>
    <div className="footer-legal">
      <p suppressHydrationWarning>© {new Date().getFullYear()} {SITE.name}. Software products, remote tech teams and agency builds.</p>
      <p><a href="/products/vepifind/privacy-policy/">VepiFind privacy policy</a><a href="/products/vepifind/terms/">VepiFind terms</a></p>
    </div>
  </footer>;
}

/* ---------- reveal on scroll: adds .in to [data-reveal] ---------- */
export function useReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-reveal]:not(.in)')];
    // Content already on screen stays visible (it was painted from the pre-rendered HTML);
    // only content further down the page waits to animate in. The "rv" class turns hiding on.
    const vh = window.innerHeight;
    const pending = els.filter((e) => { const r = e.getBoundingClientRect(); const seen = r.top < vh && r.bottom > 0; if (seen) e.classList.add('in'); return !seen; });
    document.documentElement.classList.add('rv');
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) { pending.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    pending.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ---------- cursor spotlight on [data-spot] cards ---------- */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const on = (e) => {
      const el = e.target.closest?.('[data-spot]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', `${e.clientX - r.left}px`);
      el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', on, { passive: true });
    return () => document.removeEventListener('pointermove', on);
  }, []);
}

/* ---------- hero pointer parallax: sets --tx/--ty (-1..1) on the element ---------- */
export function usePointerTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0, x = 0, y = 0;
    const apply = () => { raf = 0; el.style.setProperty('--tx', x.toFixed(3)); el.style.setProperty('--ty', y.toFixed(3)); };
    const on = (e) => { const r = el.getBoundingClientRect(); x = ((e.clientX - r.left) / r.width) * 2 - 1; y = ((e.clientY - r.top) / r.height) * 2 - 1; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { x = 0; y = 0; if (!raf) raf = requestAnimationFrame(apply); };
    el.addEventListener('pointermove', on); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', on); el.removeEventListener('pointerleave', leave); };
  }, [ref]);
}

/* ---------- scroll progress through the top of the page: --p 0..1 ---------- */
export function useScrollVar(ref, distance = 0.55) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.style.setProperty('--p', 1); return; }
    let raf = 0;
    const update = () => { raf = 0; const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * distance))); el.style.setProperty('--p', p.toFixed(3)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [ref, distance]);
}

/* ---------- count-up number, e.g. "24.6M", "64%", "1,284" ---------- */
export function CountUp({ value, delay = 0, duration = 1400 }) {
  const m = String(value).match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const [out, setOut] = useState(m ? m[1] + '0' + m[3] : value);
  useEffect(() => {
    if (!m) return;
    const target = parseFloat(m[2].replace(/,/g, ''));
    const decimals = (m[2].split('.')[1] || '').length;
    const comma = m[2].includes(',');
    const fmt = (n) => { const s = n.toFixed(decimals); return comma ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : s; };
    if (prefersReducedMotion()) { setOut(value); return; }
    let raf, t0;
    const timer = setTimeout(() => {
      const step = (t) => { t0 ??= t; const k = Math.min(1, (t - t0) / duration); const e = 1 - Math.pow(1 - k, 3); setOut(m[1] + fmt(target * e) + m[3]); if (k < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [value]);
  return <>{out}</>;
}

/* ---------- starfield canvas: slow twinkling dots that drift upward ---------- */
export function Starfield({ density = 0.00012 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const reduce = prefersReducedMotion();
    let w = 0, h = 0, stars = [], raf = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(w * h * density);
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + .3, a: Math.random() * .6 + .15, s: Math.random() * 2 + .5, v: Math.random() * .12 + .03, hue: Math.random() < .25 ? 195 : 220 }));
    };
    let last = 0;
    const draw = (t = 0) => {
      if (!reduce && t - last < 32) { raf = requestAnimationFrame(draw); return; } // ~30 fps is plenty for slow drift
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        if (!reduce) { s.y -= s.v; if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; } }
        const a = reduce ? s.a : s.a * (.55 + .45 * Math.sin(t / 1000 * s.s + s.x));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 80%, ${a})`; ctx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(); });
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } });
    io.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [density]);
  return <canvas className="starfield" ref={ref} aria-hidden="true" />;
}

/* ---------- rotating planet on the horizon ---------- */
export const Horizon = ({ className = '', band = 0.55 }) => <div className={`horizon ${className}`} aria-hidden="true"><div className="horizon-glow" /><div className="horizon-ring" /><Planet band={band} /></div>;

export function initPage() {
  document.documentElement.classList.add('js');
  if (prefersReducedMotion()) document.documentElement.classList.add('reduce');
}
