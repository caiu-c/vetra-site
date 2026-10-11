import { ExtrudeGeometry, Group, Mesh, Shape, SphereGeometry, Vector2, type Material } from 'three';

type Point = [number, number];

/*
  Mesmas coordenadas do símbolo oficial (src/components/ApertureSymbol.astro,
  viewBox 56×56): três chevrons e o ponto de convergência. Manter em sincronia.
*/
const CHEVRONS: [Point, Point, Point][] = [
  [[8, 10], [28, 46], [48, 10]],
  [[14, 10], [28, 38], [42, 10]],
  [[20, 10], [28, 30], [36, 10]],
];
const DOT: Point = [28, 46];
const CENTER: Point = [28, 28];
const UNIT = 0.1; // 1 unidade do SVG = 0,1 unidade da cena (símbolo com ~4 de largura)

/** SVG (y para baixo, origem no canto) → cena (y para cima, origem no centro). */
const toScene = ([x, y]: Point): Vector2 =>
  new Vector2((x - CENTER[0]) * UNIT, -(y - CENTER[1]) * UNIT);

/**
 * Contorno de um traço sobre uma polilinha de 3 pontos, com junção em miter e
 * pontas quadradas (como `stroke-linejoin="miter"` + `stroke-linecap="square"`).
 */
function strokeOutline([p0, p1, p2]: [Point, Point, Point], halfWidth: number): Point[] {
  const segment = (a: Point, b: Point) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    return { d: [dx / len, dy / len] as Point, n: [-dy / len, dx / len] as Point };
  };
  const s0 = segment(p0, p1);
  const s1 = segment(p1, p2);
  const start: Point = [p0[0] - s0.d[0] * halfWidth, p0[1] - s0.d[1] * halfWidth];
  const end: Point = [p2[0] + s1.d[0] * halfWidth, p2[1] + s1.d[1] * halfWidth];
  const offset = (p: Point, n: Point, side: number): Point => [
    p[0] + side * n[0] * halfWidth,
    p[1] + side * n[1] * halfWidth,
  ];
  const miter = (side: number): Point => {
    const mx = s0.n[0] + s1.n[0];
    const my = s0.n[1] + s1.n[1];
    const len = Math.hypot(mx, my);
    const k = halfWidth / ((mx / len) * s0.n[0] + (my / len) * s0.n[1]);
    return [p1[0] + side * (mx / len) * k, p1[1] + side * (my / len) * k];
  };
  return [
    offset(start, s0.n, 1),
    miter(1),
    offset(end, s1.n, 1),
    offset(end, s1.n, -1),
    miter(-1),
    offset(start, s0.n, -1),
  ];
}

export interface ApertureModel {
  group: Group;
  /** 3 chevrons (do externo ao interno) + o ponto, na ordem das Capacidades. */
  pieces: Mesh[];
}

export function createAperture(
  glass: Material,
  dotMaterial: Material,
  quality: 'low' | 'high',
): ApertureModel {
  const depth = 0.24;
  const group = new Group();
  const pieces: Mesh[] = CHEVRONS.map((chevron) => {
    const shape = new Shape(strokeOutline(chevron, 1.1).map(toScene));
    const geometry = new ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: quality === 'high' ? 4 : 2,
      curveSegments: 1,
    });
    geometry.translate(0, 0, -depth / 2);
    return new Mesh(geometry, glass);
  });

  const segments = quality === 'high' ? 48 : 24;
  const dot = new Mesh(new SphereGeometry(0.26, segments, segments / 2), dotMaterial);
  const { x, y } = toScene(DOT);
  dot.position.set(x, y, 0);
  pieces.push(dot);

  group.add(...pieces);
  return { group, pieces };
}
