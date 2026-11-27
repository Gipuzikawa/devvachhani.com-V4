import { useMemo, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useContactAnchor } from '../../hooks/useContactAnchor';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';
import { RouteTransition } from '../motion/RouteTransition';
import { useContent } from '../../sanity/ContentProvider';
import { usePreview } from '../../sanity/PreviewProvider';
import { IncompleteContentError } from '../../sanity/projectAdapters';
import { adaptSiteSettings, type SiteSettingsView } from '../../sanity/siteSettings';
import type { ContentResult } from '../../sanity/types';

export function Layout() {
  const outletRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  useContactAnchor(outletRef, footerRef);
  const content = useContent('siteSettings', {}, { scope: 'site' });
  const { refresh } = usePreview();
  const result = useMemo((): ContentResult<SiteSettingsView> => {
    if (content.status === 'loading' || content.status === 'error') return content;
    if (content.status === 'empty') return { status: 'error', message: 'Site settings are unavailable.' };
    try {
      const settings = adaptSiteSettings(content.data);
      return settings ? { status: 'ready', data: settings } : { status: 'error', message: 'Site settings are unavailable.' };
    } catch (error) {
      if (!(error instanceof IncompleteContentError)) throw error;
      return { status: 'error', message: 'Site settings are incomplete.' };
    }
  }, [content]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', color: 'var(--text-body)', fontFamily: 'var(--font-serif)' }}>
      <SiteNav wordmark={result.status === 'ready' ? result.data.wordmark : undefined} />
      <div ref={outletRef} style={{ position: 'relative', overflowX: 'clip' }}>
        <RouteTransition>
          <Outlet />
        </RouteTransition>
      </div>
      <SiteFooter footerRef={footerRef} result={result} retry={refresh} />
    </div>
  );
}
