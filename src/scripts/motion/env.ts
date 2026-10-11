export type QualityTier = 'low' | 'high';

export interface MotionEnv {
  reducedMotion: boolean;
  /** Mouse/trackpad: habilita cursor customizado e efeitos magnéticos. */
  finePointer: boolean;
  webgl: boolean;
  tier: QualityTier;
}

function hasWebGL2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/**
 * Detecta capacidades do dispositivo e marca o <html> com classes usadas pelo CSS:
 * `gl-on` / `no-webgl`, `touch`, `cursor-on`.
 */
export function detectEnv(): MotionEnv {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const webgl = hasWebGL2();
  const cores = navigator.hardwareConcurrency ?? 4;
  const tier: QualityTier = cores >= 8 && window.innerWidth >= 1024 ? 'high' : 'low';

  const root = document.documentElement;
  root.classList.add(webgl ? 'gl-on' : 'no-webgl');
  root.classList.toggle('touch', !finePointer);
  root.classList.toggle('cursor-on', finePointer && !reducedMotion);

  return { reducedMotion, finePointer, webgl, tier };
}
