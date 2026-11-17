import { parseQueryRequest, queryRegistry, validResult, type QueryName, type QueryResults } from './queryRegistry';
import { PreviewExpiredError } from './types';

export async function fetchContent<N extends QueryName>(name: N, preview: boolean, signal: AbortSignal, params: Record<string, string> = {}): Promise<QueryResults[N]> {
  parseQueryRequest({ name, params });
  if (!preview) {
    const { publishedClient } = await import('./client');
    const result: unknown = await publishedClient().fetch(queryRegistry[name], params, { signal });
    if (!validResult(name, result)) throw new Error('Invalid content response.');
    return result as QueryResults[N];
  }
  const response = await fetch('/api/preview/content', {
    method: 'POST', credentials: 'same-origin', cache: 'no-store', signal,
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, params }),
  });
  if (response.status === 401) throw new PreviewExpiredError('Re-enter preview from Studio.');
  if (!response.ok) throw new Error('Content could not be loaded.');
  const body: unknown = await response.json();
  if (!body || typeof body !== 'object' || !('result' in body) || !validResult(name, body.result)) {
    throw new Error('Invalid content response.');
  }
  return body.result as QueryResults[N];
}
