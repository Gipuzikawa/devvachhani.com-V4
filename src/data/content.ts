import type { ProjectData, ProjectDetail } from '../types';

/** Real content, ported from design-export/Home.dc.html's renderVals(). */

export const projects: ProjectData[] = [
  {
    index: '01',
    title: 'RC F-35 — VTOL',
    summary:
      'A radio-controlled F-35 with custom flight-stabilisation firmware on a Teensy — vertical take-off, hover, and transition to forward flight.',
    tags: ['Teensy', 'Flight control', 'VTOL', 'C++'],
    slug: 'rc-f35-vtol',
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

/* ── Project detail pages ──────────────────────────────────────────────
   Transcribed from Placeholders/Example_Project.md. Body copy is lorem —
   deliberately, clearly placeholder while the real build log is written.
   The `status: 'placeholder'` flag renders an explicit notice on the page
   so this is never presented as real work. */

export const projectDetails: ProjectDetail[] = [
  {
    slug: 'rc-f35-vtol',
    index: '01',
    title: 'RC F-35 — VTOL',
    year: '2026',
    status: 'placeholder',
    intro:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum feugiat metus sed nisl fermentum, sed dignissim nisl tincidunt. Donec ultricies est sed nibh tincidunt, vitae efficitur neque pellentesque.',
    toolGroups: [
      { label: 'Software', items: ['SolidWorks', 'Fusion 360', 'Bambu Studio', 'Cura', 'Autodesk CFD', 'VS Code'] },
      { label: 'Hardware', items: ['Bambu Lab P1S', 'Ender 3 V2', 'Digital callipers', 'Soldering station', 'Bench power supply'] },
      { label: 'Components', items: ['Brushless motor', 'ESC', 'LiPo battery', 'Flight controller', '9g servos', 'Carbon-fibre spars', 'PLA / PETG'] },
    ],
    skills: [
      'CAD design',
      'Mechanical engineering',
      'Rapid prototyping',
      'Electronics integration',
      'Aerodynamic design',
      'Project management',
      'Testing & iteration',
      'Technical documentation',
    ],
    milestones: [
      {
        date: 'January 2026',
        title: 'Project planning',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae ligula sed lectus feugiat cursus. Integer sed tincidunt nisl, non scelerisque turpis vel ligula.',
        figure: { index: 1, title: 'Initial concept sketches' },
      },
      {
        date: 'February 2026',
        title: 'CAD development',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum purus at lacus dignissim. Donec pretium lacus vitae mi tristique, sed vestibulum risus tempor.',
        figure: { index: 2, title: 'First CAD prototype' },
      },
      {
        date: 'March 2026',
        title: 'Prototype manufacturing',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt sem quis ligula facilisis luctus. Mauris posuere erat sed mauris commodo, vitae interdum est viverra.',
        figure: { index: 3, title: 'First physical prototype' },
      },
      {
        date: 'April 2026',
        title: 'Electronics installation',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec elit nec massa tristique malesuada. Integer et eros at lorem dignissim interdum, quis eleifend ligula neque vitae justo.',
        figure: { index: 4, title: 'Electronics integration' },
      },
      {
        date: 'May 2026',
        title: 'Testing & refinement',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet justo at turpis vulputate luctus. Suspendisse potenti; morbi tristique malesuada risus, vitae tempus augue cursus vel.',
        figure: { index: 5, title: 'Prototype testing' },
      },
      {
        date: 'June 2026',
        title: 'Final assembly',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi volutpat augue nec sapien faucibus. Cras tincidunt est at odio fermentum, quis feugiat augue consequat.',
        figure: { index: 6, title: 'Completed airframe' },
      },
    ],
    finalFigure: { index: 7, title: 'Hero photograph', aspect: 16 / 9 },
    specs: [
      { k: 'Wingspan', v: 'Lorem ipsum' },
      { k: 'Length', v: 'Lorem ipsum' },
      { k: 'Weight', v: 'Lorem ipsum' },
      { k: 'Material', v: 'Lorem ipsum' },
      { k: 'Battery', v: 'Lorem ipsum' },
      { k: 'Flight time', v: 'Lorem ipsum' },
    ],
    reflections: {
      wentWell:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae urna ac lacus facilisis porta, sed dapibus mauris vitae consequat luctus.',
      challenges:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec condimentum ligula sed urna tristique, vitae porta lectus luctus.',
      improvements: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor', 'Incididunt ut labore'],
      closing:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti; donec sed elit at risus volutpat egestas.',
    },
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
