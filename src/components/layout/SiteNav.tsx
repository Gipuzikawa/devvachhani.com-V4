import { useState, type CSSProperties } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { NavLink as NavLinkData } from '../../types';

interface SiteNavProps {
  brand?: string;
  links?: NavLinkData[];
  cta?: NavLinkData;
  style?: CSSProperties;
}

/**
 * SiteNav — the fixed top bar. A wordmark set in serif on the left, mono
 * index links on the right. Hairline bottom rule; background is a paper
 * wash with backdrop blur so content scrolls under it cleanly.
 */
export function SiteNav({ brand = 'Dev Vachhani', links = [], cta, style }: SiteNavProps) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px var(--page-margin)',
        background: 'color-mix(in srgb, var(--bg-canvas) 82%, transparent)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-hairline)',
        ...style,
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', textDecoration: 'none' }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--t-md)',
            fontWeight: 'var(--w-medium)' as CSSProperties['fontWeight'],
            letterSpacing: 'var(--track-tight)',
            color: 'var(--text-strong)',
          }}
        >
          {brand}
        </span>
        <span aria-hidden="true" style={{ width: '7px', height: '7px', background: 'var(--accent)', display: 'inline-block', transform: 'translateY(-2px)' }} />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {links.map((l) => (
          <NavItem key={l.href} link={l} />
        ))}
        {cta && (
          <a
            href={cta.href}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--t-meta)',
              letterSpacing: 'var(--track-wide)',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: 'var(--text-invert)',
              background: 'var(--ink-0)',
              padding: '9px 15px',
              borderRadius: 'var(--r-1)',
            }}
          >
            {cta.label}
          </a>
        )}
      </div>
    </nav>
  );
}

function NavItem({ link }: { link: NavLinkData }) {
  const [hover, setHover] = useState(false);
  return (
    <NavLink
      to={link.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={({ isActive }) => ({
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--t-meta)',
        letterSpacing: 'var(--track-wide)',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: isActive || hover ? 'var(--text-strong)' : 'var(--text-muted)',
        transition: 'color var(--dur-fast) var(--ease-out)',
        paddingBottom: '2px',
        borderBottom: isActive ? '1px solid var(--accent)' : '1px solid transparent',
      })}
    >
      {link.label}
    </NavLink>
  );
}
