import { gsap } from 'gsap';

type CursorState = 'default' | 'link' | 'view' | 'drag';

const INTERACTIVE = '[data-cursor], a, button';

/**
 * Cursor customizado: ponto rápido + anel com atraso. O estado vem do elemento sob
 * o ponteiro (`data-cursor="view|drag"` + `data-cursor-label`, ou `link` para
 * qualquer a/button). Só roda com ponteiro fino e sem reduced motion (`cursor-on`).
 */
export function initCursor(): void {
  const root = document.getElementById('cursor');
  if (!root || !document.documentElement.classList.contains('cursor-on')) {
    root?.remove();
    return;
  }

  const dot = root.querySelector<HTMLElement>('[data-cursor-dot]');
  const ring = root.querySelector<HTMLElement>('[data-cursor-ring]');
  const label = root.querySelector<HTMLElement>('[data-cursor-label]');
  if (!dot || !ring || !label) return;

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });

  let visible = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      if (!visible) {
        visible = true;
        root.dataset.visible = 'true';
      }
    },
    { passive: true },
  );

  document.documentElement.addEventListener('pointerleave', () => {
    visible = false;
    root.dataset.visible = 'false';
  });

  document.addEventListener('pointerover', (e) => {
    const target = (e.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
    const state: CursorState = target
      ? ((target.dataset.cursor as CursorState | undefined) ?? 'link')
      : 'default';
    root.dataset.state = state;
    label.textContent = target?.dataset.cursorLabel ?? '';
  });

  document.addEventListener('pointerdown', () => root.classList.add('is-pressed'));
  document.addEventListener('pointerup', () => root.classList.remove('is-pressed'));
}

/** Elementos com `data-magnetic` são atraídos pelo ponteiro e voltam com elástico. */
export function initMagnetic(): void {
  if (!document.documentElement.classList.contains('cursor-on')) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.35)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.35)' });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}
