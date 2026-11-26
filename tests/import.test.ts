import { describe, expect, it } from 'vitest';
import { phase1Seeds, fingerprint, type Body } from '../scripts/sanity/transform';
import { runImport, type Existing, type Store, type UpdateApproval } from '../scripts/sanity/import';
import { phase1Source } from '../scripts/sanity/source';
import { validateEnabledDetail } from '../studio/schemaTypes/projectValidation';
import { phase4Seeds } from '../scripts/sanity/homeTransform';
import { phase3Seeds } from '../scripts/sanity/aboutTransform';
import { phase2Seeds } from '../scripts/sanity/writingTransform';

class MemoryStore implements Store {
  documents: Existing[] = [];
  creates = 0; updates = 0; locks = 0; locked = false;
  async read(keys: string[]) {
    const singletons = new Set(['workPage', 'writingPage', 'aboutPage', 'homePage']);
    return structuredClone(this.documents.filter(item => keys.includes(item.sourceKey) ||
      singletons.has(item._id.replace(/^drafts\./, ''))));
  }
  async create(body: Body, singletonId?: string) {
    const document: Existing = { ...structuredClone(body), _id: singletonId ?? `generated-${++this.creates}`, _rev: 'revision-1' };
    if (singletonId) this.creates++;
    this.documents.push(document); return document;
  }
  async update(id: string, revision: string, body: Body) {
    const document = this.documents.find(item => item._id === id);
    if (!document || document._rev !== revision) throw new Error('Revision conflict');
    Object.assign(document, structuredClone(body), { _rev: 'revision-2' }); this.updates++;
  }
  async lock() {
    if (this.locked) throw new Error('Concurrent import');
    this.locked = true; this.locks++;
    return async () => { this.locked = false; };
  }
}
const write = { phase: 1 as const, dataset: 'development' as const, mode: 'create-missing' as const };
const dry = { ...write, mode: 'dry-run' as const };
const seeds = phase1Seeds();

describe('Phase 3 singleton import', () => {
  it('creates the singleton once and skips subsequent editor revisions', async () => {
    const store = new MemoryStore();
    const options = { ...write, phase: 3 as const };
    const seeds = phase3Seeds();
    await runImport(store, seeds, { ...options, mode: 'dry-run' });
    expect(store.locks).toBe(0);
    await runImport(store, seeds, options);
    const [page] = store.documents;
    expect(page._id).toBe('aboutPage');
    page.lead = 'Editor copy';
    const report = await runImport(store, seeds, options);
    expect(report.rows[0]).toMatchObject({ action: 'skip', differs: true });
    expect(store.creates).toBe(1);
    expect(page.lead).toBe('Editor copy');
    await expect(runImport(store, seeds, write)).rejects.toThrow('selected phase');
  });
});

describe('Phase 2 guarded imports', () => {
  const seeds = phase2Seeds();
  const options = { ...write, phase: 2 as const };
  it('dry-runs without a lock, imports two records and reruns without changes', async () => {
    const store = new MemoryStore();
    const report = await runImport(store, seeds, { ...options, mode: 'dry-run' });
    expect(report.phase).toBe(2); expect(report.rows).toHaveLength(2); expect(store.creates).toBe(0); expect(store.locks).toBe(0);
    await runImport(store, seeds, options);
    expect(store.documents.map(item => item._type)).toEqual(['article', 'writingPage']);
    expect(store.documents[0]._id).toBe('generated-1'); expect(store.documents[1]._id).toBe('writingPage');
    const rerun = await runImport(store, seeds, options);
    expect(rerun.rows.every(row => row.action === 'skip' && !row.differs)).toBe(true); expect(store.creates).toBe(2);
  });
  it('preserves article editor changes and drafts; refuses stale review approvals', async () => {
    const store = new MemoryStore(); await runImport(store, seeds, options);
    const article = store.documents[0]; article.title = 'Editor title'; article._rev = 'editor-revision';
    store.documents.push({ ...article, _id: `drafts.${article._id}`, title: 'Private title' });
    const report = await runImport(store, seeds, options);
    expect(report.rows[0]).toMatchObject({ action: 'skip', differs: true, draft: true }); expect(store.updates).toBe(0);
    const row = report.rows[0];
    await expect(runImport(store, seeds, { ...options, mode: 'update-reviewed', approvals: [{
      sourceKey: row.sourceKey, id: row.id!, expectedRevision: row.revision!, sourceHash: row.sourceHash,
    }] })).rejects.toThrow('manifest');
    expect(article.title).toBe('Editor title');
  });
  it('rejects singleton conflicts, duplicate source keys and incorrect phase types before writes', async () => {
    const store = new MemoryStore(); await store.create({ _type: 'writingPage', sourceKey: 'editor' }, 'writingPage');
    await expect(runImport(store, seeds, options)).rejects.toThrow('conflicting'); expect(store.creates).toBe(1);
    await expect(runImport(new MemoryStore(), [seeds[0], seeds[0]], options)).rejects.toThrow('Duplicate');
    await expect(runImport(new MemoryStore(), seeds, write)).rejects.toThrow('phase');
  });
});

