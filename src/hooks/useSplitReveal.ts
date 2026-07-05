import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DUR, EASE, SplitText, prefersReducedMotion } from '../motion/core';

export interface SplitRevealOptions {
  /**
   * Split granularity. Lines rise as whole strips (the workhorse for
   * section titles); words/chars are for display set-pieces where the
   * type should visibly assemble.
   */
  by?: 'lines' | 'words' | 'chars';
  /** Per-fragment entrance duration in seconds. */
  duration?: number;
  /** Delay between successive fragments in seconds. */
  each?: number;
  /** ScrollTrigger start position. */
  start?: string;
  /** Extra delay before the entrance begins — for choreographing with siblings. */
  delay?: number;
  /** Play on mount instead of on scroll (above-the-fold heroes). */
  immediate?: boolean;
}

/**
 * The site's signature serif entrance: text is *set* — each line (or word,
 * or char) rises into place from behind a mask, the way type comes together
 * on a press bed. Attach the returned ref to the text element itself.
 *
 * autoSplit re-splits on font load / width changes so line breaks stay
 * honest; the tween returned from onSplit is what makes that safe (GSAP
 * kills and rebuilds it on each re-split). Under reduced motion the text is
 * never split and never hidden.
 */
export function useSplitReveal<T extends HTMLElement = HTMLHeadingElement>({
  by = 'lines',
  duration = DUR.reveal,
  each,
  start = 'top 85%',
  delay = 0,
  immediate = false,
}: SplitRevealOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const stagger = each ?? (by === 'chars' ? 0.016 : by === 'words' ? 0.045 : 0.09);

      SplitText.create(el, {
        type: by === 'lines' ? 'lines' : `lines,${by}`,
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          const targets = by === 'lines' ? self.lines : by === 'words' ? self.words : self.chars;
          return gsap.from(targets, {
            yPercent: 120,
            duration,
            ease: EASE.emph,
            stagger,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
          });
        },
      });
    },
    { scope: ref },
  );

  return ref;
}
