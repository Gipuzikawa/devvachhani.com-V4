import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Tag } from '../components/ui/Tag';
import { useStagger } from '../hooks/useStagger';
import { useReveal } from '../hooks/useReveal';
import { useDecode } from '../hooks/useDecode';
import { useInkResolve } from '../hooks/useInkResolve';
import { DUR, EASE, prefersReducedMotion } from '../motion/core';
import { facts, skillGroups, principles } from '../data/content';

const M = 'var(--page-margin)';

export function About() {
  /* One decode scope for the whole page: every [data-decode] label —
     fact keys, toolkit group labels, principle numbers — prints in as it
     crosses the viewport. */
  const decodeRef = useDecode<HTMLElement>();
  const introRef = useReveal<HTMLDivElement>();
  const leadRef = useInkResolve<HTMLParagraphElement>();
  const factsRef = useStagger<HTMLDivElement>();
  const skillsRef = useRef<HTMLDivElement>(null);
  const principlesRef = useStagger<HTMLDivElement>();

  /* Toolkit tags are *stamped*: each chip springs to rest with one
     overshoot, cascading through each group slightly after the previous
     one. The group labels print via the page decode scope. */
  useGSAP(
    () => {
      const root = skillsRef.current;
      if (!root || prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>('[data-skill-group]', root).forEach((group, gi) => {
        const tags = group.querySelectorAll('[data-skill-tags] > *');
        if (tags.length === 0) return;
        gsap.from(tags, {
          opacity: 0,
          scale: 0.85,
          y: 8,
          duration: DUR.base,
          ease: EASE.spring,
          stagger: 0.05,
          delay: gi * 0.12,
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        });
      });
    },
    { scope: skillsRef },
  );

  return (
    <main ref={decodeRef} style={{ padding: `clamp(56px,9vh,110px) ${M} 0`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
      <SectionHeading index="01" eyebrow="About" title="Who's behind the index" />

      <div ref={introRef} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 56, marginTop: 36, alignItems: 'start' }}>
        <div>
          {/* The set-piece: the lead's lines sit faint on the paper and
              resolve to full ink as the read line sweeps them — the ink
              dries where you read. Color only; the text never moves. */}
          <p
            ref={leadRef}
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-lg)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-body)', margin: 0, maxWidth: 'var(--measure-read)' }}
          >
            I’m Dev — a STEM student drawn to the seam where physics meets software, the point where an idea turns into an instrument you can
            actually measure with.
          </p>
          <p
            data-reveal
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', margin: '22px 0 0', maxWidth: 'var(--measure-read)' }}
          >
            I like building things end to end: the airframe and the stabiliser that keeps it level, the database behind a busy reception desk, the
            infrastructure that makes an AI assistant genuinely useful. I care most about work that stays legible — where you can trace how every
            piece was reasoned through, from first principle to final solder joint.
          </p>
          <p
            data-reveal
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', margin: '20px 0 0', maxWidth: 'var(--measure-read)' }}
          >
            Right now I’m looking toward university and research — places where that instinct to build and measure has room to grow.
          </p>
        </div>

        <div ref={factsRef} style={{ borderTop: '1px solid var(--border-strong)' }}>
          {facts.map((f) => (
            <div key={f.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border-hairline)' }}>
              <span
                data-decode
                style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}
              >
                {f.k}
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-sm)', color: f.accent ? 'var(--text-accent)' : 'var(--text-body)', textAlign: 'right' }}>
                {f.v}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'clamp(64px,10vh,110px)' }}>
        <SectionHeading index="02" eyebrow="Toolkit" title="What I build with" />
      </div>
      <div ref={skillsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40, marginTop: 32 }}>
        {skillGroups.map((g) => (
          <div data-skill-group key={g.label}>
            <div
              data-decode
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: 14, borderBottom: '1px solid var(--border-hairline)', marginBottom: 18 }}
            >
              {g.label}
            </div>
            <div data-skill-tags style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {g.tags.map((t) => (
                <Tag key={t} variant="outline">
                  {t}
                </Tag>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'clamp(64px,10vh,110px)' }}>
        <SectionHeading index="03" eyebrow="Approach" title="How I work" />
      </div>
      <div
        ref={principlesRef}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 1, marginTop: 32, background: 'var(--border-hairline)', border: '1px solid var(--border-hairline)' }}
      >
        {principles.map((p) => (
          <div key={p.no} style={{ background: 'var(--bg-canvas)', padding: '28px 26px' }}>
            <div data-decode style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-meta)', color: 'var(--text-accent)' }}>
              {p.no}
            </div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-lg)', fontWeight: 400, lineHeight: 'var(--lh-snug)', color: 'var(--text-strong)', margin: '14px 0 0' }}>
              {p.title}
            </h4>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-sm)', lineHeight: 'var(--lh-normal)', color: 'var(--text-secondary)', margin: '10px 0 0' }}>{p.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
