// Small building blocks shared by the admin pages.
import { useId, useRef, useState } from 'react';
import { Icon } from '../shared/icons.jsx';
import { api } from './api.js';
import { useStore } from './store.jsx';

export { Icon };

export const move = (list, i, step) => {
  const j = i + step;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
export const removeAt = (list, i) => list.filter((_, k) => k !== i);
const at = (prefix, ...rest) => [prefix, ...rest].filter((x) => x !== undefined && x !== '').join('.');
export const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
export const when = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
export const ago = (iso) => {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return when(iso);
};

export function PageHead({ title, intro, children }) {
  return <header className="a-head">
    <div><h1>{title}</h1>{intro && <p>{intro}</p>}</div>
    {children && <div className="a-head-actions">{children}</div>}
  </header>;
}

export const Card = ({ title, intro, children, className = '' }) => <section className={`a-card ${className}`}>
  {title && <h2>{title}</h2>}{intro && <p className="a-muted">{intro}</p>}{children}
</section>;

export const Notice = ({ tone = 'info', children }) => <div className={`a-notice ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;

// Label + control + hint/error, with an optional character counter (soft limit `ideal`).
export function Field({ label, hint, error, value, max, ideal, children, className = '' }) {
  const id = useId();
  const len = typeof value === 'string' ? value.length : null;
  return <div className={`a-field ${error ? 'has-error' : ''} ${className}`}>
    <label htmlFor={id}>{label}{len !== null && (max || ideal) && <span className={`a-count ${(ideal && len > ideal) || (max && len > max) ? 'over' : ''}`}>{len}{ideal ? ` / ${ideal}` : max ? ` / ${max}` : ''}</span>}</label>
    {typeof children === 'function' ? children(id) : children}
    {error ? <p className="a-error">{error}</p> : hint ? <p className="a-hint">{hint}</p> : null}
  </div>;
}

export const Text = ({ label, hint, error, value, onChange, max, ideal, className, ...rest }) =>
  <Field label={label} hint={hint} error={error} value={value} max={max} ideal={ideal} className={className}>
    {(id) => <input id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} {...rest} />}
  </Field>;

export const Area = ({ label, hint, error, value, onChange, max, ideal, rows = 3, className, ...rest }) =>
  <Field label={label} hint={hint} error={error} value={value} max={max} ideal={ideal} className={className}>
    {(id) => <textarea id={id} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} {...rest} />}
  </Field>;

export function Toggle({ label, hint, checked, onChange }) {
  return <label className="a-toggle">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="a-switch" aria-hidden="true" />
    <span><strong>{label}</strong>{hint && <small>{hint}</small>}</span>
  </label>;
}

export const RowTools = ({ i, count, onMove, onRemove, label }) => <div className="a-row-tools">
  <button type="button" className="a-icon-btn" onClick={() => onMove(i, -1)} disabled={i === 0} aria-label={`Move ${label} up`}><Icon n="up" /></button>
  <button type="button" className="a-icon-btn" onClick={() => onMove(i, 1)} disabled={i === count - 1} aria-label={`Move ${label} down`}><Icon n="down" /></button>
  <button type="button" className="a-icon-btn danger" onClick={() => onRemove(i)} aria-label={`Remove ${label}`}><Icon n="trash" /></button>
</div>;

// An ordered list of short texts. `issue(path)` returns an error for "<prefix>.<i>".
export function StringList({ label, hint, items, onChange, max = 12, itemMax, placeholder = 'Add an item', issue, prefix, error }) {
  const [adding, setAdding] = useState('');
  const add = () => { const v = adding.trim(); if (!v) return; onChange([...items, v]); setAdding(''); };
  return <fieldset className="a-list">
    <legend>{label} <span className="a-count">{items.length} / {max}</span></legend>
    {hint && <p className="a-hint">{hint}</p>}
    {error && <p className="a-error">{error}</p>}
    <ol>
      {items.map((item, i) => {
        const err = issue?.(at(prefix, i));
        return <li key={i} className={err ? 'has-error' : ''}>
          <input value={item} maxLength={itemMax} onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} aria-label={`${label} ${i + 1}`} aria-invalid={Boolean(err)} />
          <RowTools i={i} count={items.length} label={`item ${i + 1}`} onMove={(a, b) => onChange(move(items, a, b))} onRemove={(a) => onChange(removeAt(items, a))} />
          {err && <p className="a-error">{err}</p>}
        </li>;
      })}
    </ol>
    {items.length < max && <div className="a-add">
      <input value={adding} placeholder={placeholder} maxLength={itemMax} onChange={(e) => setAdding(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} aria-label={placeholder} />
      <button type="button" className="a-btn" onClick={add} disabled={!adding.trim()}><Icon n="plus" /> Add</button>
    </div>}
  </fieldset>;
}

// An ordered list of [title, text] pairs (features, FAQs).
export function PairList({ label, hint, items, onChange, labels = ['Title', 'Text'], max = 12, issue, prefix, error, addLabel = 'Add' }) {
  return <fieldset className="a-list a-pairs">
    <legend>{label} <span className="a-count">{items.length} / {max}</span></legend>
    {hint && <p className="a-hint">{hint}</p>}
    {error && <p className="a-error">{error}</p>}
    <ol>
      {items.map(([a, b], i) => {
        const errA = issue?.(at(prefix, i, 0)), errB = issue?.(at(prefix, i, 1));
        const set = (k, v) => onChange(items.map((x, j) => (j === i ? (k === 0 ? [v, x[1]] : [x[0], v]) : x)));
        return <li key={i}>
          <div className="a-pair">
            <label className={errA ? 'has-error' : ''}><span>{labels[0]}</span><input value={a} onChange={(e) => set(0, e.target.value)} aria-invalid={Boolean(errA)} />{errA && <em className="a-error">{errA}</em>}</label>
            <label className={errB ? 'has-error' : ''}><span>{labels[1]}</span><textarea rows={3} value={b} onChange={(e) => set(1, e.target.value)} aria-invalid={Boolean(errB)} />{errB && <em className="a-error">{errB}</em>}</label>
          </div>
          <RowTools i={i} count={items.length} label={`${labels[0].toLowerCase()} ${i + 1}`} onMove={(x, y) => onChange(move(items, x, y))} onRemove={(x) => onChange(removeAt(items, x))} />
        </li>;
      })}
    </ol>
    {items.length < max && <button type="button" className="a-btn" onClick={() => onChange([...items, ['', '']])}><Icon n="plus" /> {addLabel}</button>}
  </fieldset>;
}

async function imageSize(file) {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close?.();
  return size;
}

// An uploaded image ({ key, alt }) with preview, replace/remove and alt text.
export function ImageField({ label, hint, value, onChange, onRemove, defaultAlt = '', error, square }) {
  const { media, addMedia } = useStore();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState(null);
  const input = useRef(null);
  const info = value ? media[value.key] : null;
  const pick = async (file) => {
    if (!file) return;
    setProblem(null);
    if (!/^image\/(webp|png|jpeg)$/.test(file.type)) { setProblem('Choose a WebP, PNG or JPEG image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setProblem('Images can be up to 5 MB.'); return; }
    setBusy(true);
    try {
      const { width, height } = await imageSize(file);
      const form = new FormData();
      form.set('file', file); form.set('width', String(width)); form.set('height', String(height));
      const res = await api('/admin/media', { method: 'POST', form });
      addMedia(res.key, res);
      onChange({ key: res.key, alt: value?.alt || defaultAlt });
    } catch (err) {
      setProblem(err.message || 'Upload failed. Try again.');
    } finally { setBusy(false); if (input.current) input.current.value = ''; }
  };
  return <div className={`a-image ${error || problem ? 'has-error' : ''}`}>
    <div className="a-image-label">{label}</div>
    <div className="a-image-row">
      <div className={`a-thumb ${square ? 'square' : ''}`}>{info?.url ? <img src={info.url} alt="" /> : <Icon n="image" />}</div>
      <div className="a-image-body">
        <div className="a-image-actions">
          <button type="button" className="a-btn" onClick={() => input.current?.click()} disabled={busy}><Icon n="upload" /> {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}</button>
          {value && onRemove && <button type="button" className="a-btn ghost" onClick={onRemove} disabled={busy}>Remove</button>}
          <input ref={input} type="file" accept="image/webp,image/png,image/jpeg" hidden onChange={(e) => pick(e.target.files?.[0])} />
        </div>
        {value && <label className="a-alt"><span>Alt text <small>(describes the image for Google and screen readers)</small></span>
          <input value={value.alt} maxLength={150} onChange={(e) => onChange({ ...value, alt: e.target.value })} /></label>}
        {(problem || error) ? <p className="a-error">{problem || error}</p> : hint ? <p className="a-hint">{hint}{info ? ` · ${info.width}×${info.height}` : ''}</p> : null}
      </div>
    </div>
  </div>;
}

// Sticky bar with Save / Discard for a useDraft() working copy.
export function SaveBar({ d, label = 'changes' }) {
  const { loadContent } = useStore();
  if (!d.isDirty && !d.ok && !d.message) return null;
  return <div className={`a-savebar ${d.message ? 'error' : d.ok && !d.isDirty ? 'ok' : ''}`} role="region" aria-label="Save changes">
    <p>{d.message
      ? <>{d.message}{d.conflict && <> <button type="button" className="a-link" onClick={() => { d.discard(); loadContent(); }}>Reload</button></>}</>
      : d.ok && !d.isDirty ? <>Saved. Press <strong>Publish</strong> (top right) to update the live site.</>
      : <>You have unsaved {label}.</>}</p>
    {d.isDirty && <div>
      <button type="button" className="a-btn ghost" onClick={d.discard} disabled={d.saving}>Discard</button>
      <button type="button" className="a-btn primary" onClick={d.commit} disabled={d.saving}>{d.saving ? 'Saving…' : 'Save'}</button>
    </div>}
  </div>;
}
