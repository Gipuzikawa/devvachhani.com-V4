import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '../components/ui/Button';
import { TextLink } from '../components/ui/TextLink';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/cards/ProjectCard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { projects, facts } from '../data/content';

const M = 'var(--page-margin)';

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const projGrid = useScrollReveal<HTMLDivElement>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('[data-hero-line] > span', { yPercent: 120, duration: 1.1, stagger: 0.09 })
        .from('[data-hero-meta]', { opacity: 0, y: 16, duration: 0.7 }, '-=0.5')
        .from('[data-hero-cta]', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <main>
      <section ref={heroRef} style={{ padding: `clamp(64px,12vh,150px) ${M} clamp(48px,9vh,90px)`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        <div
          data-hero-meta
          style={{
            display: 'flex',
            gap: 18,
            flexWrap: 'wrap',
            marginBottom: 28,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--t-micro)',
            letterSpacing: 'var(--track-label)',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: 'var(--text-accent)' }}>Portfolio — 2026</span>
          <span style={{ color: 'var(--text-muted)' }}>STEM · Embedded · Software</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-mega)', fontWeight: 300, lineHeight: 'var(--lh-tight)', letterSpacing: 'var(--track-mega)', margin: 0, color: 'var(--text-strong)' }}>
          <span data-hero-line style={{ display: 'block', overflow: 'hidden' }}>
            <span style={{ display: 'inline-block' }}>Measuring the</span>
          </span>
          <span data-hero-line style={{ display: 'block', overflow: 'hidden' }}>
            <span style={{ display: 'inline-block' }}>
              invisible, <em style={{ fontStyle: 'italic', color: 'var(--text-accent)' }}>one</em>
            </span>
          </span>
          <span data-hero-line style={{ display: 'block', overflow: 'hidden' }}>
            <span style={{ display: 'inline-block' }}>experiment at a time.</span>
          </span>
        </h1>

        <p style={{ maxWidth: '48ch', marginTop: 30, fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}>
          I’m Dev — a student building instruments, software, and small machines to understand how the physical world actually works. This is a
          catalogue of that work.
        </p>

        <div data-hero-cta style={{ display: 'flex', gap: 16, marginTop: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="accent" href="/work" iconRight="→">
            Browse projects
          </Button>
          <TextLink variant="arrow" href="#contact">
            Get in touch
          </TextLink>
        </div>
      </section>

      <section style={{ padding: `clamp(20px,4vh,44px) ${M} 0`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        <SectionHeading index="01" eyebrow="Selected work" title="Projects & experiments" />
        <div ref={projGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginTop: 32 }}>
          {projects.map((p) => (
            <div data-reveal key={p.index}>
              <ProjectCard {...p} href="/work" />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <TextLink variant="arrow" href="/work">
            See the full archive
          </TextLink>
        </div>
      </section>

      <section style={{ padding: `clamp(64px,10vh,120px) ${M} clamp(24px,6vh,64px)`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        <SectionHeading index="02" eyebrow="About" title="Who's behind the index" />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 56, marginTop: 32, alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-body)', margin: 0, maxWidth: 'var(--measure-read)' }}>
              I’m a STEM student drawn to the seam where physics meets software — the point where an idea turns into an instrument you can actually
              measure with.
            </p>
            <div style={{ marginTop: 22 }}>
              <TextLink variant="arrow" href="/about">
                More about me
              </TextLink>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hairline)' }}>
            {[facts[0], facts[3]].map((f) => (
              <div key={f.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border-hairline)' }}>
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
      </section>
    </main>
  );
}
