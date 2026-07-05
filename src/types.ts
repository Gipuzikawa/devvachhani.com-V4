export interface ProjectData {
  index: string;
  title: string;
  summary?: string;
  tags?: string[];
  year?: string;
  /** Present only when a detail page exists — cards without one link to /work. */
  slug?: string;
}

/** A figure plate — shared by project pages and articles. */
export interface FigureData {
  /** Figure number within the page (Fig. 01, 02, …). */
  index: number;
  title: string;
  /** width / height; frames reserve this space so figures never reflow text. */
  aspect?: number;
  /** Real image, when one exists. Absent = blank archival placeholder frame. */
  src?: string;
}

export interface ProjectMilestone {
  date: string;
  title: string;
  body: string;
  figure: FigureData;
}

export interface ProjectDetail {
  slug: string;
  index: string;
  title: string;
  year: string;
  /** 'placeholder' renders the discreet build-log-in-progress notice. */
  status: 'placeholder' | 'live';
  intro: string;
  toolGroups: { label: string; items: string[] }[];
  skills: string[];
  milestones: ProjectMilestone[];
  finalFigure: FigureData;
  specs: { k: string; v: string }[];
  reflections: {
    wentWell: string;
    challenges: string;
    improvements: string[];
    closing: string;
  };
}

export interface ArticleData {
  title: string;
  dek?: string;
  date?: string;
  readTime?: string;
  category?: string;
  /** Present only when a reading page exists. */
  slug?: string;
}

/* Article bodies are typed blocks, not Markdown — the reactive reading
   features (TOC, progress, figure triggers) bind to a first-class content
   contract, and no parser dependency is needed. */
export type ArticleBlock =
  | { type: 'paragraph'; text: string; dropCap?: boolean }
  | { type: 'heading'; id: string; text: string }
  | { type: 'figure'; figure: FigureData }
  | { type: 'pullquote'; text: string };

export interface ArticleDetail {
  slug: string;
  title: string;
  dek: string;
  date: string;
  readTime: string;
  category: string;
  /** 'placeholder' renders the discreet placeholder notice. */
  status: 'placeholder' | 'live';
  blocks: ArticleBlock[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}
