import { facts, principles, skillGroups } from '../../docs/sanity/fixtures/phase-1-source';
import { stableKey, type Seed } from './transform';

const heading = (eyebrow: string, title: string) => ({ _type: 'sectionHeading', eyebrow, title });

export function phase3Seeds(): Seed[] {
  return [{ type: 'aboutPage', sourceKey: 'about-page', singletonId: 'aboutPage', dependencies: [], build: () => ({
    _type: 'aboutPage', sourceKey: 'about-page',
    heading: heading('About', "Who's behind the index"), toolkitHeading: heading('Toolkit', 'What I build with'),
    approachHeading: heading('Approach', 'How I work'),
    lead: 'I’m Dev — a STEM student drawn to the seam where physics meets software, the point where an idea turns into an instrument you can actually measure with.',
    biography: [
      'I like building things end to end: the airframe and the stabiliser that keeps it level, the database behind a busy reception desk, the infrastructure that makes an AI assistant genuinely useful. I care most about work that stays legible — where you can trace how every piece was reasoned through, from first principle to final solder joint.',
      'Right now I’m looking toward university and research — places where that instinct to build and measure has room to grow.',
    ],
    facts: facts.map(f => ({ _type: 'aboutFact', _key: stableKey('fact:' + f.k), label: f.k, value: f.v,
      emphasized: f.accent, showOnHome: ['Focus', 'Looking for'].includes(f.k) })),
    skillGroups: skillGroups.map(g => ({ _type: 'toolGroup', _key: stableKey('skills:' + g.label), label: g.label, items: g.tags })),
    principles: principles.map(p => ({ _type: 'principle', _key: stableKey('principle:' + p.no), title: p.title, body: p.body })),
  }) }];
}
