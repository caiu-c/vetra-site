// Gera public/og-image.png (1200×630) a partir de SVG inline.
// Roda manualmente via `pnpm gen:og`. Não é parte do build automático —
// regenerar só quando headline ou identidade mudarem.

import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#E8E4DA"/>

  <!-- moldura sutil reproduzindo a metáfora do painel -->
  <rect x="50" y="50" width="1100" height="530" fill="#F5F3EE" stroke="#C8CDD4" stroke-width="1"/>

  <!-- logo top-left: V chevron + wordmark -->
  <g transform="translate(98, 98)" stroke="#0A1628" fill="none" stroke-width="1.4" stroke-linecap="square">
    <path d="M2 2 L11 22 L20 2"/>
    <path d="M5 2 L11 16 L17 2"/>
    <circle cx="11" cy="22" r="1.4" fill="#0A1628" stroke="none"/>
  </g>
  <text x="132" y="116" font-family="Georgia, 'Instrument Serif', serif" font-size="20" fill="#0A1628">VETRA SOLUTIONS</text>

  <!-- eyebrow accent -->
  <text x="98" y="240" font-family="ui-monospace, monospace" font-size="16" letter-spacing="3" fill="#1E4D8C">↳ ENGENHARIA DE DADOS &amp; IA</text>

  <!-- headline em 3 linhas, última em itálico -->
  <text x="98" y="320" font-family="Georgia, 'Instrument Serif', serif" font-size="68" fill="#0A1628">A coluna</text>
  <text x="98" y="396" font-family="Georgia, 'Instrument Serif', serif" font-size="68" fill="#0A1628">vertebral dos</text>
  <text x="98" y="472" font-family="Georgia, 'Instrument Serif', serif" font-size="68" font-style="italic" fill="#0A1628">seus dados.</text>

  <!-- meta-line bottom -->
  <text x="98" y="548" font-family="ui-monospace, monospace" font-size="13" letter-spacing="2" fill="#5A6470">VETRASOLUTIONS.COM.BR · FORTALEZA · CE · BRASIL</text>
</svg>
`;

const outPath = new URL('../public/og-image.png', import.meta.url);

const buffer = await sharp(Buffer.from(svg))
  .resize(1200, 630)
  .png()
  .toBuffer();

writeFileSync(outPath, buffer);

console.log(`✓ og-image.png gerada (${buffer.length} bytes) em public/og-image.png`);
