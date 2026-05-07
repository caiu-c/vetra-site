# Fase 5 — Polimento e Pré-Deploy — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fechar todos os critérios de aceite do PRD §9 que ainda faltam (SEO, Open Graph, JSON-LD, sitemap, robots, favicon definitivo, README, Lighthouse) **antes** do deploy na Vercel — que será conduzido em sessão separada pelo usuário.

**Architecture:** Tudo é meta/markup/assets estáticos. Nenhuma dependência de runtime nova é shipada — `sharp` e `png-to-ico` entram apenas como devDependencies para gerar OG image e favicon ICO uma vez (scripts em `scripts/`). `@astrojs/sitemap` é integration de build, não roda no client. Bundle JS shipado deve continuar inalterado em ~5.25 kB gzipped.

**Tech Stack:** Astro 4 + integration `@astrojs/sitemap`, devDeps `sharp` (SVG → PNG) + `png-to-ico` (PNG → ICO multi-resolução). Sem JS adicional no cliente.

**Convenções herdadas:**
- Commits atômicos em pt-BR no formato `tipo: descrição curta`.
- Validação `pnpm typecheck && pnpm lint && pnpm build` ao fim de cada commit.
- Tokens Tailwind: `canvas`, `paper`, `ink`, `accent`, `muted`, `rule`.
- Estrutura de duas camadas (PRD §4.3 + ADR-002) preservada.

**Pausa obrigatória ao final:** após Lighthouse passar, **parar antes do deploy**. O usuário conduz Vercel + DNS Registro.br em sessão separada.

---

## File Structure

**Novos arquivos:**
- `scripts/generate-og.mjs` — gera `public/og-image.png` 1200×630 a partir de SVG inline
- `scripts/generate-icons.mjs` — gera `public/favicon.ico` (16+32 multi-res) e `public/apple-touch-icon.png` (180×180) a partir de `public/favicon.svg`
- `public/og-image.png` — binário gerado, 1200×630
- `public/favicon.ico` — binário gerado, multi-resolução
- `public/apple-touch-icon.png` — binário gerado, 180×180
- `public/robots.txt` — regras de indexação
- `README.md` — instruções de dev (PRD §9)

**Arquivos modificados:**
- `src/config/site.ts` — description definitiva (PRD §8.2), endereço placeholder
- `src/layouts/BaseLayout.astro` — JSON-LD Organization, OG/Twitter meta, registro de favicon.ico e apple-touch-icon, title/description finais
- `astro.config.mjs` — registrar `@astrojs/sitemap` integration
- `package.json` — devDeps `sharp` e `png-to-ico`, scripts `gen:og` e `gen:icons`

---

## Sequência de execução

| Commit | Tarefa | Bundle/asset delta |
|---|---|---|
| C1 | site.ts: description PRD §8.2 + address placeholder | 0 |
| C2 | JSON-LD Organization no `<head>` | ~+0.4 kB HTML |
| C3 | sharp + png-to-ico (devDeps) + script + og-image.png | 0 JS, ~25 kB asset |
| C4 | Meta tags Open Graph + Twitter Cards | ~+0.5 kB HTML |
| C5 | @astrojs/sitemap integration | 0 (build-time) |
| C6 | robots.txt | ~80 bytes asset |
| C7 | Script + favicon.ico + apple-touch-icon.png | ~10 kB assets |
| C8 | Registrar favicon.ico + apple-touch-icon no `<head>` | ~+0.2 kB HTML |
| C9 | README.md (PRD §9) | 0 |
| **VALIDATION** | typecheck + lint + build + bundle measure | — |
| **LIGHTHOUSE** | rodar pelo usuário, reportar 4 métricas, ≥95 cada | — |
| **PAUSE** | aguardar usuário para Vercel + DNS | — |

---

### Task 1 — site.ts: description final + address placeholder

**Files:**
- Modify: `src/config/site.ts`

- [ ] **Step 1: Atualizar description e adicionar ADDRESS**

Em `src/config/site.ts`, substituir o bloco `SITE` atual:

Old:
```ts
export const SITE = {
  name: 'Vetra Solutions',
  domain: 'vetrasolutions.com.br',
  url: 'https://vetrasolutions.com.br',
  description:
    'Consultoria B2B de Engenharia de Dados e IA. Bancos de dados, dashboards analíticos, agentes de IA e automações de processo.',
  city: 'Fortaleza/CE',
  founded: 2026,
} as const;
```

