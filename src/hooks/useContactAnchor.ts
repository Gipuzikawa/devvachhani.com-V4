import { useEffect, useRef, type RefObject } from 'react';
import { useLocation } from 'react-router-dom';

const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

export function useContactAnchor(outletRef: RefObject<HTMLElement | null>, footerRef: RefObject<HTMLElement | null>) {
  const { hash, pathname } = useLocation();
  const directContact = useRef(hash === '#contact');

  useEffect(() => {
    const outlet = outletRef.current;
    const footer = footerRef.current;
    if (hash !== '#contact' || !outlet || !footer) {
      directContact.current = false;
      return;
    }

    const scrollToFooter = () => footer.scrollIntoView({ behavior: 'instant' });
    // The browser may look for the initial fragment before the SPA mounts.
    // Later in-page Contact links retain their native fragment navigation.
    const frame = directContact.current ? requestAnimationFrame(() => {
      directContact.current = false;
      scrollToFooter();
    }) : undefined;

    const measure = () => {
      const { top, bottom } = footer.getBoundingClientRect();
      return { top: top + window.scrollY, bottom: bottom + window.scrollY };
    };
    let previous = measure();
    const visible = ({ top, bottom }: ReturnType<typeof measure>) =>
      top < window.scrollY + window.innerHeight && bottom > window.scrollY;
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
      const current = measure();
      // A loading route can expand under a reached fragment and push it
      // offscreen. Follow it only while its previous position is in view.
      if (visible(previous) && !visible(current)) scrollToFooter();
      previous = current;
    });
    observer?.observe(outlet);

    const stop = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      directContact.current = false;
      observer?.disconnect();
    };
    const stopOnScrollKey = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) stop();
    };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', stopOnScrollKey);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stopOnScrollKey);
    };
  }, [hash, pathname, outletRef, footerRef]);
}
