// Admin data: the editable content (with versions), image links and the dashboard summary,
// loaded once and shared by every page. Also tracks unsaved edits so navigation can warn.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError } from './api.js';
import { contentSchemas, issueList } from '../shared/content-schema.js';

const Store = createContext(null);
export const useStore = () => useContext(Store);

export function StoreProvider({ children }) {
  const [content, setContent] = useState(null); // { stack: { value, version, updatedAt, updatedBy }, … }
  const [media, setMedia] = useState({}); // key -> { url, width, height, … }
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const dirty = useRef(new Set());

  const loadContent = useCallback(async () => {
    try {
      const data = await api('/admin/content');
      setContent(data.content); setMedia((m) => ({ ...m, ...data.media })); setError(null);
    } catch (err) { setError(err.message); }
  }, []);
  const loadSummary = useCallback(async () => {
    try { setSummary(await api('/admin/summary')); } catch { /* the dashboard shows what it has */ }
  }, []);
  useEffect(() => { loadContent(); loadSummary(); }, [loadContent, loadSummary]);

  // Validate locally (same rules as the API), then save. Returns { ok, issues?, message? }.
  const save = useCallback(async (key, value) => {
    const parsed = contentSchemas[key].safeParse(value);
    if (!parsed.success) return { ok: false, issues: issueList(parsed.error), message: 'Fix the highlighted fields, then save again.' };
    try {
      const res = await api(`/admin/content/${key}`, { method: 'PUT', json: { value: parsed.data, version: content[key].version } });
      setContent((c) => ({ ...c, [key]: { ...c[key], value: res.value, version: res.version, updatedAt: res.updatedAt } }));
      loadSummary();
      return { ok: true };
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) return { ok: false, issues: err.data.issues || [], message: err.data.issues?.find((i) => !i.path)?.message || 'Fix the highlighted fields, then save again.' };
      return { ok: false, issues: [], message: err.message, conflict: err.status === 409 };
    }
  }, [content, loadSummary]);

  const addMedia = useCallback((key, info) => setMedia((m) => ({ ...m, [key]: info })), []);
  const setDirty = useCallback((key, on) => { if (on) dirty.current.add(key); else dirty.current.delete(key); }, []);
  const hasDirty = useCallback(() => dirty.current.size > 0, []);

  useEffect(() => {
    const warn = (e) => { if (dirty.current.size) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  const value = useMemo(() => ({ content, media, summary, error, save, loadContent, loadSummary, addMedia, setDirty, hasDirty }),
    [content, media, summary, error, save, loadContent, loadSummary, addMedia, setDirty, hasDirty]);
  return <Store.Provider value={value}>{children}</Store.Provider>;
}

// A page's working copy of one content key: edit freely, then save or discard.
export function useDraft(key) {
  const { content, save, setDirty } = useStore();
  const saved = content?.[key]?.value;
  const [draft, setDraft] = useState(saved);
  const [state, setState] = useState({ saving: false, issues: [], message: null, ok: false });
  const savedJson = useMemo(() => JSON.stringify(saved), [saved]);
  useEffect(() => { setDraft(saved); }, [savedJson]); // eslint-disable-line react-hooks/exhaustive-deps
  const isDirty = draft !== undefined && JSON.stringify(draft) !== savedJson;
  useEffect(() => { setDirty(key, isDirty); return () => setDirty(key, false); }, [key, isDirty, setDirty]);
  const update = (fn) => { setDraft((d) => (typeof fn === 'function' ? fn(structuredClone(d)) : fn)); setState((s) => ({ ...s, ok: false })); };
  const commit = async () => {
    setState({ saving: true, issues: [], message: null, ok: false });
    const res = await save(key, draft);
    setState({ saving: false, issues: res.issues || [], message: res.ok ? null : res.message, ok: res.ok, conflict: res.conflict });
    return res.ok;
  };
  const discard = () => { setDraft(saved); setState({ saving: false, issues: [], message: null, ok: false }); };
  // Error for a field path ("3.name"), or for anything under it with { under: true }.
  const issue = (path, { under = false } = {}) => state.issues.find((i) => i.path === path || (under && i.path.startsWith(`${path}.`)))?.message;
  return { draft, update, isDirty, commit, discard, issue, ...state, meta: content?.[key] };
}
