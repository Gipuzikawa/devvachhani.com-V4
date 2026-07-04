import { useState, type CSSProperties } from 'react';
import type { ArticleData } from '../../types';

interface ArticleCardProps extends ArticleData {
  href?: string;
  style?: CSSProperties;
}

/**
 * ArticleCard — a writing-index row. Bibliographic in feel: mono date +
 * read time on one line, serif headline, optional dek. Designed to stack
 * in a ruled list (top hairline per row). The headline underlines in
 * cobalt on hover.
 */
export function ArticleCard({ title, dek, date, readTime, category, href = '#', style }: ArticleCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr)',
        gap: '12px',
        padding: '28px 0',
        borderTop: '1px solid var(--border-hairline)',
        textDecoration: 'none',
        color: 'var(--text-body)',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'baseline',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-micro)',
          letterSpacing: 'var(--track-wide)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {category && <span style={{ color: 'var(--text-accent)' }}>{category}</span>}
        {date && <span>{date}</span>}
        {readTime && <span style={{ color: 'var(--text-faint)' }}>{readTime} read</span>}
      </div>
      <h3
        style={{
          fontSize: 'var(--t-lg)',
          fontWeight: 'var(--w-regular)' as CSSProperties['fontWeight'],
          lineHeight: 'var(--lh-snug)',
          letterSpacing: 'var(--track-tight)',
          color: hover ? 'var(--text-accent)' : 'var(--text-strong)',
          maxWidth: '24ch',
          width: 'fit-content',
          backgroundImage: 'linear-gradient(currentColor, currentColor)',
          backgroundSize: hover ? '100% 1px' : '0% 1px',
          backgroundPosition: '0 100%',
          backgroundRepeat: 'no-repeat',
          transition: 'background-size var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
        }}
      >
        {title}
      </h3>
      {dek && <p style={{ fontSize: 'var(--t-body)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)', maxWidth: '56ch' }}>{dek}</p>}
    </a>
  );
}
