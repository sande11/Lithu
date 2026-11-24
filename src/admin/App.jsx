// The admin app: sign-in gate, then the shell (sidebar, publish button) around the pages.
// Routes live in the URL hash (#/products), so the app is one static file at /admin/.
import { useCallback, useEffect, useState } from 'react';
import { API_URL, AUTH_URL } from '../shared/backend.js';
import { getAuth, authMessage } from './auth.js';
import { api, setAuthProblemHandler } from './api.js';
import { StoreProvider, useStore } from './store.jsx';
import { Icon, ago } from './ui.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Stack from './pages/Stack.jsx';
import Hours from './pages/Hours.jsx';
import Products from './pages/Products.jsx';
import Services from './pages/Services.jsx';
import Enquiries from './pages/Enquiries.jsx';

export const ROUTES = [
  { path: '', label: 'Dashboard', icon: 'grid', Page: Dashboard },
  { path: 'stack', label: 'Tech stack', icon: 'code', Page: Stack },
  { path: 'hours', label: 'Working hours', icon: 'clock', Page: Hours },
  { path: 'products', label: 'Products', icon: 'box', Page: Products },
  { path: 'services', label: 'Services', icon: 'layers', Page: Services },
  { path: 'enquiries', label: 'Enquiries', icon: 'inbox', Page: Enquiries },
];

