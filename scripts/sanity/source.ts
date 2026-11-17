import { projects, projectDetails, disciplines, disciplineTags } from '../../docs/sanity/fixtures/phase-1-source';

export const phase1Source = {
  projects, projectDetails, disciplines: disciplines.filter(label => label !== 'All'), disciplineTags,
  workPage: { heading: { _type: 'sectionHeading', eyebrow: 'The archive', title: 'Projects & experiments' },
    intro: 'Instruments, software, and small machines — built end to end. Filter by discipline, or switch between the index and the grid.',
    allLabel: 'All', rowsLabel: 'Rows', gridLabel: 'Grid' },
  detailHeadings: {
    overviewHeading: { _type: 'sectionHeading', eyebrow: 'Overview', title: 'Tools & skills' },
    timelineHeading: { _type: 'sectionHeading', eyebrow: 'Production timeline', title: 'How it came together' },
    resultsHeading: { _type: 'sectionHeading', eyebrow: 'Final product', title: 'The finished machine' },
    reflectionsHeading: { _type: 'sectionHeading', eyebrow: 'Reflections', title: 'What the build taught' },
  },
};