New (description = subhead do Hero, conforme PRD §8.2; 156 chars):
```ts
export const SITE = {
  name: 'Vetra Solutions',
  domain: 'vetrasolutions.com.br',
  url: 'https://vetrasolutions.com.br',
  title: 'Vetra Solutions — Engenharia de Dados & IA',
  description:
    'Construímos sistemas de dados, agentes de IA e automações com rigor de engenharia. Resultado de negócio sustentado por arquitetura técnica.',
  city: 'Fortaleza/CE',
  founded: 2026,
} as const;

// TODO: confirmar endereço completo antes do go-live (validar com cliente)
export const ADDRESS = {
  streetAddress: 'TODO',
  addressLocality: 'Fortaleza',
  addressRegion: 'CE',
  postalCode: 'TODO',
  addressCountry: 'BR',
} as const;
```

- [ ] **Step 2: Validar e commitar**

Run: `pnpm typecheck && pnpm lint`
Expected: 0 erros / 0 problemas.

```bash
git add src/config/site.ts
git commit -m "$(cat <<'EOF'
feat: title canônico e description final (PRD §8.2)

Atualiza SITE.description para o subhead do Hero (156 chars, dentro do limite de 160 do PRD §8.2). Adiciona SITE.title com a forma canônica "Vetra Solutions — Engenharia de Dados & IA". Cria constante ADDRESS com placeholders TODO (streetAddress, postalCode) para uso na JSON-LD Organization.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2 — JSON-LD Organization no `<head>`

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Adicionar import e construir o JSON-LD**

Em `src/layouts/BaseLayout.astro`, no frontmatter atualizar:

Old:
```astro
---
import '@/styles/global.css';
import Header from '@/components/Header.astro';
import Footer from '@/components/Footer.astro';
import PanelRuler from '@/components/PanelRuler.astro';
import { SITE } from '@/config/site';

interface Props {
  title?: string;
  description?: string;
}

const { title = SITE.name, description = SITE.description } = Astro.props;
const fullTitle = title === SITE.name ? title : `${title} — ${SITE.name}`;
---
```

New:
```astro
---
import '@/styles/global.css';
import Header from '@/components/Header.astro';
import Footer from '@/components/Footer.astro';
import PanelRuler from '@/components/PanelRuler.astro';
import { SITE, ADDRESS, CONTACT } from '@/config/site';

interface Props {
  title?: string;
  description?: string;
}

const { title = SITE.title, description = SITE.description } = Astro.props;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  foundingDate: String(SITE.founded),
  email: CONTACT.email,
  sameAs: [CONTACT.linkedin],
  taxID: CONTACT.cnpj,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS.streetAddress,
    addressLocality: ADDRESS.addressLocality,
    addressRegion: ADDRESS.addressRegion,
    postalCode: ADDRESS.postalCode,
    addressCountry: ADDRESS.addressCountry,
  },
};
---
```

- [ ] **Step 2: Inserir o `<script type="application/ld+json">` no `<head>`**

Antes do `</head>`, **depois** do `<title>`:

Old:
```astro
    <title>{fullTitle}</title>
  </head>
```

New:
```astro
    <title>{title}</title>

    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
```

(também removemos o cálculo `fullTitle` — o `title` agora vem completo do `SITE.title` ou do prop, sem concatenação.)

- [ ] **Step 3: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: 0 erros.

```bash
git add src/layouts/BaseLayout.astro
git commit -m "$(cat <<'EOF'
feat: JSON-LD Organization no <head> com schema.org

Adiciona <script type="application/ld+json"> no head com Organization completo: name, url, description, foundingDate, email, sameAs (LinkedIn), taxID (CNPJ) e address PostalAddress. Endereço usa ADDRESS de site.ts com placeholders TODO. PRD §8.2.

Title agora vem do SITE.title canônico — substitui o cálculo fullTitle anterior.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3 — Geração de og-image.png

**Files:**
- Create: `scripts/generate-og.mjs`
- Create: `public/og-image.png` (binário gerado)
- Modify: `package.json` (devDeps + script)

- [ ] **Step 1: Adicionar devDependency `sharp`**

Run:
```bash
pnpm add -D sharp@^0.33
```

Expected: sharp já existe via Astro mas agora vira top-level + symlink em `node_modules/sharp/`.

