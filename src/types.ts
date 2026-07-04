export interface ProjectData {
  index: string;
  title: string;
  summary?: string;
  tags?: string[];
  year?: string;
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
