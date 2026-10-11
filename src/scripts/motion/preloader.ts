import { gsap } from 'gsap';

const SESSION_KEY = 'vetra:preloaded';
const MIN_MS = 1200;
const MAX_MS = 2500;

function markSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* storage bloqueado: preloader volta a aparecer, sem outro efeito */
  }
}

/**
 * Preloader com progresso real: cada tarefa resolvida avança o alvo do contador.
 * Resolve quando a cortina começa a subir (o intro do hero pode tocar em paralelo).
 * Já visto na sessão → o script inline do <head> marcou `preloaded` e o elemento
 * nem aparece; aqui só removemos do DOM.
 */
export function runPreloader(tasks: Promise<unknown>[], reducedMotion: boolean): Promise<void> {
  const el = document.getElementById('preloader');
  const root = document.documentElement;
  root.classList.add('preloader-armed');

  if (!el || root.classList.contains('preloaded')) {
    el?.remove();
    return Promise.resolve();
  }

  const counter = el.querySelector<HTMLElement>('[data-preloader-count]');
  const bar = el.querySelector<HTMLElement>('[data-preloader-bar]');

  if (reducedMotion) {
    markSeen();
    return new Promise<void>((resolve) => {
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: () => {
          el.remove();
          resolve();
        },
      });
    });
  }

  const progress = { value: 0 };
  let target = 0;
  const step = 100 / Math.max(tasks.length, 1);
  const render = () => {
    const v = Math.round(progress.value);
    if (counter) counter.textContent = String(v).padStart(3, '0');
    if (bar) bar.style.transform = `scaleX(${progress.value / 100})`;
  };
  const advance = (to: number) => {
    target = Math.max(target, to);
    gsap.to(progress, { value: target, duration: 0.6, ease: 'power2.out', onUpdate: render });
  };

  tasks.forEach((t) => t.finally(() => advance(target + step)));

  const allTasks = Promise.allSettled(tasks);
  const minDelay = new Promise((r) => setTimeout(r, MIN_MS));
  const cap = new Promise((r) => setTimeout(r, MAX_MS));

  return Promise.race([Promise.all([allTasks, minDelay]), cap]).then(
    () =>
      new Promise<void>((resolve) => {
        markSeen();
        gsap
          .timeline({ onComplete: () => el.remove() })
          .to(progress, { value: 100, duration: 0.35, ease: 'power2.out', onUpdate: render })
          .to(el.querySelectorAll('[data-preloader-fade]'), {
            autoAlpha: 0,
            y: -12,
            duration: 0.4,
            stagger: 0.04,
            ease: 'power2.in',
          })
          .add(resolve)
          .to(el, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<');
      }),
  );
}
