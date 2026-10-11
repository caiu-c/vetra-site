import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Espaço ocupado pelo header fixo (top 16px + barra 64px + folga). Manter igual ao scroll-padding-top do global.css. */
export const HEADER_OFFSET = 88;

/**
 * Smooth scroll dirigido pelo ticker do GSAP, para que Lenis e ScrollTrigger
 * leiam a mesma posição no mesmo frame. Com reduced motion, scroll nativo.
 */
export function initLenis(reducedMotion: boolean): Lenis | null {
  if (reducedMotion) return null;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: false,
    anchors: { offset: -HEADER_OFFSET },
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
