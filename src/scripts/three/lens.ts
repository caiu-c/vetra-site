import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionEnv } from '../motion/env';
import { createAperture } from './aperture-geometry';

/* Cores do design system (tailwind.config.mjs) */
const SURFACE = '#F2F4F8';
const LINE = '#DCE1EA';
const BRAND = '#1640D6';
const BRAND_LIGHT = '#6A8CF7';

/** Profundidade de cada peça quando a lente "explode" ao sair do hero. */
const SPREAD = [-1.4, -0.45, 0.45, 1.4];

/**
 * Disco desenhado em canvas (mesmo desenho do SVG de fallback do hero): é o que o
 * vidro refrata — sem algo atrás, a transmissão não tem o que distorcer.
 */
function discTexture(): CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const c = size / 2;
    const r = size * 0.475;
    ctx.fillStyle = SURFACE;
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.arc(c, c, r * 0.79, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(c - r, c);
    ctx.lineTo(c + r, c);
    ctx.moveTo(c, c - r);
    ctx.lineTo(c, c + r);
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/**
 * Lente aperture em vidro no hero (ADR-007). Resolve depois do primeiro quadro,
 * quando a âncora ganha `.is-live` e o SVG de fallback some (global.css).
 * - Loop no gsap.ticker, pausado com o hero fora da tela ou a aba oculta.
 * - Inclinação segue o ponteiro (só ponteiro fino); ao rolar para fora do hero, o
 *   grupo gira e as 4 peças se afastam em profundidade.
 * - Reduced motion: um quadro estático, refeito só no resize.
 */
export async function initLens(anchor: HTMLElement, env: MotionEnv): Promise<void> {
  const canvas = anchor.querySelector<HTMLCanvasElement>('[data-lens-canvas]');
  if (!canvas) return;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  if (env.tier === 'low') renderer.transmissionResolutionScale = 0.5;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const backdrop = new Mesh(
    new PlaneGeometry(6.4, 6.4),
    new MeshBasicMaterial({ map: discTexture(), transparent: true, toneMapped: false }),
  );
  backdrop.position.z = -2;
  scene.add(backdrop);

  const glass = new MeshPhysicalMaterial({
    color: new Color('#FFFFFF'),
    roughness: 0.07,
    metalness: 0,
    transmission: 1,
    thickness: 1.1,
    ior: 1.45,
    iridescence: 0.25,
    iridescenceIOR: 1.3,
    attenuationColor: new Color(BRAND_LIGHT),
    attenuationDistance: 0.9,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.25,
  });
  const dotMaterial = new MeshPhysicalMaterial({
    color: new Color(BRAND),
    roughness: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });

  const { group, pieces } = createAperture(glass, dotMaterial, env.tier);
  group.scale.setScalar(0.88);
  scene.add(group);

  const light = new DirectionalLight('#FFFFFF', 1.2);
  light.position.set(3, 4, 6);
  scene.add(light);

  const render = () => renderer.render(scene, camera);

  const resize = () => {
    const { width, height } = anchor.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (env.reducedMotion) render();
  };
  new ResizeObserver(resize).observe(anchor);
  resize();

  if (env.reducedMotion) {
    group.rotation.set(-0.12, 0.35, 0);
    render();
    anchor.classList.add('is-live');
    return;
  }

  // Estado dirigido por ponteiro e scroll
  const pointer = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0 };
  const scroll = { spread: 0, spin: 0 };

  if (env.finePointer) {
    window.addEventListener(
      'pointermove',
      (e) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true },
    );
  }

  const hero = anchor.closest('section') ?? anchor;
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      scroll.spread = self.progress;
      scroll.spin = self.progress * Math.PI * 0.55;
    },
  });

  const tick = (time: number) => {
    tilt.x += (pointer.x * 0.25 - tilt.x) * 0.06;
    tilt.y += (pointer.y * 0.25 - tilt.y) * 0.06;
    group.rotation.y = Math.sin(time * 0.35) * 0.28 + tilt.x + scroll.spin;
    group.rotation.x = -0.1 + tilt.y + Math.sin(time * 0.27) * 0.05;
    pieces.forEach((piece, i) => {
      piece.position.z = SPREAD[i] * scroll.spread;
    });
    render();
  };

  // Só renderiza com o hero na tela e a aba visível.
  let inView = true;
  let running = false;
  const update = () => {
    const shouldRun = inView && document.visibilityState === 'visible';
    if (shouldRun && !running) gsap.ticker.add(tick);
    if (!shouldRun && running) gsap.ticker.remove(tick);
    running = shouldRun;
  };
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  }).observe(hero);
  document.addEventListener('visibilitychange', update);

  tick(0);
  anchor.classList.add('is-live');
  update();
}
