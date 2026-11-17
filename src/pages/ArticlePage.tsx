import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from '../motion/core';
import { useGSAP } from '@gsap/react';
import { Tag } from '../components/ui/Tag';
import { useReveal } from '../hooks/useReveal';
import { useStagger } from '../hooks/useStagger';
import { useSplitReveal } from '../hooks/useSplitReveal';
import { useDecode } from '../hooks/useDecode';
import { ArticleBody } from '../components/content/ArticleBody';
import { useContent } from '../sanity/ContentProvider';
import { usePreview } from '../sanity/PreviewProvider';
import { adaptArticle, type ArticleView } from '../sanity/articleAdapters';
import { ContentPageState } from '../components/ui/ContentPageState';
import { useContentLayout } from '../hooks/useContentLayout';

const M = 'var(--page-margin)';

const mono: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--t-micro)',
  letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase',
};

/** Tracks a media query so the TOC rail only renders where it fits. */
function useWide(query = '(min-width: 1020px)') {
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return wide;
}

function BackLink() {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to="/writing"
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
      Writing index
    </Link>
  );
}

export function ArticlePage() {
  const { slug = '' } = useParams();
  const result = useContent('articlePage', { slug });
  const { status, refresh } = usePreview();
  if (result.status === 'empty') return <Navigate to="/writing" replace />;
  if (result.status !== 'ready') return <ContentPageState result={result} retry={refresh} />;
  let article: ArticleView | null;
  try { article = adaptArticle(result.data); }
  catch { return <ContentPageState result={status === 'active' ? { status: 'incomplete', data: null } :
    { status: 'error', message: 'This article is incomplete. Please try again later.' }} retry={refresh} />; }
  if (!article) return <Navigate to="/writing" replace />;
  return <ArticleContent key={article.contentKey} article={article} />;
}

function ArticleContent({ article }: { article: ArticleView }) {
  const wide = useWide();

  const [activeId, setActiveId] = useState('');
  const headRef = useStagger<HTMLDivElement>({ each: 0.08 });
  const headReveal = useReveal<HTMLElement>();
  const metaRef = useDecode<HTMLDivElement>();
  const titleRef = useSplitReveal<HTMLHeadingElement>({ immediate: true, delay: 0.15 });
  const bodyRef = useReveal<HTMLDivElement>();
  const barRef = useRef<HTMLDivElement>(null);
  const progressScope = useRef<HTMLDivElement>(null);
  useContentLayout(progressScope);
  useEffect(() => {
    // Data arrives after the router's scroll reset, so restore deep section links here.
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (article.toc.some(heading => heading.id === id)) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [article.contentKey]);

  /* Reading state — progress bar + active-section tracking. Deliberately NOT
     gated on prefers-reduced-motion: both are information about where the
     reader is, not decoration (HANDOVER §5b). The bar is scrub-linked, so it
     only ever moves exactly as far as the reader scrolls. */
  useGSAP(
    () => {
      const body = bodyRef.current;
      if (!body || !barRef.current) return;

      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: body, start: 'top 25%', end: 'bottom bottom', scrub: true } },
      );

      /* Active section = last heading above the read line (45% viewport),
         recomputed from measured positions on every scroll tick. Deliberately
         not per-heading onEnter/onLeaveBack toggles: those skip when a jump
         (Home/End key, restored scroll) crosses a heading's whole range in
         one update. Positions are cached and re-measured on refresh; the
         setState no-ops when the value is unchanged. */
      const headings = gsap.utils.toArray<HTMLElement>('[data-article-heading]', body);
      let tops: { id: string; y: number }[] = [];
      const measure = () => {
        tops = headings.map((h) => ({ id: h.id, y: h.getBoundingClientRect().top + window.scrollY }));
      };
      const update = () => {
        const readLine = window.scrollY + window.innerHeight * 0.45;
        let current = '';
        for (const t of tops) if (t.y <= readLine) current = t.id;
        setActiveId(current);
      };
      ScrollTrigger.create({
        trigger: body,
        start: 'top bottom',
        end: 'bottom top',
        onRefresh: () => {
          measure();
          update();
        },
        onUpdate: update,
      });
      measure();
      update();
    },
    { scope: progressScope },
  );

  const toc = article.toc;

  return (
    <div ref={progressScope}>
      {/* reading progress — a cobalt hairline across the very top */}
      <div
        ref={barRef}
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'var(--cobalt)', transform: 'scaleX(0)', transformOrigin: 'left', zIndex: 90 }}
      />

      <main style={{ padding: `clamp(48px,7vh,90px) ${M} clamp(48px,8vh,90px)`, maxWidth: 'var(--measure-wide)', margin: '0 auto' }}>
        {/* ── Header ── */}
        <header ref={headReveal} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860 }}>
          <div ref={headRef} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <BackLink />
            </div>
            <div ref={metaRef} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'baseline' }}>
              <span data-decode style={{ ...mono, color: 'var(--text-accent)', fontWeight: 500 }}>{article.category}</span>
              <span data-decode style={{ ...mono, color: 'var(--text-muted)' }}>{article.date}</span>
              <span data-decode style={{ ...mono, color: 'var(--text-faint)' }}>{article.readTime} read</span>
              {article.status === 'placeholder' && <Tag variant="accent">Placeholder content</Tag>}
            </div>
          </div>
          <h1
            ref={titleRef}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--t-xxl)',
              fontWeight: 300,
              lineHeight: 'var(--lh-tight)',
              letterSpacing: 'var(--track-tight)',
              color: 'var(--text-strong)',
              margin: 0,
              maxWidth: '24ch',
            }}
          >
            {article.title}
          </h1>
          <p
            data-reveal
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', lineHeight: 'var(--lh-normal)', color: 'var(--text-secondary)', margin: 0, maxWidth: '52ch' }}
          >
            {article.dek}
          </p>
        </header>

        {/* ── Body: TOC rail + reading column ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: wide ? '190px minmax(0, var(--measure-read))' : 'minmax(0, var(--measure-read))',
            gap: wide ? 72 : 0,
            marginTop: 'clamp(40px,6vh,64px)',
            paddingTop: 32,
            borderTop: '1px solid var(--border-strong)',
          }}
        >
          {wide && (
            <nav aria-label="Contents" style={{ position: 'sticky', top: 110, alignSelf: 'start' }}>
              <div style={{ ...mono, color: 'var(--text-muted)', paddingBottom: 12, borderBottom: '1px solid var(--border-hairline)', marginBottom: 14 }}>
                Contents
              </div>
              {toc.map((h) => {
                const active = h.id === activeId;
                return (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={event => {
                      event.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: 'instant' });
                      window.history.replaceState(window.history.state, '', `#${h.id}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '7px 0',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--t-meta)',
                      letterSpacing: 'var(--track-wide)',
                      color: active ? 'var(--text-accent)' : 'var(--text-muted)',
                      transition: 'color var(--dur-base) var(--ease-out)',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: active ? 18 : 10,
                        height: 1,
                        background: active ? 'var(--cobalt)' : 'var(--border-hairline)',
                        transition: 'width var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
                      }}
                    />
                    {h.text}
                  </a>
                );
              })}
            </nav>
          )}

          <article ref={bodyRef}>
            <ArticleBody body={article.body} />

            <div data-reveal style={{ marginTop: 'clamp(48px,8vh,72px)', paddingTop: 28, borderTop: '1px solid var(--border-hairline)' }}>
              <BackLink />
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
