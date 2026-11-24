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

// The password email links to /admin/?token=… (or ?error=INVALID_TOKEN once the link has expired
// or been used). Read it once on load, then take it out of the address bar and history.
const PASSWORD_LINK = (() => {
  const q = new URLSearchParams(window.location.search);
  const link = q.get('token') ? { token: q.get('token') } : q.get('error') ? { error: q.get('error') } : null;
  if (link) window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  return link;
})();

export default function App() {
  const configured = Boolean(API_URL && AUTH_URL);
  const [phase, setPhase] = useState('loading'); // loading | signedOut | denied | ready
  const [user, setUser] = useState(null);
  const [denied, setDenied] = useState(null);
  const [resetToken, setResetToken] = useState(PASSWORD_LINK?.token ?? null);
  const [notice, setNotice] = useState(PASSWORD_LINK?.error ? 'expired' : null); // expired | passwordSet

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
  if (resetToken) return <SetPassword token={resetToken}
    onDone={() => { setResetToken(null); setNotice('passwordSet'); }} onExpired={() => { setResetToken(null); setNotice('expired'); }} />;
  if (phase === 'loading') return <Centered><p className="a-muted">Checking your session…</p></Centered>;
  if (phase === 'signedOut') return <SignIn onSignedIn={enter} notice={notice} />;
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

// Sign-in only: there is no sign-up. The site owner creates staff accounts with the Neon CLI
// (see DESIGN.md › Admin accounts) and sign-up is switched off in Neon Auth itself, not just
// hidden here. A new account has no password, so "Set or reset your password" emails a link.
function SignIn({ onSignedIn, notice }) {
  const [view, setView] = useState(notice === 'expired' ? 'forgot' : 'signIn'); // signIn | forgot | sent
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sentTo, setSentTo] = useState('');
  const show = (v) => { setView(v); setError(null); };
  const requestLink = async (e) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') || '').trim();
    if (!email) { setError('Enter your email.'); return; }
    setBusy(true); setError(null);
    try {
      const res = await (await getAuth()).requestPasswordReset({ email, redirectTo: `${window.location.origin}/admin/` });
      if (res?.error) { setError(authMessage(res.error)); return; }
      setSentTo(email); setView('sent');
    } catch (err) { setError(authMessage(err)); } finally { setBusy(false); }
  };
  if (view === 'sent') return <Centered>
    <h1>Check your email</h1>
    <p>If {sentTo} has a staff account, a link to set your password is on its way. It works once, for one hour.</p>
    <button type="button" className="a-link" onClick={() => show('signIn')}>Back to sign in</button>
  </Centered>;
  if (view === 'forgot') return <Centered>
    <h1>Set or reset your password</h1>
    {notice === 'expired' && <p className="a-notice warn">That link has expired or was already used. Request a new one.</p>}
    <p className="a-muted">New staff account, or forgot your password? Enter your email and we’ll send you a link to choose one.</p>
    <form className="a-form" onSubmit={requestLink} noValidate>
      <label className="a-field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      {error && <p className="a-notice error" role="alert">{error}</p>}
      <button className="a-btn primary wide" type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Email me a link'}</button>
    </form>
    <button type="button" className="a-link" onClick={() => show('signIn')}>Back to sign in</button>
  </Centered>;
  const submit = async (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get('email') || '').trim(), password = String(d.get('password') || '');
    if (!email || !password) { setError('Enter your email and password.'); return; }
    setBusy(true); setError(null);
    try {
      const auth = await getAuth();
      const res = await auth.signIn.email({ email, password });
      if (res?.error) { setError(authMessage(res.error)); return; }
      const { data } = await auth.getSession();
      if (!data?.user) { setError('You’re signed in, but this browser didn’t keep the session. Allow cookies for this site and try again.'); return; }
      await onSignedIn(data.user);
    } catch (err) { setError(authMessage(err)); } finally { setBusy(false); }
  };
  return <Centered>
    <h1>Sign in</h1>
    {notice === 'passwordSet' && <p className="a-notice ok" role="status">Password set. Sign in with your new password.</p>}
    <form className="a-form" onSubmit={submit} noValidate>
      <label className="a-field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      <label className="a-field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="a-notice error" role="alert">{error}</p>}
      <button className="a-btn primary wide" type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Sign in'}</button>
    </form>
    <button type="button" className="a-link" onClick={() => show('forgot')}>Set or reset your password</button>
    <p className="a-hint">Staff accounts are created by the site owner. Ask them if you need access.</p>
  </Centered>;
}

// Opened from the password email: choose a password for this account.
function SetPassword({ token, onDone, onExpired }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const password = String(d.get('password') || ''), again = String(d.get('again') || '');
    if (password.length < 8) { setError('Use a password of at least 8 characters.'); return; }
    if (password !== again) { setError('The two passwords don’t match.'); return; }
    setBusy(true); setError(null);
    try {
      const res = await (await getAuth()).resetPassword({ newPassword: password, token });
      if (res?.error?.code === 'INVALID_TOKEN') { onExpired(); return; }
      if (res?.error) { setError(authMessage(res.error)); return; }
      onDone();
    } catch (err) { setError(authMessage(err)); } finally { setBusy(false); }
  };
  return <Centered>
    <h1>Choose a password</h1>
    <form className="a-form" onSubmit={submit} noValidate>
      <label className="a-field"><span>New password</span><input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
      <label className="a-field"><span>Type it again</span><input name="again" type="password" autoComplete="new-password" minLength={8} required /></label>
      <p className="a-hint">At least 8 characters. A long phrase is easiest to remember.</p>
      {error && <p className="a-notice error" role="alert">{error}</p>}
      <button className="a-btn primary wide" type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Set password'}</button>
    </form>
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
        ? { tone: 'warn', text: 'Publishing isn’t set up yet. Create a build hook in Netlify (Project configuration › Build & deploy › Continuous deployment › Build hooks), add it as NETLIFY_BUILD_HOOK_URL in .env.local and run npm run neon:deploy. Until then, changes go live with the next Netlify deploy.' }
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
