import { phase1Seeds, stableKey, type Seed } from './transform';

const heading = (eyebrow: string, title: string) => ({ _type: 'sectionHeading', eyebrow, title });
const link = (label: string, href: string) => ({ _type: 'homeLink', label, href });

export function phase4Seeds(): Seed[] {
  const dependencies = phase1Seeds().filter(seed => seed.type === 'project').map(seed => seed.sourceKey);
  // Home's editorial source is docs/sanity/fixtures/phase1-pages/Home.tsx.snapshot.
  const lines = [
    [{ text: 'Measuring the' }],
    [{ text: 'invisible, ' }, { text: 'one', emphasis: true }],
    [{ text: 'experiment at a time.' }],
  ];
  return [{ type: 'homePage', sourceKey: 'home-page', singletonId: 'homePage', dependencies, build: ids => ({
    _type: 'homePage', sourceKey: 'home-page',
    metaAccent: 'Portfolio — 2026', metaMuted: 'STEM · Embedded · Software',
    heroLines: lines.map((runs, i) => ({
      _type: 'heroLine', _key: stableKey(`home:line:${i}`),
      runs: runs.map((run, j) => ({ _type: 'heroRun', _key: stableKey(`home:line:${i}:run:${j}`), ...run })),
    })),
    heroLead: 'I’m Dev — a student building instruments, software, and small machines to understand how the physical world actually works. This is a catalogue of that work.',
    primaryCta: link('Browse projects', '/work'), contactCta: link('Get in touch', '#contact'),
    workHeading: heading('Selected work', 'Projects & experiments'), archiveLink: link('See the full archive', '/work'),
    aboutHeading: heading('About', "Who's behind the index"),
    aboutIntro: 'I’m a STEM student drawn to the seam where physics meets software — the point where an idea turns into an instrument you can actually measure with.',
    aboutLink: link('More about me', '/about'),
    featuredProjects: dependencies.map(sourceKey => {
      const id = ids.get(sourceKey);
      if (!id) throw new Error('Unresolved Home project reference.');
      return { _type: 'reference', _key: stableKey(`home:featured:${sourceKey}`), _ref: id };
    }),
  }) }];
}
