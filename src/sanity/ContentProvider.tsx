import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { usePreview } from './PreviewProvider';
import { fetchContent } from './transport';
import { PreviewExpiredError, type ContentResult } from './types';
import type { QueryName, QueryResults } from './queryRegistry';
import { publicConfig } from './environment';

type Transport = typeof fetchContent;
const TransportContext = createContext<Transport>(fetchContent);
export function ContentProvider({ children, transport = fetchContent }: { children: ReactNode; transport?: Transport }) {
  return <TransportContext.Provider value={transport}>{children}</TransportContext.Provider>;
}

export function useContent<N extends QueryName>(name: N): ContentResult<QueryResults[N]> {
  const preview = usePreview();
  const location = useLocation();
  const transport = useContext(TransportContext);
  const config = publicConfig();
  const key = JSON.stringify([config?.projectId, config?.dataset, preview.status, preview.revision, location.key, name]);
  const [snapshot, setSnapshot] = useState<{ key: string; result: ContentResult<QueryResults[N]> }>();
  const canFetch = preview.status === 'active' || preview.status === 'public';
  useEffect(() => {
    setSnapshot(undefined);
    if (!canFetch) return;
    const controller = new AbortController();
    let current = true;
    transport(name, preview.status === 'active', controller.signal).then(data => {
      if (!current) return;
      const incomplete = data.some(item => !item.label || !item.sourceKey || typeof item.sortOrder !== 'number');
      setSnapshot({ key, result: data.length === 0 ? { status: 'empty' } :
        incomplete && preview.status === 'active' ? { status: 'incomplete', data } : { status: 'ready', data } });
    }).catch(error => {
      if (!current) return;
      if (error instanceof PreviewExpiredError) preview.expire();
      setSnapshot({ key, result: { status: 'error', message: 'Content could not be loaded. Please retry.' } });
    });
    return () => { current = false; controller.abort(); };
    // The key includes every content identity and preview refresh boundary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, transport, canFetch]);
  return useMemo(() => {
    if (preview.status === 'expired') return { status: 'error', message: 'Preview expired. Re-enter from Studio.' };
    if (preview.status === 'error') return { status: 'error', message: 'Preview could not be verified.' };
    return snapshot?.key === key ? snapshot.result : { status: 'loading' };
  }, [key, snapshot, preview.status]);
}
