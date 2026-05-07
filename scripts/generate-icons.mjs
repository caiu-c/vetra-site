// Gera public/favicon.ico (16+32 multi-res) e public/apple-touch-icon.png (180×180)
// a partir de public/favicon.svg.
//
// Pipeline:
//   public/favicon.svg
//     → sharp.resize(180, 180).png() → public/apple-touch-icon.png
//     → sharp.resize(16, 16).png() + sharp.resize(32, 32).png() → png-to-ico → public/favicon.ico
//
// sharp/libvips renderiza SVG simples sem font de forma confiável (não há texto
// no favicon, só um chevron path). Por isso aqui é diferente do gen:og — não
// precisa do pipeline wawoff2/resvg.
//
// Roda manualmente via `pnpm gen:icons` quando o SVG mudar.

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync(
  new URL('../public/favicon.svg', import.meta.url),
);

// apple-touch-icon: 180×180
const appleBuf = await sharp(svg).resize(180, 180).png().toBuffer();
writeFileSync(
  new URL('../public/apple-touch-icon.png', import.meta.url),
  appleBuf,
);
console.log(`✓ apple-touch-icon.png (${appleBuf.length} bytes)`);

// favicon.ico: multi-resolução (16, 32) a partir de PNGs intermediários
const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
const icoBuf = await pngToIco([png16, png32]);
writeFileSync(new URL('../public/favicon.ico', import.meta.url), icoBuf);
console.log(`✓ favicon.ico (${icoBuf.length} bytes, 16+32 multi-res)`);
