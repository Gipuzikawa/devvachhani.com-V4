import { useState, type CSSProperties, type RefObject } from 'react';
import { useContentLayout } from '../../hooks/useContentLayout';
import { useReveal } from '../../hooks/useReveal';
import { useSplitReveal } from '../../hooks/useSplitReveal';
import { useDecode } from '../../hooks/useDecode';
import type { SiteSettingsView } from '../../sanity/siteSettings';
import type { ContentResult } from '../../sanity/types';
import type { FooterLink } from '../../types';
import { ContentState } from '../ui/ContentState';

export function SiteFooter({ footerRef, result, retry }: {
  footerRef: RefObject<HTMLElement | null>; result: ContentResult<SiteSettingsView>; retry: () => void;
}) {
  const settings = result.status === 'ready' ? result.data : null;
  // SplitText and decode own their rendered text. Rebuild their subtree
  // only when the authored footer presentation changes.
  const footerKey = settings && JSON.stringify([
    settings.footerSignoff, settings.contactEmail, settings.footerMeta, settings.footerColophon,
    settings.socialLinks.map(({ label, href }) => [label, href]),
  ]);
  useContentLayout(footerRef, JSON.stringify([footerKey, settings?.wordmark, result.status, result.status === 'error' && result.message]));

  return (
    <footer
      ref={footerRef}
      id="contact"
      style={{
        background: 'var(--bg-invert)',
        color: 'var(--text-invert)',
        padding: 'var(--s-9) var(--page-margin) var(--s-6)',
        scrollMarginTop: '88px',
      }}
    >
      {settings ? <FooterContent key={footerKey} settings={settings} /> :
        <div style={{ maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
          <ContentState result={result} retry={retry} loadingMessage="Loading site settings…" />
        </div>
      }
    </footer>
  );
}

function FooterContent({ settings }: { settings: SiteSettingsView }) {
  const ref = useReveal<HTMLDivElement>();
  const signoffRef = useSplitReveal<HTMLHeadingElement>();
  const colophonRef = useDecode<HTMLDivElement>();

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2
            ref={signoffRef}
            style={{ fontSize: 'var(--t-xxl)', fontWeight: 'var(--w-light)' as CSSProperties['fontWeight'], letterSpacing: 'var(--track-tight)', lineHeight: 'var(--lh-tight)', color: 'var(--text-invert)' }}
          >
            {settings.footerSignoff}
          </h2>
          <a
            data-reveal
            href={settings.emailHref}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--t-md)',
              fontStyle: 'italic',
              color: 'var(--text-accent)',
              textDecoration: 'none',
              width: 'fit-content',
              borderBottom: '1px solid currentColor',
              paddingBottom: '2px',
            }}
          >
            {settings.contactEmail}
          </a>
        </div>
        <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
          {settings.socialLinks.map(link => (
            <FooterLinkItem key={link.key} link={link} />
          ))}
          <FooterLinkItem link={{ label: 'Email', href: settings.emailHref }} />
        </div>
      </div>
      <div
        ref={colophonRef}
        style={{
          maxWidth: 'var(--measure-wide)',
          margin: '0 auto',
          marginTop: 'var(--s-8)',
          paddingTop: '18px',
          borderTop: '1px solid rgba(255,255,255,0.16)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-micro)',
          letterSpacing: 'var(--track-wide)',
          textTransform: 'uppercase',
          color: 'color-mix(in srgb, var(--text-invert) 60%, transparent)',
        }}
      >
        <span data-decode>{settings.footerMeta}</span>
        <span data-decode>{settings.footerColophon}</span>
      </div>
    </div>
  );
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={link.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--t-meta)',
        letterSpacing: 'var(--track-wide)',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: hover ? 'var(--text-accent)' : 'var(--text-invert)',
        transition: 'color var(--dur-fast) var(--ease-out)',
      }}
    >
      {link.label} ↗
    </a>
  );
}
