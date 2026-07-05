import type { ArticleData, ArticleDetail, ProjectData, ProjectDetail } from '../types';

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

/* ── Articles ──────────────────────────────────────────────────────────
   Transcribed from Placeholders/Example_Article.md — body copy is lorem,
   deliberately and visibly placeholder while the real essays are written.
   Section headings and the pull quote were added to the example's structure
   (with the user's agreement) because the reading page's reactive features
   (TOC, set pieces) need them to bind to. */

export const articles: ArticleData[] = [
  {
    title: 'Breakthrough Achieved in F-35 RC Aircraft Development',
    dek: 'An engineering update on the VTOL F-35 build — a placeholder long-read while the real field notes are written.',
    date: '12 Jun 2026',
    readTime: '6 min',
    category: 'Engineering update',
    slug: 'f35-development-update',
  },
];

export const articleDetails: ArticleDetail[] = [
  {
    slug: 'f35-development-update',
    title: 'Breakthrough Achieved in F-35 RC Aircraft Development',
    dek: 'An engineering update on the VTOL F-35 build — a placeholder long-read while the real field notes are written.',
    date: '12 June 2026',
    readTime: '6 min',
    category: 'Engineering update',
    status: 'placeholder',
    blocks: [
      { type: 'heading', id: 'overview', text: 'Overview' },
      {
        type: 'paragraph',
        dropCap: true,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae urna ac lacus facilisis porta. Sed dapibus, mauris vitae consequat luctus, arcu lectus sollicitudin nisi, vel interdum velit odio vitae risus. Integer sed tincidunt nisl. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
      },
      {
        type: 'paragraph',
        text: 'Curabitur luctus, neque quis aliquet feugiat, lorem orci bibendum nisl, quis eleifend ligula neque vitae justo. Donec pretium lacus vitae mi tristique, sed vestibulum risus tempor. Integer et eros at lorem dignissim interdum. Mauris posuere erat sed mauris commodo, vitae interdum est viverra.',
      },
      { type: 'figure', figure: { index: 1, title: 'Project development workspace' } },
      {
        type: 'paragraph',
        text: 'Aliquam erat volutpat. Nulla facilisi. Proin sed libero sit amet magna luctus interdum. Donec viverra consequat sapien, non luctus magna feugiat vitae. Sed porta lectus sed nisi viverra, et consequat arcu posuere. Cras tincidunt est at odio fermentum, quis feugiat augue consequat.',
      },
      { type: 'heading', id: 'development', text: 'Development progress' },
      {
        type: 'paragraph',
        text: 'Praesent feugiat, nisl sed interdum dignissim, justo massa tristique est, non scelerisque turpis turpis vel ligula. Morbi tristique malesuada risus, vitae tempus augue cursus vel. Integer sed urna eu lectus faucibus tincidunt. Duis tincidunt augue vitae lorem pellentesque, at vulputate velit convallis.',
      },
      {
        type: 'paragraph',
        text: 'The latest phase of development has focused on refining several key systems before progressing to more advanced testing. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec condimentum ligula sed urna tristique, vitae porta lectus luctus. Integer sed risus et augue convallis fermentum.',
      },
      { type: 'pullquote', text: 'Suspendisse potenti — mauris luctus, lorem at volutpat placerat, nisl purus tempor magna.' },
      {
        type: 'paragraph',
        text: 'Fusce non neque vel lectus feugiat efficitur. Curabitur sed ligula sed turpis tempor efficitur. Integer commodo, mauris nec ultrices tristique, velit nisi cursus purus, vitae faucibus risus lorem sit amet ipsum.',
      },
      { type: 'figure', figure: { index: 2, title: 'Prototype undergoing assembly' } },
      { type: 'heading', id: 'testing', text: 'Testing & iteration' },
      {
        type: 'paragraph',
        text: 'Vivamus posuere, neque vitae consequat feugiat, lectus orci tincidunt libero, vitae aliquet tortor sapien nec risus. Donec vitae augue sed neque facilisis ultricies. Sed et orci nec lorem volutpat pellentesque. In hac habitasse platea dictumst. Pellentesque vel nulla vel orci suscipit consequat.',
      },
      {
        type: 'paragraph',
        text: 'Throughout the development process, emphasis has remained on iterative design and continuous refinement. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tincidunt sem eget neque tincidunt, vitae tincidunt lorem aliquam. Morbi eu risus vitae mauris feugiat pretium.',
      },
      { type: 'heading', id: 'ahead', text: 'Looking ahead' },
      {
        type: 'paragraph',
        text: 'Looking ahead, the project is expected to continue through several additional design iterations before reaching its final demonstration phase. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Praesent tristique neque vitae turpis fermentum, vel facilisis orci tincidunt.',
      },
      { type: 'figure', figure: { index: 3, title: 'Current project milestone' } },
      {
        type: 'paragraph',
        text: 'As documentation continues to expand, future updates will include detailed technical analysis, design revisions, testing outcomes, and engineering insights. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Donec sed elit at risus volutpat egestas.',
      },
      {
        type: 'paragraph',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus, odio non volutpat volutpat, mauris sapien efficitur elit, vitae tristique mauris elit quis purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
      },
    ],
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
