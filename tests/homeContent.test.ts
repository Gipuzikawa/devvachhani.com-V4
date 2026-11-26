import { describe, expect, it } from 'vitest';
import { adaptHome } from '../src/sanity/homeContent';
import type { QueryResults } from '../src/sanity/queryRegistry';

type HomeResult = QueryResults['homePage'];
type HomeDocument = HomeResult['settings'][number];
type FeaturedProject = NonNullable<HomeDocument['featuredProjects']>[number];

const project = (_id: string, detailEnabled = true): FeaturedProject['project'] => ({
  _id, _rev: 'project-rev', title: 'Project ' + _id, summary: 'Project summary', tags: ['Tag'],
  slug: detailEnabled ? { _type: 'slug', current: _id } : null, detailEnabled,
});
const slot = (_key: string, _ref: string, target: FeaturedProject['project'] = project(_ref)): FeaturedProject => ({
  _key, _ref, project: target,
});

function home(overrides: Partial<HomeDocument> = {}): HomeResult {
  return {
    settings: [{
      _id: 'homePage', _rev: 'home-rev', metaAccent: 'Portfolio', metaMuted: 'STEM',
      heroLines: [
        { _key: 'first', runs: [{ _key: 'a', text: 'Measuring the', emphasis: null }] },
        { _key: 'second', runs: [{ _key: 'b', text: 'invisible, ', emphasis: null }, { _key: 'c', text: 'one', emphasis: true }] },
        { _key: 'third', runs: [{ _key: 'd', text: 'experiment at a time.', emphasis: false }] },
      ],
      heroLead: 'An introduction.',
      primaryCta: { label: 'Browse projects', href: '/work' },
      contactCta: { label: 'Get in touch', href: '#contact' },
      workHeading: { eyebrow: 'Selected work', title: 'Projects & experiments' },
      archiveLink: { label: 'See the archive', href: '/work' },
      aboutHeading: { eyebrow: 'About', title: 'Who is behind the index' },
      aboutIntro: 'About the student.',
      aboutLink: { label: 'More about me', href: '/about' },
      featuredProjects: [slot('second-card', 'second', project('second', false)), slot('first-card', 'first')],
      ...overrides,
    }],
    order: [{ _id: 'first' }, { _id: 'second' }],
  };
}

describe('Home content adapter', () => {
  it('returns null only when the Home singleton is absent', () => {
    const result = home();
    expect(adaptHome({ settings: [], order: result.order })).toBeNull();
    expect(() => adaptHome({ ...result, settings: [...result.settings, ...result.settings] })).toThrow('Home');
    expect(() => adaptHome(home({ heroLead: null }))).toThrow('Home');
  });

  it('keeps ordered hero run keys, whitespace and emphasis', () => {
    expect(adaptHome(home())?.heroLines[1]).toEqual({
      key: 'second', runs: [{ key: 'b', text: 'invisible, ', emphasis: false }, { key: 'c', text: 'one', emphasis: true }],
    });
  });

  it('rejects missing, blank, multiline or oversized hero lines', () => {
    const original = home().settings[0].heroLines!;
    const cases = [
      original.slice(1),
      [...original, original[0]],
      [{ ...original[0], runs: [{ _key: 'a', text: '   ', emphasis: false }] }, ...original.slice(1)],
      [{ ...original[0], runs: [{ _key: 'a', text: 'first\nsecond', emphasis: null }] }, ...original.slice(1)],
      [{ ...original[0], runs: [{ _key: 'a', text: 'x'.repeat(121), emphasis: null }] }, ...original.slice(1)],
      [{ ...original[0], runs: Array.from({ length: 9 }, (_, i) => ({ _key: String(i), text: 'a', emphasis: false })) }, ...original.slice(1)],
    ];
    for (const heroLines of cases) expect(() => adaptHome(home({ heroLines }))).toThrow('hero');
  });

  it.each(['https://other.example/work', '//other.example/work', '/%2Fother.example/work', '/\\other.example', 'javascript:alert(1)', 'about', ' /work', '#'])(
    'rejects an unsafe or empty CTA destination %s', href => {
      expect(() => adaptHome(home({ primaryCta: { label: 'CTA', href } }))).toThrow('same-site');
    },
  );

  it('uses authored order with archive numbers and links for both card types', () => {
    const cards = adaptHome(home())?.featuredProjects;
    expect(cards).toEqual([
      { key: 'second-card', card: { index: '02', title: 'Project second', summary: 'Project summary', tags: ['Tag'] }, href: '/work' },
      { key: 'first-card', card: { index: '01', title: 'Project first', summary: 'Project summary', tags: ['Tag'], slug: 'first' }, href: '/work/first' },
    ]);
  });

  it.each([null, undefined])('builds a project card with no tags when the optional field is %s', tags => {
    const result = home({ featuredProjects: [slot('first-card', 'first', { ...project('first')!, tags })] });
    expect(adaptHome(result)?.featuredProjects).toEqual([
      { key: 'first-card', card: expect.objectContaining({ index: '01', tags: [] }), href: '/work/first' },
    ]);
  });

  it('keeps a card with malformed non-null tags unavailable', () => {
    const result = home({ featuredProjects: [slot('first-card', 'first', { ...project('first')!, tags: [''] })] });
    expect(adaptHome(result)?.featuredProjects).toEqual([]);
    expect(adaptHome(result, true)?.featuredProjects).toEqual([
      { key: 'first-card', card: null, notice: expect.stringMatching(/incomplete/i) },
    ]);
  });

  it('omits unresolved and unusable targets publicly, with per-slot diagnostics in preview', () => {
    const result = home({ featuredProjects: [
      slot('missing', 'unpublished', null),
      slot('usable', 'second', project('second', false)),
      slot('unusable', 'first', { ...project('first')!, detailEnabled: null }),
    ] });
    expect(adaptHome(result)?.featuredProjects.map(value => value.key)).toEqual(['usable']);
    expect(adaptHome(result, true)?.featuredProjects).toEqual([
      { key: 'missing', card: null, notice: expect.stringMatching(/unavailable|missing/i) },
      { key: 'usable', card: expect.objectContaining({ index: '02' }), href: '/work' },
      { key: 'unusable', card: null, notice: expect.stringMatching(/incomplete/i) },
    ]);
  });

  it('changes the combined identity for card edits and renumbering while preserving the hero identity', () => {
    const before = adaptHome(home())!;
    const changed = adaptHome(home({ featuredProjects: [slot('first-card', 'first', { ...project('first')!, _rev: 'revised' })] }))!;
    const changedOrder = adaptHome({ ...home(), order: [{ _id: 'new-first' }, ...home().order] })!;
    const changedProject = home();
    changedProject.settings[0].featuredProjects![0].project!._rev = 'revised';
    const sameOrderCardEdit = adaptHome(changedProject)!;
    for (const after of [changed, changedOrder, sameOrderCardEdit]) {
      expect(after.homeRevision).toBe(before.homeRevision);
      expect(after.revision).not.toBe(before.revision);
    }
    expect(adaptHome(home({ _rev: 'new-home-revision' }))?.homeRevision).not.toBe(before.homeRevision);
  });
});
