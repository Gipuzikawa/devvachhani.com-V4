import type { CSSProperties } from 'react';
import type { ProjectFigure } from '../../types';

interface FigureProps extends ProjectFigure {
  style?: CSSProperties;
}

/**
 * Figure — an archival figure plate. Reserves its aspect ratio up front so
 * figures never reflow surrounding text. With no `src` it renders as an
 * empty plate — hairline frame, faint X rules, mono figure label — the
 * honest "image forthcoming" state. A real image drops into the same frame
 * with zero layout change.
 */
export function Figure({ index, title, aspect = 3 / 2, src, style }: FigureProps) {
  const label = `Fig. ${String(index).padStart(2, '0')}`;

  return (
    <figure style={{ margin: 0, ...style }}>
      <div
        style={{
          aspectRatio: String(aspect),
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--r-1)',
          background: src
            ? 'var(--bg-surface)'
            : /* empty plate: faint diagonal X, drawn in hairline ink */
              `linear-gradient(to top right, transparent calc(50% - 0.5px), var(--border-hairline) 50%, transparent calc(50% + 0.5px)),
               linear-gradient(to bottom right, transparent calc(50% - 0.5px), var(--border-hairline) 50%, transparent calc(50% + 0.5px)),
               var(--bg-surface)`,
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
        }}
      >
        {src ? (
          <img src={src} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--t-micro)',
              letterSpacing: 'var(--track-label)',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              background: 'var(--bg-surface)',
              padding: '6px 12px',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--r-1)',
            }}
          >
            Placeholder — image forthcoming
          </span>
        )}
      </div>
      <figcaption
        style={{
          marginTop: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--t-micro)',
          letterSpacing: 'var(--track-label)',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ color: 'var(--text-accent)' }}>{label}</span>
        <span style={{ color: 'var(--text-muted)' }}> — {title}</span>
      </figcaption>
    </figure>
  );
}
