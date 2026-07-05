import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../motion/core';

export interface PinnedOptions {
  /** ScrollTrigger start for the pin. */
  start?: string;
  /** How long the hold lasts (ScrollTrigger end, relative). */
  end?: string;
  /**
   * Media query gating the pin. Pinning a section taller than the viewport
   * reads broken, so this defaults to desktop widths; below it, content
   * renders statically in final state.
   */
  media?: string;
  /** Adds the tweens that play (scrubbed) through the hold. */
  build?: (tl: gsap.core.Timeline, root: HTMLElement) => void;
}

/**
 * Pin-and-hold: the ref'd section pins in place through a scroll range while
 * a scrubbed timeline plays — the "hold and reveal" moment. Under reduced
 * motion (or below the media query) nothing pins and nothing is hidden:
 * content sits in its natural, final state.
 */
export function usePinned<T extends HTMLElement = HTMLDivElement>({
  start = 'top 18%',
  end = '+=70%',
  media = '(min-width: 900px)',
  build,
}: PinnedOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      // matchMedia registers with the surrounding useGSAP context, so it is
      // reverted (pin-spacer removed, tweens killed) on unmount.
      const mm = gsap.matchMedia();
      mm.add(media, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start, end, pin: true, scrub: true },
        });
        build?.(tl, root);
      });
    },
    { scope: ref },
  );

  return ref;
}
