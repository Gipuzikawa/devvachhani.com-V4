import { useEffect, useRef, type DependencyList } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
function ensureScrollTrigger() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/**
 * Fade + rise a set of children on scroll-in (staggered). Attach the
 * returned ref to a container; direct descendants marked [data-reveal]
 * animate individually as they cross the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(deps: DependencyList = []) {
  const ref = useRef<T>(null);

  useEffect(() => {
    ensureScrollTrigger();
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = root.querySelectorAll<HTMLElement>('[data-reveal]');
    if (reduce) {
      items.forEach((i) => (i.style.opacity = '1'));
      return;
    }
    const ctx = gsap.context(() => {
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
        );
      });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
