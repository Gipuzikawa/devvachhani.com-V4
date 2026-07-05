import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

/* ── Motion core ────────────────────────────────────────────────────────
   The single registration point for GSAP plugins and the bridge between
   the CSS motion tokens (src/styles/tokens/effects.css) and GSAP. Every
   duration/ease below mirrors a token so CSS transitions and GSAP tweens
   draw from the same well — if a value changes there, change it here. */

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase, SplitText, ScrambleTextPlugin, Flip);

/* Re-exported so consumers never import plugins from 'gsap/…' directly —
   importing through the core is what guarantees registration happened. */
export { SplitText, Flip };

/** Durations in seconds — mirrors --dur-* in effects.css. */
export const DUR = {
  fast: 0.18,
  base: 0.4,
  slow: 0.7,
  reveal: 0.9,
  hero: 1.1,
} as const;

/* Registered from the token cubic-beziers so GSAP and CSS share the
   literal same curves (the old code used 'expo.out', which only
   approximated --ease-emph). */
CustomEase.create('ds-out', '0.22,1,0.36,1');
CustomEase.create('ds-in-out', '0.65,0,0.35,1');
CustomEase.create('ds-emph', '0.16,1,0.3,1');
CustomEase.create('ds-spring', '0.34,1.56,0.64,1');

/** Ease names — mirrors --ease-* in effects.css. */
export const EASE = {
  out: 'ds-out',
  inOut: 'ds-in-out',
  emph: 'ds-emph',
  /** Settles with one overshoot — magnetic returns, node stamps. */
  spring: 'ds-spring',
} as const;

/** Standard entrance rise distance in px — mirrors --reveal-rise. */
export const REVEAL_RISE = 24;

/**
 * The character well every decode/scramble effect draws from — index
 * glyphs (figures, catalogue punctuation), so mid-scramble text still
 * reads like something out of the archive rather than static noise.
 */
export const DECODE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ·—/';

/**
 * Resolve a design token (e.g. '--cobalt') to its computed value, for the
 * few GSAP tweens that need a literal color. Read at animation-setup time,
 * not module scope, so late stylesheet loads can't hand back ''.
 */
export function cssToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * The one JS-side reduced-motion check; no hook or component should call
 * matchMedia for this itself. (The CSS side is handled globally by the
 * transition-killer in tokens/base.css.) When this returns true, skip the
 * animation entirely — content must render in its final state.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
