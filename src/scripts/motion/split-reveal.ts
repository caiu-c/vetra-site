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
