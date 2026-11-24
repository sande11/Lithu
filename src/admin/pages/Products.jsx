import { useState } from 'react';
import { useDraft, useStore } from '../store.jsx';
import { PageHead, Card, Text, Area, Field, Toggle, StringList, ImageField, SaveBar, RowTools, Icon, move, removeAt, slugify } from '../ui.jsx';
import { APP_CATEGORIES, LINK_KINDS } from '../../shared/content-schema.js';

const categoryLabel = (c) => c.replace(/Application$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
const blank = () => ({
  key: '', name: '', status: 'In development', statusHighlight: false, summary: '', features: [],
  category: 'BusinessApplication', os: 'Android', links: [], icon: null, screenshots: [], visible: false,
});
const MAX_LINKS = 4;

// The product's links: where each goes, its address and the button text. Changing where a link
// goes swaps in that kind's usual button text, unless the text was already edited.
function LinkList({ links, onChange, issue, prefix, error }) {
  const setAt = (k, patch) => onChange(links.map((l, j) => (j === k ? { ...l, ...patch } : l)));
  const setKind = (k, kind) => {
    const l = links[k];
    const keepLabel = l.label.trim() && l.label !== LINK_KINDS[l.kind].label;
    setAt(k, { kind, ...(keepLabel ? {} : { label: LINK_KINDS[kind].label }) });
  };
  const add = () => {
    const used = new Set(links.map((l) => l.kind));
    const kind = ['google-play', 'website', 'app-store', 'web-app'].find((x) => !used.has(x)) ?? 'website';
    onChange([...links, { kind, href: '', label: LINK_KINDS[kind].label }]);
  };
  return <fieldset className="a-list a-pairs">
    <legend><span className="a-count">{links.length} of {MAX_LINKS} links</span></legend>
    {error && <p className="a-error">{error}</p>}
    {!links.length && <p className="a-hint">No links yet. The product shows without a button.</p>}
    <ol>
      {links.map((l, k) => {
        const errHref = issue(`${prefix}.${k}.href`), errLabel = issue(`${prefix}.${k}.label`), errKind = issue(`${prefix}.${k}.kind`);
        return <li key={k}>
          <div className="a-linkrow">
            <label className={errKind ? 'has-error' : ''}><span>Goes to {k === 0 && <em className="a-tag">Main button</em>}</span>
              <select value={l.kind} onChange={(ev) => setKind(k, ev.target.value)}>
                {Object.entries(LINK_KINDS).map(([v, x]) => <option key={v} value={v}>{x.name}</option>)}
              </select>{errKind && <em className="a-error">{errKind}</em>}</label>
            <label className={errLabel ? 'has-error' : ''}><span>Button text</span>
              <input value={l.label} maxLength={60} onChange={(ev) => setAt(k, { label: ev.target.value })} aria-invalid={Boolean(errLabel)} />{errLabel && <em className="a-error">{errLabel}</em>}</label>
            <label className={`wide ${errHref ? 'has-error' : ''}`}><span>Address</span>
              <input value={l.href} inputMode="url" placeholder={LINK_KINDS[l.kind].example} onChange={(ev) => setAt(k, { href: ev.target.value.trim() })} aria-invalid={Boolean(errHref)} />
              {errHref ? <em className="a-error">{errHref}</em> : l.href.startsWith('https://') && <a className="a-link a-hint" href={l.href} target="_blank" rel="noopener noreferrer"><Icon n="external" />Open to check it</a>}</label>
          </div>
          <RowTools i={k} count={links.length} label={`link ${k + 1}`} onMove={(a, b) => onChange(move(links, a, b))} onRemove={(a) => onChange(removeAt(links, a))} />
        </li>;
      })}
    </ol>
    {links.length < MAX_LINKS && <button type="button" className="a-btn" onClick={add}><Icon n="plus" /> Add a link</button>}
  </fieldset>;
}

export default function Products() {
  const d = useDraft('products');
  const { media } = useStore();
  const [sel, setSel] = useState(0);
  const list = d.draft;
  const i = Math.min(sel, list.length - 1);
  const add = () => { d.update((l) => [...l, blank()]); setSel(list.length); };
  const reorder = (k, step) => { d.update((l) => move(l, k, step)); if (k === i) setSel(Math.max(0, Math.min(list.length - 1, k + step))); };
  const remove = (k) => {
    if (!window.confirm(`Remove ${list[k].name || 'this product'} from the site? (You can discard instead of saving to undo.)`)) return;
    d.update((l) => removeAt(l, k)); setSel(Math.max(0, k - 1));
  };
  const itemHasError = (k) => d.issues.some((x) => x.path === String(k) || x.path.startsWith(`${k}.`));
  return <>
    <PageHead title="Products" intro="The products slideshow on the home and products pages, in this order. The first three also appear in “How to work with us”. Each product is listed for Google as an app.">
      <button type="button" className="a-btn" onClick={add} disabled={list.length >= 12}><Icon n="plus" />Add a product</button>
    </PageHead>
    {d.issue('') && <p className="a-notice error">{d.issue('')}</p>}
    {!list.length ? <Card><p className="a-muted">No products yet. The products section is hidden on the site until you add one.</p></Card>
      : <div className="a-split">
        <ol className="a-picker" aria-label="Products">
          {list.map((p, k) => <li key={k} className={`${k === i ? 'on' : ''} ${itemHasError(k) ? 'has-error' : ''}`}>
            <button type="button" className="a-pick" onClick={() => setSel(k)} aria-current={k === i}>
              <span className="a-thumb square sm">{p.icon && media[p.icon.key]?.url ? <img src={media[p.icon.key].url} alt="" /> : <Icon n="box" />}</span>
              <span><strong>{p.name || 'New product'}</strong><small>{p.visible ? p.status : 'Hidden'}</small></span>
            </button>
            <span className="a-pick-tools">
              <button type="button" className="a-icon-btn" onClick={() => reorder(k, -1)} disabled={k === 0} aria-label={`Move ${p.name} up`}><Icon n="up" /></button>
              <button type="button" className="a-icon-btn" onClick={() => reorder(k, 1)} disabled={k === list.length - 1} aria-label={`Move ${p.name} down`}><Icon n="down" /></button>
            </span>
          </li>)}
        </ol>
        <ProductEditor key={i} p={list[i]} i={i} d={d} onRemove={() => remove(i)} />
      </div>}
    <SaveBar d={d} label="product changes" />
  </>;
}

function ProductEditor({ p, i, d, onRemove }) {
  const set = (patch) => d.update((l) => l.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const e = (field, opts) => d.issue(`${i}.${field}`, opts);
  const setName = (name) => set({ name, ...(!p.key || p.key === slugify(p.name) ? { key: slugify(name) } : {}) });
  const shots = p.screenshots;
  return <div className="a-editor">
    <Card title="Basics">
      <div className="a-cols2">
        <Text label="Name" value={p.name} max={60} onChange={setName} error={e('name')} />
        <Text label="Key" value={p.key} onChange={(v) => set({ key: v })} error={e('key')} hint="Identifies the app for Google. Lowercase letters, numbers and hyphens." />
      </div>
      <div className="a-cols2">
        <Text label="Status" value={p.status} max={40} onChange={(v) => set({ status: v })} error={e('status')} hint="e.g. In development, Coming soon, Live" />
        <div className="a-stack-toggles">
          <Toggle label="Show the status in green" checked={p.statusHighlight} onChange={(v) => set({ statusHighlight: v })} />
          <Toggle label="Show on the site" hint="Hidden products stay here but leave the site." checked={p.visible} onChange={(v) => set({ visible: v })} />
        </div>
      </div>
      <Area label="Summary" value={p.summary} max={320} ideal={200} onChange={(v) => set({ summary: v })} error={e('summary')}
        hint="Shown under the name in the slideshow, and the app description Google reads." />
      <StringList label="Key features" items={p.features} max={6} itemMax={120} onChange={(v) => set({ features: v })} issue={d.issue} prefix={`${i}.features`}
        placeholder="Add a feature" hint="Optional ticked list in the slideshow." error={e('features')} />
    </Card>

    <Card title="App details for Google">
      <div className="a-cols2">
        <Field label="Category" error={e('category')}>{(id) => <select id={id} value={p.category} onChange={(ev) => set({ category: ev.target.value })}>
          {APP_CATEGORIES.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}</select>}</Field>
        <Text label="Platforms" value={p.os} max={60} onChange={(v) => set({ os: v })} error={e('os')} hint="e.g. Android, iOS, Web" />
      </div>
    </Card>

    <Card title="Links" intro="Buttons under the product in the slideshow: app stores, the product’s website or its page on this site. The first one is the main button. Store links also tell Google where the app can be installed.">
      <LinkList links={p.links} onChange={(links) => set({ links })} issue={d.issue} prefix={`${i}.links`} error={e('links')} />
    </Card>

    <Card title="Images">
      <ImageField label="App icon" square value={p.icon} defaultAlt={`${p.name} app icon`} onChange={(v) => set({ icon: v })}
        error={e('icon', { under: true }) && (p.icon ? 'Add alt text for the icon.' : 'Upload an app icon.')} hint="Square, at least 192×192. WebP keeps the page fast." />
      <div className="a-shots">
        {shots.map((s, k) => <div key={s.key} className="a-shot">
          <ImageField label={`Screenshot ${k + 1}`} value={s} defaultAlt={`${p.name} screen`}
            onChange={(v) => set({ screenshots: shots.map((x, j) => (j === k ? v : x)) })} onRemove={() => set({ screenshots: removeAt(shots, k) })}
            error={e(`screenshots.${k}`, { under: true }) && 'Add alt text for this screenshot.'} />
          <div className="a-row-tools">
            <button type="button" className="a-icon-btn" onClick={() => set({ screenshots: move(shots, k, -1) })} disabled={k === 0} aria-label="Move screenshot left"><Icon n="up" /></button>
            <button type="button" className="a-icon-btn" onClick={() => set({ screenshots: move(shots, k, 1) })} disabled={k === shots.length - 1} aria-label="Move screenshot right"><Icon n="down" /></button>
          </div>
        </div>)}
        {shots.length < 3 && <ImageField label={shots.length ? 'Add another screenshot' : 'Phone screenshots (optional)'} value={null} defaultAlt={`${p.name} screen`}
          onChange={(v) => v && set({ screenshots: [...shots, v] })} hint="Up to 3, shown as a fan of phones. Portrait, e.g. 600×1336. Without screenshots the slideshow shows the icon large." />}
      </div>
    </Card>

    <div className="a-danger-row"><button type="button" className="a-btn danger" onClick={onRemove}><Icon n="trash" />Remove this product</button></div>
  </div>;
}
