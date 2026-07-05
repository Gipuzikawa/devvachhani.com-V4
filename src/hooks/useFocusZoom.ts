import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../motion/core';

export interface FocusZoomOptions {
  /** Out-of-focus scale (element scrubs between this and 1). */
  scale?: number;
  /** Out-of-focus opacity. */
  dim?: number;
  /** Viewport line (as ScrollTrigger %) where the approach completes — keep in sync with the read line the rest of the page uses. */
  focusLine?: string;
}

/**
 * Scroll-scrubbed focus cycle: the element zooms in (scale + ink) as it
 * approaches the read line, holds completely static at full scale while it
 * sits in the reading band, then zooms back out and dims once it has been
 * read — a card-by-card focus hand-off down a timeline.
 *
 * The plateau in the middle is the point: text is never mid-scale (soft)
 * or moving while it's actually being read, which keeps the "body copy
 * never animates while read" rule intact. Only use this on blocks tall
 * enough that the approach and departure zones can't overlap (roughly
 * >25% of the viewport).
 *
 * Transform-origin is the left edge so content stays anchored to whatever
 * spine/margin it sits against instead of swimming sideways.
 */
export function useFocusZoom<T extends HTMLElement = HTMLDivElement>({
  scale = 0.93,
  dim = 0.45,
  focusLine = '60%',
}: FocusZoomOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      gsap.set(el, { transformOrigin: '0% 50%' });

      // Approach: rise into focus, landing at scale 1 exactly on the read line.
      gsap.fromTo(
        el,
        { scale, opacity: dim },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 98%', end: `top ${focusLine}`, scrub: true },
        },
      );

      // Departure: once the block's bottom clears the reading band, recede.
      // immediateRender:false so this tween doesn't stomp the approach's
      // initial state at load — standard GSAP rule for two scrubs on one target.
      gsap.fromTo(
        el,
        { scale: 1, opacity: 1 },
        {
          scale,
          opacity: dim,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'bottom 40%', end: 'bottom 8%', scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return ref;
}
