import { SectionHeading } from '../components/ui/SectionHeading';
import { Tag } from '../components/ui/Tag';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { facts, skillGroups, principles } from '../data/content';

const M = 'var(--page-margin)';

export function About() {
  const factsRef = useScrollReveal<HTMLDivElement>([]);
  const skillsRef = useScrollReveal<HTMLDivElement>([]);
  const principlesRef = useScrollReveal<HTMLDivElement>([]);

  return (
    <main style={{ padding: `clamp(56px,9vh,110px) ${M} 0`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
      <SectionHeading index="01" eyebrow="About" title="Who's behind the index" />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 56, marginTop: 36, alignItems: 'start' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-lg)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-body)', margin: 0, maxWidth: 'var(--measure-read)' }}>
            I’m Dev — a STEM student drawn to the seam where physics meets software, the point where an idea turns into an instrument you can
            actually measure with.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', margin: '22px 0 0', maxWidth: 'var(--measure-read)' }}>
            I like building things end to end: the airframe and the stabiliser that keeps it level, the database behind a busy reception desk, the
            infrastructure that makes an AI assistant genuinely useful. I care most about work that stays legible — where you can trace how every
            piece was reasoned through, from first principle to final solder joint.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', margin: '20px 0 0', maxWidth: 'var(--measure-read)' }}>
            Right now I’m looking toward university and research — places where that instinct to build and measure has room to grow.
          </p>
        </div>

        <div ref={factsRef} style={{ borderTop: '1px solid var(--border-strong)' }}>
          {facts.map((f) => (
            <div data-reveal key={f.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border-hairline)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
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
          <div data-reveal key={g.label}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: 14, borderBottom: '1px solid var(--border-hairline)', marginBottom: 18 }}>
              {g.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
          <div data-reveal key={p.no} style={{ background: 'var(--bg-canvas)', padding: '28px 26px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-meta)', color: 'var(--text-accent)' }}>{p.no}</div>
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
