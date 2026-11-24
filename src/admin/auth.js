// Neon Auth (Managed Better Auth) for the admin. The client is loaded on first use.
import { AUTH_URL } from '../shared/backend.js';

let client;
export const getAuth = () => (client ??= import('@neon/auth').then(({ createAuthClient }) => createAuthClient(AUTH_URL)));

// The short-lived JWT the API verifies. Neon Auth puts it on the session.
export async function getToken() {
  const auth = await getAuth();
  const { data } = await auth.getSession();
  const token = data?.session?.token;
  if (token && token.split('.').length === 3) return token;
  const res = await auth.token?.();
  return res?.data?.token ?? null;
}

export function authMessage(err) {
  const code = err?.error?.code || err?.code || '';
  if (code === 'INVALID_EMAIL_OR_PASSWORD' || err?.status === 401) return 'That email and password don’t match an account.';
  if (code === 'INVALID_ORIGIN') return `Sign-in isn’t allowed from ${window.location.host} yet. Add it with: neon neon-auth domain add ${window.location.origin}`;
  if (code === 'PASSWORD_TOO_SHORT') return 'Use a password of at least 8 characters.';
  if (code === 'PASSWORD_TOO_LONG') return 'That password is too long. Use 128 characters or fewer.';
  if (code === 'INVALID_TOKEN') return 'That link has expired or was already used. Request a new one.';
  if (err?.status === 429) return 'Too many attempts. Wait a minute and try again.';
  return err?.message || 'Something went wrong. Try again.';
}
