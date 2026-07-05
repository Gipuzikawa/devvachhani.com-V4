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

  useGSAP(
    () => {
      /* The page under us just changed height; persistent triggers (the
         footer's reveal) must recompute against the new layout. Page-scoped
         triggers were just created with fresh positions, so this is cheap
         and harmless for them. */
      ScrollTrigger.refresh();

      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 12 },
        // clearProps: a lingering transform would turn this wrapper into a
        // containing block for any position:fixed descendant (e.g. a future
        // reading-progress bar).
        { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.out, clearProps: 'all' },
      );
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div key={pathname} ref={ref}>
      {children}
    </div>
  );
}