describe('source parity and project publication', () => {
  it('joins F-35 metadata/detail, preserves placeholders, figure ratios and archive-only cards', () => {
    const ids = new Map(seeds.slice(0, 3).map(seed => [seed.sourceKey, `existing-${seed.sourceKey}`]));
    const projects = seeds.filter(seed => seed.type === 'project').map(seed => seed.build(ids));
    expect(projects.map(project => project.title)).toEqual(phase1Source.projects.map(project => project.title));
    expect(projects.map(project => project.detailEnabled)).toEqual([true, false, false]);
    expect(projects[0].contentStatus).toBe('placeholder');
    expect(projects.slice(1).every(project => !project.slug && !project.detail)).toBe(true);
    expect(validateEnabledDetail(projects[0])).toBe(true);
    expect(validateEnabledDetail({ detailEnabled: true })).toBeTypeOf('string');
    expect(validateEnabledDetail({ detailEnabled: false })).toBe(true);
    const detail = projects[0].detail as { milestones: { figure: { mode: string; aspect: number; caption: string } }[]; finalFigure: { aspect: number } };
    expect(detail.milestones.map(item => item.figure.caption)).toEqual(phase1Source.projectDetails[0].milestones.map(item => item.figure.title));
    expect(detail.milestones.every(item => item.figure.mode === 'placeholder' && item.figure.aspect === 1.5)).toBe(true);
    expect(detail.finalFigure.aspect).toBe(16 / 9);
  });
  it('keeps array keys and source identities stable when source projects reorder', () => {
    const reordered = phase1Seeds({ ...phase1Source, projects: [...phase1Source.projects].reverse() });
    const ids = new Map(seeds.slice(0, 3).map(seed => [seed.sourceKey, seed.sourceKey]));
    const before = seeds.find(seed => seed.sourceKey === 'project-rc-f35-vtol')!.build(ids);
    const after = reordered.find(seed => seed.sourceKey === 'project-rc-f35-vtol')!.build(ids);
    expect(before.detail).toEqual(after.detail); expect(before.title).toBe(after.title);
  });
});

