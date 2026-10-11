import { gsap } from 'gsap';

/**
 * `<span data-count="99.97">` conta de 0 até o valor ao entrar na viewport,
 * respeitando as casas decimais do próprio valor. O texto final já está no HTML,
 * então sem JS (ou com reduced motion) o número aparece direto.
 */
export function initCounters(reducedMotion: boolean): void {
  if (reducedMotion) return;

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const raw = el.dataset.count ?? '';
    const end = Number(raw);
    if (!Number.isFinite(end)) return;
    const decimals = raw.split('.')[1]?.length ?? 0;
    const width = raw.split('.')[0].length;
    const state = { v: 0 };
    const format = (v: number) =>
      decimals ? v.toFixed(decimals) : String(Math.round(v)).padStart(width, '0');

    el.textContent = format(0);
    gsap.to(state, {
      v: end,
      duration: 2,
      ease: 'expo.out',
      onUpdate: () => {
        el.textContent = format(state.v);
      },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}
