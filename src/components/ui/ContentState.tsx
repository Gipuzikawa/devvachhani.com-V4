import type { ContentResult } from '../../sanity/types';

export function ContentState({ result, retry, emptyMessage, incompleteMessage }: { result: ContentResult<unknown>; retry: () => void; emptyMessage?: string; incompleteMessage?: string }) {
  if (result.status === 'ready') return null;
  const text = result.status === 'loading' ? 'Loading content…' :
    result.status === 'error' ? result.message : result.status === 'empty' ?
      emptyMessage ?? 'No disciplines found. Create an unpublished discipline in Studio to check draft preview.' :
      incompleteMessage ?? 'Incomplete draft — fill in the missing discipline fields in Studio.';
  return <div role={result.status === 'error' ? 'alert' : 'status'}>
    <p>{text}</p>{result.status === 'error' && <button type="button" onClick={retry}>Retry</button>}
  </div>;
}
