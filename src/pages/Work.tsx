import { useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/cards/ProjectCard';
import { useStagger } from '../hooks/useStagger';
import { useReveal } from '../hooks/useReveal';
import { useDecode } from '../hooks/useDecode';
import { DUR, EASE, Flip, prefersReducedMotion } from '../motion/core';
import { useContent } from '../sanity/ContentProvider';
import { usePreview } from '../sanity/PreviewProvider';
import { adaptArchive, type ArchiveView, type ArchiveProject } from '../sanity/projectAdapters';
import { ContentPageState } from '../components/ui/ContentPageState';
import { useContentLayout } from '../hooks/useContentLayout';

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
  const result = useContent('workArchive');
  const { status, refresh } = usePreview();
  if (result.status !== 'ready') return <ContentPageState result={result} retry={refresh} />;
  let data: ArchiveView;
  try { data = adaptArchive(result.data); }
  catch { return <ContentPageState result={status === 'active' ? { status: 'incomplete', data: null } :
    { status: 'error', message: 'The project archive is incomplete. Please try again later.' }} retry={refresh} />; }
  return <WorkContent key={data.key} data={data} />;
}

function WorkContent({ data }: { data: ArchiveView }) {
  const { projects } = data;
  const [filter, setFilter] = useState<string | null>(null);
  const [layout, setLayout] = useState<'row' | 'grid'>('row');

  const pageRef = useReveal<HTMLElement>();
  useContentLayout(pageRef);
  const decodeScope = useDecode<HTMLDivElement>();
  // Entrance only — filter/layout changes are handled by FLIP below, not by
  // re-running the stagger.
  const gridRef = useStagger<HTMLDivElement>({ y: 14, duration: DUR.slow, each: 0.06 });
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const matches = (p: ArchiveProject) => filter === null || p.disciplineIds.includes(filter);

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
      <SectionHeading index={`${String(projects.length).padStart(2, '0')} entries`} {...data.heading} />
      <p
        data-reveal
        style={{ maxWidth: '56ch', marginTop: 22, fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}
      >
        {data.intro}
      </p>

      <div data-reveal style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, alignItems: 'center', margin: '34px 0 8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[{ id: null, label: data.allLabel }, ...data.disciplines].map((d) => (
            <button key={d.id ? `discipline:${d.id}` : 'all'} type="button" aria-pressed={filter === d.id}
              onClick={() => rearrange(() => setFilter(d.id))} style={chipStyle(filter === d.id)}>
              {d.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => rearrange(() => setLayout('row'))} style={chipStyle(layout === 'row')}>
            {data.rowsLabel}
          </button>
          <button type="button" onClick={() => rearrange(() => setLayout('grid'))} style={chipStyle(layout === 'grid')}>
            {data.gridLabel}
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
            <div key={p.id} style={{ display: matches(p) ? undefined : 'none' }}>
              <ProjectCard {...p} layout={layout === 'grid' ? 'tile' : 'row'} href={p.slug ? `/work/${p.slug}` : '/work'} />
            </div>
          ))}
        </div>
      </div>
      {!projects.length && <p role="status">No projects have been published yet.</p>}
    </main>
  );
}
