import { useDraft, useStore } from '../store.jsx';
import { PageHead, Card, Text, Area, Toggle, StringList, PairList, SaveBar, Notice, Icon, move, slugify } from '../ui.jsx';
import { SERVICE_ICONS, RESERVED_SLUGS } from '../../shared/content-schema.js';

const template = () => ({
  slug: '', name: '', icon: 'code', short: '', phrase: '', wide: false, visible: true,
  title: '', description: '', keywords: [], h1: '', lead: '',
  whatTitle: 'What we build', what: [['', '']], forTitle: 'Who we build for', for: [''],
  includedTitle: 'What every project includes', included: [''], stack: [], faqs: [], related: [], proof: null,
});

// #/services lists them; #/services/<n> edits the n-th. Both share one working copy.
export default function Services({ params }) {
  const d = useDraft('services');
  const n = params?.[0] !== undefined && params[0] !== '' ? Number(params[0]) : null;
  const editing = n !== null && d.draft[n] ? n : null;
  return editing === null ? <ServiceList d={d} /> : <ServiceEditor d={d} i={editing} />;
}

function ServiceList({ d }) {
  const list = d.draft;
  const add = () => { d.update((l) => [...l, template()]); window.location.hash = `#/services/${list.length}`; };
  const hasError = (k) => d.issues.some((x) => x.path === String(k) || x.path.startsWith(`${k}.`));
  return <>
    <PageHead title="Services" intro="Each visible service has its own page at /address/, a card on the home and services pages and a footer link, in this order. A hidden service has no page and its address redirects to /services/.">
      <button type="button" className="a-btn" onClick={add} disabled={list.length >= 30}><Icon n="plus" />New service</button>
    </PageHead>
    {d.issue('') && <p className="a-notice error">{d.issue('')}</p>}
    <ol className="a-rows">
      {list.map((s, k) => <li key={k} className={hasError(k) ? 'has-error' : ''}>
        <span className="a-row-icon"><Icon n={s.icon} /></span>
        <a className="a-row-main" href={`#/services/${k}`}><strong>{s.name || 'New service'}</strong><small>/{s.slug || '…'}/</small></a>
        <span className={`a-badge ${s.visible ? 'ok' : ''}`}>{s.visible ? 'Visible' : 'Hidden'}</span>
        <span className="a-row-tools">
          <button type="button" className="a-icon-btn" onClick={() => d.update((l) => l.map((x, j) => (j === k ? { ...x, visible: !x.visible } : x)))} aria-label={s.visible ? `Hide ${s.name}` : `Show ${s.name}`}><Icon n={s.visible ? 'eye' : 'eyeOff'} /></button>
          <button type="button" className="a-icon-btn" onClick={() => d.update((l) => move(l, k, -1))} disabled={k === 0} aria-label={`Move ${s.name} up`}><Icon n="up" /></button>
          <button type="button" className="a-icon-btn" onClick={() => d.update((l) => move(l, k, 1))} disabled={k === list.length - 1} aria-label={`Move ${s.name} down`}><Icon n="down" /></button>
          <a className="a-btn ghost sm" href={`#/services/${k}`}><Icon n="edit" />Edit</a>
        </span>
      </li>)}
    </ol>
    <SaveBar d={d} label="service changes" />
  </>;
}

