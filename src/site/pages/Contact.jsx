import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { SITE } from '../site.js';
import { contactFaqs } from '../content/pages.js';
import { PageHero, ContactSection, FaqList, Process } from '../sections.jsx';

const NEXT = [
  ['You send an enquiry', 'Tell us about your project or the team you need, using the form, email, phone or WhatsApp.'],
  ['We reply within a working day', 'Usually with a few questions and times for a short call.'],
  ['Short call', 'We talk through goals, constraints, timing and budget.'],
  ['Written proposal', 'You receive a scope, timeline and quote, or a team proposal for remote developers.'],
];

export default function Contact({ route }) {
  return <Layout route={route}>
    <PageHero eyebrow="Contact" title="Contact Sande Technologies"
      lead={`Tell us about the website, app or system you need, or the remote developers you’re looking for. We reply within one working day. Based in ${SITE.city}, ${SITE.country}, working with clients everywhere.`}>
      <a className="btn btn-primary" href="#contact">Send an enquiry <Icon n="arrow" /></a>
      <a className="btn btn-glass" href={SITE.whatsapp} target="_blank" rel="noopener">Message us on WhatsApp</a>
    </PageHero>
    <ContactSection title="Start a conversation" />
    <Process id="next" title="What happens next" text="From your first message to a written proposal." steps={NEXT} />
    <FaqList faqs={contactFaqs} title="Before you get in touch" />
  </Layout>;
}
