import { phase1Seeds } from '../../scripts/sanity/transform';
import type { QueryResults } from '../../src/sanity/queryRegistry';

// Build the API fixtures from the captured migration source; adapters still
// validate every field at runtime, including intentionally malformed variants.
export function projectQueries() {
  const seeds = phase1Seeds();
  const ids = new Map(seeds.map(seed => [seed.sourceKey, seed.singletonId ?? `id-${seed.sourceKey}`]));
  const docs = seeds.map(seed => ({ ...seed.build(ids), _id: ids.get(seed.sourceKey)!, _rev: 'revision-1' }));
  const projects = docs.filter(doc => doc._type === 'project');
  return {
    archive: { settings: docs.filter(doc => doc._type === 'workPage'), disciplines: docs.filter(doc => doc._type === 'discipline'),
      projects: projects.map(project => ({ ...project, disciplineIds: (project.disciplines as { _ref: string }[]).map(ref => ref._ref) })) } as unknown as QueryResults['workArchive'],
    detail: { order: projects.map(project => ({ _id: project._id })), projects: projects.filter(project => project.detailEnabled) } as unknown as QueryResults['projectPage'],
  };
}
