import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Jumps to top on route change, but leaves in-page hash links (e.g. #contact) alone. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
