import { articleDetails, articles, planned } from '../../docs/sanity/fixtures/phase-1-source';

/** Copy is captured in fixtures/phase1-pages/Writing.tsx.snapshot; keep the migration offline. */
export const phase2Source = {
  articles, articleDetails, planned,
  publishedDates: { 'f35-development-update': '2026-06-12' } as Record<string, string>,
  writingPage: {
    heading: { _type: 'sectionHeading', eyebrow: 'Writing — index', title: 'Essays, notebooks & field notes' },
    intro: 'Thinking out loud about physics, computation, and the odd machine. Roughly monthly, always in progress.',
    plannedHeading: 'On the desk',
  },
};