describe('guarded import runner', () => {
  it('dry-run performs no writes or locks and reports seven planned documents', async () => {
    const store = new MemoryStore();
    const report = await runImport(store, seeds, dry);
    expect(report.rows).toHaveLength(7); expect(report.rows.every(row => row.action === 'create')).toBe(true);
    expect(store.documents).toEqual([]); expect(store.locks).toBe(0);
  });
  it('creates dependencies first using returned IDs and reruns create nothing', async () => {
    const store = new MemoryStore();
    await runImport(store, seeds, write);
    expect(store.documents.filter(item => item._type === 'project')).toHaveLength(3);
    expect(store.documents.filter(item => item._type === 'discipline')).toHaveLength(3);
    expect(store.documents.find(item => item._type === 'workPage')?._id).toBe('workPage');
    const project = store.documents.find(item => item.sourceKey === 'project-rc-f35-vtol')!;
    const discipline = store.documents.find(item => item.sourceKey === 'discipline-embedded')!;
    expect(project.disciplines).toEqual([expect.objectContaining({ _ref: discipline._id })]);
    const rerun = await runImport(store, seeds, write);
    expect(rerun.rows.every(row => row.action === 'skip' && !row.differs)).toBe(true);
    expect(store.creates).toBe(7); expect(store.locked).toBe(false);
  });
  it('preserves editor changes and drafts while reporting differences', async () => {
    const store = new MemoryStore(); await runImport(store, seeds, write);
    const project = store.documents.find(item => item._type === 'project')!;
    project.title = 'Editor title'; project._rev = 'editor-revision';
    store.documents.push({ ...project, _id: `drafts.${project._id}`, title: 'Private draft title' });
    const report = await runImport(store, seeds, write);
    expect(report.rows.find(row => row.sourceKey === project.sourceKey)).toMatchObject({ action: 'skip', differs: true, draft: true });
    expect(project.title).toBe('Editor title'); expect(store.updates).toBe(0);
  });
  it('rejects ambiguous source keys before any writes and releases the lock', async () => {
    const store = new MemoryStore(); await store.create(seeds[0].build(new Map())); await store.create(seeds[0].build(new Map()));
    const count = store.creates;
    await expect(runImport(store, seeds, write)).rejects.toThrow('Ambiguous');
    expect(store.creates).toBe(count); expect(store.locked).toBe(false);
  });
  it('fails closed for a singleton ID with unrelated data', async () => {
    const store = new MemoryStore(); await store.create({ _type: 'workPage', sourceKey: 'other', intro: 'Editor data' }, 'workPage');
    await expect(runImport(store, seeds, write)).rejects.toThrow('conflicting'); expect(store.creates).toBe(1);
  });
  it('requires exact revision/hash approval and rejects updates when a draft exists', async () => {
    const store = new MemoryStore(); await runImport(store, seeds, write);
    const report = await runImport(store, seeds, dry);
    const row = report.rows.find(item => item.sourceKey === 'project-rc-f35-vtol')!;
    const approval: UpdateApproval = { sourceKey: row.sourceKey, id: row.id!, expectedRevision: row.revision!, sourceHash: row.sourceHash };
    const options = { ...write, mode: 'update-reviewed' as const, approvals: [approval] };
    await expect(runImport(store, seeds, { ...options, approvals: [{ ...approval, expectedRevision: 'stale' }] })).rejects.toThrow('manifest');
    await expect(runImport(store, seeds, { ...options, approvals: [{ ...approval, sourceHash: fingerprint('wrong') }] })).rejects.toThrow('hash');
    const target = store.documents.find(item => item._id === row.id)!;
    store.documents.push({ ...target, _id: `drafts.${target._id}` });
    await expect(runImport(store, seeds, options)).rejects.toThrow('manifest'); expect(store.updates).toBe(0);
    store.documents.pop(); await runImport(store, seeds, options); expect(store.updates).toBe(1);
  });
  it('rejects concurrent imports and preserves the active lock', async () => {
    const store = new MemoryStore(); const release = await store.lock();
    await expect(runImport(store, seeds, write)).rejects.toThrow('Concurrent');
    expect(store.locked).toBe(true); expect(store.creates).toBe(0); await release();
  });
  it('rejects a draft-only referenced discipline and non-development targets', async () => {
    const store = new MemoryStore();
    store.documents.push({ ...seeds[0].build(new Map()), _id: 'drafts.only', _rev: '1' });
    await expect(runImport(store, seeds, write)).rejects.toThrow('only as a draft');
    await expect(runImport(store, seeds, { ...write, dataset: 'production' as 'development' })).rejects.toThrow('development');
  });
});

