import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { remoteFaqs } from '../content/pages.js';
import { PageHero, TeamBuilder, TimeBand, Process, FaqList, ContactSection } from '../sections.jsx';

const HOW = [
  ['Tell us the roles', 'Share the skills, seniority and hours you need, and how your team works today.'],
  ['Meet your developers', 'We introduce people from our team who match. You talk to them before anyone starts.'],
  ['Onboard into your tools', 'They join your chat, issue tracker, repos and meetings, and take priorities from you.'],
  ['Scale as you go', 'Add people, change roles or pause month to month as your roadmap changes.'],
];

export default function Remote({ route }) {
  return <Layout route={route}>
    <PageHero eyebrow="Remote developers" title="Hire remote developers who work as part of your team"
      lead="Add software engineers, designers and QA from Sande Technologies to your team without hiring in-house. They work your sprint in your tools, during hours that overlap the UK and European working day.">
      <a className="btn btn-primary" href="#build">Build your team <Icon n="arrow" /></a>
      <a className="btn btn-glass" href="#faq">Common questions</a>
    </PageHero>

    <section className="section team" id="build" aria-labelledby="roles-title">
      <div className="team-copy" data-reveal>
        <h2 id="roles-title">Roles you can add to your team</h2>
        <p>Pick the roles you need and send the request. We’ll come back with who is available and a start date.</p>
        <ul className="ticks">
          <li><Icon n="check" /> Mobile, web, backend, AI and QA engineers, plus UI/UX designers</li>
          <li><Icon n="check" /> One point of contact for contracts, reporting and replacements</li>
          <li><Icon n="check" /> Month-to-month engagements, no long lock-in</li>
          <li><Icon n="check" /> Your NDA and IP terms; the code belongs to you</li>
        </ul>
      </div>
      <TeamBuilder />
    </section>

    <TimeBand />

    <Process id="how" title="How hiring remote developers works" text="From first call to developers working in your sprint." steps={HOW} />

    <section className="section" aria-labelledby="why-title">
      <div className="head" data-reveal>
        <h2 id="why-title">Why teams hire developers from Malawi</h2>
      </div>
      <div className="feature-grid even">
        {[
          ['Working hours that overlap yours', 'Central Africa Time is the same as Central European summer time and one hour ahead in winter, and one to two hours ahead of the UK, so almost all of your working day is shared.'],
          ['English as a working language', 'English is an official language in Malawi and the language of business and education, so communication is straightforward.'],
          ['A product team, not just individuals', 'Our developers also build our own apps, so they’re used to owning features end to end, from design to release.'],
          ['Cost-effective without cutting corners', 'You add experienced people at a lower cost than many local hires, with code reviews, testing and documentation as standard.'],
        ].map(([t, d], i) => <article key={t} className="glass feature" data-reveal data-spot style={{ '--d': i % 2 }}><h3>{t}</h3><p>{d}</p></article>)}
      </div>
      <p className="section-links" data-reveal>Comparing outsourcing options? Read about <a className="link inline" href="/software-development-outsourcing-africa/">software development outsourcing to Africa</a>. Need a whole project delivered instead? See our <a className="link inline" href="/web-development/">web development</a>, <a className="link inline" href="/mobile-app-development/">mobile app development</a> and <a className="link inline" href="/custom-software-development/">custom software development</a> services.</p>
    </section>

    <FaqList faqs={remoteFaqs} title="Hiring remote developers: common questions" />
    <ContactSection title="Tell us the team you need." defaultEngagement="team" />
  </Layout>;
}
