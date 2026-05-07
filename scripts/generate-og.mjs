// Gera public/og-image.png (1200×630) a partir de SVG inline com Instrument Serif
// preservando consistência tipográfica entre site e preview social.
//
// Pipeline:
//   WOFF2 self-hosted (public/fonts/instrument-serif-{regular,italic}.woff2)
//     → wawoff2.decompress (Brotli → tabelas OpenType)
//     → TTF temporário em os.tmpdir()
//     → @resvg/resvg-js fontFiles (Resvg lê os TTFs do disco)
//     → PNG 1200×630
//   → cleanup explícito dos TTFs temporários
//
// Motivo dessa cadeia: resvg-js não aceita WOFF2 nativamente — o binding JS
// não decodifica WOFF2 nem em fontBuffers nem em fontFiles. E fontBuffers
// in-memory com TTFs descomprimidos falha silenciosamente (bug provável do
// binding atual @resvg/resvg-js@2.6). fontFiles apontando para TTFs em disco
// é o caminho que funciona.
//
// Substituto histórico: o primeiro draft usava sharp/libvips, que ignora
// @font-face com data: URIs por design — librsvg depende de fontconfig do
// sistema. Trocamos para resvg pelo motivo correto: render SVG-com-fonte-
// embarcada é o que ele faz bem (mesma stack do @vercel/og).
//
// Roda manualmente via `pnpm gen:og`. Não é parte do build automático —
// regenerar só quando headline ou identidade mudarem.

import { Resvg } from '@resvg/resvg-js';
import wawoff2 from 'wawoff2';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const fontRegularWoff2 = readFileSync(
  new URL('../public/fonts/instrument-serif-regular.woff2', import.meta.url),
);
const fontItalicWoff2 = readFileSync(
  new URL('../public/fonts/instrument-serif-italic.woff2', import.meta.url),
);

const ttfRegularBuf = Buffer.from(await wawoff2.decompress(fontRegularWoff2));
const ttfItalicBuf = Buffer.from(await wawoff2.decompress(fontItalicWoff2));

const ttfRegularPath = join(tmpdir(), 'vetra-instrument-serif-regular.ttf');
const ttfItalicPath = join(tmpdir(), 'vetra-instrument-serif-italic.ttf');
writeFileSync(ttfRegularPath, ttfRegularBuf);
writeFileSync(ttfItalicPath, ttfItalicBuf);

// Nome de família "Instrument Serif" confirmado via fontkit nos woff2 originais
// (postscriptName: InstrumentSerif-Regular / -Italic, familyName: "Instrument Serif").
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
  <text x="132" y="116" font-family="Instrument Serif" font-size="20" fill="#0A1628">VETRA SOLUTIONS</text>

  <!-- eyebrow accent (mono via sistema) -->
  <text x="98" y="240" font-family="monospace" font-size="16" letter-spacing="3" fill="#1E4D8C">↳ ENGENHARIA DE DADOS &amp; IA</text>

  <!-- headline em 3 linhas, última em itálico -->
  <text x="98" y="320" font-family="Instrument Serif" font-size="76" fill="#0A1628">A coluna</text>
  <text x="98" y="396" font-family="Instrument Serif" font-size="76" fill="#0A1628">vertebral dos</text>
  <text x="98" y="472" font-family="Instrument Serif" font-size="76" font-style="italic" fill="#0A1628">seus dados.</text>

  <!-- meta-line bottom (mono via sistema) -->
  <text x="98" y="548" font-family="monospace" font-size="13" letter-spacing="2" fill="#5A6470">VETRASOLUTIONS.COM.BR · FORTALEZA · CE · BRASIL</text>
</svg>
`;

const resvg = new Resvg(svg, {
  font: {
    fontFiles: [ttfRegularPath, ttfItalicPath],
    loadSystemFonts: true, // resolve "monospace" para fonte mono do sistema
    defaultFontFamily: 'Instrument Serif',
  },
  fitTo: { mode: 'width', value: 1200 },
});

const pngBuffer = resvg.render().asPng();

const outPath = new URL('../public/og-image.png', import.meta.url);
writeFileSync(outPath, pngBuffer);

// Cleanup explícito dos TTFs temporários — em CI/CD os.tmpdir() pode acumular
// entre runs sem limpeza automática garantida.
unlinkSync(ttfRegularPath);
unlinkSync(ttfItalicPath);

console.log(
  `✓ og-image.png gerada (${pngBuffer.length} bytes / ${(pngBuffer.length / 1024).toFixed(1)} kB) em public/og-image.png`,
);
