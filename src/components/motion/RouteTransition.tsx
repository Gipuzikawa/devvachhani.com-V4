import { useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { DUR, EASE, prefersReducedMotion } from '../../motion/core';

/**
 * Enter-only route transition: the incoming page fades + rises softly on
 * navigation. Deliberately no exit choreography — outgoing animation delays
 * navigation and fights the archival, direct feel. Keyed by pathname so
 * navigating between two URLs that render the same component (e.g. two
 * project slugs) still re-enters.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useGSAP(
    () => {
      /* The page under us just changed height; persistent triggers (the
         footer's reveal) must recompute against the new layout. Page-scoped
         triggers were just created with fresh positions, so this is cheap
         and harmless for them. */
      ScrollTrigger.refresh();

      if (prefersReducedMotion()) {
        firstRender.current = false;
        return;
      }
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 12 },
        // clearProps: a lingering transform would turn this wrapper into a
        // containing block for any position:fixed descendant (e.g. a future
        // reading-progress bar).
        { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.out, clearProps: 'all' },
      );

      /* The sweep: a cobalt hairline draws across the top as the new page
         enters — the same line the article's reading-progress bar lives on,
         so navigation visually hands off to reading. Skipped on first load
         (that moment belongs to the hero) and never delays navigation. */
      if (firstRender.current) {
        firstRender.current = false;
      } else if (sweepRef.current) {
        gsap
          .timeline()
          .fromTo(sweepRef.current, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: DUR.slow, ease: EASE.emph })
          .to(sweepRef.current, { opacity: 0, duration: DUR.base, ease: EASE.out });
      }
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <>
      <div
        ref={sweepRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'var(--cobalt)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          opacity: 0,
          zIndex: 100,
          pointerEvents: 'none',
        }}
      />
      <div key={pathname} ref={ref}>
        {children}
      </div>
    </>
  );
}
