import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DUR, EASE, REVEAL_RISE, prefersReducedMotion } from '../motion/core';

export interface RevealOptions {
  /** Entrance rise distance in px. */
  y?: number;
  /** Entrance duration in seconds. */
  duration?: number;
  /** ScrollTrigger start position for each item. */
  start?: string;
}

/**
 * Canonical scroll entrance. Attach the returned ref to a container; every
 * [data-reveal] descendant fades + rises individually as it crosses the
 * viewport. Right for vertical lists and long flows where items enter one
 * at a time — for a set that should enter together as one choreographed
 * group, use useStagger instead.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  y = REVEAL_RISE,
  duration = DUR.reveal,
  start = 'top 88%',
}: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', ref.current);
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          { opacity: 1, y: 0, duration, ease: EASE.emph, scrollTrigger: { trigger: el, start, once: true } },
        );
      });
    },
    { scope: ref },
  );

  return ref;
}
