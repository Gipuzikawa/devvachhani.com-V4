import { createClient } from '@sanity/client';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { resolve } from '../studio/presentation/resolve';
import { structure } from '../studio/structure';

const studioRequire = createRequire(new URL('../studio/sanity.config.ts', import.meta.url));
const origin = 'https://example.test';
const singletonIds = ['homePage', 'aboutPage', 'workPage', 'writingPage', 'siteSettings'];
const ordinaryTypes = ['project', 'article', 'discipline'];

beforeAll(() => {
  vi.stubEnv('SANITY_STUDIO_PROJECT_ID', 'example');
  vi.stubEnv('SANITY_STUDIO_DATASET', 'development');
  vi.stubEnv('SANITY_STUDIO_PREVIEW_ORIGIN', origin);
});
afterAll(() => vi.unstubAllEnvs());

it('opens five fixed document editors before the three ordinary lists', async () => {
  const { default: config } = await import('../studio/sanity.config');
  const { createSourceFromConfig } = await import(pathToFileURL(studioRequire.resolve('sanity')).href);
  const { createStructureBuilder, ListBuilder } =
    await import(pathToFileURL(studioRequire.resolve('sanity/structure')).href);
  const source = await createSourceFromConfig({
    ...config,
    currentUser: { id: 'editor', name: 'Editor', email: 'editor@example.test', role: 'editor', roles: [] },
    getClient: ({ apiVersion }: { apiVersion: string }) => createClient({ projectId: 'example', dataset: 'development', useCdn: false, apiVersion }),
  });
  const builder = createStructureBuilder({ source, perspectiveStack: ['published'] });
  const root = structure(builder, { ...builder.context, documentStore: source.documentStore });
  if (!(root instanceof ListBuilder)) throw new Error('Expected the Portfolio list');
  const items = root.serialize().items.filter(item => item.type === 'listItem');
  expect(items.map(item => item.id)).toEqual([...singletonIds, ...ordinaryTypes]);
  for (const [index, id] of singletonIds.entries()) {
    expect(items[index].child).toMatchObject({ type: 'document', id, options: { id, type: id } });
    const actions = source.document.actions({ documentId: id, schemaType: id, versionType: 'published', releaseId: undefined });
    expect(actions.map(action => action.action)).toContain('publish');
    expect(actions.map(action => action.action)).not.toContain('duplicate');
    expect(actions.map(action => action.action)).not.toContain('delete');
    expect(source.document.resolveNewDocumentOptions({ type: 'structure', schemaType: id })).toEqual([]);
  }
  expect(source.document.resolveNewDocumentOptions({ type: 'global' }).map(option => option.templateId).sort())
    .toEqual(['article', 'discipline', 'project']);
  for (const schemaType of ordinaryTypes) {
    const actions = source.document.actions({ documentId: 'ordinary-doc', schemaType, versionType: 'published', releaseId: undefined });
    expect(actions.map(action => action.action)).toEqual(expect.arrayContaining(['delete', 'duplicate']));
  }
});

describe('Presentation route resolution', () => {
  it.each([
    ['/', 'homePage'], ['/about', 'aboutPage'], ['/work', 'workPage'], ['/writing', 'writingPage'],
  ])('binds %s to its fixed singleton ID', (route, id) => {
    const resolver = resolve?.mainDocuments?.find(entry => entry.route === route);
    const context = { origin, params: {}, path: route };
    expect(resolver?.resolve?.(context) ?? resolver).toMatchObject({
      filter: '_type == $type && _id == $id',
      params: { type: id, id },
    });
  });

  it.each([
    ['/work/:slug', '_type == "project" && detailEnabled == true && slug.current == $slug'],
    ['/writing/:slug', '_type == "article" && slug.current == $slug'],
  ])('binds %s to a validated slug parameter', (route, filter) => {
    const select = resolve?.mainDocuments?.find(entry => entry.route === route)?.resolve;
    expect(select).toBeTypeOf('function');
    const selectSlug = (slug: string) => select?.({ origin, params: { slug }, path: route.replace(':slug', slug) });
    for (const slug of ['a1-slug', 'a'.repeat(160)]) {
      expect(selectSlug(slug)).toEqual({ filter, params: { slug } });
    }
    for (const slug of ['', 'a'.repeat(161), 'foo--bar', 'A-1', 'a/b', 'a%2Fb', 'foo\n']) {
      expect(selectSlug(slug)).toBeUndefined();
    }
  });

  it('offers settings on all editorial entry points and retains the other document locations', () => {
    const locations = resolve?.locations;
    if (!locations || typeof locations === 'function') throw new Error('Expected location mappings');
    function urls(type: string, doc?: Record<string, unknown>) {
      const location = locations![type];
      if (!location || typeof location === 'function') return undefined;
      return ('resolve' in location ? location.resolve(doc ?? null) : location)?.locations.map(entry => entry.href);
    }
    expect(urls('siteSettings')).toEqual(['/', '/about', '/work', '/writing']);
    expect(urls('homePage')).toEqual(['/']);
    expect(urls('aboutPage')).toEqual(['/about', '/']);
    expect(urls('workPage')).toEqual(['/work']);
    expect(urls('writingPage')).toEqual(['/writing']);
    expect(urls('discipline')).toEqual(['/work']);
    expect(urls('project', { slug: 'example-slug', detailEnabled: true })).toEqual(['/work', '/work/example-slug']);
    expect(urls('project', { slug: 'example-slug', detailEnabled: false })).toEqual(['/work']);
    expect(urls('article', { slug: 'example-slug' })).toEqual(['/writing', '/writing/example-slug']);
    for (const slug of ['a'.repeat(161), 'foo--bar', 'foo\n']) {
      expect(urls('project', { slug, detailEnabled: true })).toEqual(['/work']);
      expect(urls('article', { slug })).toEqual(['/writing']);
    }
  });
});