- [ ] **Step 2: Adicionar script gen:og no package.json**

Em `package.json`, no bloco `scripts`, adicionar:

```json
    "gen:og": "node scripts/generate-og.mjs",
```

- [ ] **Step 3: Criar scripts/generate-og.mjs**

Criar `scripts/generate-og.mjs`:

```javascript
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

  <!-- logo top-left -->
  <g transform="translate(98, 98)" stroke="#0A1628" fill="none" stroke-width="1.4" stroke-linecap="square">
    <path d="M2 2 L11 22 L20 2"/>
    <path d="M5 2 L11 16 L17 2"/>
    <circle cx="11" cy="22" r="1.4" fill="#0A1628" stroke="none"/>
  </g>
  <text x="132" y="116" font-family="Georgia, 'Instrument Serif', serif" font-size="20" fill="#0A1628">VETRA SOLUTIONS</text>

  <!-- eyebrow accent -->
  <text x="98" y="240" font-family="ui-monospace, monospace" font-size="16" letter-spacing="3" fill="#1E4D8C">↳ ENGENHARIA DE DADOS &amp; IA</text>

  <!-- headline -->
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
```

- [ ] **Step 4: Rodar geração**

Run: `pnpm gen:og`
Expected: `✓ og-image.png gerada (~25000 bytes) em public/og-image.png`

- [ ] **Step 5: Verificar dimensões da PNG**

Run: `file public/og-image.png`
Expected: `PNG image data, 1200 x 630, 8-bit/color RGB, non-interlaced`

- [ ] **Step 6: Commit (script + binário juntos)**

```bash
git add package.json pnpm-lock.yaml scripts/generate-og.mjs public/og-image.png
git commit -m "$(cat <<'EOF'
chore: script + og-image.png 1200x630 via sharp

scripts/generate-og.mjs renderiza SVG inline (paper bg + moldura canvas + logo + headline + meta-line) para PNG via sharp. Rodar manualmente com pnpm gen:og quando headline ou identidade mudarem; não roda no build. sharp adicionado como devDep (já existia transitivamente via Astro; agora simlinkado em top-level). Fontes usam fallback Georgia/serif — Instrument Serif self-hosted não é resolvida pelo libvips (é aceitável para OG image que aparece em previews de redes sociais).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4 — Open Graph + Twitter Cards

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Adicionar bloco de meta tags antes do `<title>`**

Em `src/layouts/BaseLayout.astro`, dentro do `<head>`, **antes** do `<title>`:

Old (trecho):
```astro
    <link rel="preload"
      href="/fonts/inter-tight-regular.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <title>{title}</title>
