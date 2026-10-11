import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { detectEnv } from './motion/env';
import { runPreloader } from './motion/preloader';
import { initSplitReveals, prepareHeroIntro } from './motion/split-reveal';
import { initCursor, initMagnetic } from './motion/cursor';
import { initMarquees } from './motion/marquee';
import { initCarousels } from './motion/carousel';
import { initCounters } from './motion/counters';
import { initChartScrubbers } from './charts';
import { initContactForm } from './contact-form';

gsap.registerPlugin(ScrollTrigger, SplitText);

const env = detectEnv();
// Scroll nativo (ADR-008), travado só enquanto o preloader cobre a página.
const root = document.documentElement;
root.classList.add('scroll-locked');

const playIntro = env.reducedMotion ? null : prepareHeroIntro();
if (!playIntro) root.classList.add('intro-armed');

const windowLoaded = new Promise<void>((resolve) => {
  if (document.readyState === 'complete') resolve();
  else window.addEventListener('load', () => resolve(), { once: true });
});

// Lente 3D (ADR-007): Three.js num chunk assíncrono; se falhar, o SVG do hero fica.
const lensAnchor = document.querySelector<HTMLElement>('[data-lens-anchor]');
const lensReady =
  env.webgl && lensAnchor
    ? import('./three/lens').then(({ initLens }) => initLens(lensAnchor, env)).catch(() => undefined)
    : Promise.resolve();

void runPreloader([document.fonts.ready, windowLoaded, lensReady], env.reducedMotion).then(() => {
  root.classList.remove('scroll-locked');
  playIntro?.();
});

if (!env.reducedMotion) {
  initSplitReveals();
  initMarquees();
}
initCarousels(env.reducedMotion);
initChartScrubbers();
initContactForm();
initCursor();
initMagnetic();
initCounters(env.reducedMotion);

// Posições dos gatilhos de scroll dependem das métricas finais da fonte.
void document.fonts.ready.then(() => ScrollTrigger.refresh());
