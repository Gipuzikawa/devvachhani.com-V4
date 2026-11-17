import { createHash } from 'node:crypto';
import type { FigureData } from '../../src/types';
import { phase1Source } from './source';

export type Body = Record<string, unknown> & { _type: string; sourceKey: string };
export type Seed = { sourceKey: string; type: string; singletonId?: string; dependencies: string[]; build: (ids: ReadonlyMap<string, string>) => Body };
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => `${JSON.stringify(key)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
export const fingerprint = (value: unknown) => createHash('sha256').update(canonical(value)).digest('hex');
export const stableKey = (value: string) => `k${fingerprint(value).slice(0, 20)}`;
function figure(value: FigureData) {
  if (value.src) throw new Error('A source image needs an asset upload mapping before import.');
  return { _type: 'figure', mode: 'placeholder', caption: value.title, aspect: value.aspect ?? 1.5 };
}
export function phase1Seeds(source = phase1Source): Seed[] {
  const disciplines: Seed[] = source.disciplines.map((label, sortOrder) => ({
    sourceKey: `discipline-${label.toLowerCase()}`, type: 'discipline', dependencies: [],
    build: () => ({ _type: 'discipline', sourceKey: `discipline-${label.toLowerCase()}`, label, sortOrder }),
  }));
  const keys: Record<string, string> = { '01': 'project-rc-f35-vtol', '02': 'project-guest-registration', '03': 'project-dcs-companion' };
  if (source.projects.length !== Object.keys(keys).length || new Set(source.projects.map(item => item.index)).size !== source.projects.length) throw new Error('Review project source-key mapping before importing changed inventory.');
  const projects: Seed[] = source.projects.map((card, sortOrder) => {
    const sourceKey = keys[card.index];
    if (!sourceKey) throw new Error('Unknown project source key.');
    const detail = card.slug ? source.projectDetails.find(item => item.slug === card.slug) : undefined;
    const memberships = source.disciplines.filter(label => card.tags?.some(tag => source.disciplineTags[label].includes(tag)));
    if (!memberships.length) throw new Error('Project has no discipline mapping.');
    const dependencies = memberships.map(label => `discipline-${label.toLowerCase()}`);
    return { sourceKey, type: 'project', dependencies, build: ids => ({
      _type: 'project', sourceKey, title: card.title, summary: card.summary,
      ...(card.slug ? { slug: { _type: 'slug', current: card.slug } } : {}),
      ...(detail?.year || card.year ? { year: detail?.year ?? card.year } : {}), tags: card.tags ?? [], sortOrder,
      contentStatus: detail?.status ?? 'live', detailEnabled: Boolean(detail),
      disciplines: dependencies.map(key => {
        const id = ids.get(key); if (!id) throw new Error('Unresolved discipline reference.');
        return { _type: 'reference', _key: stableKey(key), _ref: id };
      }),
      ...(detail ? { detail: {
        _type: 'projectDetail', intro: detail.intro, skills: detail.skills,
        toolGroups: detail.toolGroups.map(group => ({ _type: 'toolGroup', _key: stableKey(group.label), ...group })),
        milestones: detail.milestones.map(item => ({ ...item, _type: 'projectMilestone',
          _key: stableKey(`${item.date}:${item.title}`), figure: figure(item.figure) })),
        finalFigure: figure(detail.finalFigure),
        specifications: detail.specs.map(item => ({ _type: 'specification', _key: stableKey(item.k), label: item.k, value: item.v })),
        reflections: { _type: 'reflections', ...detail.reflections }, ...source.detailHeadings,
      } } : {}),
    }) };
  });
  return [...disciplines, ...projects, { sourceKey: 'work-page', type: 'workPage', singletonId: 'workPage', dependencies: [],
    build: () => ({ _type: 'workPage', sourceKey: 'work-page', ...source.workPage }) }];
}
