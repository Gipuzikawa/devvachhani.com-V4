import { useRef, useState, type CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Tag } from '../components/ui/Tag';
import { Figure } from '../components/ui/Figure';
import { useReveal } from '../hooks/useReveal';
import { useStagger } from '../hooks/useStagger';
import { useParallax } from '../hooks/useParallax';
import { usePinned } from '../hooks/usePinned';
import { DUR, EASE, prefersReducedMotion } from '../motion/core';
import { projectDetails } from '../data/content';
import type { ProjectMilestone } from '../types';

const M = 'var(--page-margin)';

/* Timeline geometry: the spine sits SPINE_X px into the wrapper's left
   padding; nodes are NODE px squares centred on it. */
const PAD = 56;
const SPINE_X = 10;
const NODE = 9;

const mono: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--t-micro)',
  letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase',
};

/** Back-to-archive link — router Link so navigation stays in the SPA. */
function BackLink() {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to="/work"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...mono,
        fontSize: 'var(--t-meta)',
        letterSpacing: 'var(--track-wide)',
        color: 'var(--text-accent)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 8,
      }}
    >
      <span
        aria-hidden="true"
        style={{ display: 'inline-block', transition: 'transform var(--dur-base) var(--ease-out)', transform: hover ? 'translateX(-4px)' : 'none' }}
      >
        ←
      </span>
      The archive
    </Link>
  );
}

/** One timeline entry: node + date on the spine, then title, figure, body. */
function MilestoneEntry({ m }: { m: ProjectMilestone }) {
  const figRef = useParallax<HTMLDivElement>(12);

  return (
    <article data-milestone data-reveal style={{ position: 'relative', paddingBottom: 'clamp(56px, 9vh, 96px)' }}>
      <span
        data-node
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: SPINE_X - PAD - NODE / 2 + 0.5,
          top: 4,
          width: NODE,
          height: NODE,
          background: 'var(--bg-canvas)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--r-0)',
        }}
      />
      <div data-date style={{ ...mono, color: 'var(--text-muted)' }}>
        {m.date}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--t-lg)',
          fontWeight: 400,
          lineHeight: 'var(--lh-snug)',
          color: 'var(--text-strong)',
          margin: '12px 0 0',
        }}
      >
        {m.title}
      </h3>
      <div ref={figRef} style={{ margin: '24px 0 0', maxWidth: 620 }}>
        <Figure {...m.figure} />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--t-body)',
          lineHeight: 'var(--lh-relaxed)',
          color: 'var(--text-secondary)',
          margin: '20px 0 0',
          maxWidth: 'var(--measure-read)',
        }}
      >
        {m.body}
      </p>
    </article>
  );
}

