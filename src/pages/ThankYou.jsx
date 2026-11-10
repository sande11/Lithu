import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';

// Shown after the contact form is submitted without JavaScript. Also a useful goal page for analytics.
export default function ThankYou({ route }) {
  return <Layout route={route}>
    <section className="page-hero notfound">
      <div className="page-hero-inner">
        <div className="page-hero-copy">
          <p className="eyebrow">Message sent</p>
          <h1>Thanks, we’ve got your enquiry</h1>
          <p className="hero-sub">We reply within one working day, usually to book a short call. If it’s urgent, message us on WhatsApp.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/">Back to the home page <Icon n="arrow" /></a>
            <a className="btn btn-glass" href="/services/">See our services</a>
          </div>
        </div>
      </div>
    </section>
  </Layout>;
}
