import { useState, type CSSProperties } from 'react';
import type { FooterLink } from '../../types';

interface SiteFooterProps {
  signoff?: string;
  email?: string;
  links?: FooterLink[];
  meta?: string;
  invert?: boolean;
  style?: CSSProperties;
}

/**
 * SiteFooter — the closing colophon. A large serif sign-off / contact
 * line, a row of mono index links, and a baseline of metadata (year,
 * location, "built with"). Sits on a full top rule; optionally inverts
 * to ink ground.
 */
export function SiteFooter({
  signoff = 'Let’s build something.',
  email = 'hello@devvachhani.com',
  links = [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Email', href: '#' },
  ],
  meta = '© 2026 Dev Vachhani',
  invert = false,
  style,
}: SiteFooterProps) {
  const fg = invert ? 'var(--text-invert)' : 'var(--text-strong)';
  const muted = invert ? 'color-mix(in srgb, var(--text-invert) 60%, transparent)' : 'var(--text-muted)';

  return (
    <footer
      id="contact"
      style={{
        background: invert ? 'var(--bg-invert)' : 'transparent',
        color: fg,
        borderTop: invert ? 'none' : '1px solid var(--border-strong)',
        padding: 'var(--s-9) var(--page-margin) var(--s-6)',
        scrollMarginTop: '88px',
        ...style,
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: 'var(--t-xxl)', fontWeight: 'var(--w-light)' as CSSProperties['fontWeight'], letterSpacing: 'var(--track-tight)', lineHeight: 'var(--lh-tight)', color: fg }}>
            {signoff}
          </h2>
          <a
            href={`mailto:${email}`}
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
            {email}
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
          {links.map((l) => (
            <FooterLinkItem key={l.label} link={l} fg={fg} />
          ))}
        </div>
      </div>
      <div
        style={{
          maxWidth: 'var(--measure-wide)',
          margin: '0 auto',
          marginTop: 'var(--s-8)',
          paddingTop: '18px',
          borderTop: `1px solid ${invert ? 'rgba(255,255,255,0.16)' : 'var(--border-hairline)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-micro)',
          letterSpacing: 'var(--track-wide)',
          textTransform: 'uppercase',
          color: muted,
        }}
      >
        <span>{meta}</span>
        <span>Set in Newsreader & IBM Plex Mono</span>
      </div>
    </footer>
  );
}

function FooterLinkItem({ link, fg }: { link: FooterLink; fg: string }) {
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
        color: hover ? 'var(--text-accent)' : fg,
        transition: 'color var(--dur-fast) var(--ease-out)',
      }}
    >
      {link.label} ↗
    </a>
  );
}
