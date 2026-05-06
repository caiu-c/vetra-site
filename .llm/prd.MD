# PRD — Site Vetra Solutions (Homepage MVP)

> Documento de requisitos para implementação da homepage institucional da Vetra Solutions.
> Stack: Astro + Tailwind CSS + Framer Motion (seletivo) + Lenis.
> Deploy: Vercel.

---

## 1. Contexto

### 1.1 Sobre a empresa

**Vetra Solutions** é uma consultoria B2B de Engenharia de Dados e IA, fundada em 2026 em Fortaleza/CE. Atua em quatro frentes integradas: bancos de dados, dashboards analíticos, agentes de IA e automações de processo.

O nome **Vetra** carrega a ideia de *vértebra* — estrutura, postura, retidão. A proposta de valor é ser a "coluna vertebral" dos dados do cliente: rigor de engenharia sustentando decisões de negócio.

### 1.2 Posicionamento de marca

- **Personalidade**: técnica, séria, sofisticada, institucional. Referências: ASML, IBM, Siemens.
- **Tom de voz**: preciso, direto, com confiança técnica. Não vendedor. Não bombástico.
- **Diferencial declarado**: "Não entregamos código — entregamos estrutura."

### 1.3 Público-alvo

Tomadores de decisão B2B (CTOs, Heads de Dados, diretores operacionais) em empresas de médio/grande porte que precisam profissionalizar sua infraestrutura de dados ou implantar IA com rigor.

---

## 2. Objetivos do projeto

### 2.1 Objetivo primário

Publicar uma homepage institucional que transmita capacidade técnica e maturidade, no domínio `vetrasolutions.com.br`, em até **2 sprints** de desenvolvimento.

### 2.2 Métricas de sucesso

| Métrica | Meta |
|---------|------|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| LCP (Largest Contentful Paint) | < 1.5s |
| CLS (Cumulative Layout Shift) | < 0.05 |
| Bundle JS inicial | < 50kb |

### 2.3 Fora do escopo (v1)

- Blog / sistema de conteúdo
- Área logada / dashboard
- Formulário de contato com backend (usar link externo: Cal.com, mailto, ou WhatsApp)
- Versão multilíngue (apenas pt-BR no MVP)
- CMS headless (conteúdo hardcoded em arquivos `.md` ou diretamente nos componentes)

---

## 3. Stack técnica

```yaml
framework: Astro 4.x (com integração React para componentes interativos)
styling: Tailwind CSS 3.x
animations:
  - Framer Motion (apenas em ilhas React que precisam)
  - Lenis (smooth scroll global)
  - GSAP + ScrollTrigger (apenas se houver animação scroll-driven complexa)
fonts:
  - Instrument Serif (display) — via Fontshare
  - JetBrains Mono (mono/labels) — via Fontshare
  - Inter Tight (body) — via Fontshare
package_manager: pnpm (preferencial) ou npm
deploy: Vercel
node_version: ">=20"
```

**Princípio**: zero JavaScript por padrão (Astro static). React/Framer Motion entram apenas em "ilhas" pontuais onde a interatividade justifica o custo.

---

## 4. Design system

### 4.1 Tokens de cor

```js
// tailwind.config.mjs — extend.colors
colors: {
  canvas: '#F5F3EE',     // background principal das seções claras
  paper:  '#E8E4DA',     // background do site (mais quente)
  ink:    '#0A1628',     // texto principal e seções escuras
  accent: '#1E4D8C',     // azul de destaque (labels, links)
  muted:  '#5A6470',     // texto secundário
  rule:   '#C8CDD4',     // linhas divisórias claras
  'rule-dark': '#2A3A52', // linhas em fundo escuro
  'muted-on-dark': '#8A96A8', // texto secundário em fundo escuro
}
```

### 4.2 Tipografia

```js
fontFamily: {
  serif: ['"Instrument Serif"', 'Georgia', 'serif'],
  sans:  ['"Inter Tight"', 'system-ui', 'sans-serif'],
  mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
}
```

**Regras de uso**:

| Família | Uso | Pesos |
|---------|-----|-------|
| Instrument Serif | Headlines, números grandes (estatísticas), nome da marca em logotipos textuais. **Itálico** para palavras-chave dentro de headlines. | 400, 400 italic |
| JetBrains Mono | Labels de seção (`01 · CAPACIDADES`), navegação, CTAs, metadados (cidade, data, código de seção). Sempre `letter-spacing: 0.18em` ou maior. | 400, 500 |
| Inter Tight | Corpo de texto, descrições, parágrafos. | 400, 500 |

### 4.3 Sistema de grid