describe('Phase 4 guarded Home import', () => {
  const options = { ...write, phase: 4 as const };
  const projectKeys = ['project-rc-f35-vtol', 'project-guest-registration', 'project-dcs-companion'];
  const projects = () => projectKeys.map((sourceKey, index): Existing => ({
    _id: 'published-' + (index + 1), _rev: 'project-rev', _type: 'project', sourceKey,
  }));

  it('accepts explicit phase 4 while preserving the development-only guard', async () => {
    const store = new MemoryStore();
    expect(await runImport(store, [], { ...options, mode: 'dry-run' })).toMatchObject({ phase: 4, rows: [] });
    await expect(runImport(store, [], { ...options, dataset: 'production' as 'development' })).rejects.toThrow('development');
  });

  it('imports the frozen copy and resolves the authored order to published project IDs', async () => {
    const store = new MemoryStore();
    const [first] = projects();
    store.documents.push(...projects(),
      { ...first, _id: 'drafts.published-1' },
      { ...first, _id: 'versions.release.published-1' });
    const seeds = phase4Seeds();
    await expect(runImport(store, seeds, write)).rejects.toThrow('selected phase');
    const dryRun = await runImport(store, seeds, { ...options, mode: 'dry-run' });
    expect(dryRun.rows).toEqual([expect.objectContaining({ sourceKey: 'home-page', action: 'create' })]);
    expect(store.locks).toBe(0);
    const original = structuredClone(store.documents);

    await runImport(store, seeds, options);
    const home = store.documents.at(-1)!;
    expect(home).toMatchObject({
      _id: 'homePage', _type: 'homePage', sourceKey: 'home-page',
      metaAccent: 'Portfolio — 2026', metaMuted: 'STEM · Embedded · Software',
      heroLead: 'I’m Dev — a student building instruments, software, and small machines to understand how the physical world actually works. This is a catalogue of that work.',
      primaryCta: { label: 'Browse projects', href: '/work' },
      contactCta: { label: 'Get in touch', href: '#contact' },
      workHeading: { eyebrow: 'Selected work', title: 'Projects & experiments' },
      archiveLink: { label: 'See the full archive', href: '/work' },
      aboutHeading: { eyebrow: 'About', title: "Who's behind the index" },
      aboutIntro: 'I’m a STEM student drawn to the seam where physics meets software — the point where an idea turns into an instrument you can actually measure with.',
      aboutLink: { label: 'More about me', href: '/about' },
      heroLines: [
        { _key: expect.any(String), runs: [{ _key: expect.any(String), text: 'Measuring the' }] },
        { _key: expect.any(String), runs: [{ _key: expect.any(String), text: 'invisible, ' }, { _key: expect.any(String), text: 'one', emphasis: true }] },
        { _key: expect.any(String), runs: [{ _key: expect.any(String), text: 'experiment at a time.' }] },
      ],
      featuredProjects: ['published-1', 'published-2', 'published-3'].map(_ref => ({ _type: 'reference', _key: expect.any(String), _ref })),
    });
    expect(store.documents.slice(0, -1)).toEqual(original);
    expect((await runImport(store, seeds, options)).rows[0]).toMatchObject({ action: 'skip', differs: false });
    expect(store.creates).toBe(1);
  });

  it.each<[string, Existing[]]>([
    ['absent', []],
    ['only as a draft', [{ ...projects()[0], _id: 'drafts.published-1' }]],
    ['ambiguous', [projects()[0], { ...projects()[0], _id: 'other-published' }]],
    ['ambiguous', [projects()[0], { ...projects()[0], _id: 'other-type', _type: 'article' }]],
    ['absent', [{ ...projects()[0], _id: 'versions.release.published-1' }]],
    ['private', [{ ...projects()[0], _id: 'private.project' }]],
    ['private', [{ ...projects()[0], _id: 'drafts.private.project' }]],
    ['ambiguous', [projects()[0], { ...projects()[0], _id: 'private.project' }]],
  ])('rejects an external project dependency that is %s before writing', async (message, matches) => {
    const store = new MemoryStore();
    store.documents.push(...matches, ...projects().slice(1));
    const seeds = phase4Seeds();
    await expect(runImport(store, seeds, { ...options, mode: 'dry-run' })).rejects.toThrow(new RegExp(message, 'i'));
    await expect(runImport(store, seeds, options)).rejects.toThrow(new RegExp(message, 'i'));
    expect(store.creates).toBe(0);
    expect(store.locked).toBe(false);
  });
});
