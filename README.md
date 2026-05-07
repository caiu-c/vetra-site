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
- Densidade visual: SVG inline + tipografia + CSS, sem fotos — ver `ADR-003`

## Comandos

```bash
pnpm install         # instala dependências
pnpm dev             # ambiente de desenvolvimento (porta 4321)
pnpm build           # build de produção em dist/
pnpm preview         # serve o build localmente
pnpm typecheck       # astro check + tsc --noEmit
pnpm lint            # ESLint
pnpm format          # Prettier --write
```

## Scripts de build

Geradores manuais para assets binários. Rodar antes do deploy quando o conteúdo mudar:

- `pnpm gen:og` — Gera `public/og-image.png` (1200×630) a partir de SVG inline.
  Pipeline: WOFF2 self-hosted → `wawoff2` (descompressão Brotli) → TTF temporário em `os.tmpdir()` → `@resvg/resvg-js` `fontFiles` → PNG. `wawoff2` é necessário porque o binding JS do `@resvg/resvg-js` não decodifica WOFF2 nativamente. Limpa os TTFs temporários ao final.
- `pnpm gen:icons` — Gera `public/favicon.ico` (multi-resolução 16+32) e `public/apple-touch-icon.png` (180×180) a partir de `public/favicon.svg`. Pipeline: `sharp` (SVG → PNG) + `png-to-ico` (PNGs → ICO). Funciona com `sharp` puro porque o favicon não tem texto.

## Estrutura de pastas

```
src/
├── components/      # componentes Astro (Header, Hero, Stack, ...)
├── config/          # site.ts (SITE, ADDRESS, CONTACT, NAV, BOOKING_URL)
├── layouts/         # BaseLayout.astro
├── pages/           # index.astro
├── scripts/         # smooth-scroll.ts, reveal.ts (Lenis vanilla + IO)
└── styles/          # global.css (tokens, fonts, keyframes, paper grain)

public/              # assets estáticos (fontes, og-image, favicons, robots.txt, sitemap.xml)
scripts/             # geradores Node.js (og-image, favicon ICO/PNG)
docs/superpowers/    # planos de implementação por fase
```

## Documentação

- **PRD canônico**: `.llm/prd.MD`
- **Mockup canônico**: `Insumos/SVG/14-mockup-site.svg`
- **Decisões arquiteturais**: seção `## Decisões arquiteturais` em `CLAUDE.md` (ADR-001 sobre vanilla, ADR-002 sobre painel canvas, ADR-003 sobre densidade visual)
- **Planos de fase**: `docs/superpowers/plans/`

## Validação pós-deploy

Após subir para Vercel + DNS apontado, rodar nessas ferramentas antes do go-live:

- **[Schema Markup Validator](https://validator.schema.org/)** — valida JSON-LD `Organization` em `<head>`. Lembrar de preencher os TODOs (`telephone`, `streetAddress`, `postalCode`) antes do go-live, ou aceitar que o validator vai sinalizar campos como placeholder.
- **[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)** — inspeciona Open Graph tags e renderiza preview de compartilhamento. Forçar re-scrape quando atualizar `og-image.png`.
- **[Twitter / X Card Validator](https://cards-dev.twitter.com/validator)** — confirma `twitter:card=summary_large_image`. Hoje o Twitter renderiza o card automaticamente, mas o validator é útil para debug.
- **[Google Search Console](https://search.google.com/search-console)** — adicionar a propriedade do domínio, verificar via DNS TXT, e submeter `sitemap.xml`.

## Deploy

Vercel (configuração em sessão separada). DNS no Registro.br: registros `A` e `CNAME` para `vetrasolutions.com.br` apontando para Vercel.