**Estrutura visual de duas camadas.** A página é composta por duas tonalidades de bege em camadas: o `<body>` é renderizado em `paper` (#E8E4DA, mais quente) e abre uma moldura para um **painel** centralizado em `canvas` (#F5F3EE, mais claro), com **borda 1px solid `rule`** (#C8CDD4) e **cantos retos** (sem `border-radius` nem `box-shadow` — estética editorial). Todas as seções claras (Header, MetaLine, Hero, Capabilities) vivem **dentro** do painel; a seção Methodology também, ocupando 100% da largura do painel mas trocando o fundo interno para `ink`. O Footer fica **fora** do painel, ancorado novamente em `paper`. A leitura visual pretendida é a de "página de catálogo dentro de uma capa". Ver mockup `Insumos/SVG/14-mockup-site.svg` (rect 1100×1460 com stroke).

**Métricas:**

- **Container externo**: `max-width: 1280px`, padding lateral `64px` (desktop), `24px` (mobile). Padding vertical fluido para criar a margem de paper visível ao redor do painel: `32px` mobile / `48px` ≥640 / `50px` ≥768.
- **Painel interno**: `max-width: 1100px` centralizado dentro do container, com padding interno `48px`. Fundo `canvas`, borda `1px solid rule`, sem raio nem sombra.
- **Grid**: 12 colunas, `gap: 24px` (desktop), `gap: 16px` (mobile).
- **Variáveis CSS** expostas em `:root` para uso pontual fora do Tailwind:

```css
:root {
  --container-max: 1280px;
  --panel-max: 1100px;
  --gutter: 24px;
  --pad-x: 64px;
  --pad-x-mobile: 24px;
  --pad-inner: 48px;
}
```

### 4.4 Espaçamento vertical entre seções

- Seções claras: `padding-block: 80px` (mobile: `48px`).
- Seção escura (Metodologia): `padding-block: 64px` (mobile: `40px`).
- Linhas divisórias (`<hr>`) usam `border-color: theme('colors.rule')` e `border-width: 1px`.

### 4.5 Numeração e labels de seção

Todo bloco de seção começa com um label monoespaçado em `--muted`:

```
02 · CAPACIDADES
```

Convenções:
- Numeração com 2 dígitos.
- Separador: ` · ` (espaço-bullet-espaço).
- `letter-spacing: 0.24em`, `font-size: 10–11px`, `text-transform: uppercase`.

---

## 5. Estrutura de pastas

```
vetra-site/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   └── fonts/                # se hospedar localmente
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro  # html base, head, fontes, Lenis init
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SectionLabel.astro
│   │   ├── Hero.astro
│   │   ├── Capabilities.astro
│   │   ├── Methodology.astro
│   │   ├── Stats.astro
│   │   └── react/
│   │       └── SmoothScroll.tsx   # ilha React para Lenis
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   └── global.css        # variáveis CSS, reset adicional
│   └── content/              # opcional: textos em md
│       └── home.md
└── README.md
```

---

## 6. Especificação por seção

> Referência visual: arquivo SVG `14-mockup-site.svg` (anexado).

### 6.1 Header

- Posição: sticky no topo, `height: 92px`, fundo `paper` com `backdrop-blur` sutil ao rolar.
- Linha inferior: `1px solid rule`.
- Layout (esquerda → direita):
  - **Logo**: ícone "V" (chevron duplo descendente) + wordmark `VETRA SOLUTIONS` em Instrument Serif 14px.
  - **Navegação central** (mono 11px, letter-spacing 0.18em): `SISTEMAS · METODOLOGIA · CASOS · SOBRE`.
  - **CTA direito**: botão preto `AGENDAR ↗`, 100×28px, mono 10px.
- Mobile (<768px): logo à esquerda, hamburguer à direita; CTA e nav colapsam em drawer.

### 6.2 Meta-linha (acima do Hero)

Linha com label monoespaçado em `--muted`:
- Esquerda: `VS · 001 / VETRA SOLUTIONS`
- Direita: `FORTALEZA · CE · BRASIL`

### 6.3 Hero

- **Eyebrow** (mono, accent): `↳ ENGENHARIA DE DADOS & IA`
- **Headline** (Instrument Serif, 76px desktop / 48px mobile, line-height 0.98):
  ```
  A coluna
  vertebral dos
  *seus dados.*
  ```
  A última palavra (`seus dados.`) em **itálico**.
- **Subhead** (Inter Tight 17px, `--muted`, max 2 linhas):
  > "Construímos sistemas de dados, agentes de IA e automações com rigor de engenharia. Resultado de negócio sustentado por arquitetura técnica."
- **CTAs** (lado a lado, gap 16px):
  - Primário: fundo `ink`, texto `canvas`, mono 12px → `AGENDAR DIAGNÓSTICO ↗` (240×46px)
  - Secundário: outline `ink`, texto `ink` → `VER METODOLOGIA` (200×46px)
- **Animação de entrada**: stagger nos elementos (eyebrow → 3 linhas da headline → subhead → CTAs), 60ms entre cada, easing `easeOut`, duração 700ms. Implementar com Framer Motion em ilha React isolada.

### 6.4 Stats (faixa lateral direita do Hero)

Três métricas alinhadas à direita, na mesma linha vertical do CTA:

| Label (mono, --muted, 9px) | Valor (Instrument Serif, 28px, --ink) |
|----------------------------|---------------------------------------|
| PROJETOS | 47+ |
| UPTIME | 99.97% |
| ANOS | 04 |

> ⚠️ Esses números são placeholders. Marcar com comentário `<!-- TODO: validar com cliente -->` no código.

### 6.5 Capabilities (Seção 02)

- Label: `02 · CAPACIDADES` (esq.) / `04 / SISTEMAS` (dir.).
- Headline (Instrument Serif 38px): `Quatro camadas. Um sistema.`
- Grid de 4 cards lado a lado, separados por linhas verticais `1px rule`. Sem fundo, sem sombras — apenas estrutura.
- Cada card:
  - Numeração superior em accent: `01`, `02`, `03`, `04`.
  - Título (Instrument Serif 20px) na base do card.
  - Descrição (Inter Tight 12px, --muted) abaixo do título.

| # | Título | Descrição |
|---|--------|-----------|
| 01 | Bancos de dados | Modelagem, ETL/ELT, infraestrutura confiável. |
| 02 | Dashboards | Camada analítica que vira decisão acionável. |
| 03 | Agentes de IA | Sistemas autônomos com guardrails e observabilidade. |
| 04 | Automações | RPA, orquestração, integração de sistemas. |

- **Hover**: leve escurecimento de fundo do card (`bg-paper/40`), transição 200ms.
- Mobile: stack vertical, linhas verticais viram horizontais.

### 6.6 Methodology (Seção 03 — bloco escuro)

- Bloco com fundo `ink`, ocupando largura total do painel interno (`1100px`).
- Label: `03 · METODOLOGIA` (mono, `--muted-on-dark`).
- Headline (Instrument Serif 32px, `canvas`):
  > "Não entregamos código — entregamos *estrutura*. Cada projeto começa com diagnóstico técnico, segue para fundação arquitetural, e só então vira operação."
  
  Palavra `estrutura` em **itálico**.
- Linha divisória `1px solid rule-dark`.
- Três colunas com fases:
  - `FASE 01 — Diagnóstico` — "Mapa do sistema, gargalos."
  - `FASE 02 — Fundação` — "Arquitetura e implantação."
  - `FASE 03 — Operação` — "Monitoramento e SLA."

### 6.7 Footer

- Fundo `paper`, padding-block 48px.
- Linhas:
  - Logo + tagline curta.
  - Links de navegação repetidos.
  - Linha legal: `© 2026 VETRA SOLUTIONS · CNPJ XX.XXX.XXX/0001-XX · FORTALEZA / CE` (mono 10px).
  - LinkedIn / e-mail à direita.

---

## 7. Animações e interações

### 7.1 Smooth scroll (Lenis)

Inicializar Lenis no `BaseLayout` via ilha React (`<SmoothScroll client:load />`). Configuração base:

```ts
new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
})
```

### 7.2 Reveal on scroll

Cada bloco de seção entra com:
- `opacity: 0 → 1`
- `translateY: 20px → 0`
- `duration: 600ms`, `easing: easeOut`
- Trigger: 15% da seção visível.

Implementar com `IntersectionObserver` puro (sem dependência de framer-motion para cada seção — apenas onde houver animação coreografada como o Hero).

### 7.3 Cursor

**Não implementar cursor customizado no v1.** Adiciona complexidade sem retorno proporcional para uma marca institucional/séria.

### 7.4 Transições de página

V1 tem apenas a homepage. Quando outras páginas forem adicionadas, considerar `astro:transitions` com fade simples.

---

## 8. Performance, SEO e acessibilidade

### 8.1 Performance

- Imagens via `<Image>` do Astro, formato AVIF com fallback WebP.
- Fontes em `font-display: swap`, com `<link rel="preload">` para os pesos críticos (Instrument Serif 400, Inter Tight 400, JetBrains Mono 400).
- Sem bibliotecas de ícones genéricas. Ícones específicos (chevron da logo, seta `↗`) inline em SVG.
- Crítico CSS inline via Astro (já é padrão).

### 8.2 SEO

- `<title>`: `Vetra Solutions — Engenharia de Dados & IA`
- `<meta name="description">`: até 160 caracteres, baseada no subhead do Hero.
- Open Graph + Twitter Cards configurados.
- `og:image` 1200×630px com headline + logo, fundo `paper`.
- Schema.org `Organization` em JSON-LD no `<head>`.
- `sitemap.xml` e `robots.txt` (Astro tem integração oficial: `@astrojs/sitemap`).

### 8.3 Acessibilidade

- Contrastes mínimos AA: validar `--muted` sobre `--canvas` (deve passar em 4.5:1 para texto normal).
- `<nav>` com `aria-label="Principal"`.
- Foco visível em todos os elementos interativos (outline 2px `accent`).
- `prefers-reduced-motion`: desabilitar Lenis e reveals quando `true`.
- Hierarquia de headings correta (um único `<h1>`, depois `<h2>` por seção).

---

## 9. Critérios de aceitação

A implementação só é considerada **concluída** quando todos os itens abaixo estiverem satisfeitos:

- [ ] Site renderiza fielmente o mockup `14-mockup-site.svg` em viewport 1280px.
- [ ] Layout responsivo testado em: 1440px, 1280px, 1024px, 768px, 414px, 375px.
- [ ] Lighthouse (mobile, modo incógnito) atinge metas da seção 2.2.
- [ ] Sem erros no console em nenhuma rota.
- [ ] Fontes carregam sem FOUT visível (preload configurado).
- [ ] Animação de entrada do Hero é suave em CPU mid-tier (testar com throttle 4x no DevTools).
- [ ] `prefers-reduced-motion: reduce` desabilita Lenis e animações.
- [ ] Build de produção (`pnpm build`) gera bundle dentro do limite de 50kb JS.
- [ ] Deploy em Vercel funcional, com domínio `vetrasolutions.com.br` apontado e HTTPS ativo.
- [ ] README com instruções de dev (`pnpm install`, `pnpm dev`, `pnpm build`).

---

## 10. Roadmap de implementação (ordem para o Claude Code)

### Fase 1 — Fundação (1ª sessão)

1. `pnpm create astro@latest vetra-site` (template: empty, TypeScript: strict).
2. Adicionar integrações: `@astrojs/tailwind`, `@astrojs/react`, `@astrojs/sitemap`.
3. Configurar `tailwind.config.mjs` com tokens da seção 4.1, 4.2, 4.3.
4. Criar `src/styles/global.css` com variáveis CSS e reset adicional.
5. Carregar fontes via Fontshare no `<head>` do BaseLayout (com preload).
6. Estruturar `BaseLayout.astro` com slot principal, header e footer.

**Checkpoint**: rodar `pnpm dev`, abrir `localhost:4321`, ver header + footer + área vazia no meio com tipografia e cores corretas.

### Fase 2 — Seções estáticas (2ª sessão)

7. Implementar `Header.astro` (versão desktop apenas).
8. Implementar `Hero.astro` (sem animações ainda, layout estático).
9. Implementar `Stats.astro`.
10. Implementar `Capabilities.astro` com os 4 cards.
11. Implementar `Methodology.astro` (bloco escuro).
12. Implementar `Footer.astro`.

**Checkpoint**: comparar lado a lado com o SVG. Pixels não precisam bater perfeitamente, mas proporções e hierarquia sim.

### Fase 3 — Responsividade (3ª sessão)

13. Adaptar Header para mobile (drawer).
14. Ajustar tipografia fluida do Hero (`clamp()` para a headline).
15. Stack vertical das Capabilities em <768px.
16. Validar em todos os breakpoints da seção 9.

### Fase 4 — Animações (4ª sessão)

17. Criar `SmoothScroll.tsx` com Lenis.
18. Implementar entrada animada do Hero (Framer Motion em ilha React).
19. Adicionar `IntersectionObserver` para reveal das demais seções.
20. Respeitar `prefers-reduced-motion`.

### Fase 5 — Polimento e deploy (5ª sessão)

21. Otimizar imagens e Open Graph.
22. Configurar `sitemap.xml`, `robots.txt`, JSON-LD.
23. Validar Lighthouse e ajustar até atingir metas.
24. `git push` → deploy automático na Vercel.
25. Configurar DNS no Registro.br (registros A e CNAME).
26. Validar HTTPS e propagação.

---

## 11. Notas finais para o agente de implementação

- **Não criar páginas extras** que não estão no escopo (ex: /sobre, /contato). Links de navegação podem usar âncoras (`#metodologia`) ou ficar como `href="#"` com `TODO`.
- **Não inventar copy.** Todo o texto da homepage está nesta especificação ou no mockup. Se faltar algo, marcar com `<!-- TODO -->` em vez de criar conteúdo.
- **Não adicionar bibliotecas além do listado** sem justificativa. Cada dependência custa bytes e manutenção.
- **Commits pequenos e descritivos**, em português ou inglês (escolher e manter consistente).
- **Quando em dúvida**, priorizar a estética editorial e técnica do mockup sobre soluções "criativas". A marca pede contenção.

---

**Anexo**: `14-mockup-site.svg` — referência visual única e canônica deste documento.