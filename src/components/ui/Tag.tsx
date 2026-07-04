import type { CSSProperties, ReactNode } from 'react';

type Variant = 'outline' | 'filled' | 'accent';

interface TagProps {
  children: ReactNode;
  variant?: Variant;
  style?: CSSProperties;
}

const variants: Record<Variant, CSSProperties> = {
  outline: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-hairline)' },
  filled: { background: 'var(--bg-recessed)', color: 'var(--text-body)', border: '1px solid transparent' },
  accent: { background: 'var(--accent-wash)', color: 'var(--accent-press)', border: '1px solid transparent' },
};

/**
 * Tag — a small mono label. Used for topic/discipline tags, statuses, and
 * index categories. Hairline-bordered by default; `filled` and `accent`
 * for emphasis.
 */
export function Tag({ children, variant = 'outline', style }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--t-micro)',
        fontWeight: 'var(--w-medium)' as CSSProperties['fontWeight'],
        letterSpacing: 'var(--track-wide)',
        textTransform: 'uppercase',
        lineHeight: 1,
        padding: '5px 9px',
        borderRadius: 'var(--r-1)',
        whiteSpace: 'nowrap',
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
