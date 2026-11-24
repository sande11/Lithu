import { useCallback, useEffect, useState } from 'react';
import { Layout } from '../Layout.jsx';
import { Icon } from '../shared.jsx';
import { API_URL, AUTH_URL } from '../backend.js';

// Staff inbox for enquiries sent from the contact form (Netlify Forms also emails each one).
// Sign-in is Neon Auth. The enquiries API answers only users whose Neon Auth role is "admin":
//   neon neon-auth user set-role <user-id> --roles admin
// The Neon Auth client is loaded on demand, so it never ships with the marketing pages.

let authClient;
const getAuth = () => (authClient ??= import('@neon/auth').then(({ createAuthClient }) => createAuthClient(AUTH_URL)));

// The short-lived JWT the enquiries API verifies. Neon Auth puts it on the session.
async function getToken(auth) {
  const { data } = await auth.getSession();
  const token = data?.session?.token;
  if (token && token.split('.').length === 3) return token;
  const res = await auth.token?.();
  return res?.data?.token ?? null;
}

function authMessage(err) {
  const code = err?.error?.code || err?.code || '';
  if (code === 'INVALID_EMAIL_OR_PASSWORD' || err?.status === 401) return 'That email and password don’t match an account.';
  if (code.startsWith('USER_ALREADY_EXISTS')) return 'An account with this email already exists. Sign in instead.';
  if (code === 'PASSWORD_TOO_SHORT') return 'Use a password of at least 8 characters.';
  if (err?.status === 429) return 'Too many attempts. Wait a minute and try again.';
  return err?.message || 'Something went wrong. Try again.';
}

