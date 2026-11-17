import { afterEach, describe, expect, it, vi } from 'vitest';
import { adaptArchive, adaptProject } from '../src/sanity/projectAdapters';
import { responsiveImage } from '../src/sanity/images';
import { parseQueryRequest } from '../src/sanity/queryRegistry';
import { projectDetails, projects } from '../docs/sanity/fixtures/phase-1-source';
import { projectQueries } from './fixtures/projectQueries';

afterEach(() => vi.unstubAllEnvs());
describe('project content parity', () => {
  it('preserves cards, fallback links and archive numbering while filtering by IDs', () => {
    const data = adaptArchive(projectQueries().archive);
    expect(data.projects.map(({ id: _id, disciplineIds: _disciplines, ...card }) => card)).toEqual(projects);
    expect(data.projects.filter(card => card.disciplineIds.includes('id-discipline-software')).map(card => card.index)).toEqual(['02']);
    expect(data.projects.map(card => card.slug ? `/work/${card.slug}` : '/work')).toEqual(['/work/rc-f35-vtol', '/work', '/work']);
    expect(data.disciplines.map(item => item.label)).toEqual(['Embedded', 'Software', 'AI']);
  });
  it('preserves F-35 text, sections, ratios, placeholder state and body figure order', () => {
    const data = adaptProject(projectQueries().detail)!;
    const source = projectDetails[0];
    expect(data.title).toBe(source.title); expect(data.intro).toBe(source.intro); expect(data.status).toBe('placeholder');
    expect(data.toolGroups).toEqual(source.toolGroups); expect(data.skills).toEqual(source.skills);
    expect(data.specs).toEqual(source.specs); expect(data.reflections).toEqual(source.reflections);
    expect(data.milestones.map(({ figure, ...milestone }) => ({ ...milestone, figure: { index: figure.index, title: figure.title } }))).toEqual(source.milestones);
    expect(data.finalFigure).toEqual(source.finalFigure);
    expect(data.milestones.every(item => item.figure.aspect === 1.5 && !item.figure.src)).toBe(true);
    expect(data.headings.timeline).toEqual({ eyebrow: 'Production timeline', title: 'How it came together' });
  });
  it('distinguishes missing, incomplete and ambiguous details', () => {
    const { detail } = projectQueries(); expect(adaptProject({ ...detail, projects: [] })).toBeNull();
    const partial = structuredClone(detail); partial.projects[0].detail = null;
    expect(() => adaptProject(partial)).toThrow();
    expect(() => adaptProject({ ...detail, projects: [...detail.projects, ...detail.projects] })).toThrow('More than one');
  });
  it('uses archive order for detail numbering and keys only relevant revisions', () => {
    const { detail, archive } = projectQueries();
    const reordered = { ...detail, order: [...detail.order].reverse() };
    expect(adaptProject(reordered)?.index).toBe('03');
    const original = adaptArchive(archive);
    const changed = structuredClone(archive); changed.projects[0]._rev = 'revision-2';
    expect(adaptArchive(changed).key).not.toBe(original.key);
    expect(adaptArchive(structuredClone(archive)).key).toBe(original.key);
    expect(adaptProject({ ...detail, order: [...detail.order, { _id: 'unrelated' }] })?.contentKey).toBe(adaptProject(detail)?.contentKey);
  });
  it('ignores unused smoke disciplines but rejects missing referenced disciplines', () => {
    const { archive } = projectQueries();
    archive.disciplines.push({ _id: 'smoke', _rev: '2', label: null, sourceKey: null });
    expect(adaptArchive(archive).disciplines).toHaveLength(3);
    archive.disciplines.shift(); expect(() => adaptArchive(archive)).toThrow('references');
  });
  it('renders an empty archive without inventing projects and rejects missing settings', () => {
    const { archive } = projectQueries(); expect(adaptArchive({ ...archive, projects: [] }).projects).toEqual([]);
    expect(() => adaptArchive({ ...archive, settings: [] })).toThrow('settings');
  });
});

describe('real image contract', () => {
  it('requests bounded responsive crops and honors hotspot/crop data', () => {
    const config = { projectId: 'oir24qey', dataset: 'development' };
    const image = { asset: { _ref: 'image-abcdef123456-3000x2000-jpg' }, crop: { left: 0.1, right: 0, top: 0, bottom: 0 },
      hotspot: { x: 0.75, y: 0.5, width: 0.2, height: 0.2 } };
    const result = responsiveImage(image, 1, config);
    expect(result.width).toBe(1200); expect(result.height).toBe(1200);
    expect(result.src).toContain('cdn.sanity.io/images/oir24qey/development/');
    expect(result.src).toContain('rect='); expect(result.src).toContain('auto=format');
    expect(result.srcSet).toContain('480w'); expect(result.srcSet).toContain('1800w');
    expect(result.src).not.toBe(responsiveImage({ asset: image.asset }, 1, config).src);
  });
  it('keeps alt text separate from captions and rejects missing assets/alt', () => {
    vi.stubEnv('VITE_SANITY_PROJECT_ID', 'oir24qey'); vi.stubEnv('VITE_SANITY_DATASET', 'development');
    const { detail } = projectQueries();
    const figure = detail.projects[0].detail!.finalFigure!;
    figure.mode = 'image'; figure.alt = 'Completed F-35 airframe on the workbench';
    figure.image = { _type: 'image', asset: { _type: 'reference', _ref: 'image-abcdef123456-3000x2000-jpg' }, assetId: 'image-abcdef123456-3000x2000-jpg' };
    const image = adaptProject(detail)!.finalFigure;
    expect(image.alt).toBe(figure.alt); expect(image.title).toBe('Hero photograph'); expect(image.srcSet).toBeTruthy();
    delete figure.alt; expect(() => adaptProject(detail)).toThrow('incomplete');
    figure.alt = 'A descriptive alternative'; figure.image.assetId = null;
    expect(() => adaptProject(detail)).toThrow('asset');
  });
});

describe('project query boundary', () => {
  it('allows only a bounded slug on the registered detail query', () => {
    expect(parseQueryRequest({ name: 'projectPage', params: { slug: 'rc-f35-vtol' } })).toEqual({ name: 'projectPage', params: { slug: 'rc-f35-vtol' } });
    for (const params of [{}, { slug: '../studio' }, { slug: 'x'.repeat(161) }, { slug: 'safe', dataset: 'production' }]) {
      expect(() => parseQueryRequest({ name: 'projectPage', params })).toThrow();
    }
    expect(() => parseQueryRequest({ name: 'workArchive', params: { slug: 'anything' } })).toThrow();
  });
});
