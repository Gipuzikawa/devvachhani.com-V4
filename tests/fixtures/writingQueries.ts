import { phase2Seeds } from '../../scripts/sanity/writingTransform';
import type { QueryResults } from '../../src/sanity/queryRegistry';

export function writingQueries() {
  const docs = phase2Seeds().map(seed => ({ ...seed.build(new Map()), _id: seed.singletonId ?? 'article-id', _rev: 'revision-1' }));
  return {
    index: { settings: docs.filter(doc => doc._type === 'writingPage'), articles: docs.filter(doc => doc._type === 'article') } as unknown as QueryResults['writingIndex'],
    detail: docs.filter(doc => doc._type === 'article') as unknown as QueryResults['articlePage'],
  };
}
