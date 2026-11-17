import type { ContentResult } from '../../sanity/types';

export function ContentState({ result, retry }: { result: ContentResult<unknown>; retry: () => void }) {
  if (result.status === 'ready') return null;
  const text = result.status === 'loading' ? 'Loading content…' :
    result.status === 'error' ? result.message : result.status === 'empty' ?
      'No disciplines found. Create an unpublished discipline in Studio to check draft preview.' :
      'Incomplete draft — fill in the missing discipline fields in Studio.';
  return <div role={result.status === 'error' ? 'alert' : 'status'}>
    <p>{text}</p>{result.status === 'error' && <button type="button" onClick={retry}>Retry</button>}
  </div>;
}
