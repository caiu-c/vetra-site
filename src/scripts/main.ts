import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { detectEnv } from './motion/env';
import { initSplitReveals } from './motion/split-reveal';
import { initCursor, initMagnetic } from './motion/cursor';
import { initMarquees } from './motion/marquee';
import { initCarousels } from './motion/carousel';
import { initCounters } from './motion/counters';
import { initChartScrubbers } from './charts';
import { initContactForm } from './contact-form';

gsap.registerPlugin(ScrollTrigger, SplitText);

const env = detectEnv();

// Lente 3D (ADR-007/009): só com tela ≥ md e ponteiro fino. No celular fica o SVG do
// hero, e o Three.js (~140 kB gz) nem é baixado. Se o import falhar, o SVG fica.
const lensAnchor = document.querySelector<HTMLElement>('[data-lens-anchor]');
if (env.webgl && env.finePointer && lensAnchor && window.matchMedia('(min-width: 768px)').matches) {
  void import('./three/lens').then(({ initLens }) => initLens(lensAnchor, env)).catch(() => undefined);
}

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
