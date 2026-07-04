import { useState, type CSSProperties, type ReactNode } from 'react';

type Variant = 'solid' | 'accent' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  disabled?: boolean;
  iconRight?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}

const sizes: Record<Size, CSSProperties> = {
  sm: { padding: '8px 14px', fontSize: 'var(--t-micro)' },
  md: { padding: '12px 20px', fontSize: 'var(--t-meta)' },
  lg: { padding: '16px 28px', fontSize: 'var(--t-sm)' },
};

const variants: Record<Variant, CSSProperties> = {
  solid: { background: 'var(--ink-0)', color: 'var(--text-invert)', border: '1px solid var(--ink-0)' },
  accent: { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' },
  outline: { background: 'transparent', color: 'var(--text-strong)', border: '1px solid var(--border-strong)' },
  ghost: { background: 'transparent', color: 'var(--text-strong)', border: '1px solid transparent' },
};

/**
 * Button — the system's action control. Sharp-cornered, hairline or solid
 * ink, with the cobalt accent reserved for the primary intent. Mono label,
 * wide tracking, uppercase — it reads like an index affordance.
 */
export function Button({
  children,
  variant = 'solid',
  size = 'md',
  href,
  disabled = false,
  iconRight,
  style,
  onClick,
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'var(--w-medium)' as CSSProperties['fontWeight'],
    letterSpacing: 'var(--track-wide)',
    textTransform: 'uppercase',
    lineHeight: 1,
    borderRadius: 'var(--r-1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition:
      'transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transform: pressed ? 'translateY(1px)' : 'translateY(0)',
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  if (hover && !disabled) {
    if (variant === 'outline' || variant === 'ghost') {
      base.background = 'var(--ink-0)';
      base.color = 'var(--text-invert)';
    } else if (variant === 'accent') {
      base.background = 'var(--accent-press)';
    } else {
      base.background = 'var(--ink-1)';
    }
  }

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPressed(false);
    },
    onMouseDown: () => !disabled && setPressed(true),
    onMouseUp: () => setPressed(false),
  };

  const content = (
    <>
      {children}
      {iconRight && (
        <span aria-hidden="true" style={{ fontSize: '1.1em', lineHeight: 0 }}>
          {iconRight}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} style={base} onClick={onClick} {...handlers}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" disabled={disabled} style={base} onClick={onClick} {...handlers}>
      {content}
    </button>
  );
}
