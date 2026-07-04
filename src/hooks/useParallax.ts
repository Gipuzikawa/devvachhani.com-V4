import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
function ensureScrollTrigger() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/** Parallax: element drifts as it scrolls through the viewport. */
export function useParallax<T extends HTMLElement = HTMLDivElement>(strength = 60) {
  const ref = useRef<T>(null);

  useEffect(() => {
    ensureScrollTrigger();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -strength },
        { y: strength, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
    return () => ctx.revert();
  }, [strength]);

  return ref;
}
