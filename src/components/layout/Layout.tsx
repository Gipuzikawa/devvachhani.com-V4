import { Outlet } from 'react-router-dom';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';
import { RouteTransition } from '../motion/RouteTransition';
import { navProps, footerProps } from '../../data/content';

/** Persistent shell — nav and footer render once; routed pages swap in between. */
export function Layout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', color: 'var(--text-body)', fontFamily: 'var(--font-serif)' }}>
      <SiteNav {...navProps} />
      <div style={{ position: 'relative', overflowX: 'clip' }}>
        <RouteTransition>
          <Outlet />
        </RouteTransition>
      </div>
      <SiteFooter {...footerProps} />
    </div>
  );
}
