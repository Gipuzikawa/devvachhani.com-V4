import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DUR, EASE, REVEAL_RISE, prefersReducedMotion } from '../motion/core';

export interface StaggerOptions {
  /** Entrance rise distance in px. */
  y?: number;
  /** Per-item entrance duration in seconds. */
  duration?: number;
  /** Delay between successive items in seconds. */
  each?: number;
  /** ScrollTrigger start position for the container. */
  start?: string;
  /**
   * Re-run the entrance when these change (e.g. a filter). If the container
   * is already in view, the group re-enters immediately — this replaces the
   * old pattern of re-running per-item scroll reveals on state change.
   * (Mutable array type because that's what useGSAP's config accepts.)
   */
  dependencies?: unknown[];
}

/**
 * Orchestrated group entrance. Attach the returned ref to a container; its
 * direct children fade + rise as one staggered sequence when the container
 * crosses the viewport. Right for grids and rows whose items sit side by
 * side — per-item triggers would fire all at once with no rhythm.
 */
export function useStagger<T extends HTMLElement = HTMLDivElement>({
  y = REVEAL_RISE,
  duration = DUR.reveal,
  each = 0.09,
  start = 'top 88%',
  dependencies = [],
}: StaggerOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const items = Array.from(root.children);
      if (items.length === 0) return;
      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: EASE.emph,
          stagger: each,
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: root, start, once: true },
        },
      );
    },
    { scope: ref, dependencies, revertOnUpdate: true },
  );

  return ref;
}
