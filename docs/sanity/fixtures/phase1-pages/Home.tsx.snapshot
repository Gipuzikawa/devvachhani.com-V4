import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '../components/ui/Button';
import { TextLink } from '../components/ui/TextLink';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/cards/ProjectCard';
import { useStagger } from '../hooks/useStagger';
import { useMagnetic } from '../hooks/useMagnetic';
import { DUR, EASE, DECODE_CHARS, SplitText, prefersReducedMotion } from '../motion/core';
import { attachTextPressure } from '../motion/textPressure';
import { projects, facts } from '../data/content';

const M = 'var(--page-margin)';

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const projGrid = useStagger<HTMLDivElement>();
  const ctaMagnet = useMagnetic<HTMLDivElement>({ strength: 0.25 });

  /* ── The opening set-piece ──────────────────────────────────────────
     The index sets itself in type: the mono metas *print* (scramble-
     settle), then the headline is *set* — every character rises into its
     line from behind the line's own clip. Once the type has settled the
     split is *kept* (not reverted) and handed to text-pressure, which turns
     the settled headline into a cursor-reactive masthead on fine pointers.
     Scrolling away, the lines peel upward at different rates — the page
     starts performing from the very first gesture. */
  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion()) return;

      /* Held so the sync cleanup below can tear down the pressure loop the
         async .then() attaches once the entrance completes. */
      let pressureCleanup: (() => void) | undefined;

      /* Staging: nothing shows until the fonts have settled, so the split
         measures real metrics. Fonts are self-hosted — the wait is a frame
         or two, not a flash. */
      gsap.set('[data-hero-headline]', { autoAlpha: 0 });
      gsap.set('[data-hero-meta] [data-hero-decode]', { opacity: 0 });
      gsap.set(['[data-hero-lead]', '[data-hero-cta]'], { opacity: 0, y: 16 });

      document.fonts.ready.then(
        contextSafe!(() => {
          /* Split the line spans themselves (not the h1). The split is kept
             after the entrance (see onComplete): its char spans become the
             pressure targets, and the [data-hero-line] containers it leaves
             in place are exactly what the recede scrub below drives. */
          const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', heroRef.current);
          if (lines.length === 0) return;
          const split = SplitText.create(lines, { type: 'chars' });
          gsap.set(split.chars, { yPercent: 120 });
          gsap.set('[data-hero-headline]', { autoAlpha: 1 });

          const tl = gsap.timeline({
            defaults: { ease: EASE.emph },
            onComplete: () => {
              pressureCleanup = attachTextPressure(heroRef.current!, split.chars as HTMLElement[]);
            },
          });

          gsap.utils.toArray<HTMLElement>('[data-hero-meta] [data-hero-decode]', heroRef.current).forEach((el, i) => {
            const text = el.textContent ?? '';
            el.setAttribute('aria-label', text);
            tl.to(el, { opacity: 1, duration: DUR.fast, ease: EASE.out }, i * 0.14).to(
              el,
              {
                duration: DUR.slow,
                ease: 'none',
                scrambleText: { text, chars: DECODE_CHARS, speed: 0.4 },
                onComplete: () => el.removeAttribute('aria-label'),
              },
              i * 0.14,
            );
          });

          tl.to(split.chars, { yPercent: 0, duration: DUR.hero, stagger: 0.014 }, 0.25)
            .to('[data-hero-lead]', { opacity: 1, y: 0, duration: DUR.slow }, '-=0.55')
            .to('[data-hero-cta]', { opacity: 1, y: 0, duration: DUR.slow }, '-=0.45');
        }),
      );

      /* The recede — each headline line drifts up a little faster than the
         one above it as the hero scrolls out; the meta line leads. Pure
         transform/opacity, scrub-linked to the reader's own hand. */
      const scrub = { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true } as const;
      gsap.utils.toArray<HTMLElement>('[data-hero-line]', heroRef.current).forEach((line, i) => {
        gsap.to(line, { yPercent: -14 * (i + 1), ease: 'none', scrollTrigger: { ...scrub } });
      });
      gsap.to('[data-hero-meta]', { yPercent: -80, ease: 'none', scrollTrigger: { ...scrub } });
      gsap.to(heroRef.current, { opacity: 0.25, ease: 'none', scrollTrigger: { ...scrub } });

      /* useGSAP reverts the tweens/ScrollTriggers above; the pressure loop
         is attached outside its tracking (async, via gsap.ticker), so tear
         it down explicitly. */
      return () => pressureCleanup?.();
    },
    { scope: heroRef },
  );

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
          <span data-hero-decode style={{ color: 'var(--text-accent)' }}>
            Portfolio — 2026
          </span>
          <span data-hero-decode style={{ color: 'var(--text-muted)' }}>
            STEM · Embedded · Software
          </span>
        </div>

        <h1
          data-hero-headline
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-mega)', fontWeight: 300, lineHeight: 'var(--lh-tight)', letterSpacing: 'var(--track-mega)', margin: 0, color: 'var(--text-strong)' }}
        >
          <span data-hero-line style={{ display: 'block', overflow: 'hidden' }}>
            Measuring the
          </span>
          <span data-hero-line style={{ display: 'block', overflow: 'hidden' }}>
            invisible, <em style={{ fontStyle: 'italic', color: 'var(--text-accent)' }}>one</em>
          </span>
          <span data-hero-line style={{ display: 'block', overflow: 'hidden' }}>
            experiment at a time.
          </span>
        </h1>

        <p
          data-hero-lead
          style={{ maxWidth: '48ch', marginTop: 30, fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}
        >
          I’m Dev — a student building instruments, software, and small machines to understand how the physical world actually works. This is a
          catalogue of that work.
        </p>

        <div data-hero-cta style={{ display: 'flex', gap: 16, marginTop: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          <div ref={ctaMagnet} style={{ display: 'inline-block' }}>
            <Button variant="accent" href="/work" iconRight="→">
              Browse projects
            </Button>
          </div>
          <TextLink variant="arrow" href="#contact">
            Get in touch
          </TextLink>
        </div>
      </section>

      <section style={{ padding: `clamp(20px,4vh,44px) ${M} 0`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        <SectionHeading index="01" eyebrow="Selected work" title="Projects & experiments" />
        <div ref={projGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginTop: 32 }}>
          {projects.map((p) => (
            <div key={p.index}>
              <ProjectCard {...p} href={p.slug ? `/work/${p.slug}` : '/work'} />
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
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', lineHeight: 'var(--lh-normal)', color: 'var(--text-secondary)', margin: 0, maxWidth: 'var(--measure-read)' }}>
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
