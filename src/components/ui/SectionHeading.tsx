import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSplitReveal } from '../../hooks/useSplitReveal';
import { useDecode } from '../../hooks/useDecode';
import { DUR, EASE, prefersReducedMotion } from '../../motion/core';

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
 * full rule. This is the primary rhythm device across the site, so it
 * carries the signature entrance itself: the mono line *prints* (decode),
 * the serif title is *set* (masked line rise), and the rule draws itself
 * across the page beneath them.
 */
export function SectionHeading({ index, eyebrow, title, align = 'left', rule = true, animate = true, style }: SectionHeadingProps) {
  const rootRef = useRef<HTMLElement>(null);
  const metaRef = useDecode<HTMLDivElement>();
  const titleRef = useSplitReveal<HTMLHeadingElement>();

  useGSAP(
    () => {
      if (!animate || prefersReducedMotion()) return;
      const line = rootRef.current?.querySelector('[data-rule]');
      if (!line) return;
      gsap.fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: DUR.reveal, ease: EASE.emph, scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once: true } },
      );
    },
    { scope: rootRef },
  );

  return (
    <header
      ref={rootRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        textAlign: align,
        alignItems: align === 'center' ? 'center' : 'stretch',
        paddingBottom: rule ? '20px' : 0,
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
      {rule && (
        <span
          data-rule
          aria-hidden="true"
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: 'var(--border-strong)', transformOrigin: 'left' }}
        />
      )}
    </header>
  );
}
