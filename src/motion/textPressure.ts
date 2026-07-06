import { gsap } from 'gsap';
import { cssToken } from './core';

/* ── Hero text-pressure ─────────────────────────────────────────────────
   The React Bits "TextPressure" effect, adapted for the masthead. Letters
   near the cursor swell (heavier + wider); letters far from it thin and
   condense. Newsreader exposes only a weight axis, so the width half is
   faked with a per-char scaleX transform — which, being a transform, does
   not reflow its neighbours, so the line stays stable instead of jittery.

   This is the idle interaction the hero settles into *after* its entrance;
   the caller (Home.tsx) hands us the persistent SplitText char spans and
   holds the cleanup we return. Fine-pointer / hover devices only — touch
   and coarse pointers never attach (reduced-motion is already gated
   upstream, where the entrance that produces these chars is skipped). */

/** Reads a numeric pressure token, falling back if the stylesheet is late. */
function num(name: string, fallback: number): number {
  const v = parseFloat(cssToken(name));
  return Number.isFinite(v) ? v : fallback;
}

export function attachTextPressure(container: HTMLElement, chars: HTMLElement[]): () => void {
  if (chars.length === 0) return () => {};

  const WGHT_MIN = num('--pressure-wght-min', 300);
  const WGHT_MAX = num('--pressure-wght-max', 600);
  const SX_MIN = num('--pressure-scalex-min', 1);
  const SX_MAX = num('--pressure-scalex-max', 1.22);
  const SMOOTH = num('--pressure-smooth', 0.15);

  const mm = gsap.matchMedia();

  mm.add('(hover: hover) and (pointer: fine)', () => {
    /* scaleX needs an inline-block box and a stable pivot; SplitText already
       makes char spans inline-block, but set it defensively. */
    const setScaleX = chars.map((el) => {
      gsap.set(el, { transformOrigin: '50% 50%', display: 'inline-block' });
      return gsap.quickSetter(el, 'scaleX') as (v: number) => void;
    });

    /* Both start far offscreen so the resting masthead is the *designed*
       pose (every char at the mins) — the effect only ever swells letters
       toward the cursor, never restyles the headline before it's touched.
       The first real move snaps the smoothed pointer onto the cursor
       (`primed`) so letters don't ripple as it sweeps in from offscreen. */
    const target = { x: -1e4, y: -1e4 };
    const pointer = { x: target.x, y: target.y };
    let primed = false;

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!primed) {
        pointer.x = target.x;
        pointer.y = target.y;
        primed = true;
      }
    };
    window.addEventListener('mousemove', onMove);

    /* Linear falloff on the headline's half-width: at the cursor → maxVal,
       at/beyond the edge → minVal. (React Bits' own formula overshoots to
       min+max at d=0 and leans on the font clamping the wght axis; scaleX
       has no such clamp, so we interpolate honestly within [min, max].) */
    const getAttr = (d: number, maxDist: number, minVal: number, maxVal: number) => {
      const t = Math.min(1, Math.max(0, 1 - d / maxDist));
      return minVal + (maxVal - minVal) * t;
    };

    const tick = () => {
      if (!visible) return;
      pointer.x += (target.x - pointer.x) * SMOOTH;
      pointer.y += (target.y - pointer.y) * SMOOTH;

      const cRect = container.getBoundingClientRect();
      const maxDist = cRect.width / 2 || 1;

      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dx = pointer.x - (r.left + r.width / 2);
        const dy = pointer.y - (r.top + r.height / 2);
        const d = Math.sqrt(dx * dx + dy * dy);

        const wght = Math.round(getAttr(d, maxDist, WGHT_MIN, WGHT_MAX));
        const sx = getAttr(d, maxDist, SX_MIN, SX_MAX);

        /* Keep opsz pinned so overriding font-variation-settings doesn't
           switch off Newsreader's optical sizing (base.css: auto). */
        el.style.fontVariationSettings = `'opsz' 72, 'wght' ${wght}`;
        setScaleX[i](sx);
      });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMove);
      io.disconnect();
      chars.forEach((el) => {
        el.style.fontVariationSettings = '';
        gsap.set(el, { scaleX: 1 });
      });
    };
  });

  return () => mm.revert();
}
