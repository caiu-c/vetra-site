import { gsap } from 'gsap';

const INTERACTIVE = 'a, button, summary, input, select, textarea, [data-chart-scrub]';
const DRAG_START = 6; // px antes de considerar arraste
const SWIPE = 0.15; // fração da largura que troca de slide

/**
 * Carrossel `[data-carousel]` (seção Casos): um slide por vez, trilha movida por
 * transform. Controles: setas (`[data-carousel-prev|next]`), teclas ←/→ com o foco
 * dentro do carrossel e arraste/swipe por pointer events (`touch-action: pan-y` no
 * CSS mantém o scroll vertical da página). Slides fora de vista ficam `inert`.
 * Sem JS, a trilha é scroll horizontal nativo com snap (global.css).
 */
export function initCarousels(reducedMotion: boolean): void {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const viewport = root.querySelector<HTMLElement>('[data-carousel-viewport]');
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const status = root.querySelector<HTMLElement>('[data-carousel-status]');
    const slides = track ? (Array.from(track.children) as HTMLElement[]) : [];
    if (!viewport || !track || slides.length < 2) return;

    root.classList.add('carousel-js');
    let index = 0;

    const go = (to: number, animate = true) => {
      index = Math.max(0, Math.min(slides.length - 1, to));
      gsap.to(track, {
        xPercent: -100 * index,
        duration: animate && !reducedMotion ? 0.8 : 0,
        ease: 'expo.out',
        overwrite: true,
      });
      slides.forEach((slide, i) => {
        slide.inert = i !== index;
      });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
      if (status) status.textContent = `${index + 1} / ${slides.length}`;
    };

    prev?.addEventListener('click', () => go(index - 1));
    next?.addEventListener('click', () => go(index + 1));

    root.addEventListener('keydown', (e) => {
      if ((e.target as Element).closest('[data-chart-scrub], input, textarea, select')) return;
      if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === 'ArrowRight') go(index + 1);
    });

    // Arraste / swipe
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dragging = false;
    let suppressClick = false;

    track.addEventListener('pointerdown', (e) => {
      dragging = false;
      if (e.button !== 0 || (e.target as Element).closest(INTERACTIVE)) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      dx = 0;
    });

    track.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pointerId) return;
      dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_START || Math.abs(dx) < Math.abs(e.clientY - startY)) return;
        dragging = true;
        track.setPointerCapture(e.pointerId);
      }
      // Resistência nas pontas
      const atEdge = (index === 0 && dx > 0) || (index === slides.length - 1 && dx < 0);
      const offset = ((atEdge ? dx * 0.3 : dx) / viewport.clientWidth) * 100;
      gsap.set(track, { xPercent: -100 * index + offset });
    });

    const release = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      // O clique que o navegador dispara logo após soltar não deve abrir links.
      suppressClick = true;
      setTimeout(() => {
        suppressClick = false;
      }, 0);
      const threshold = viewport.clientWidth * SWIPE;
      if (dx < -threshold) go(index + 1);
      else if (dx > threshold) go(index - 1);
      else go(index);
    };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);

    // Um arraste não deve virar clique em link dentro do slide.
    track.addEventListener(
      'click',
      (e) => {
        if (suppressClick) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );

    go(0, false);
  });
}
