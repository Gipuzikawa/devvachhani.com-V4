import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { publicConfig } from './environment';

export type PreviewStatus = 'public' | 'checking' | 'active' | 'expired' | 'error' | 'exiting';
type PreviewContextValue = {
  status: PreviewStatus; dataset?: string; revision: number;
  refresh: () => void; expire: () => void; exit: () => Promise<void>;
};
const PreviewContext = createContext<PreviewContextValue | null>(null);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const configured = Boolean(publicConfig());
  const [status, setStatus] = useState<PreviewStatus>(configured ? 'checking' : 'public');
  const [dataset, setDataset] = useState<string>();
  const [expiresAt, setExpiresAt] = useState(0);
  const [revision, setRevision] = useState(0);
  const [sessionCheck, setSessionCheck] = useState(0);
  const epoch = useRef(0);
  const refresh = useCallback(() => {
    setStatus(value => value === 'active' || value === 'public' || value === 'exiting' ? value : 'checking');
    setRevision(value => value + 1); setSessionCheck(value => value + 1);
  }, []);
  const expire = useCallback(() => { epoch.current++; setStatus('expired'); setRevision(value => value + 1); }, []);

  useEffect(() => {
    if (!configured || status === 'expired' || status === 'exiting') return;
    const controller = new AbortController();
    const current = ++epoch.current;
    fetch('/api/preview/session', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (response.status === 401) return { status: 'expired' as const };
        if (!response.ok) throw new Error('Session unavailable');
        const body: unknown = await response.json();
        if (!body || typeof body !== 'object' || !('active' in body) || typeof body.active !== 'boolean') {
          throw new Error('Invalid session');
        }
        if (body.active && (!('expiresAt' in body) || typeof body.expiresAt !== 'number' || body.expiresAt <= Date.now() ||
          !('projectId' in body) || body.projectId !== publicConfig()?.projectId ||
          !('dataset' in body) || body.dataset !== publicConfig()?.dataset)) throw new Error('Invalid session binding');
        return { status: body.active ? 'active' as const : 'public' as const,
          dataset: 'dataset' in body && typeof body.dataset === 'string' ? body.dataset : undefined,
          expiresAt: 'expiresAt' in body && typeof body.expiresAt === 'number' ? body.expiresAt : 0 };
      }).then(result => {
        if (current !== epoch.current || controller.signal.aborted) return;
        if (result.status === 'active' && result.dataset !== publicConfig()?.dataset) { setStatus('error'); return; }
        setDataset(result.dataset); setExpiresAt(result.expiresAt ?? 0); setStatus(result.status);
      }).catch(() => { if (!controller.signal.aborted && current === epoch.current) setStatus('error'); });
    return () => controller.abort();
    // Session polling is separate from content refresh, so it cannot replay page motion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, sessionCheck]);

  useEffect(() => {
    if (status === 'public' || !configured) return;
    const meta = document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex, nofollow';
    document.head.append(meta);
    return () => meta.remove();
  }, [status, configured]);

  useEffect(() => {
    if (status !== 'active') return;
    const onFocus = () => setSessionCheck(value => value + 1);
    const interval = window.setInterval(onFocus, 60_000);
    const expiry = window.setTimeout(expire, Math.max(0, expiresAt - Date.now()));
    window.addEventListener('focus', onFocus);
    return () => { window.clearTimeout(expiry); window.clearInterval(interval); window.removeEventListener('focus', onFocus); };
  }, [status, refresh, expire, expiresAt]);

  const exit = useCallback(async () => {
    // Clear mounted draft state immediately, including when the exit request fails.
    epoch.current++; setStatus('exiting'); setRevision(value => value + 1);
    try {
      const response = await fetch('/api/preview/disable', { method: 'POST', credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) throw new Error('Exit failed');
      window.location.reload();
    } catch { setStatus('error'); }
  }, []);
  return <PreviewContext.Provider value={{ status, dataset, revision, refresh, expire, exit }}>{children}</PreviewContext.Provider>;
}

export function usePreview() {
  const value = useContext(PreviewContext);
  if (!value) throw new Error('PreviewProvider is missing');
  return value;
}
