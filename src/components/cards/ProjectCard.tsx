import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectData } from '../../types';

interface ProjectCardProps extends ProjectData {
  href?: string;
  layout?: 'tile' | 'row';
  style?: CSSProperties;
}

/**
 * ProjectCard — an index row/tile for a project. Archival by default: a
 * hairline-bordered block with a mono index number, serif title, one-line
 * summary, and discipline tags. On hover the whole block lifts and the
 * title shifts to cobalt. Works in a grid or as a full-width list row.
 */
export function ProjectCard({ index, title, summary, tags = [], year, href = '#', layout = 'tile', style }: ProjectCardProps) {
  const [hover, setHover] = useState(false);
  const isRow = layout === 'row';

  return (
    <Link
      to={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: isRow ? 'grid' : 'flex',
        gridTemplateColumns: isRow ? '64px 1fr auto' : undefined,
        flexDirection: isRow ? undefined : 'column',
        gap: isRow ? '28px' : '18px',
        alignItems: isRow ? 'start' : 'stretch',
        padding: isRow ? '26px 24px' : '24px',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--r-1)',
        background: hover ? 'var(--bg-surface)' : 'transparent',
        borderColor: hover ? 'var(--border-strong)' : 'var(--border-hairline)',
        textDecoration: 'none',
        color: 'var(--text-body)',
        transition: 'background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-label)', color: 'var(--text-accent)' }}>
          {index}
        </span>
        {!isRow && year && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-wide)', color: 'var(--text-faint)' }}>
            {year}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3
          style={{
            fontSize: isRow ? 'var(--t-lg)' : 'var(--t-md)',
            fontWeight: 'var(--w-regular)' as CSSProperties['fontWeight'],
            lineHeight: 'var(--lh-snug)',
            letterSpacing: 'var(--track-tight)',
            color: hover ? 'var(--text-accent)' : 'var(--text-strong)',
            transition: 'color var(--dur-base) var(--ease-out)',
          }}
        >
          {title}
        </h3>
        {summary && (
          <p style={{ fontSize: 'var(--t-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)', maxWidth: '52ch' }}>{summary}</p>
        )}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--t-micro)',
                  letterSpacing: 'var(--track-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: 'var(--r-1)',
                  padding: '4px 8px',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifySelf: isRow ? 'end' : undefined }}>
        {isRow && year && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-meta)', color: 'var(--text-faint)' }}>{year}</span>
        )}
        <span
          aria-hidden="true"
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-strong)',
            transition: 'transform var(--dur-base) var(--ease-out)',
            transform: hover ? 'translate(3px,-3px)' : 'translate(0,0)',
            alignSelf: isRow ? 'center' : 'flex-start',
          }}
        >
          ↗
        </span>
      </div>
    </Link>
  );
}
