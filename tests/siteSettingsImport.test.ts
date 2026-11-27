import type { SanityClient } from '@sanity/client';
import { describe, expect, it } from 'vitest';
import { runImport, type Existing, type Store } from '../scripts/sanity/import';
import { sanityStore } from '../scripts/sanity/store';
import { phase5Seeds } from '../scripts/sanity/siteSettingsTransform';
import { phase4Seeds } from '../scripts/sanity/homeTransform';
import type { Seed } from '../scripts/sanity/transform';

const options = { phase: 5, dataset: 'development', mode: 'create-missing' } as const;
const dryRun = { ...options, mode: 'dry-run' } as const;

const fixture: Seed = {
  type: 'siteSettings', sourceKey: 'site-settings', singletonId: 'siteSettings', dependencies: [],
  build: () => ({
    _type: 'siteSettings', sourceKey: 'site-settings',
    wordmark: 'Dev Vachhani', contactEmail: 'hello@devvachhani.com',
    footerSignoff: 'Let’s build something.', footerMeta: '© 2026 Dev Vachhani',
    footerColophon: 'Set in Newsreader & IBM Plex Mono',
  }),
};

function storeFixture() {
  const documents: Existing[] = [];
  let locked = false;
  let locks = 0;
  let writes = 0;
  const client = {
    async fetch(query: string, { keys }: { keys: string[] }, { perspective }: { perspective: string }) {
      const fixedIds = JSON.parse(query.match(/_id in (\[[^\]]+\])/)?.[1] ?? '[]') as string[];
      return structuredClone(documents.filter(item => (perspective === 'raw' || !item._id.startsWith('drafts.')) &&
        (keys.includes(item.sourceKey) || fixedIds.includes(item._id))));
    },
  } as unknown as SanityClient;
  const store: Store = {
    read: sanityStore(client).read,
    async create(body, id) {
      const record = { ...body, _id: id ?? 'generated', _rev: 'seed-rev' };
      documents.push(record);
      writes++;
      return record;
    },
    async update() { throw new Error('An unapproved update was attempted.'); },
    async lock() {
      locked = true;
      locks++;
      return async () => { locked = false; };
    },
  };
  return { store, documents, stats: () => ({ locked, locks, writes }) };
}

describe('Phase 5 guarded import', () => {
  it('confines settings to the development Phase 5 importer', async () => {
    const { store, stats } = storeFixture();
    await expect(runImport(store, [fixture], dryRun)).resolves.toMatchObject({ phase: 5, rows: [{ action: 'create' }] });
    await expect(runImport(store, [fixture], { ...options, phase: 4 })).rejects.toThrow('selected phase');
    await expect(runImport(store, phase4Seeds(), options)).rejects.toThrow('selected phase');
    await expect(runImport(store, [fixture], { ...options, dataset: 'production' as 'development' })).rejects.toThrow('development');
    expect(stats()).toEqual({ locked: false, locks: 0, writes: 0 });
  });

  it.each([
    { singletonId: undefined }, { singletonId: 'other' }, { sourceKey: 'other' }, { dependencies: ['project'] },
  ])('rejects conflicting seed identity or dependencies (%o)', async identity => {
    const { store, stats } = storeFixture();
    await expect(runImport(store, [{ ...fixture, ...identity }], options)).rejects.toThrow('site-settings');
    expect(stats()).toEqual({ locked: false, locks: 0, writes: 0 });
  });

  it.each(['siteSettings', 'drafts.siteSettings'])('detects an existing unrelated record at %s', async _id => {
    const { store, documents, stats } = storeFixture();
    documents.push({ _id, _type: 'siteSettings', _rev: 'editor-rev', sourceKey: 'other' });
    await expect(runImport(store, [fixture], options)).rejects.toThrow('conflicting source key');
    expect(stats()).toEqual({ locked: false, locks: 1, writes: 0 });
  });

  it('refuses a malformed settings seed before any content mutation', async () => {
    const { store, stats } = storeFixture();
    const seed = { ...fixture, build: () => ({ ...fixture.build(new Map()), contactEmail: 'mailto:hello@example.com' }) };
    await expect(runImport(store, [seed], options)).rejects.toThrow('Invalid transformed source document');
    expect(stats()).toEqual({ locked: false, locks: 1, writes: 0 });
  });

  it('creates the fixed record once and skips reruns with editor changes and drafts', async () => {
    const { store, documents, stats } = storeFixture();
    const seeds = phase5Seeds();
    const first = await runImport(store, seeds, options);
    expect(first.rows).toEqual([expect.objectContaining({ action: 'create', id: 'siteSettings', draft: false })]);
    const [published] = documents;
    expect((await runImport(store, seeds, options)).rows[0]).toMatchObject({ action: 'skip', differs: false });
    published.wordmark = 'Editor wordmark';
    published._rev = 'editor-rev';
    documents.push({ ...published, _id: 'drafts.siteSettings', wordmark: 'Draft wordmark' });
    const rerun = await runImport(store, seeds, options);
    expect(rerun.rows[0]).toMatchObject({
      action: 'skip', id: 'siteSettings', revision: 'editor-rev', differs: true, draft: true,
      sourceHash: first.rows[0].sourceHash,
    });
    expect(documents.map(item => item.wordmark)).toEqual(['Editor wordmark', 'Draft wordmark']);
    expect(stats()).toEqual({ locked: false, locks: 3, writes: 1 });
  });
});
