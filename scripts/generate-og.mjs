// Gera public/og-image.png (1200×630) a partir de SVG inline, espelhando o hero do
// site: fundo branco, moldura com cruzes, Archivo expandida em Tinta e a lente aperture.
//
// Pipeline:
//   WOFF2 do @fontsource-variable/archivo (eixos wght + wdth)
//     → wawoff2.decompress (em memória; o getVariation do fontkit falha em WOFF2)
//     → fontkit.create + getVariation({ wght, wdth })
//     → cada texto vira <path> (glifos da instância pedida)
//     → @resvg/resvg-js → PNG 1200×630
//
// Todo texto é convertido em path porque o resvg ignora font-weight/font-stretch em
// fontes variáveis (renderiza só a instância default). Assim o SVG não depende de
// nenhuma fonte instalada.
//
// Roda manualmente via `pnpm gen:og`. Não é parte do build automático —
// regenerar só quando headline ou identidade mudarem.

import { Resvg } from '@resvg/resvg-js';
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';
import { readFileSync, writeFileSync } from 'node:fs';

const woff2 = readFileSync(
  new URL(
    '../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2',
    import.meta.url,
  ),
);
const archivo = fontkit.create(Buffer.from(await wawoff2.decompress(woff2)));

function textPath(str, x, y, size, fill, { wght = 400, wdth = 100, tracking = 0 } = {}) {
  const font = archivo.getVariation({ wght, wdth });
  const run = font.layout(str);
  const scale = size / font.unitsPerEm;
  let cursor = 0;
  const glyphs = run.glyphs.map((glyph, i) => {
    const pos = run.positions[i];
    const gx = x + (cursor + pos.xOffset) * scale;
    cursor += pos.xAdvance + tracking / scale;
    return `<path transform="translate(${gx.toFixed(2)} ${y}) scale(${scale} ${-scale})" d="${glyph.path.toSVG()}"/>`;
  });
  return `<g fill="${fill}">${glyphs.join('')}</g>`;
}

const INK = '#0C1838';
const BRAND = '#1640D6';
const MUTED = '#586178';
const LINE = '#DCE1EA';
const SURFACE = '#F2F4F8';

const heading = { wght: 600, wdth: 112, tracking: -2.4 };

const cross = (x, y) =>
  `<path d="M${x - 6} ${y} H${x + 6} M${x} ${y - 6} V${y + 6}" stroke="#AEB6C6" stroke-width="1"/>`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#FFFFFF"/>

  <!-- moldura com cruzes nos cantos (grid do site) -->
  <rect x="60" y="60" width="1080" height="510" fill="none" stroke="${LINE}" stroke-width="1"/>
  ${cross(60, 60)}${cross(1140, 60)}${cross(60, 570)}${cross(1140, 570)}

  <!-- lente aperture (mesmo desenho do fallback do hero) -->
  <g transform="translate(790 165) scale(0.75)">
    <circle cx="200" cy="200" r="190" fill="${SURFACE}"/>
    <circle cx="200" cy="200" r="190" fill="none" stroke="${LINE}"/>
    <circle cx="200" cy="200" r="150" fill="none" stroke="${LINE}" stroke-dasharray="2 6"/>
    <path d="M10 200H390M200 10V390" stroke="${LINE}"/>
    <g transform="translate(26 26) scale(0.87)" stroke="${INK}" stroke-width="10" fill="none" stroke-linejoin="miter" stroke-linecap="square">
      <path d="M57 71 L200 329 L343 71"/>
      <path d="M100 71 L200 271 L300 71"/>
      <path d="M143 71 L200 214 L257 71"/>
      <circle cx="200" cy="329" r="16" fill="${BRAND}" stroke="none"/>
    </g>
  </g>

  <!-- logo: símbolo aperture + wordmark -->
  <g transform="translate(108, 104)" stroke="${BRAND}" fill="none" stroke-width="2" stroke-linecap="square">
    <path d="M4 5 L14 23 L24 5"/>
    <path d="M7 5 L14 19 L21 5"/>
    <path d="M10 5 L14 15 L18 5"/>
    <circle cx="14" cy="23" r="1.6" fill="${BRAND}" stroke="none"/>
  </g>
  ${textPath('Vetra Solutions', 146, 125, 22, INK, { wght: 600, wdth: 112, tracking: -0.4 })}

  <!-- headline -->
  ${textPath('A coluna vertebral', 104, 330, 72, INK, heading)}
  ${textPath('dos seus dados.', 104, 408, 72, INK, heading)}

  <!-- rodapé -->
  ${textPath('Engenharia de dados e IA em Fortaleza/CE', 108, 500, 20, MUTED)}
  ${textPath('vetrasolutions.com.br', 108, 530, 20, MUTED)}
</svg>
`;

const pngBuffer = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

writeFileSync(new URL('../public/og-image.png', import.meta.url), pngBuffer);

console.log(
  `✓ og-image.png gerada (${pngBuffer.length} bytes / ${(pngBuffer.length / 1024).toFixed(1)} kB) em public/og-image.png`,
);
