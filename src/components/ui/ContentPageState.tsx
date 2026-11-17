import { ContentState } from './ContentState';
import type { ContentResult } from '../../sanity/types';

export function ContentPageState({ result, retry }: { result: ContentResult<unknown>; retry: () => void }) {
  return <main style={{ padding: 'clamp(56px,9vh,110px) var(--page-margin)', maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
    <ContentState result={result} retry={retry} emptyMessage="No content is available yet."
      incompleteMessage="Incomplete draft — complete the page fields in Studio, then refresh preview." />
  </main>;
}
