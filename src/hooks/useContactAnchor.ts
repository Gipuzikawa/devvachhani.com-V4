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
    const shell = footer.parentElement;

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
      const liveHash = window.location.hash;
      // A loading route can expand under a reached fragment and push it
      // offscreen. An article outline can change the live hash outside Router.
      if ((!liveHash || liveHash === hash) && visible(previous) && !visible(current)) scrollToFooter();
      previous = current;
    });
    observer?.observe(outlet);

    const resumeOnContact = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href="#contact"]') : null;
      if (!link || !shell?.contains(link) || link.hasAttribute('download') || (link.target && link.target.toLowerCase() !== '_self')) return;
      // Repeating a native fragment link may leave Router's location unchanged.
      previous = measure();
      observer?.observe(outlet);
    };

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
    window.addEventListener('click', resumeOnContact);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stopOnScrollKey);
      window.removeEventListener('click', resumeOnContact);
    };
  }, [hash, pathname, outletRef, footerRef]);
}
