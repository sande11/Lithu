import { useEffect, useRef, useState } from 'react';
import mark from '../assets/icon-cropped.png';

export const EMAIL = 'sandetechnologiesmw@gmail.com';
export const PHONE = '+265 996 534 912';

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- icons ---------- */
const P = {
  arrow: <path d="M6 14 14 6M7.5 6H14v6.5" />,
  plus: <path d="M10 5v10M5 10h10" />,
  check: <path d="m5 10.5 3.2 3L15 6.5" />,
  chev: <path d="m8 5 5 5-5 5" />,
  down: <path d="m5 8 5 5 5-5" />,
  web: <><rect x="2.5" y="4" width="15" height="12" rx="2" /><path d="M2.5 7.5h15M5 5.8h.01M7 5.8h.01" /></>,
  phone: <><rect x="6" y="2.5" width="8" height="15" rx="2" /><path d="M9 15h2" /></>,
  code: <path d="m7 6-4 4 4 4M13 6l4 4-4 4M11 4.5 9 15.5" />,
  spark: <path d="M10 2.5v4M10 13.5v4M2.5 10h4M13.5 10h4M5 5l2.2 2.2M12.8 12.8 15 15M15 5l-2.2 2.2M7.2 12.8 5 15" />,
  pen: <path d="m4 16 1-4 8-8 3 3-8 8-4 1ZM11.5 5.5l3 3" />,
  cloud: <path d="M6 15.5h8.5a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 5.3 9.3 3.2 3.2 0 0 0 6 15.5Z" />,
  bell: <path d="M6 8a4 4 0 1 1 8 0c0 4 1.5 5.5 1.5 5.5h-11S6 12 6 8ZM8.5 16.5a1.6 1.6 0 0 0 3 0" />,
  target: <><circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="3.5" /><circle cx="10" cy="10" r=".6" /></>,
  bookmark: <path d="M6 3.5h8v13l-4-3-4 3v-13Z" />,
  doc: <><path d="M5.5 2.5h6l3.5 3.5v11.5h-9.5v-15Z" /><path d="M11.5 2.5V6H15M8 10h5M8 13h5" /></>,
  mic: <><rect x="7.5" y="2.5" width="5" height="9" rx="2.5" /><path d="M5 9.5a5 5 0 0 0 10 0M10 14.5v3" /></>,
  list: <path d="M7 5.5h9M7 10h9M7 14.5h9M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" />,
  bulb: <path d="M7.5 14.5h5M8 17h4M10 2.5a5 5 0 0 0-3 9c.6.5 1 1.2 1 2h4c0-.8.4-1.5 1-2a5 5 0 0 0-3-9Z" />,
  shield: <path d="M10 2.5 16 5v4.5c0 4-2.6 6.6-6 8-3.4-1.4-6-4-6-8V5l6-2.5Z" />,
  clock: <><circle cx="10" cy="10" r="7.5" /><path d="M10 6v4l2.5 2" /></>,
  pin: <><path d="M10 17.5s5.5-5 5.5-9.5a5.5 5.5 0 0 0-11 0c0 4.5 5.5 9.5 5.5 9.5Z" /><circle cx="10" cy="8" r="2" /></>,
  bolt: <path d="M11 2.5 4.5 11h5L9 17.5 15.5 9h-5L11 2.5Z" />,
  mail: <><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path d="m3 5.5 7 5.5 7-5.5" /></>,
};
export const Icon = ({ n, className }) => <svg className={className} viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{P[n]}</svg>;

export function Logo() {
  return <span className="logo"><span className="logo-chip"><img src={mark} alt="" /></span><span className="logo-word">Sande Technologies</span></span>;
}

/* ---------- header with scroll state + progress bar ---------- */
export function SiteHeader({ links, cta, home = '#top' }) {
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
      <a href={home} aria-label="Sande Technologies home" onClick={close}><Logo /></a>
      <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
      </button>
      <nav className={open ? 'nav open' : 'nav'} aria-label="Main">
        {links.map(([label, href]) => <a key={href} href={href} onClick={close}>{label}</a>)}
        <a className="btn btn-primary btn-sm" href={cta[1]} onClick={close}>{cta[0]}</a>
      </nav>
      <span className="scroll-bar" ref={barRef} aria-hidden="true" />
    </div>
  </header>;
}

export function SiteFooter({ links }) {
  return <footer className="footer">
    <div className="footer-top" data-reveal>
      <a href="/" aria-label="Sande Technologies home"><Logo /></a>
      <nav aria-label="Footer">{links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}</nav>
    </div>
    <div className="footer-word" data-reveal="word" aria-hidden="true">Sande Technologies</div>
    <p className="footer-legal">© {new Date().getFullYear()} Sande Technologies. Software products, remote tech teams and agency builds.</p>
  </footer>;
}

/* ---------- reveal on scroll: adds .in to [data-reveal] ---------- */
export function useReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-reveal]:not(.in)')];
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    els.forEach((e) => io.observe(e));
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
    const draw = (t = 0) => {
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

/* ---------- glowing planet-horizon arc ---------- */
export const Horizon = ({ className = '' }) => <div className={`horizon ${className}`} aria-hidden="true"><div className="horizon-glow" /><div className="horizon-ring" /></div>;

export function initPage() {
  document.documentElement.classList.add('js');
  if (prefersReducedMotion()) document.documentElement.classList.add('reduce');
}
