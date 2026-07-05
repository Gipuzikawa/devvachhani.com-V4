import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText, cssToken, prefersReducedMotion } from '../motion/core';

export interface InkResolveOptions {
  /** Token the un-read lines start at. */
  fromToken?: string;
  /** Token the lines resolve to as the read line passes. */
  toToken?: string;
  /** Scrub range — where in the viewport lines begin and finish resolving. */
  start?: string;
  end?: string;
}

/**
 * Ink resolve: a lead paragraph's lines sit faint on the page and darken
 * to full ink as the reader's scroll position sweeps over them — the ink
 * dries where you read. Color-only (no transform, no reflow) so the text
 * is never disturbed while being read; it's for *lead* display paragraphs,
 * not article body copy. Under reduced motion the text renders at full ink.
 */
export function useInkResolve<T extends HTMLElement = HTMLParagraphElement>({
  fromToken = '--text-faint',
  toToken = '--text-body',
  start = 'top 78%',
  end = 'bottom 45%',
}: InkResolveOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const from = cssToken(fromToken);
      const to = cssToken(toToken);

      SplitText.create(el, {
        type: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.lines,
            { color: from },
            {
              color: to,
              ease: 'none',
              stagger: 0.5,
              scrollTrigger: { trigger: el, start, end, scrub: true },
            },
          );
        },
      });
    },
    { scope: ref },
  );

  return ref;
}
