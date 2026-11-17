import { queryRegistry, type QueryName, type QueryResults } from './queryRegistry';
import { PreviewExpiredError } from './types';

export async function fetchContent<N extends QueryName>(name: N, preview: boolean, signal: AbortSignal): Promise<QueryResults[N]> {
  if (!preview) {
    const { publishedClient } = await import('./client');
    return publishedClient().fetch(queryRegistry[name], {}, { signal });
  }
  const response = await fetch('/api/preview/content', {
    method: 'POST', credentials: 'same-origin', cache: 'no-store', signal,
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, params: {} }),
  });
  if (response.status === 401) throw new PreviewExpiredError('Re-enter preview from Studio.');
  if (!response.ok) throw new Error('Content could not be loaded.');
  const body: unknown = await response.json();
  if (!body || typeof body !== 'object' || !('result' in body) || !Array.isArray(body.result)) {
    throw new Error('Invalid content response.');
  }
  return body.result as QueryResults[N];
}