const readHash = () => window.location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
function useHash() {
  const [parts, setParts] = useState(readHash);
  useEffect(() => {
    const on = () => { setParts(readHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return parts;
}

export default function App() {
  const configured = Boolean(API_URL && AUTH_URL);
  const [phase, setPhase] = useState('loading'); // loading | signedOut | denied | ready
  const [user, setUser] = useState(null);
  const [denied, setDenied] = useState(null);

  const signedOut = useCallback(() => { setUser(null); setPhase('signedOut'); }, []);
  useEffect(() => {
    setAuthProblemHandler((status, data) => {
      if (status === 401) signedOut();
      if (status === 403) { setDenied(data); setPhase('denied'); }
    });
  }, [signedOut]);

  // Restore an existing session, then check the account is an admin.
  const enter = useCallback(async (u) => {
    setUser(u);
    try { await api('/admin/summary'); setPhase('ready'); } catch (err) { if (err.status !== 401 && err.status !== 403) setPhase('ready'); }
  }, []);
  useEffect(() => {
    if (!configured) return;
    getAuth().then((a) => a.getSession())
      .then(({ data }) => (data?.user ? enter(data.user) : setPhase('signedOut')))
      .catch(() => setPhase('signedOut'));
  }, [configured, enter]);

  const signOut = async () => {
    try { await (await getAuth()).signOut(); } catch { /* the local session is cleared either way */ }
    signedOut();
  };

  if (!configured) return <Centered><h1>Admin not configured</h1><p>This build has no Neon API address. Set VITE_NEON_API_URL and VITE_NEON_AUTH_URL (see netlify.toml) and rebuild.</p></Centered>;
  if (phase === 'loading') return <Centered><p className="a-muted">Checking your session…</p></Centered>;
  if (phase === 'signedOut') return <SignIn onSignedIn={enter} />;
  if (phase === 'denied') return <Centered>
    <h1>No admin access yet</h1>
    <p>{denied?.email || user?.email} can sign in but isn’t allowed into the admin. The site owner can grant access with the Neon CLI:</p>
    <pre><code>neon neon-auth user set-role {denied?.userId} --roles admin</code></pre>
    <div className="a-row"><button type="button" className="a-btn primary" onClick={() => window.location.reload()}>I’ve been given access</button><button type="button" className="a-btn ghost" onClick={signOut}>Sign out</button></div>
  </Centered>;
  return <StoreProvider><Shell user={user} onSignOut={signOut} /></StoreProvider>;
}

const Brand = () => <a className="a-brand" href="#/"><img src="/icon-192.png" alt="" width="28" height="28" /><span>Sande<b> admin</b></span></a>;

function Centered({ children }) {
  return <main className="a-center"><div className="a-card a-center-card"><Brand />{children}</div></main>;
}

function SignIn({ onSignedIn }) {
  const [mode, setMode] = useState('signIn');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get('email') || '').trim(), password = String(d.get('password') || ''), name = String(d.get('name') || '').trim();
    if (!email || !password) { setError('Enter your email and password.'); return; }
    setBusy(true); setError(null);
    try {
      const auth = await getAuth();
      const res = mode === 'signUp' ? await auth.signUp.email({ email, password, name: name || email.split('@')[0] }) : await auth.signIn.email({ email, password });
      if (res?.error) { setError(authMessage(res.error)); return; }
      const { data } = await auth.getSession();
      if (!data?.user) { setError('You’re signed in, but this browser didn’t keep the session. Allow cookies for this site and try again.'); return; }
      await onSignedIn(data.user);
    } catch (err) { setError(authMessage(err)); } finally { setBusy(false); }
  };
  return <Centered>
    <h1>{mode === 'signIn' ? 'Sign in' : 'Create a staff account'}</h1>
    <form className="a-form" onSubmit={submit} noValidate>
      {mode === 'signUp' && <label className="a-field"><span>Name</span><input name="name" autoComplete="name" /></label>}
      <label className="a-field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      <label className="a-field"><span>Password</span><input name="password" type="password" autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'} minLength={8} required /></label>
      {mode === 'signUp' && <p className="a-hint">New accounts can’t open the admin until the site owner grants them the admin role.</p>}
      {error && <p className="a-notice error" role="alert">{error}</p>}
      <button className="a-btn primary wide" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signIn' ? 'Sign in' : 'Create account'}</button>
    </form>
    <button type="button" className="a-link" onClick={() => { setMode(mode === 'signIn' ? 'signUp' : 'signIn'); setError(null); }}>
      {mode === 'signIn' ? 'No account yet? Create one' : 'Already have an account? Sign in'}
    </button>
  </Centered>;
}

function Shell({ user, onSignOut }) {
  const [section, ...rest] = useHash();
  const route = ROUTES.find((r) => r.path === section) || ROUTES[0];
  const [menu, setMenu] = useState(false);
  const { hasDirty, content, error } = useStore();
  const guard = (e) => {
    if (hasDirty() && !window.confirm('You have unsaved changes on this page. Leave without saving?')) e.preventDefault();
    else setMenu(false);
  };
  const Page = route.Page;
  return <div className={`a-shell ${menu ? 'menu-open' : ''}`}>
    <aside className="a-side">
      <Brand />
      <nav aria-label="Admin">
        {ROUTES.map((r) => <a key={r.path} href={`#/${r.path}`} className={r === route ? 'on' : ''} aria-current={r === route ? 'page' : undefined} onClick={guard}><Icon n={r.icon} />{r.label}</a>)}
      </nav>
      <div className="a-side-foot">
        <a href="/" target="_blank" rel="noopener"><Icon n="external" />View the live site</a>
        <p title={user?.email}>{user?.email}</p>
        <button type="button" className="a-link" onClick={onSignOut}><Icon n="logout" />Sign out</button>
      </div>
    </aside>
    <div className="a-main">
      <div className="a-top">
        <button type="button" className="a-icon-btn a-menu" onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}><Icon n={menu ? 'x' : 'menu'} /></button>
        <PublishButton />
      </div>
      <main className="a-page">
        {error && <p className="a-notice error" role="alert">Couldn’t load the site content: {error}</p>}
        {route.path && route.path !== 'enquiries' && !content ? <p className="a-muted">Loading…</p> : <Page params={rest} />}
      </main>
    </div>
  </div>;
}

function PublishButton() {
  const { summary, loadSummary } = useStore();
  const [state, setState] = useState(null); // { tone, text }
  const [busy, setBusy] = useState(false);
  const pending = summary?.publish?.pending;
  const publish = async () => {
    setBusy(true); setState(null);
    try {
      await api('/admin/publish', { method: 'POST' });
      setState({ tone: 'ok', text: 'Publishing. The live site updates in about 2 minutes.' });
      loadSummary();
    } catch (err) {
      setState(err.status === 501
        ? { tone: 'warn', text: 'Publishing isn’t set up yet. Create a build hook in Netlify (Site configuration › Build & deploy › Build hooks), add it as NETLIFY_BUILD_HOOK_URL in .env.local and run npm run neon:deploy. Until then, changes go live with the next Netlify deploy.' }
        : { tone: 'error', text: err.data?.detail || err.message });
    } finally { setBusy(false); }
  };
  const last = summary?.publish?.last;
  return <div className="a-publish">
    <span className={`a-pubstate ${pending ? 'pending' : ''}`}>{pending ? 'Unpublished changes' : last?.ok ? `Published ${ago(last.at)}` : 'Live site up to date'}</span>
    <button type="button" className={`a-btn ${pending ? 'primary' : ''}`} onClick={publish} disabled={busy}><Icon n="rocket" />{busy ? 'Publishing…' : 'Publish'}</button>
    {state && <div className={`a-pubmsg a-notice ${state.tone}`} role="status">{state.text}<button type="button" className="a-icon-btn" onClick={() => setState(null)} aria-label="Dismiss"><Icon n="x" /></button></div>}
  </div>;
}
