import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { ScrollTrigger } from '../motion/core';

export function useContentLayout(scope: RefObject<HTMLElement | null>, layoutKey?: string) {
  useGSAP(() => {
    let active = true;
    let frame = 0;
    const refresh = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if (active) ScrollTrigger.refresh(); }); };
    refresh();
    void document.fonts?.ready.then(() => { if (active) refresh(); });
    const root = scope.current;
    root?.addEventListener('load', refresh, true);
    return () => { active = false; cancelAnimationFrame(frame); root?.removeEventListener('load', refresh, true); };
  }, { scope, dependencies: [layoutKey], revertOnUpdate: true });
}
