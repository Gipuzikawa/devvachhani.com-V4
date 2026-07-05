import { useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/cards/ProjectCard';
import { useStagger } from '../hooks/useStagger';
import { useReveal } from '../hooks/useReveal';
import { useDecode } from '../hooks/useDecode';
import { DUR, EASE, Flip, prefersReducedMotion } from '../motion/core';
import { projects, disciplines, disciplineTags } from '../data/content';
import type { ProjectData } from '../types';

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

  const pageRef = useReveal<HTMLElement>();
  const decodeScope = useDecode<HTMLDivElement>();
  // Entrance only — filter/layout changes are handled by FLIP below, not by
  // re-running the stagger.
  const gridRef = useStagger<HTMLDivElement>({ y: 14, duration: DUR.slow, each: 0.06 });
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const matches = (p: ProjectData) => filter === 'All' || (p.tags?.some((t) => (disciplineTags[filter] ?? []).includes(t)) ?? false);

  /* Every card stays mounted; filtering toggles display. That's what lets
     FLIP see both worlds — where each card was, where it is now — and glide
     the survivors while entering/leaving cards fade through. */
  const rearrange = (apply: () => void) => {
    if (gridRef.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(Array.from(gridRef.current.children));
    }
    apply();
  };

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      Flip.from(state, {
        duration: DUR.slow,
        ease: EASE.emph,
        absolute: true,
        nested: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.emph }),
        onLeave: (els) => gsap.to(els, { opacity: 0, y: -10, duration: DUR.base, ease: EASE.out }),
      });
    },
    { dependencies: [filter, layout], scope: gridRef },
  );

  return (
    <main ref={pageRef} style={{ padding: `clamp(56px,9vh,110px) ${M} 0`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
      <SectionHeading index={`${String(projects.length).padStart(2, '0')} entries`} eyebrow="The archive" title="Projects & experiments" />
      <p
        data-reveal
        style={{ maxWidth: '56ch', marginTop: 22, fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}
      >
        Instruments, software, and small machines — built end to end. Filter by discipline, or switch between the index and the grid.
      </p>

      <div data-reveal style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, alignItems: 'center', margin: '34px 0 8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {disciplines.map((d) => (
            <button key={d} type="button" onClick={() => rearrange(() => setFilter(d))} style={chipStyle(filter === d)}>
              {d}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => rearrange(() => setLayout('row'))} style={chipStyle(layout === 'row')}>
            Rows
          </button>
          <button type="button" onClick={() => rearrange(() => setLayout('grid'))} style={chipStyle(layout === 'grid')}>
            Grid
          </button>
        </div>
      </div>

      <div ref={decodeScope}>
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
          {projects.map((p) => (
            <div key={p.index} style={{ display: matches(p) ? undefined : 'none' }}>
              <ProjectCard {...p} layout={layout === 'grid' ? 'tile' : 'row'} href={p.slug ? `/work/${p.slug}` : '/work'} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
