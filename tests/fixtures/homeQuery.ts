import type { QueryResults } from '../../src/sanity/queryRegistry';

export type HomeResult = QueryResults['homePage'];
type HomeDocument = HomeResult['settings'][number];
type FeaturedProject = NonNullable<HomeDocument['featuredProjects']>[number];

export const project = (_id: string, detailEnabled = true): NonNullable<FeaturedProject['project']> => ({
  _id, _rev: 'project-rev', title: 'Project ' + _id, summary: 'Project summary', tags: ['Tag'],
  slug: detailEnabled ? { _type: 'slug', current: _id } : null, detailEnabled,
});
export const slot = (_key: string, _ref: string, target: FeaturedProject['project'] = project(_ref)): FeaturedProject => ({
  _key, _ref, project: target,
});

export function homeQuery(overrides: Partial<HomeDocument> = {}): HomeResult {
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
