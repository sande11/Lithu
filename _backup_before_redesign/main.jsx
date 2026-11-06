import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const services = [
  ['01', 'Web platforms', 'High-performing websites, e-commerce, portals, and the systems behind them.', 'Web design & development'],
  ['02', 'Mobile products', 'Useful Android and iOS experiences shaped around real people and their work.', 'Mobile app development'],
  ['03', 'Custom software', 'Business systems, APIs, integrations, and internal tools that remove friction.', 'Custom software solutions'],
  ['04', 'AI & automation', 'Practical AI workflows and data-led tools that make teams faster and sharper.', 'AI & digital innovation'],
  ['05', 'Digital growth', 'Digital strategy, campaigns, and content that give good products an audience.', 'Digital marketing'],
  ['06', 'Technical guidance', 'A dependable technical sounding board, from infrastructure to delivery planning.', 'IT consulting & support'],
];

const Arrow = () => <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Menu = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const Close = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const title = 'Sande Technologies — Digital innovation, delivered';
    document.title = title;
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const submitContact = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('name') || !data.get('email') || !data.get('message')) {
      setError('Please share your name, email address, and a brief project outline.');
      setSent(false);
      return;
    }
    setError('');
    setSent(true);
    event.currentTarget.reset();
  };

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Sande Technologies home" onClick={closeMenu}>
        <img src="/assets/sandetechnologies-500.png" alt="Sande Technologies" />
      </a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <Close /> : <Menu />}</button>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <a href="#services" onClick={closeMenu}>Capabilities</a>
        <a href="#approach" onClick={closeMenu}>How we work</a>
        <a href="#work" onClick={closeMenu}>Products</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a className="nav-cta" href="#contact" onClick={closeMenu}>Start a conversation <Arrow /></a>
      </nav>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker"><span /> Your remote technology partner</p>
          <h1 id="hero-title">Build the thing your business <em>needs next.</em></h1>
          <p className="hero-intro">Sande Technologies is the focused software team behind ambitious websites, applications, and digital systems—built with care, wherever you are.</p>
          <div className="hero-actions">
            <a className="button primary" href="#contact">Talk to our team <Arrow /></a>
            <a className="text-link" href="#services">Explore capabilities <Arrow /></a>
          </div>
          <p className="availability"><span className="pulse" /> Accepting new projects for 2026</p>
        </div>
        <aside className="delivery-board" aria-label="An example of Sande Technologies' delivery approach">
          <div className="board-top"><span>ST / DELIVERY DESK</span><span className="board-live"><i /> Team online</span></div>
          <div className="board-title"><p>YOUR PROJECT</p><strong>From brief<br />to momentum.</strong></div>
          <div className="board-track"><span>Discovery</span><span className="track-line complete" /><span className="track-line complete" /><span>Build</span><span className="track-line" /><span>Launch</span></div>
          <div className="board-tasks">
            <div><b>01</b><p><strong>Understand</strong><span>Goals, users, and the real problem</span></p><i>Done</i></div>
            <div><b>02</b><p><strong>Design the right path</strong><span>Clear product decisions before code</span></p><i>Now</i></div>
            <div><b>03</b><p><strong>Deliver in the open</strong><span>Steady releases and useful feedback</span></p><i>Next</i></div>
          </div>
          <div className="board-bottom"><span>Remote by default</span><span>Made for momentum</span></div>
        </aside>
      </section>

      <section className="proof-strip" aria-label="What to expect from Sande Technologies"><p>Technology should create opportunities—not more complexity.</p><div><span>Remote-ready</span><span>Practical by design</span><span>Built to scale</span></div></section>

      <section className="section services" id="services" aria-labelledby="services-title">
        <div className="section-heading"><p className="kicker"><span /> What we bring</p><h2 id="services-title">A versatile team for the work that moves you forward.</h2><p>Bring us a clear project, an early idea, or a stubborn business problem. We’ll meet you there and build a useful way through.</p></div>
        <div className="service-list">
          {services.map(([number, name, description, label]) => <article className="service" key={number}><span className="service-number">{number}</span><div><h3>{name}</h3><p>{description}</p></div><a href="#contact" aria-label={`Ask about ${label}`}>Let’s talk <Arrow /></a></article>)}
        </div>
      </section>

      <section className="section approach" id="approach" aria-labelledby="approach-title">
        <div className="approach-image"><img src="/assets/startup.jpg" alt="A creative workspace where ideas become working products" /><div className="image-note"><span>OUR WORKING PRINCIPLE</span><strong>Clarity first.<br />Code second.</strong></div></div>
        <div className="approach-copy"><p className="kicker"><span /> A better way to work remotely</p><h2 id="approach-title">Your extended product team, without the overhead.</h2><p>Hire us as the technology partner that stays close to the business. We ask sharp questions, make the work visible, and turn decisions into progress—without requiring you to build an in-house team first.</p><ol><li><b>Listen closely</b><span>We learn what is true about your customers and your operating reality.</span></li><li><b>Build deliberately</b><span>Small, accountable steps turn complexity into a working product.</span></li><li><b>Keep improving</b><span>We stay available as your needs evolve beyond the first release.</span></li></ol><a className="text-link" href="#contact">Work with our team <Arrow /></a></div>
      </section>

      <section className="section work" id="work" aria-labelledby="work-title"><div className="section-heading"><p className="kicker"><span /> Built by Sande</p><h2 id="work-title">We make products, too.</h2><p>Our own platforms keep us honest about the craft of taking an idea all the way to the people it serves.</p></div><div className="product-feature"><div className="product-details"><span className="product-label">IN DEVELOPMENT</span><h3>VepiFind</h3><p>A smarter career companion designed to help job seekers discover relevant opportunities, prepare better applications, and keep their search moving.</p><a className="button dark" href="/vepifind.html">Explore VepiFind <Arrow /></a></div><img src="/assets/vepifind.png" alt="VepiFind mobile application" /></div></section>

      <section className="about-band" id="about"><div><p className="kicker"><span /> Who we are</p><h2>Technology that feels possible.</h2></div><p>Sande Technologies is a digital solutions company that combines engineering, creative thinking, and a customer-focused approach. Our mission is to empower businesses and communities through technology that is accessible, impactful, and built to last.</p></section>

      <section className="section contact" id="contact" aria-labelledby="contact-title"><div className="contact-copy"><p className="kicker"><span /> Start here</p><h2 id="contact-title">Tell us what you’re trying to make happen.</h2><p>Whether you need a complete product team, a focused build, or help defining the right technical path, we’d love to hear the shape of it.</p><a className="email-link" href="mailto:sandetechnologiesmw@gmail.com">sandetechnologiesmw@gmail.com <Arrow /></a></div><form onSubmit={submitContact} noValidate><label>Your name<input name="name" autoComplete="name" /></label><label>Work email<input name="email" type="email" autoComplete="email" /></label><label>How can we help?<textarea className="resize-none" name="message" rows="4" placeholder="A little about the project, team, or challenge…" /></label>{error && <p className="form-status error" role="alert">{error}</p>}{sent && <p className="form-status success" role="status">Thanks—we’ve got your note. We’ll be in touch soon.</p>}<button className="button primary" type="submit">Send project outline <Arrow /></button></form></section>
    </main>
    <footer><a className="brand" href="#top"><img src="/assets/sandetechnologies-500.png" alt="Sande Technologies" /></a><p>Innovating today. Empowering tomorrow.</p><span>© {new Date().getFullYear()} Sande Technologies</span></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
