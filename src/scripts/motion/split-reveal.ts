import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

/**
 * Títulos com `data-split` sobem linha a linha por trás de uma máscara ao entrar
 * na viewport. `autoSplit` refaz a divisão em resize/carregamento de fonte, e o
 * tween devolvido no onSplit é revertido e recriado junto. Em títulos, `aria: 'auto'`
 * mantém o texto original acessível (aria-label no pai, partes com aria-hidden).
 */
export function initSplitReveals(): void {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      // aria-label só é válido em títulos; em parágrafo (manifesto) as linhas já leem o texto inteiro.
      aria: /^H[1-6]$/.test(el.tagName) ? 'auto' : 'none',
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
  });
}

/**
 * Intro do hero, tocada quando a cortina do preloader sobe. Elementos com
 * `data-intro` começam ocultos pelo CSS (`.js:not(.intro-armed)`), com failsafe
 * caso este script nunca rode.
 */
export function prepareHeroIntro(): () => gsap.core.Timeline {
  const items = gsap.utils.toArray<HTMLElement>('[data-intro]');
  const title = document.querySelector<HTMLElement>('[data-intro-title]');
  gsap.set(items, { autoAlpha: 0 });
  document.documentElement.classList.add('intro-armed');

  return () => {
    const tl = gsap.timeline();
    if (title) {
      const split = SplitText.create(title, {
        type: 'lines,chars',
        mask: 'lines',
        linesClass: 'split-line',
        aria: 'auto',
      });
      // Reverte o split ao fim: sem isso, as linhas mascaradas quebram no resize.
      tl.set(title, { autoAlpha: 1 })
        .from(split.chars, {
          yPercent: 120,
          rotate: 6,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.018,
        })
        .add(() => split.revert());
    }
    tl.to(
      items.filter((el) => el !== title),
      { autoAlpha: 1, duration: 1, ease: 'power2.out', stagger: 0.08 },
      title ? '-=0.9' : 0,
    ).from(
      items.filter((el) => el !== title),
      { y: 24, duration: 1.2, ease: 'expo.out', stagger: 0.08 },
      '<',
    );
    return tl;
  };
}
