import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { PageHead, Icon, when } from '../ui.jsx';

const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

// Every enquiry sent from the contact form, newest first. Netlify Forms also emails each one.
export default function Enquiries() {
  const [state, setState] = useState({ status: 'loading', items: [], hasMore: false });
  const load = useCallback(async (before) => {
    setState((s) => ({ ...s, status: 'loading' }));
    try {
      const data = await api(`/admin/enquiries?limit=50${before ? `&before=${before}` : ''}`);
      setState((s) => ({ status: 'ready', items: before ? s.items.concat(data.enquiries) : data.enquiries, hasMore: data.hasMore }));
    } catch {
      setState((s) => ({ ...s, status: 'error' }));
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  const { status, items, hasMore } = state;
  return <>
    <PageHead title="Enquiries" intro="Everything sent from the contact form, newest first. Netlify still emails each one too.">
      <button type="button" className="a-btn ghost" onClick={() => load()} disabled={status === 'loading'}><Icon n="refresh" />{status === 'loading' ? 'Loading…' : 'Refresh'}</button>
    </PageHead>
    {status === 'error' && <p className="a-notice error" role="alert">Couldn’t load enquiries. Check your connection and refresh.</p>}
    {status === 'ready' && !items.length && <p className="a-muted">No enquiries yet. New ones appear here as soon as they’re sent.</p>}
    <ol className="a-inbox">
      {items.map((q) => <li key={q.id} className="a-card">
        <header>
          <div>
            <h2>{q.name}{q.company && <span> · {q.company}</span>}</h2>
            <a className="a-link" href={`mailto:${q.email}?subject=${encodeURIComponent(`Re: your ${q.engagement.toLowerCase()} enquiry`)}`}>{q.email}</a>
          </div>
          <div className="a-inbox-meta"><span className="a-tag">{q.engagement}</span><time dateTime={q.createdAt}>{when(q.createdAt)}</time></div>
        </header>
        <p className="a-inbox-msg">{q.message}</p>
        {(q.attachment || q.page) && <footer>
          {q.attachment && <a className="a-link" href={q.attachment.url} rel="noopener"><Icon n="doc" />Download {q.attachment.name} ({size(q.attachment.size)})</a>}
          {q.page && <span className="a-muted">Sent from {q.page}</span>}
        </footer>}
      </li>)}
    </ol>
    {hasMore && <button type="button" className="a-btn" onClick={() => load(items[items.length - 1].id)} disabled={status === 'loading'}>Load older enquiries</button>}
  </>;
}