export function ProjectPage() {
  const { slug } = useParams();
  const project = projectDetails.find((p) => p.slug === slug);

  const headRef = useStagger<HTMLElement>({ each: 0.08 });
  const mainRef = useReveal<HTMLElement>();
  const toolsRef = useStagger<HTMLDivElement>();
  const reflRef = useStagger<HTMLDivElement>();
  const tlRef = useRef<HTMLDivElement>(null);
  const pinRef = usePinned<HTMLDivElement>({
    build: (tl, root) => {
      // The hold: the hero figure settles while the spec rows print in.
      const fig = root.querySelector('[data-final-figure]');
      if (fig) tl.fromTo(fig, { y: 28 }, { y: 0, ease: 'none' }, 0);
      tl.fromTo(root.querySelectorAll('[data-spec]'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.12, ease: 'none' }, 0);
    },
  });

  /* Timeline choreography: the cobalt progress line draws down the spine as
     the story is read, and each node/date activates as it reaches the read
     line (60% viewport) — the same position the progress tip tracks. */
  useGSAP(
    () => {
      const root = tlRef.current;
      if (!root || prefersReducedMotion()) return;
      const css = getComputedStyle(document.documentElement);
      const cobalt = css.getPropertyValue('--cobalt').trim();
      const hairline = css.getPropertyValue('--border-hairline').trim();
      const canvas = css.getPropertyValue('--bg-canvas').trim();
      const muted = css.getPropertyValue('--text-muted').trim();

      gsap.fromTo(
        '[data-spine-progress]',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top 60%', end: 'bottom 60%', scrub: true } },
      );

      gsap.utils.toArray<HTMLElement>('[data-milestone]', root).forEach((ms) => {
        const node = ms.querySelector<HTMLElement>('[data-node]');
        const date = ms.querySelector<HTMLElement>('[data-date]');
        if (!node || !date) return;
        const set = (active: boolean) => {
          gsap.to(node, {
            backgroundColor: active ? cobalt : canvas,
            borderColor: active ? cobalt : hairline,
            scale: active ? 1.25 : 1,
            duration: DUR.fast,
            ease: EASE.out,
          });
          gsap.to(date, { color: active ? cobalt : muted, duration: DUR.fast, ease: EASE.out });
        };
        ScrollTrigger.create({ trigger: ms, start: 'top 60%', onEnter: () => set(true), onLeaveBack: () => set(false) });
      });
    },
    { scope: tlRef },
  );

  if (!project) return <Navigate to="/work" replace />;

  return (
    <main ref={mainRef} style={{ padding: `clamp(48px,7vh,90px) ${M} 0`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
      {/* ── Header ── */}
      <header ref={headRef} style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 900 }}>
        <div>
          <BackLink />
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'baseline' }}>
          <span style={{ ...mono, color: 'var(--text-accent)', fontWeight: 500 }}>
            Entry {project.index} — {project.year}
          </span>
          {project.status === 'placeholder' && (
            <Tag variant="accent">Placeholder content — build log in progress</Tag>
          )}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--t-xxl)',
            fontWeight: 300,
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--track-tight)',
            color: 'var(--text-strong)',
            margin: 0,
          }}
        >
          {project.title}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--t-md)',
            lineHeight: 'var(--lh-normal)',
            color: 'var(--text-secondary)',
            margin: 0,
            maxWidth: '52ch',
          }}
        >
          {project.intro}
        </p>
      </header>

      {/* ── 01 Overview ── */}
      <section style={{ marginTop: 'clamp(56px,9vh,100px)' }}>
        <div data-reveal>
          <SectionHeading index="01" eyebrow="Overview" title="Tools & skills" />
        </div>
        <div ref={toolsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40, marginTop: 32 }}>
          {[...project.toolGroups, { label: 'Skills demonstrated', items: project.skills }].map((g) => (
            <div key={g.label}>
              <div style={{ ...mono, color: 'var(--text-muted)', paddingBottom: 14, borderBottom: '1px solid var(--border-hairline)', marginBottom: 18 }}>
                {g.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {g.items.map((t) => (
                  <Tag key={t} variant="outline">
                    {t}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 02 Production timeline ── */}
      <section style={{ marginTop: 'clamp(64px,10vh,110px)' }}>
        <div data-reveal>
          <SectionHeading index="02" eyebrow="Production timeline" title="How it came together" />
        </div>
        <div ref={tlRef} style={{ position: 'relative', paddingLeft: PAD, marginTop: 48 }}>
          {/* spine + cobalt progress line */}
          <span aria-hidden="true" style={{ position: 'absolute', left: SPINE_X, top: 4, bottom: 4, width: 1, background: 'var(--border-hairline)' }} />
          <span
            data-spine-progress
            aria-hidden="true"
            style={{ position: 'absolute', left: SPINE_X, top: 4, bottom: 4, width: 1, background: 'var(--cobalt)', transformOrigin: 'top', transform: 'scaleY(1)' }}
          />
          {project.milestones.map((m) => (
            <MilestoneEntry key={m.figure.index} m={m} />
          ))}
        </div>
      </section>

      {/* ── 03 Final product ── */}
      <section style={{ marginTop: 'clamp(24px,4vh,48px)' }}>
        <div data-reveal>
          <SectionHeading index="03" eyebrow="Final product" title="The finished machine" />
        </div>
        <div ref={pinRef} style={{ padding: '48px 0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'start' }}>
            <div data-final-figure>
              <Figure {...project.finalFigure} />
            </div>
            <div style={{ borderTop: '1px solid var(--border-strong)' }}>
              {project.specs.map((s) => (
                <div
                  data-spec
                  key={s.k}
                  style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border-hairline)' }}
                >
                  <span style={{ ...mono, color: 'var(--text-muted)' }}>{s.k}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-sm)', color: 'var(--text-body)', textAlign: 'right' }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 Reflections ── */}
      <section style={{ marginTop: 'clamp(48px,8vh,90px)', paddingBottom: 'clamp(48px,8vh,90px)' }}>
        <div data-reveal>
          <SectionHeading index="04" eyebrow="Reflections" title="What the build taught" />
        </div>
        <div ref={reflRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 40, marginTop: 32 }}>
          {[
            { label: 'What went well', body: project.reflections.wentWell },
            { label: 'Challenges', body: project.reflections.challenges },
          ].map((r) => (
            <div key={r.label}>
              <div style={{ ...mono, color: 'var(--text-muted)', paddingBottom: 14, borderBottom: '1px solid var(--border-hairline)', marginBottom: 18 }}>
                {r.label}
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', margin: 0 }}>
                {r.body}
              </p>
            </div>
          ))}
          <div>
            <div style={{ ...mono, color: 'var(--text-muted)', paddingBottom: 14, borderBottom: '1px solid var(--border-hairline)', marginBottom: 18 }}>
              Future improvements
            </div>
            {project.reflections.improvements.map((it, i) => (
              <div key={it} style={{ display: 'flex', gap: 14, alignItems: 'baseline', padding: '8px 0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-meta)', color: 'var(--text-accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-body)', color: 'var(--text-secondary)' }}>{it}</span>
              </div>
            ))}
          </div>
        </div>
        <p
          data-reveal
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--t-md)',
            fontStyle: 'italic',
            lineHeight: 'var(--lh-relaxed)',
            color: 'var(--text-body)',
            margin: 'clamp(40px,6vh,64px) 0 0',
            maxWidth: 'var(--measure-read)',
          }}
        >
          {project.reflections.closing}
        </p>
        <div data-reveal style={{ marginTop: 48 }}>
          <BackLink />
        </div>
      </section>
    </main>
  );
}
