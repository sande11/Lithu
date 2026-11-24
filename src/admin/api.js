// Calls to the site API (functions/api) with the signed-in user's token.
import { API_URL } from '../shared/backend.js';
import { getToken } from './auth.js';

export class ApiError extends Error {
  constructor(status, data) {
    super(data?.message || (status === 0 ? 'Couldn’t reach the server. Check your connection.' : `Request failed (${status})`));
    this.status = status;
    this.data = data || {};
  }
}

// Called when the API says the session is gone (401) or the account isn't an admin (403).
let onAuthProblem = () => {};
export const setAuthProblemHandler = (fn) => { onAuthProblem = fn; };

export async function api(path, { method = 'GET', json, form } = {}) {
  const token = await getToken();
  if (!token) { onAuthProblem(401, {}); throw new ApiError(401, { message: 'Your session has ended. Sign in again.' }); }
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}) },
      body: json !== undefined ? JSON.stringify(json) : form,
    });
  } catch {
    throw new ApiError(0);
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) onAuthProblem(res.status, data);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}
