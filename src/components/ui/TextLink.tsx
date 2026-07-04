import { useState, type CSSProperties, type ReactNode } from 'react';

type Variant = 'underline' | 'arrow' | 'plain';
type Tone = 'accent' | 'ink';

interface TextLinkProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  tone?: Tone;
  style?: CSSProperties;
}

/**
 * TextLink — an inline reading link. Cobalt by default with an animated
 * underline that draws in on hover. `arrow` is the standing "index" link
 * with a trailing mark that slides on hover.
 */
export function TextLink({ children, href = '#', variant = 'underline', tone = 'accent', style }: TextLinkProps) {
  const [hover, setHover] = useState(false);
  const color = tone === 'ink' ? 'var(--text-strong)' : 'var(--text-accent)';

  const base: CSSProperties = {
    color,
    fontFamily: variant === 'arrow' ? 'var(--font-mono)' : 'inherit',
    fontSize: variant === 'arrow' ? 'var(--t-meta)' : 'inherit',
    letterSpacing: variant === 'arrow' ? 'var(--track-wide)' : 'inherit',
    textTransform: variant === 'arrow' ? 'uppercase' : 'none',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: variant === 'arrow' ? '8px' : 0,
    position: 'relative',
    cursor: 'pointer',
    ...style,
  };

  if (variant === 'underline') {
    base.backgroundImage = 'linear-gradient(currentColor, currentColor)';
    base.backgroundSize = hover ? '100% 1px' : '0% 1px';
    base.backgroundPosition = '0 100%';
    base.backgroundRepeat = 'no-repeat';
    base.paddingBottom = '1px';
    base.transition = 'background-size var(--dur-base) var(--ease-out)';
  }

  return (
    <a href={href} style={base} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
      {variant === 'arrow' && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            transition: 'transform var(--dur-base) var(--ease-out)',
            transform: hover ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          →
        </span>
      )}
    </a>
  );
}
