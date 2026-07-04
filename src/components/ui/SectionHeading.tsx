import type { CSSProperties } from 'react';

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title?: string;
  align?: 'left' | 'center';
  rule?: boolean;
  style?: CSSProperties;
}

/**
 * SectionHeading — the archival section marker. A mono index number +
 * eyebrow sit above a serif title, divided from the content below by a
 * full hairline rule. This is the primary rhythm device across the site.
 */
export function SectionHeading({ index, eyebrow, title, align = 'left', rule = true, style }: SectionHeadingProps) {
  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        textAlign: align,
        alignItems: align === 'center' ? 'center' : 'stretch',
        paddingBottom: rule ? '20px' : 0,
        borderBottom: rule ? '1px solid var(--border-strong)' : 'none',
        ...style,
      }}
    >
      {(index || eyebrow) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: align === 'center' ? 'center' : 'flex-start',
            gap: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--t-micro)',
            letterSpacing: 'var(--track-label)',
            textTransform: 'uppercase',
          }}
        >
          {index && <span style={{ color: 'var(--text-accent)', fontWeight: 'var(--w-medium)' as CSSProperties['fontWeight'] }}>{index}</span>}
          {eyebrow && <span style={{ color: 'var(--text-muted)' }}>{eyebrow}</span>}
        </div>
      )}
      {title && (
        <h2
          style={{
            fontSize: 'var(--t-xl)',
            fontWeight: 'var(--w-regular)' as CSSProperties['fontWeight'],
            lineHeight: 'var(--lh-snug)',
            letterSpacing: 'var(--track-tight)',
            color: 'var(--text-strong)',
            maxWidth: align === 'center' ? '18ch' : 'none',
          }}
        >
          {title}
        </h2>
      )}
    </header>
  );
}
