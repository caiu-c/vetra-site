# Vetra Solutions — Site Institucional

Site institucional B2B da Vetra Solutions (consultoria de Engenharia de Dados e IA), construído em Astro + Tailwind + TypeScript.

Domínio: [vetrasolutions.com.br](https://vetrasolutions.com.br)

## Stack

- **Astro 4** — geração estática
- **Tailwind 3** — design system
- **TypeScript strict**
- **pnpm 10** — package manager
- Motion: GSAP (ScrollTrigger, SplitText) sobre scroll nativo, sem React — ver `ADR-005` e `ADR-008` em `CLAUDE.md`
- Tipografia: Archivo Variable (eixos de peso e largura) via Fontsource
- Visuais: SVG inline + tipografia + CSS, sem fotos — ver `ADR-003`

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
  Pipeline: WOFF2 do `@fontsource-variable/archivo` → `wawoff2` (descompressão em memória) → `fontkit` instancia peso/largura e converte cada texto em `<path>` → `@resvg/resvg-js` → PNG. O texto vira path porque o resvg ignora peso e largura em fontes variáveis.
- `pnpm gen:icons` — Gera `public/favicon.ico` (multi-resolução 16+32) e `public/apple-touch-icon.png` (180×180) a partir de `public/favicon.svg`. Pipeline: `sharp` (SVG → PNG) + `png-to-ico` (PNGs → ICO). Funciona com `sharp` puro porque o favicon não tem texto.

## Estrutura de pastas

```
src/
├── components/      # seções e componentes Astro (Header, Hero, Diagnosis, Founder…)
├── config/          # site.ts (SITE, CONTACT, ADDRESS, NAV, BOOKING_URL, FOUNDER…)
├── data/            # services.ts (serviços), cases.ts (casos)
├── layouts/         # BaseLayout.astro
├── pages/           # index, servicos/[slug], privacidade, 404, sitemap.xml.ts
├── scripts/         # main.ts + motion/ (GSAP, cursor, marquee, carrossel…) + three/ (lente 3D)
└── styles/          # global.css (componentes, entrada do hero, cursor, carrossel)

public/              # og-image, favicons, robots.txt, _headers
scripts/             # geradores Node.js (og-image, favicon ICO/PNG)
auditoria-ux/        # auditoria UX (contexto, relatórios, identidade; coletas fora do Git)
docs/superpowers/    # planos de implementação por fase
```

## Documentação

- **PRD canônico**: `.llm/prd.MD`
- **Mockup original**: `Insumos/SVG/14-mockup-site.svg` (histórico; desde o ADR-004 o visual segue o `CLAUDE.md`)
- **Decisões arquiteturais**: seção `## Decisões arquiteturais` em `CLAUDE.md` (ADR-001 a ADR-009; as vigentes para o visual são ADR-004 a ADR-009)
- **Planos de fase**: `docs/superpowers/plans/`

## Validação pós-deploy

Após subir para Vercel + DNS apontado, rodar nessas ferramentas antes do go-live:

- **[Schema Markup Validator](https://validator.schema.org/)** — valida JSON-LD `Organization` em `<head>`. Lembrar de preencher os TODOs (`telephone`, `streetAddress`, `postalCode`) antes do go-live, ou aceitar que o validator vai sinalizar campos como placeholder.
- **[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)** — inspeciona Open Graph tags e renderiza preview de compartilhamento. Forçar re-scrape quando atualizar `og-image.png`.
- **[Twitter / X Card Validator](https://cards-dev.twitter.com/validator)** — confirma `twitter:card=summary_large_image`. Hoje o Twitter renderiza o card automaticamente, mas o validator é útil para debug.
- **[Google Search Console](https://search.google.com/search-console)** — adicionar a propriedade do domínio, verificar via DNS TXT, e submeter `sitemap.xml`.

## Deploy

**Cloudflare Pages** (grátis, uso comercial permitido). O site é estático: `pnpm build` gera `dist/`. Cabeçalhos de cache em `public/_headers`.

Configuração (feita uma vez, na conta Cloudflare do dono):

1. Criar conta grátis em cloudflare.com e adicionar o domínio `vetrasolutions.com.br` (plano Free). A Cloudflare informa 2 nameservers.
2. Na zona importada, apagar os registros antigos do Replit: `A 34.111.179.208` e `TXT replit-verify=…`.
3. No Registro.br (registro.br → domínio → DNS → "Alterar servidores DNS"), trocar pelos 2 nameservers da Cloudflare. A propagação leva de minutos a algumas horas.
4. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → repositório `caiu-c/vetra-site`, branch `main`.
   - Framework preset: **Astro**
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Variáveis de ambiente: `NODE_VERSION` = `22` e `PNPM_VERSION` = `10.33.2` (o build da Cloudflare não lê o campo `packageManager` do `package.json`)
5. Revisar o site no endereço `*.pages.dev` gerado. **Só conectar o domínio depois de substituir ou ocultar o conteúdo placeholder** (casos, indicadores, setores, diagnóstico, FAQ — procurar `TODO` em `src/`).
6. Pages → projeto → Custom domains: adicionar `vetrasolutions.com.br` e `www.vetrasolutions.com.br`. Criar uma Redirect Rule `www` → raiz (301).
7. Formulário de contato: criar a chave grátis em [web3forms.com](https://web3forms.com) com o e-mail que vai receber as mensagens e colar em `CONTACT_FORM.accessKey` (`src/config/site.ts`). Enquanto a chave for `'TODO'`, o formulário mostra o erro com o `mailto:` como alternativa.
8. E-mail: o domínio não tem registro MX, então `contato@vetrasolutions.com.br` não recebe mensagens. Ativar Email → Email Routing e encaminhar `contato@` para um e-mail pessoal.

Depois disso, todo push em `main` publica automaticamente; pull requests ganham URL de preview.

## Medição de conversão

O site registra eventos de conversão em `window.dataLayer` (`src/scripts/track.ts`): `agenda_aberta` (com a seção de origem), `formulario_inicio`, `formulario_enviado`, `exemplo_mapa_liberado`, `teste_concluido`, `calculadora_usada` e cliques em elementos com `data-track`. Nenhuma ferramenta de analytics é carregada por padrão.

- **Para enviar os eventos a uma ferramenta,** inclua o script dela no `<head>` do `BaseLayout.astro`:
  - **Plausible ou Umami:** sem cookies; o `track()` detecta e repassa automaticamente.
  - **GA4:** exige consentimento de cookies antes de carregar.
- **Origem do tráfego:** use links com UTM nas divulgações, por exemplo `https://vetrasolutions.com.br/?utm_source=linkedin&utm_medium=post&utm_campaign=diagnostico`.
- **Agendamentos concluídos** ficam registrados no próprio Cal.com.
