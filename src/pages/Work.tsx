import { useState, type CSSProperties } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/cards/ProjectCard';
import { useStagger } from '../hooks/useStagger';
import { DUR } from '../motion/core';
import { projects, disciplines, disciplineTags } from '../data/content';

const M = 'var(--page-margin)';

function chipStyle(active: boolean): CSSProperties {
  return {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--t-micro)',
    letterSpacing: 'var(--track-wide)',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '7px 12px',
    borderRadius: 'var(--r-1)',
    transition: 'all var(--dur-fast) var(--ease-out)',
    border: `1px solid ${active ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
    background: active ? 'var(--ink-0)' : 'transparent',
    color: active ? 'var(--text-invert)' : 'var(--text-muted)',
  };
}

export function Work() {
  const [filter, setFilter] = useState('All');
  const [layout, setLayout] = useState<'row' | 'grid'>('row');
  // Re-runs on filter/layout change: the visible set re-enters as one quick
  // group instead of each card re-firing its own scroll reveal.
  const gridRef = useStagger<HTMLDivElement>({ y: 14, duration: DUR.slow, each: 0.06, dependencies: [filter, layout] });

  const visible = filter === 'All' ? projects : projects.filter((p) => p.tags?.some((t) => (disciplineTags[filter] ?? []).includes(t)));

  return (
    <main style={{ padding: `clamp(56px,9vh,110px) ${M} 0`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
      <SectionHeading index={`${String(projects.length).padStart(2, '0')} entries`} eyebrow="The archive" title="Projects & experiments" />
      <p style={{ maxWidth: '56ch', marginTop: 22, fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}>
        Instruments, software, and small machines — built end to end. Filter by discipline, or switch between the index and the grid.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, alignItems: 'center', margin: '34px 0 8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {disciplines.map((d) => (
            <button key={d} type="button" onClick={() => setFilter(d)} style={chipStyle(filter === d)}>
              {d}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setLayout('row')} style={chipStyle(layout === 'row')}>
            Rows
          </button>
          <button type="button" onClick={() => setLayout('grid')} style={chipStyle(layout === 'grid')}>
            Grid
          </button>
        </div>
      </div>

      <div
        ref={gridRef}
        style={{
          marginTop: 20,
          paddingBottom: 24,
          display: 'grid',
          gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit,minmax(300px,1fr))' : '1fr',
          gap: layout === 'grid' ? 16 : 12,
        }}
      >
        {visible.map((p) => (
          <div key={p.index}>
            <ProjectCard {...p} layout={layout === 'grid' ? 'tile' : 'row'} href={p.slug ? `/work/${p.slug}` : '/work'} />
          </div>
        ))}
      </div>
    </main>
  );
}