```

New:
```astro
    <link rel="preload"
      href="/fonts/inter-tight-regular.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content={SITE.name} />
    <meta property="og:url" content={SITE.url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={`${SITE.url}/og-image.png`} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={SITE.title} />

    {/* Twitter Cards */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={`${SITE.url}/og-image.png`} />

    <title>{title}</title>
```

- [ ] **Step 2: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: 0 erros.

```bash
git add src/layouts/BaseLayout.astro
git commit -m "$(cat <<'EOF'
feat: meta tags Open Graph e Twitter Cards no BaseLayout

Adiciona o conjunto canônico para previews em redes sociais (Facebook, LinkedIn, Twitter, WhatsApp): og:type, og:locale=pt_BR, og:site_name, og:url, og:title, og:description, og:image (1200x630 PNG gerada na C3), og:image:alt; twitter:card=summary_large_image + title/description/image. Imagem é absoluta via SITE.url. PRD §8.2.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5 — @astrojs/sitemap

**Files:**
- Modify: `package.json` (dep)
- Modify: `astro.config.mjs` (integration)

- [ ] **Step 1: Instalar a integration**

Run: `pnpm add @astrojs/sitemap`

- [ ] **Step 2: Registrar no astro.config.mjs**

Em `astro.config.mjs`:

Old:
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://vetrasolutions.com.br',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
```

New:
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://vetrasolutions.com.br',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
});
```

- [ ] **Step 3: Build e verificar geração do sitemap**

Run: `pnpm build`
Expected: build complete + `dist/sitemap-index.xml` e `dist/sitemap-0.xml` existem.

Run: `ls dist/sitemap*`
Expected: dois arquivos `.xml`.

- [ ] **Step 4: Validar e commitar**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs
git commit -m "$(cat <<'EOF'
chore: integrar @astrojs/sitemap

Integration oficial do Astro gera sitemap-index.xml + sitemap-0.xml em dist no build. Registrada com config padrão (lê site=https://vetrasolutions.com.br do astro.config). Sem JS adicional no client; pura geração de build.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6 — robots.txt

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Criar public/robots.txt**

Criar `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://vetrasolutions.com.br/sitemap-index.xml
```

- [ ] **Step 2: Build e verificar**

Run: `pnpm build && cat dist/robots.txt`
Expected: conteúdo idêntico ao escrito acima.

- [ ] **Step 3: Commitar**

```bash
git add public/robots.txt
git commit -m "$(cat <<'EOF'
feat: robots.txt permitindo indexação completa + apontando sitemap

User-agent: * Allow: / e link explícito para sitemap-index.xml. Astro copia o public/ inteiro para dist/ no build, então o arquivo fica acessível em /robots.txt em produção sem config extra.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7 — Favicon definitivo (.ico + apple-touch-icon)

**Files:**
- Create: `scripts/generate-icons.mjs`
- Create: `public/favicon.ico` (binário)
- Create: `public/apple-touch-icon.png` (binário 180×180)
- Modify: `package.json` (devDep + script)

- [ ] **Step 1: Adicionar devDep `png-to-ico`**

Run: `pnpm add -D png-to-ico`

- [ ] **Step 2: Adicionar script gen:icons no package.json**

Em `package.json`, em `scripts`:

```json
    "gen:icons": "node scripts/generate-icons.mjs",
```

- [ ] **Step 3: Criar scripts/generate-icons.mjs**

Criar `scripts/generate-icons.mjs`:

```javascript
// Gera public/favicon.ico (16+32 multi-res) e public/apple-touch-icon.png (180x180)
// a partir de public/favicon.svg. Roda manualmente via `pnpm gen:icons`.

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'node:fs';

const svgPath = new URL('../public/favicon.svg', import.meta.url);
const svg = readFileSync(svgPath);

// apple-touch-icon: 180×180
const appleBuf = await sharp(svg).resize(180, 180).png().toBuffer();
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), appleBuf);
console.log(`✓ apple-touch-icon.png (${appleBuf.length} bytes)`);

// favicon.ico: multi-resolução (16, 32) a partir de PNGs intermediários
const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
const icoBuf = await pngToIco([png16, png32]);
writeFileSync(new URL('../public/favicon.ico', import.meta.url), icoBuf);
console.log(`✓ favicon.ico (${icoBuf.length} bytes, 16+32 multi-res)`);
```

- [ ] **Step 4: Rodar geração**

Run: `pnpm gen:icons`
Expected:
```
✓ apple-touch-icon.png (NNNN bytes)
✓ favicon.ico (NNNN bytes, 16+32 multi-res)
```

- [ ] **Step 5: Verificar formatos**

Run: `file public/apple-touch-icon.png public/favicon.ico`
Expected:
- `public/apple-touch-icon.png: PNG image data, 180 x 180, ...`
- `public/favicon.ico: MS Windows icon resource - 2 icons, ...`

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml scripts/generate-icons.mjs public/apple-touch-icon.png public/favicon.ico
git commit -m "$(cat <<'EOF'
chore: script + favicon.ico (16+32) e apple-touch-icon.png (180x180)

scripts/generate-icons.mjs lê public/favicon.svg e gera duas variantes via sharp + png-to-ico: apple-touch-icon.png 180x180 (Safari iOS, bookmarks Android) e favicon.ico multi-resolução 16+32 (compat com legacy IE/Edge e tabs antigas). Rodar via pnpm gen:icons quando o SVG mudar. png-to-ico adicionado como devDep — pequeno (~5kB), justifica-se pelo ICO multi-res.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8 — Registrar favicon.ico + apple-touch-icon no `<head>`

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Adicionar links no `<head>`**

Em `src/layouts/BaseLayout.astro`, atualizar o bloco do favicon:

Old:
```astro
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

New:
```astro
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

- [ ] **Step 2: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/layouts/BaseLayout.astro
git commit -m "$(cat <<'EOF'
feat: registrar favicon.ico e apple-touch-icon no head

Cobertura universal: SVG (modernos), ICO (legacy), apple-touch-icon (iOS Safari, Android bookmarks). Browsers modernos preferem SVG; fallback ICO para casos sem suporte.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9 — README.md (PRD §9)

**Files:**
- Create: `README.md`

- [ ] **Step 1: Criar README.md**

Criar `README.md` na raiz:

```markdown
# Vetra Solutions — Site Institucional

Site institucional B2B da Vetra Solutions (consultoria de Engenharia de Dados e IA), construído em Astro + Tailwind + TypeScript.

Domínio: [vetrasolutions.com.br](https://vetrasolutions.com.br)

## Stack

- **Astro 4** — geração estática
- **Tailwind 3** — design system
- **TypeScript strict**
- **pnpm 10** — package manager
- Smooth scroll: Lenis vanilla (sem ilha React) — ver `ADR-001` em `CLAUDE.md`
- Animações: CSS keyframes + IntersectionObserver — ver `ADR-001`

## Comandos

```bash
pnpm install         # instala dependências
pnpm dev             # ambiente de desenvolvimento (porta 4321)
pnpm build           # build de produção em dist/
pnpm preview         # serve o build localmente
pnpm typecheck       # astro check + tsc --noEmit
pnpm lint            # ESLint
pnpm format          # Prettier --write
pnpm gen:og          # regenera public/og-image.png a partir do SVG inline
pnpm gen:icons       # regenera favicon.ico + apple-touch-icon.png a partir de favicon.svg
```

## Estrutura de pastas

```
src/
├── components/      # componentes Astro (Header, Hero, Stack, ...)
├── config/          # site.ts (SITE, ADDRESS, CONTACT, NAV, BOOKING_URL)
├── layouts/         # BaseLayout.astro
├── pages/           # index.astro
├── scripts/         # smooth-scroll.ts, reveal.ts (Lenis vanilla + IO)
└── styles/          # global.css (tokens, fonts, keyframes, paper grain)

public/              # assets estáticos (fontes self-hosted, og-image, favicons, robots.txt)
scripts/             # geradores Node.js (og-image, favicon ICO/PNG)
docs/superpowers/    # planos de implementação por fase
```

## Documentação

- **PRD canônico**: `.llm/prd.MD`
- **Mockup canônico**: `Insumos/SVG/14-mockup-site.svg`
- **Decisões arquiteturais**: seção `## Decisões arquiteturais` em `CLAUDE.md` (ADR-001 sobre vanilla, ADR-002 sobre painel canvas, ADR-003 sobre densidade visual)
- **Planos de fase**: `docs/superpowers/plans/`

## Deploy

Vercel (configuração em sessão separada). DNS no Registro.br: registros `A` e `CNAME` para `vetrasolutions.com.br` apontando para Vercel.
```

- [ ] **Step 2: Commitar**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: README com stack, comandos, estrutura e referências

Atende critério PRD §9 ("README com instruções de dev"). Lista comandos pnpm (incluindo gen:og e gen:icons da Fase 5), estrutura de pastas, ponteiros para PRD, mockup, ADRs e planos. Em pt-BR consistente com o resto da doc.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Validation — Build limpo e bundle final

- [ ] **Step 1: Build limpo**

Run:
```bash
rm -rf dist && pnpm typecheck && pnpm lint && pnpm build
```

Expected: 0 erros, 0 problemas, build complete.

- [ ] **Step 2: Verificar artefatos esperados em dist/**

Run:
```bash
ls dist/ | sort
```
Expected (entre outros): `_astro/`, `apple-touch-icon.png`, `favicon.ico`, `favicon.svg`, `fonts/`, `index.html`, `og-image.png`, `robots.txt`, `sitemap-0.xml`, `sitemap-index.xml`.

- [ ] **Step 3: Medir bundle JS shipado**

Run:
```bash
echo "=== JS shipado ==="
for f in $(grep -oE '/_astro/[^"]+\.js' dist/index.html | sort -u); do
  full="dist${f}"
  raw=$(stat -c%s "$full")
  gz=$(gzip -c "$full" | wc -c)
  printf "  %-40s  raw=%6d B  gz=%5d B (%.2f kB)\n" "$f" "$raw" "$gz" "$(echo "$gz/1024" | bc -l)"
done
```

Expected: ~5.25 kB JS gzipped (inalterado da fase de densidade — Fase 5 não adiciona JS).

- [ ] **Step 4: Verificar HTML servido tem JSON-LD, OG, sitemap link**

Run:
```bash
echo "JSON-LD presente:"
grep -c "application/ld+json" dist/index.html
echo "OG image presente:"
grep -c 'og:image' dist/index.html
echo "Twitter card presente:"
grep -c 'twitter:card' dist/index.html
echo "robots.txt acessível:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/robots.txt
echo ""
echo "sitemap-index acessível:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/sitemap-index.xml
```

Expected: cada conta ≥1, ambos códigos HTTP 200 (note: dev server não gera sitemap; é só do build. Para testar sitemap, rodar `pnpm preview` em vez de `pnpm dev`).

---

### Lighthouse — você roda

Lighthouse precisa de Chrome. WSL2 não tem Chrome instalado e não posso instalar com sudo. Você roda do Chrome do Windows:

- [ ] **Step 1: Servir build de produção**

```bash
pnpm preview
```

Vai expor em `http://localhost:4321` (ou outra porta — anotar).

- [ ] **Step 2: Rodar Lighthouse no Chrome (Windows)**

1. Abrir Chrome em **modo incógnito** (Ctrl+Shift+N — sem extensões).
2. Navegar para `http://localhost:4321/`.
3. Abrir DevTools → aba **Lighthouse**.
4. Configurar: **Mobile**, categorias **Performance, Accessibility, Best Practices, SEO** marcadas.
5. **Throttling**: deixar no padrão "Simulated throttling" (4G + CPU 4×).
6. Clicar **Analyze page load**.

- [ ] **Step 3: Reportar as 4 métricas**

Esperado: ≥95 em todas as 4 (PRD §2.2).

Critério de aceite: se qualquer uma cair abaixo de 95, **PARAR**, não fazer deploy. Reportar a métrica e abrir investigação (sub-skill: superpowers:systematic-debugging).

---

### PAUSE antes do deploy

- [ ] **Step 1: Reportar status final**

Listar:
- `git log --oneline` da fase
- Bundle JS gzipped final
- 4 métricas Lighthouse
- Confirmação de que todos os artefatos estão em `dist/`

- [ ] **Step 2: Aguardar usuário**

O usuário conduz Vercel + DNS Registro.br em sessão separada (envolve credenciais e configuração externa). **Não tentar deploy aqui.**

---

## Self-review

**Cobertura do escopo da Fase 5:**
- ✅ JSON-LD Organization — Task 2
- ✅ Open Graph + Twitter Cards (com og-image.png 1200×630) — Tasks 3 + 4
- ✅ sitemap.xml via @astrojs/sitemap — Task 5
- ✅ robots.txt — Task 6
- ✅ Favicon definitivo (.ico + apple-touch-icon) — Tasks 7 + 8
- ✅ Title + meta description (PRD §8.2) — Task 1 + Task 2 (Task 1 atualiza site.ts; Task 2 usa)
- ✅ Lighthouse mobile incógnito 4G — Lighthouse step
- ✅ Build limpo + bundle final — Validation step
- ✅ README — Task 9 (também é critério PRD §9)
- ✅ Pause antes do deploy — explicit

**Sem placeholders:** todos os steps mostram código completo, paths exatos, comandos com saída esperada.

**Consistência de tipos/nomes:** `SITE`, `ADDRESS`, `CONTACT` em site.ts são consumidos consistentemente na BaseLayout (Task 2) e referenciados na Task 4 (OG meta usa SITE.url para construir URLs absolutas). Nenhum nome conflitante.

**Riscos identificados e mitigações:**
1. **Sharp + libvips não resolve Instrument Serif self-hosted no SVG** → fontes usam fallback Georgia/serif. Mitigação: documentado no commit; aceito porque OG image aparece em previews de redes sociais onde tipografia precisa não bate. Se inaceitável, abrir nova fase pra embed da fonte como base64.
2. **Lighthouse no WSL** → fora do alcance do agente. Usuário roda no Chrome do Windows; instruções explícitas no plano.
3. **Address placeholder na JSON-LD** → marcado TODO; antes do go-live precisa ser preenchido com endereço real validado pelo cliente.
4. **og:image absoluto usa SITE.url=https://vetrasolutions.com.br** — no preview local (localhost:4321) o crawler não conseguiria buscar a imagem se testar OG ali. Não é problema porque OG só importa em produção; em desenvolvimento, validamos só que o `<meta>` está presente.
