import { PortableText, type InferStrictComponents, type PortableTextComponentProps } from '@portabletext/react';
import type { CSSProperties } from 'react';
import type { ArticleTextBlock, FigureData, RichArticleBlock } from '../../types';
import { Figure } from '../ui/Figure';
import { useParallax } from '../../hooks/useParallax';
import { useSplitReveal } from '../../hooks/useSplitReveal';
import { safeArticleHref } from '../../sanity/articleValidation';

const prose: CSSProperties = { fontFamily: 'var(--font-serif)', fontSize: 'var(--t-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-body)', margin: '22px 0 0' };
function ArticleFigure({ value }: { value: { figure: FigureData } }) {
  const ref = useParallax<HTMLDivElement>(10);
  return <div data-reveal style={{ margin: '44px 0 0' }}><div ref={ref}><Figure {...value.figure} /></div></div>;
}
function PullQuote({ value }: { value: { text: string } }) {
  const ref = useSplitReveal<HTMLQuoteElement>();
  return <blockquote ref={ref} style={{ margin: 'clamp(40px,6vh,56px) 0 0', padding: '26px 0', borderTop: '1px solid var(--border-strong)',
    borderBottom: '1px solid var(--border-hairline)', fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', fontStyle: 'italic',
    fontWeight: 300, lineHeight: 'var(--lh-snug)', color: 'var(--text-strong)' }}>
    <span aria-hidden="true" style={{ color: 'var(--text-accent)' }}>“</span>{value.text}<span aria-hidden="true" style={{ color: 'var(--text-accent)' }}>”</span>
  </blockquote>;
}
function Heading({ value, children, index }: PortableTextComponentProps<ArticleTextBlock>) {
  const Tag = value.style === 'h3' ? 'h3' : 'h2';
  return <Tag id={value.sectionId} data-article-heading data-reveal style={{ fontFamily: 'var(--font-serif)',
    fontSize: value.style === 'h3' ? 'var(--t-md)' : 'var(--t-lg)', fontWeight: 400, lineHeight: 'var(--lh-snug)', letterSpacing: 'var(--track-tight)',
    color: 'var(--text-strong)', margin: index === 0 ? 0 : 'clamp(44px,7vh,64px) 0 0', paddingBottom: 14,
    borderBottom: '1px solid var(--border-hairline)', scrollMarginTop: 96 }}>{children}</Tag>;
}
const components = {
  block: {
    normal: ({ children, value }: PortableTextComponentProps<ArticleTextBlock>) => <p className={value.dropCap ? 'article-drop-cap' : undefined} style={prose}>{children}</p>,
    h2: Heading, h3: Heading,
  },
  types: { figure: ArticleFigure, pullQuote: PullQuote },
  marks: {
    link: ({ children, value }) => safeArticleHref(value?.href) ?
      <a href={value.href} rel={/^https?:/i.test(value.href) ? 'noopener noreferrer' : undefined} style={{ color: 'var(--text-accent)' }}>{children}</a> : <>{children}</>,
  },
  list: {
    bullet: ({ children }) => <ul style={{ ...prose, paddingLeft: 28 }}>{children}</ul>,
    number: ({ children }) => <ol style={{ ...prose, paddingLeft: 28 }}>{children}</ol>,
  },
  listItem: { bullet: ({ children }) => <li>{children}</li>, number: ({ children }) => <li>{children}</li> },
} satisfies InferStrictComponents<RichArticleBlock[]>;
export function ArticleBody({ body }: { body: RichArticleBlock[] }) {
  return <PortableText value={body} components={components} />;
}
