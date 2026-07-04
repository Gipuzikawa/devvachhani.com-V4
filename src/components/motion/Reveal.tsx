import { useEffect, useRef, useState, Children, type CSSProperties, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  y?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
  style?: CSSProperties;
}

/**
 * Reveal — scroll-entrance primitive. Content starts hidden (opacity 0,
 * nudged down) and rises into place when it scrolls into view. Kept
 * dependency-free (IntersectionObserver) per the design system's own
 * spec — GSAP ScrollTrigger drives the same fade+rise via the
 * useScrollReveal hook where finer control (stagger across DOM children
 * already in the tree, parallax, reading progress) is needed.
 */
export function Reveal({ children, as: Tag = 'div', y = 24, delay = 0, stagger, once = true, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const transitionFor = (i = 0) =>
    `opacity var(--dur-reveal) var(--ease-emph) ${delay + i}s, transform var(--dur-reveal) var(--ease-emph) ${delay + i}s`;

  if (stagger != null) {
    const kids = Children.toArray(children);
    return (
      <Tag ref={ref} style={style}>
        {kids.map((child, i) => (
          <div
            key={i}
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
              transition: transitionFor(i * stagger),
              willChange: 'opacity, transform',
            }}
          >
            {child}
          </div>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
        transition: transitionFor(0),
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
