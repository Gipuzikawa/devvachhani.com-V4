export interface ProjectData {
  index: string;
  title: string;
  summary?: string;
  tags?: string[];
  year?: string;
  /** Present only when a detail page exists — cards without one link to /work. */
  slug?: string;
}

export interface ProjectFigure {
  /** Figure number within the project (Fig. 01, 02, …). */
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
  figure: ProjectFigure;
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
  finalFigure: ProjectFigure;
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
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}
