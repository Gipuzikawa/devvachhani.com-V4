import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { DUR, EASE, DECODE_CHARS, prefersReducedMotion } from '../motion/core';

export interface DecodeOptions {
  /** Scramble-settle duration in seconds. */
  duration?: number;
  /** ScrollTrigger start position for each item. */
  start?: string;
  /** Delay between successive items when several share one trigger moment. */
  each?: number;
}

/**
 * The site's signature mono entrance: labels are *printed* — each
 * [data-decode] descendant scrambles through catalogue glyphs and settles
 * left-to-right into its real text as it crosses the viewport. For the
 * display layer only (eyebrows, indices, metadata) — never body prose.
 *
 * While scrambling, aria-label carries the real text so assistive tech
 * never reads the noise; it's removed once the text settles. Under reduced
 * motion nothing scrambles and nothing is hidden.
 */
export function useDecode<T extends HTMLElement = HTMLDivElement>({
  duration = DUR.slow,
  start = 'top 88%',
  each = 0.08,
}: DecodeOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-decode]', root);

      /* Items whose triggers fire together (same scroll position) queue up
         a shared cascade offset so simultaneous labels still print in
         sequence rather than as one block. */
      let queued = 0;
      let flushAt = 0;

      items.forEach((el) => {
        const text = el.textContent ?? '';
        if (!text.trim()) return;
        gsap.set(el, { opacity: 0 });

        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: () => {
            const now = gsap.ticker.time;
            if (now - flushAt > 0.05) queued = 0;
            flushAt = now;
            const delay = queued * each;
            queued += 1;

            el.setAttribute('aria-label', text);
            gsap.to(el, { opacity: 1, duration: DUR.fast, ease: EASE.out, delay });
            gsap.to(el, {
              duration,
              delay,
              ease: 'none',
              scrambleText: { text, chars: DECODE_CHARS, speed: 0.4 },
              onComplete: () => el.removeAttribute('aria-label'),
            });
          },
        });
      });
    },
    { scope: ref },
  );

  return ref;
}
