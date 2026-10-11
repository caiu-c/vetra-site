import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Lane {
  tween: gsap.core.Tween;
  /** Velocidade de repouso: 1 normal, 0 com o ponteiro em cima. */
  base: number;
}

/**
 * Faixas `[data-marquee]` com o conteúdo duplicado (a segunda cópia é aria-hidden):
 * deslocar -50% fecha o loop sem emenda. `data-marquee="reverse"` inverte o
 * sentido. A velocidade do scroll acelera as faixas; hover desacelera até parar.
 */
export function initMarquees(): void {
  const lanes: Lane[] = [];

  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((track) => {
    const reverse = track.dataset.marquee === 'reverse';
    const lane: Lane = {
      tween: gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: 38, ease: 'none', repeat: -1 },
      ),
      base: 1,
    };
    lanes.push(lane);

    const settle = (base: number) => {
      lane.base = base;
      gsap.to(lane.tween, { timeScale: base, duration: 0.8, ease: 'power2.out', overwrite: true });
    };
    track.parentElement?.addEventListener('pointerenter', () => settle(0));
    track.parentElement?.addEventListener('pointerleave', () => settle(1));
  });

  if (!lanes.length) return;

  ScrollTrigger.create({
    trigger: lanes[0].tween.targets()[0] as Element,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 6);
      for (const lane of lanes) {
        if (lane.base === 0) continue;
        gsap.to(lane.tween, {
          timeScale: boost,
          duration: 0.15,
          overwrite: true,
          onComplete: () => {
            gsap.to(lane.tween, { timeScale: lane.base, duration: 1.2, ease: 'power2.out' });
          },
        });
      }
    },
  });
}
