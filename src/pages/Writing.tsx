import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { planned } from '../data/content';

const M = 'var(--page-margin)';

export function Writing() {
  const plannedRef = useScrollReveal<HTMLDivElement>([]);

  return (
    <main style={{ padding: `clamp(56px,9vh,110px) ${M} 0`, maxWidth: '860px', margin: '0 auto' }}>
      <SectionHeading eyebrow="Writing — index" title="Essays, notebooks & field notes" />
      <p style={{ maxWidth: '54ch', marginTop: 22, fontFamily: 'var(--font-serif)', fontSize: 'var(--t-md)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}>
        Thinking out loud about physics, computation, and the odd machine. Roughly monthly, always in progress.
      </p>

      <div style={{ marginTop: 44, borderTop: '1px solid var(--border-strong)', borderBottom: '1px solid var(--border-hairline)', padding: '56px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--t-micro)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-accent)' }}>
          Forthcoming
        </div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-xl)', fontWeight: 300, lineHeight: 'var(--lh-snug)', color: 'var(--text-strong)', margin: '16px auto 0', maxWidth: '20ch' }}>
          The first field notes are being written.
        </h3>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--t-body)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)', margin: '14px auto 0', maxWidth: '52ch' }}>
          Essays and notebooks on the projects in the archive — instrumentation, control theory, and building with AI — are on the way. Until then,
          the work itself is the record.
        </p>
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outline" href="/work" iconRight="→">
            Read the project archive instead
          </Button>
        </div>
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
