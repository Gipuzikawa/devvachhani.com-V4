import type { ProjectData } from '../types';

/** Real content, ported from design-export/Home.dc.html's renderVals(). */

export const projects: ProjectData[] = [
  {
    index: '01',
    title: 'RC F-35 — VTOL',
    summary:
      'A radio-controlled F-35 with custom flight-stabilisation firmware on a Teensy — vertical take-off, hover, and transition to forward flight.',
    tags: ['Teensy', 'Flight control', 'VTOL', 'C++'],
  },
  {
    index: '02',
    title: 'Corporate guest registration',
    summary:
      'A visitor check-in system for a corporate reception — Flask backend, relational database, and a clean Bootstrap interface for front-desk staff.',
    tags: ['Flask', 'SQL', 'Bootstrap', 'Full-stack'],
  },
  {
    index: '03',
    title: 'DCS companion app',
    summary:
      'A companion app for Digital Combat Simulator, built end-to-end with an AI-assisted workflow and a solid inference and prompt infrastructure underneath.',
    tags: ['AI infra', 'Tooling', 'Product'],
  },
];

/** Discipline filter chips on the Work page, mapped to the tags above. */
export const disciplineTags: Record<string, string[]> = {
  Embedded: ['Teensy', 'Flight control', 'VTOL', 'C++'],
  Software: ['Flask', 'SQL', 'Bootstrap', 'Full-stack'],
  AI: ['AI infra', 'Tooling', 'Product'],
};
export const disciplines = ['All', 'Embedded', 'Software', 'AI'];

export const skillGroups = [
  { label: 'Embedded & hardware', tags: ['Teensy', 'C++', 'Flight control', 'Sensor fusion', 'PCB bring-up'] },
  { label: 'Software', tags: ['Python', 'Flask', 'SQL', 'JavaScript', 'Bootstrap'] },
  { label: 'AI & tooling', tags: ['AI-assisted dev', 'LLM infrastructure', 'Prompt design', 'Git'] },
];

export const facts = [
  { k: 'Focus', v: 'Embedded · control · software', accent: false },
  { k: 'Currently', v: 'Building & tinkering', accent: false },
  { k: 'Based', v: 'United Kingdom', accent: false },
  { k: 'Looking for', v: 'University & research', accent: true },
];

export const principles = [
  {
    no: '01',
    title: 'Build it end to end',
    body: 'Airframe to firmware, schema to interface — I want to understand the whole path, not just one layer of it.',
  },
  {
    no: '02',
    title: 'Keep it legible',
    body: 'Work should be traceable. Anyone should be able to follow how each decision was reasoned through.',
  },
  {
    no: '03',
    title: 'Measure, then trust',
    body: 'A claim is only as good as the instrument behind it. I test before I believe my own results.',
  },
];

export const planned = [
  { no: '01', kind: 'Field note', title: 'Keeping an F-35 level: what a Teensy actually does 400 times a second.' },
  { no: '02', kind: 'Build log', title: 'From spreadsheet to schema: designing the guest-registration database.' },
  { no: '03', kind: 'Essay', title: 'Good AI infrastructure is boring — and that is the point.' },
];

export const navProps = {
  brand: 'Dev Vachhani',
  links: [
    { label: 'About', href: '/about' },
    { label: 'Work', href: '/work' },
    { label: 'Writing', href: '/writing' },
  ],
  cta: { label: 'Contact', href: '#contact' },
};

export const footerProps = {
  signoff: 'Let’s build something.',
  email: 'hello@devvachhani.com',
  invert: true,
  links: [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Email', href: 'mailto:hello@devvachhani.com' },
  ],
  meta: '© 2026 Dev Vachhani',
};
