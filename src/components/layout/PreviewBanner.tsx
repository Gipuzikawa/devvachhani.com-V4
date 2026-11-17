import { usePreview } from '../../sanity/PreviewProvider';
import { useContent } from '../../sanity/ContentProvider';
import { ContentState } from '../ui/ContentState';

function DisciplineCheck() {
  const result = useContent('disciplines');
  const { refresh } = usePreview();
  return <details><summary>Phase 0: discipline draft check</summary>
    <ContentState result={result} retry={refresh} />
    {(result.status === 'ready' || result.status === 'incomplete') && <ul>
      {result.data.map(item => <li key={item._id}>{item.label || 'Untitled discipline'} ({item.sourceKey || 'missing source key'})</li>)}
    </ul>}
    <p>The portfolio pages still use static content until their migration phases.</p>
  </details>;
}
export function PreviewBanner() {
  const { status, dataset, refresh, exit } = usePreview();
  if (status === 'public') return null;
  return <aside aria-label="Content preview" style={{ position: 'relative', zIndex: 100,
    padding: 'var(--space-4, 1rem)', background: 'var(--accent-wash)', color: 'var(--text-strong)',
    borderBottom: '1px solid var(--border-accent)' }}>
    <strong>{status === 'active' ? `Draft preview · ${dataset}` : status === 'expired' ?
      'Preview expired — re-enter from Studio.' : status === 'error' ? 'Preview could not be verified.' : 'Checking preview…'}</strong>
    {' '}<button type="button" onClick={refresh}>Refresh</button>{' '}
    <button type="button" onClick={() => { void exit(); }}>Exit preview</button>
    {status === 'active' && <DisciplineCheck />}
  </aside>;
}