function ServiceEditor({ d, i }) {
  const { content } = useStore();
  const s = d.draft[i];
  const savedSlugs = (content.services.value || []).map((x) => x.slug);
  const isNew = !savedSlugs.includes(s.slug) || !s.slug;
  const set = (patch) => d.update((l) => l.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const e = (field, opts) => d.issue(`${i}.${field}`, opts);
  const others = d.draft.filter((_, k) => k !== i && d.draft[k].slug);
  const setName = (name) => set({ name, ...(isNew && (!s.slug || s.slug === slugify(s.name)) ? { slug: slugify(name) } : {}) });
  const reserved = RESERVED_SLUGS.includes(s.slug);
  return <>
    <a className="a-back" href="#/services"><Icon n="up" />All services</a>
    <PageHead title={s.name || 'New service'} intro={isNew ? 'A new page. It goes live at its address when you save and publish.' : `The page at /${s.slug}/.`}>
      {!isNew && s.visible && <a className="a-btn ghost" href={`/${s.slug}/`} target="_blank" rel="noopener"><Icon n="external" />View live page</a>}
    </PageHead>

    <Card title="Basics">
      <div className="a-cols2">
        <Text label="Service name" value={s.name} max={60} onChange={setName} error={e('name')} hint="Used on cards, in the footer and in “… services” links." />
        <Text label="Address" value={s.slug} onChange={(v) => set({ slug: v })} disabled={!isNew} error={e('slug') || (reserved ? 'That address is used by another page.' : null)}
          hint={isNew ? `The page will be at /${s.slug || 'address'}/. It can’t be changed after saving.` : 'Fixed once saved, so links and search rankings keep working.'} />
      </div>
      <fieldset className="a-icons"><legend>Icon</legend>
        {SERVICE_ICONS.map((n) => <label key={n} className={s.icon === n ? 'on' : ''} title={n}><input type="radio" name={`icon-${i}`} checked={s.icon === n} onChange={() => set({ icon: n })} /><Icon n={n} /><span className="sr">{n}</span></label>)}
      </fieldset>
      <div className="a-cols2">
        <Toggle label="Visible on the site" hint="Hidden: no page, and the address redirects to /services/." checked={s.visible} onChange={(v) => set({ visible: v })} />
        <Toggle label="Wide card on the home page" hint="Takes two columns in the services grid." checked={s.wide} onChange={(v) => set({ wide: v })} />
      </div>
    </Card>

    <Card title="How it appears in Google">
      <div className="a-serp" aria-label="Google result preview">
        <span className="a-serp-url">sandetechnologies.com › {s.slug || 'address'}</span>
        <span className="a-serp-title">{s.title || 'Page title'}</span>
        <span className="a-serp-desc">{s.description || 'Meta description'}</span>
      </div>
      <Text label="Page title" value={s.title} max={80} ideal={60} onChange={(v) => set({ title: v })} error={e('title')} hint="About 60 characters shows in full. End with “| Sande Technologies”." />
      <Area label="Meta description" value={s.description} max={200} ideal={155} rows={2} onChange={(v) => set({ description: v })} error={e('description')} hint="About 155 characters shows in full. Say what you do, where, for whom." />
      <StringList label="Target searches" items={s.keywords} max={20} itemMax={80} onChange={(v) => set({ keywords: v })} issue={d.issue} prefix={`${i}.keywords`}
        placeholder="Add a search phrase" hint="The searches this page is written for. Not shown on the page; use them naturally in the wording below." />
    </Card>

    <Card title="Cards and links">
      <Area label="Card text" value={s.short} max={200} rows={2} onChange={(v) => set({ short: v })} error={e('short')} hint="One sentence on the service cards and in “Related services”." />
      <Text label="Mid-sentence name" value={s.phrase} max={60} onChange={(v) => set({ phrase: v })} error={e('phrase')} hint={`Lower-case. Reads: “How a ${s.phrase || '…'} project runs”, “Talk to us about your ${s.phrase || '…'} project.”`} />
    </Card>

    <Card title="Top of the page">
      <Text label="Main heading (H1)" value={s.h1} max={120} onChange={(v) => set({ h1: v })} error={e('h1')} />
      <Area label="Intro paragraph" value={s.lead} max={400} rows={3} onChange={(v) => set({ lead: v })} error={e('lead')} />
    </Card>

    <Card title="What you offer">
      <Text label="Section heading" value={s.whatTitle} max={100} onChange={(v) => set({ whatTitle: v })} error={e('whatTitle')} />
      <PairList label="Offerings" items={s.what} labels={['Title', 'Description']} max={12} onChange={(v) => set({ what: v })} issue={d.issue} prefix={`${i}.what`} error={e('what')} addLabel="Add an offering" />
    </Card>

    <Card title="Who it’s for and what’s included">
      <Text label="“Who it’s for” heading" value={s.forTitle} max={100} onChange={(v) => set({ forTitle: v })} error={e('forTitle')} />
      <StringList label="Who it’s for" items={s.for} max={12} itemMax={200} onChange={(v) => set({ for: v })} issue={d.issue} prefix={`${i}.for`} error={e('for')} placeholder="Add a type of client" />
      <Text label="“Included” heading" value={s.includedTitle} max={100} onChange={(v) => set({ includedTitle: v })} error={e('includedTitle')} />
      <StringList label="Included in every project" items={s.included} max={12} itemMax={200} onChange={(v) => set({ included: v })} issue={d.issue} prefix={`${i}.included`} error={e('included')} placeholder="Add what’s included" hint="The first three also show in the badge at the top of the page." />
      <StringList label="Tools and technologies" items={s.stack} max={16} itemMax={40} onChange={(v) => set({ stack: v })} issue={d.issue} prefix={`${i}.stack`} placeholder="Add a tool" hint="The first four show on the service card." />
    </Card>

    <Card title="Proof (optional)">
      <Toggle label="Show a proof line" hint="A short line pointing to real work, under the offerings." checked={Boolean(s.proof)} onChange={(v) => set({ proof: v ? { text: '', href: '/products/', label: '' } : null })} />
      {s.proof && <>
        <Area label="Text" value={s.proof.text} max={300} rows={2} onChange={(v) => set({ proof: { ...s.proof, text: v } })} error={e('proof.text')} />
        <div className="a-cols2">
          <Text label="Link text" value={s.proof.label} max={80} onChange={(v) => set({ proof: { ...s.proof, label: v } })} error={e('proof.label')} />
          <Text label="Link" value={s.proof.href} onChange={(v) => set({ proof: { ...s.proof, href: v } })} error={e('proof.href')} hint="A page on this site or a full https:// address" />
        </div>
      </>}
    </Card>

    <Card title="Questions and answers">
      <PairList label="FAQs" items={s.faqs} labels={['Question', 'Answer']} max={12} onChange={(v) => set({ faqs: v })} issue={d.issue} prefix={`${i}.faqs`}
        hint="Shown on the page and given to Google as FAQ structured data." addLabel="Add a question" />
    </Card>

    <Card title="Related services" intro="Linked at the bottom of the page. Up to 6.">
      {e('related', { under: true }) && <Notice tone="error">{e('related', { under: true })}</Notice>}
      <div className="a-checks">
        {others.map((o) => {
          const on = s.related.includes(o.slug);
          return <label key={o.slug} className={on ? 'on' : ''}><input type="checkbox" checked={on} disabled={!on && s.related.length >= 6}
            onChange={(ev) => set({ related: ev.target.checked ? [...s.related, o.slug] : s.related.filter((r) => r !== o.slug) })} />
            <Icon n={o.icon} />{o.name}{!o.visible && <small> (hidden)</small>}</label>;
        })}
      </div>
    </Card>
    <SaveBar d={d} label="service changes" />
  </>;
}
