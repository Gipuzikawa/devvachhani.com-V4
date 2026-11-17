import { SectionHeading } from '../components/ui/SectionHeading';
import { ArticleCard } from '../components/cards/ArticleCard';
import { useReveal } from '../hooks/useReveal';
import { useStagger } from '../hooks/useStagger';
import { articles, planned } from '../data/content';

const M = 'var(--page-margin)';

export function Writing() {
  const listRef = useStagger<HTMLDivElement>();
  const plannedRef = useReveal<HTMLDivElement>();

  return (
    <main style={{ padding: `clamp(56px,9vh,110px) ${M} 0`, maxWidth: '860px', margin: '0 auto' }}>
      <SectionHeading eyebrow="Writing — index" title="Essays, notebooks & field notes" />
      <p style={{ maxWidth: '54ch', marginTop: 22, fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}>
        Thinking out loud about physics, computation, and the odd machine. Roughly monthly, always in progress.
      </p>

      <div ref={listRef} style={{ marginTop: 44, borderBottom: '1px solid var(--border-hairline)' }}>
        {articles.map((a) => (
          <ArticleCard key={a.slug ?? a.title} {...a} href={a.slug ? `/writing/${a.slug}` : '/writing'} style={{ borderTop: '1px solid var(--border-strong)' }} />
        ))}
      </div>

      <div ref={plannedRef} style={{ marginTop: 56 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: 16, borderBottom: '1px solid var(--border-hairline)' }}>
          On the desk
        </div>
        {planned.map((t) => (
          <div data-reveal key={t.no} style={{ display: 'flex', gap: 20, alignItems: 'baseline', padding: '22px 0', borderBottom: '1px solid var(--border-hairline)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-meta)', color: 'var(--text-faint)', flexShrink: 0 }}>{t.no}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-wide)', textTransform: 'uppercase', color: 'var(--text-accent)' }}>
                {t.kind}
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-lg)', fontWeight: 400, lineHeight: 'var(--lh-snug)', color: 'var(--text-strong)', margin: '8px 0 0', maxWidth: '34ch' }}>
                {t.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
