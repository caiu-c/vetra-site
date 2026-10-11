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
import { initBooking } from './booking';

gsap.registerPlugin(ScrollTrigger, SplitText);

const env = detectEnv();

// Lente 3D (ADR-007/009): só com tela ≥ md e ponteiro fino. No celular fica o SVG do
// hero, e o Three.js (~140 kB gz) nem é baixado. Se o import falhar, o SVG fica.
const lensAnchor = document.querySelector<HTMLElement>('[data-lens-anchor]');
if (env.webgl && env.finePointer && lensAnchor && window.matchMedia('(min-width: 768px)').matches) {
  void import('./three/lens').then(({ initLens }) => initLens(lensAnchor, env)).catch(() => undefined);
}

// Leves e ligados à interação: na hora.
initContactForm();
initBooking();
initCursor();
initMagnetic();

/*
  O resto mexe só com o que está abaixo da dobra (títulos revelados, faixa de logos,
  carrossel, gráficos, contadores). Roda quando o navegador fica ocioso, uma tarefa
  por vez, para não virar uma tarefa longa logo depois da primeira pintura (TBT).
*/
const deferred: (() => void)[] = [
  () => initCarousels(env.reducedMotion),
  () => initChartScrubbers(),
  () => initCounters(env.reducedMotion),
];
if (!env.reducedMotion) deferred.unshift(() => initSplitReveals(), () => initMarquees());

// Safari só tem requestIdleCallback atrás de flag: lá cai no setTimeout.
const whenIdle = (fn: () => void) => {
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(fn, { timeout: 1500 });
  else setTimeout(fn, 50);
};
const runNext = () => {
  const task = deferred.shift();
  if (!task) return;
  task();
  whenIdle(runNext);
};
whenIdle(runNext);

// Posições dos gatilhos de scroll dependem das métricas finais da fonte.
void document.fonts.ready.then(() => ScrollTrigger.refresh());
