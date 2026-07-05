import type { CSSProperties } from 'react';
import { useSplitReveal } from '../../hooks/useSplitReveal';
import { useDecode } from '../../hooks/useDecode';

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title?: string;
  align?: 'left' | 'center';
  rule?: boolean;
  /** Self-animates by default — set false when a parent choreographs it. */
  animate?: boolean;
  style?: CSSProperties;
}

/**
 * SectionHeading — the archival section marker. A mono index number +
 * eyebrow sit above a serif title, divided from the content below by a
 * full hairline rule. This is the primary rhythm device across the site,
 * so it carries the signature entrance itself: the mono line *prints*
 * (decode) and the serif title is *set* (masked line rise).
 */
export function SectionHeading({ index, eyebrow, title, align = 'left', rule = true, animate = true, style }: SectionHeadingProps) {
  const metaRef = useDecode<HTMLDivElement>();
  const titleRef = useSplitReveal<HTMLHeadingElement>();

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
          ref={animate ? metaRef : undefined}
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
          {index && (
            <span data-decode={animate ? '' : undefined} style={{ color: 'var(--text-accent)', fontWeight: 'var(--w-medium)' as CSSProperties['fontWeight'] }}>
              {index}
            </span>
          )}
          {eyebrow && (
            <span data-decode={animate ? '' : undefined} style={{ color: 'var(--text-muted)' }}>
              {eyebrow}
            </span>
          )}
        </div>
      )}
      {title && (
        <h2
          ref={animate ? titleRef : undefined}
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
