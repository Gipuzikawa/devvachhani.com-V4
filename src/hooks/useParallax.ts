import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../motion/core';

/**
 * Scrub-linked parallax: the element drifts vertically (±strength px) as it
 * travels through the viewport. Give it breathing room — the drift overshoots
 * the element's resting position in both directions.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(strength = 60) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { y: -strength },
        { y: strength, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    },
    { scope: ref, dependencies: [strength], revertOnUpdate: true },
  );

  return ref;
}