const when = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function Admin({ route }) {
  const configured = Boolean(API_URL && AUTH_URL);
  const [phase, setPhase] = useState('loading'); // loading | signedOut | signedIn
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('signIn'); // signIn | signUp
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);
  const [inbox, setInbox] = useState({ state: 'idle', items: [], hasMore: false, denied: null });

  const signedOut = () => { setUser(null); setPhase('signedOut'); setInbox({ state: 'idle', items: [], hasMore: false, denied: null }); };

  const load = useCallback(async (before) => {
    setInbox((s) => ({ ...s, state: 'loading' }));
    try {
      const token = await getToken(await getAuth());
      if (!token) return signedOut();
      const res = await fetch(`${API_URL}/admin/enquiries?limit=50${before ? `&before=${before}` : ''}`, { headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json().catch(() => ({}));
      if (res.status === 401) return signedOut();
      if (res.status === 403) return setInbox({ state: 'denied', items: [], hasMore: false, denied: body });
      if (!res.ok) throw new Error(String(res.status));
      setInbox((s) => ({ state: 'ready', items: before ? s.items.concat(body.enquiries) : body.enquiries, hasMore: body.hasMore, denied: null }));
    } catch {
      setInbox((s) => ({ ...s, state: 'error' }));
    }
  }, []);

  // Restore an existing session on load.
  useEffect(() => {
    if (!configured) return;
    let live = true;
    getAuth().then((auth) => auth.getSession())
      .then(({ data }) => { if (!live) return; if (data?.user) { setUser(data.user); setPhase('signedIn'); } else setPhase('signedOut'); })
      .catch(() => { if (live) setPhase('signedOut'); });
    return () => { live = false; };
  }, [configured]);

  useEffect(() => { if (phase === 'signedIn') load(); }, [phase, load]);

  const submit = async (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get('email') || '').trim(), password = String(d.get('password') || ''), name = String(d.get('name') || '').trim();
    if (!email || !password) { setFormError('Enter your email and password.'); return; }
    setBusy(true); setFormError(null);
    try {
      const auth = await getAuth();
      const res = mode === 'signUp'
        ? await auth.signUp.email({ email, password, name: name || email.split('@')[0] })
        : await auth.signIn.email({ email, password });
      if (res?.error) { setFormError(authMessage(res.error)); return; }
      const { data } = await auth.getSession();
      if (!data?.user) { setFormError('You’re signed in, but this browser didn’t keep the session. Allow cookies for this site and try again.'); return; }
      setUser(data.user); setPhase('signedIn');
    } catch (err) {
      setFormError(authMessage(err));
    } finally { setBusy(false); }
  };

  const signOut = async () => {
    setBusy(true);
    try { await (await getAuth()).signOut(); } catch { /* the local session is cleared either way */ }
    setBusy(false); signedOut();
  };

  return <Layout route={route}>
    <section className="page-hero admin-hero">
      <div className="page-hero-inner">
        <div className="page-hero-copy">
          <p className="eyebrow">Staff only</p>
          <h1>Enquiries inbox</h1>
          <p className="hero-sub">Every enquiry sent from the contact form, newest first. Netlify still emails each one too.</p>
        </div>
      </div>
    </section>

    <section className="admin" aria-live="polite">
      {!configured && <p className="form-status error">The Neon backend isn’t configured for this build. Set VITE_NEON_API_URL and VITE_NEON_AUTH_URL (see netlify.toml) and rebuild.</p>}

      {configured && phase === 'loading' && <p className="admin-note">Checking your session…</p>}

      {configured && phase === 'signedOut' && <form className="glass admin-auth" onSubmit={submit} noValidate>
        <h2>{mode === 'signIn' ? 'Sign in' : 'Create a staff account'}</h2>
        {mode === 'signUp' && <label>Name<input name="name" autoComplete="name" /></label>}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'} minLength={8} required /></label>
        {mode === 'signUp' && <p className="admin-note">New accounts can’t see enquiries until the site owner grants them the admin role.</p>}
        {formError && <p className="form-status error" role="alert">{formError}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signIn' ? 'Sign in' : 'Create account'} <Icon n="arrow" /></button>
        <button type="button" className="admin-switch" onClick={() => { setMode(mode === 'signIn' ? 'signUp' : 'signIn'); setFormError(null); }}>
          {mode === 'signIn' ? 'No account yet? Create one' : 'Already have an account? Sign in'}
        </button>
      </form>}

      {configured && phase === 'signedIn' && <>
        <div className="admin-bar">
          <p>Signed in as <strong>{user?.email}</strong></p>
          <div>
            <button type="button" className="btn btn-glass btn-sm" onClick={() => load()} disabled={inbox.state === 'loading'}>{inbox.state === 'loading' ? 'Loading…' : 'Refresh'}</button>
            <button type="button" className="btn btn-glass btn-sm" onClick={signOut} disabled={busy}>Sign out</button>
          </div>
        </div>

        {inbox.state === 'denied' && <div className="glass admin-denied">
          <h2>No admin access yet</h2>
          <p>This account can sign in but isn’t allowed to read enquiries. The site owner can grant access with the Neon CLI:</p>
          <pre><code>neon neon-auth user set-role {inbox.denied?.userId} --roles admin</code></pre>
          <p className="admin-note">Then refresh this page.</p>
        </div>}

        {inbox.state === 'error' && <p className="form-status error" role="alert">Couldn’t load enquiries. Check your connection and refresh.</p>}

        {inbox.state !== 'denied' && inbox.items.length === 0 && inbox.state === 'ready' && <p className="admin-note">No enquiries yet. New ones appear here as soon as they’re sent.</p>}

        {inbox.items.length > 0 && <ol className="inbox">
          {inbox.items.map((q) => <li key={q.id} className="glass inbox-item">
            <header>
              <div>
                <h3>{q.name}{q.company && <span> · {q.company}</span>}</h3>
                <a className="link" href={`mailto:${q.email}?subject=${encodeURIComponent(`Re: your ${q.engagement.toLowerCase()} enquiry`)}`}>{q.email}</a>
              </div>
              <div className="inbox-meta">
                <span className="tag">{q.engagement}</span>
                <time dateTime={q.createdAt}>{when(q.createdAt)}</time>
              </div>
            </header>
            <p className="inbox-msg">{q.message}</p>
            <footer>
              {q.attachment && <a className="link" href={q.attachment.url} rel="noopener">Download {q.attachment.name} ({size(q.attachment.size)}) <Icon n="arrow" /></a>}
              {q.page && <span className="admin-note">Sent from {q.page}</span>}
            </footer>
          </li>)}
        </ol>}

        {inbox.hasMore && <button type="button" className="btn btn-glass" onClick={() => load(inbox.items[inbox.items.length - 1].id)} disabled={inbox.state === 'loading'}>Load older enquiries</button>}
      </>}
    </section>
  </Layout>;
}
