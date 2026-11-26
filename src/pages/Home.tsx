import { Fragment, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '../components/ui/Button';
import { TextLink } from '../components/ui/TextLink';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/cards/ProjectCard';
import { useContentLayout } from '../hooks/useContentLayout';
import { useStagger } from '../hooks/useStagger';
import { useMagnetic } from '../hooks/useMagnetic';
import { DUR, EASE, DECODE_CHARS, SplitText, prefersReducedMotion, scrambleTextTarget } from '../motion/core';
import { attachTextPressure } from '../motion/textPressure';
import { useAboutContent } from '../sanity/useAboutContent';
import { useContent } from '../sanity/ContentProvider';
import { usePreview } from '../sanity/PreviewProvider';
import { adaptHome, type HomeView } from '../sanity/homeContent';
import { HomeValidationError } from '../sanity/homeValidation';
import { IncompleteContentError } from '../sanity/projectAdapters';
import { ContentPageState } from '../components/ui/ContentPageState';
import { ContentState } from '../components/ui/ContentState';

const M = 'var(--page-margin)';

export function Home() {
  const result = useContent('homePage');
  const { status, refresh } = usePreview();
  if (result.status !== 'ready') return <ContentPageState result={result} retry={refresh} />;

  let page: HomeView | null;
  try {
    page = adaptHome(result.data, status === 'active');
  } catch (error) {
    if (!(error instanceof HomeValidationError || error instanceof IncompleteContentError)) throw error;
    return <ContentPageState result={status === 'active' ? { status: 'incomplete', data: null } :
      { status: 'error', message: 'Home content is incomplete. Please try again later.' }} retry={refresh} />;
  }
  if (!page) return <ContentPageState result={{ status: 'empty' }} retry={refresh} />;

  return (
    <main style={{ overflowWrap: 'anywhere' }}>
      <HomeHero key={page.homeRevision} page={page} />

      <section style={{ padding: `clamp(20px,4vh,44px) ${M} 0`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        {/* Heading copy changes replace the nodes owned by SplitText. */}
        <SectionHeading key={JSON.stringify(page.workHeading)} index="01" {...page.workHeading} />
        <FeaturedProjects key={page.revision} projects={page.featuredProjects} />
        <div style={{ marginTop: 28 }}>
          <TextLink variant="arrow" href={page.archiveLink.href}>
            {page.archiveLink.label}
          </TextLink>
        </div>
      </section>

      <section style={{ padding: `clamp(64px,10vh,120px) ${M} clamp(24px,6vh,64px)`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        <SectionHeading key={JSON.stringify(page.aboutHeading)} index="02" {...page.aboutHeading} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 56, marginTop: 32, alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', lineHeight: 'var(--lh-normal)', color: 'var(--text-secondary)', margin: 0, maxWidth: 'var(--measure-read)' }}>
              {page.aboutIntro}
            </p>
            <div style={{ marginTop: 22 }}>
              <TextLink variant="arrow" href={page.aboutLink.href}>
                {page.aboutLink.label}
              </TextLink>
            </div>
          </div>
          <HomeFacts />
        </div>
      </section>
    </main>
  );
}

function HomeHero({ page }: { page: HomeView }) {
  const heroRef = useRef<HTMLElement>(null);
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
    (context, contextSafe) => {
      const root = heroRef.current;
      if (!root || prefersReducedMotion()) return;
      const headline = root.querySelector<HTMLElement>('[data-hero-headline]');
      if (!headline) return;
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', root);
      const metaLabels = gsap.utils.toArray<HTMLElement>('[data-hero-meta] [data-hero-decode]', root).map(el => ({
        el, target: scrambleTextTarget(el), text: el.textContent ?? '',
      }));

      let active = true;
      const isLive = () => active && heroRef.current === root && root.isConnected;
      let split: SplitText | undefined;
      let pressureCleanup: (() => void) | undefined;

      // Stage the entrance until fonts settle so each character measures correctly.
      gsap.set(headline, { autoAlpha: 0 });
      gsap.set(metaLabels.map(label => label.el), { opacity: 0 });
      gsap.set(['[data-hero-lead]', '[data-hero-cta]'], { opacity: 0, y: 16 });

      const startEntrance = contextSafe!(() => {
        // The outer line spans drive the scroll scrub. Retain their split
        // children for pressure and let the heading speak the full headline.
        headline.setAttribute('aria-label', lines.map(line => line.textContent?.trim()).join(' '));
        context.ignore(() => { split = SplitText.create(lines, { type: 'chars', tag: 'span', aria: 'hidden' }); });
        const chars = split!.chars as HTMLElement[];
        gsap.set(chars, { display: 'inline-block', position: 'relative', yPercent: 120 });
        gsap.set(headline, { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: EASE.emph },
          onComplete: () => {
            if (!isLive() || pressureCleanup) return;
            context.ignore(() => { pressureCleanup = attachTextPressure(root, chars); });
          },
        });

        metaLabels.forEach(({ el, target, text }, i) => {
          el.setAttribute('aria-label', text);
          tl.to(el, { opacity: 1, duration: DUR.fast, ease: EASE.out }, i * 0.14).to(
            target,
            {
              duration: DUR.slow,
              ease: 'none',
              scrambleText: { text, chars: DECODE_CHARS, speed: 0.4 },
              onComplete: () => {
                if (!isLive()) return;
                target.textContent = text;
                el.removeAttribute('aria-label');
              },
            },
            i * 0.14,
          );
        });

        tl.to(chars, { yPercent: 0, duration: DUR.hero, stagger: 0.014 }, 0.25)
          .to('[data-hero-lead]', { opacity: 1, y: 0, duration: DUR.slow }, '-=0.55')
          .to('[data-hero-cta]', { opacity: 1, y: 0, duration: DUR.slow }, '-=0.45');
      });
      const onFontsReady = () => { if (isLive()) startEntrance(); };
      void Promise.resolve(document.fonts?.ready).then(onFontsReady, onFontsReady);

      /* The recede — each headline line drifts up a little faster than the
         one above it as the hero scrolls out; the meta line leads. Pure
         transform/opacity, scrub-linked to the reader's own hand. */
      const scrub = { trigger: root, start: 'top top', end: 'bottom top', scrub: true } as const;
      lines.forEach((line, i) => {
        gsap.to(line, { yPercent: -14 * (i + 1), ease: 'none', scrollTrigger: { ...scrub } });
      });
      gsap.to('[data-hero-meta]', { yPercent: -80, ease: 'none', scrollTrigger: { ...scrub } });
      gsap.to(root, { opacity: 0.25, ease: 'none', scrollTrigger: { ...scrub } });

      // useGSAP reverts the tweens first. Stop pressure before SplitText
      // removes its character targets.
      return () => {
        active = false;
        pressureCleanup?.();
        split?.revert();
        headline.removeAttribute('aria-label');
        metaLabels.forEach(({ el, target, text }) => {
          target.textContent = text;
          el.removeAttribute('aria-label');
        });
      };
    },
    { scope: heroRef },
  );

  return (
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
          {page.metaAccent}
        </span>
        <span data-hero-decode style={{ color: 'var(--text-muted)' }}>
          {page.metaMuted}
        </span>
      </div>

      <h1
        data-hero-headline
        style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-mega)', fontWeight: 300, lineHeight: 'var(--lh-tight)', letterSpacing: 'var(--track-mega)', margin: 0, color: 'var(--text-strong)' }}
      >
        {page.heroLines.map(line => (
          <span key={line.key} data-hero-line style={{ display: 'block', overflow: 'hidden' }}>
            {line.runs.map(run => run.emphasis
              ? <em key={run.key} style={{ fontStyle: 'italic', color: 'var(--text-accent)' }}>{run.text}</em>
              : <Fragment key={run.key}>{run.text}</Fragment>)}
          </span>
        ))}
      </h1>

      <p
        data-hero-lead
        style={{ maxWidth: '48ch', marginTop: 30, fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}
      >
        {page.heroLead}
      </p>

      <div data-hero-cta style={{ display: 'flex', gap: 16, marginTop: 36, alignItems: 'center', flexWrap: 'wrap' }}>
        <div ref={ctaMagnet} style={{ display: 'inline-block' }}>
          <Button variant="accent" href={page.primaryCta.href} iconRight="→" style={{ whiteSpace: 'normal' }}>
            {page.primaryCta.label}
          </Button>
        </div>
        <TextLink variant="arrow" href={page.contactCta.href}>
          {page.contactCta.label}
        </TextLink>
      </div>
    </section>
  );
}

function FeaturedProjects({ projects }: { projects: HomeView['featuredProjects'] }) {
  const gridRef = useStagger<HTMLDivElement>();
  useContentLayout(gridRef);
  return (
    <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 16, marginTop: 32 }}>
      {projects.map(project => (
        <div key={project.key}>
          {project.card ? <ProjectCard {...project.card} href={project.href} /> : <p role="status">{project.notice}</p>}
        </div>
      ))}
    </div>
  );
}

function HomeFacts() {
  const { result, refresh } = useAboutContent();
  if (result.status !== 'ready') return <ContentState result={result} retry={refresh} emptyMessage="No About facts available." />;
  return (
    <div style={{ borderTop: '1px solid var(--border-hairline)' }}>
      {result.data.page.gaps.includes('facts') && <p role="status">Incomplete draft — add facts in Studio.</p>}
      {result.data.page.facts.filter(f => f.showOnHome).map((f) => (
        <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border-hairline)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {f.label}
          </span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-sm)', color: f.emphasized ? 'var(--text-accent)' : 'var(--text-body)', textAlign: 'right' }}>
            {f.value}
          </span>
        </div>
      ))}
    </div>
  );
}
