import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DUR, EASE, prefersReducedMotion } from '../motion/core';

export interface MagneticOptions {
  /** How far the element follows the cursor, as a fraction of the offset. */
  strength?: number;
}

/**
 * Magnetic pull: the element leans toward the cursor while hovered and
 * springs back on leave. An accent, not a signature — reserve it for small
 * interactive atoms (the wordmark tick, CTAs). Only active on fine-pointer
 * hover devices; touch and reduced-motion users get a static element.
 */
export function useMagnetic<T extends HTMLElement = HTMLSpanElement>({ strength = 0.35 }: MagneticOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const xTo = gsap.quickTo(el, 'x', { duration: DUR.base, ease: EASE.out });
        const yTo = gsap.quickTo(el, 'y', { duration: DUR.base, ease: EASE.out });
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: DUR.slow, ease: EASE.spring, overwrite: 'auto' });
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        };
      });
    },
    { scope: ref },
  );

  return ref;
}
