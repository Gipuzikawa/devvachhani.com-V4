import type { PortableTextBlock, PortableTextSpan } from '@portabletext/types';

export type ArticleLink = { _type: 'link'; _key: string; href: string };
export type ArticleTextBlock = PortableTextBlock<ArticleLink, PortableTextSpan, 'normal' | 'h2' | 'h3', 'bullet' | 'number'> & {
  _type: 'block'; _key: string; sectionId?: string; dropCap?: boolean;
};
export type RichArticleBlock = ArticleTextBlock | { _type: 'figure'; _key: string; figure: FigureData } |
  { _type: 'pullQuote'; _key: string; text: string };

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
  alt?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
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

/* Legacy static source contract retained for versioned migration fixtures.
   Sanity reading pages use RichArticleBlock above. */
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
