# Densidade Visual — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar densidade visual e de conteúdo ao site Vetra Solutions sem fotos próprias nem stock — só SVG inline, CSS e tipografia — antes de seguir para a Fase 5.

**Architecture:** 9 adições agrupadas em 10 commits atômicos: 2 fundacionais (grain no paper, craft tipográfico), 1 backdrop estático no Hero, 3 seções novas (Stack, Indicadores, Casos), 1 decoração de moldura (ruler ticks), 1 conjunto de microinterações, 1 sistema de divisores tipográficos entre seções, 1 doc (ADR-003). Cada commit fechado por typecheck + lint + build. Bundle JS shipado deve continuar abaixo de 30 kB gzipped — checkpoint a cada 3 commits.

**Tech Stack:** Astro 4, Tailwind 3, CSS puro (sem libs novas), SVG inline. Sem novas dependências de runtime. Atende `prefers-reduced-motion` em todas animações.

**Convenções herdadas:**
- Commits atômicos em pt-BR no formato `tipo: descrição curta`, um commit por adição.
- Seções claras vivem dentro do painel canvas (PRD §4.3 + ADR-002). Footer fora do painel.
- Tokens Tailwind: `canvas`, `paper`, `ink`, `accent`, `muted`, `rule`, `rule-dark`, `muted-on-dark`.
- Validação: `pnpm typecheck && pnpm lint && pnpm build` ao fim de cada commit; bundle gzipped do `dist/index.html` referenciado.

**Renumeração de seções** (consequência da inserção de Stack e Indicadores entre Capabilities e Methodology):

| Posição | Antes | Depois | Counterpart |
|---|---|---|---|
| 02 | Capabilities | Capabilities | `04 / SISTEMAS` |
| 03 | Methodology | **Stack (NOVO)** | `10 / TECNOLOGIAS` |
| 04 | — | **Indicadores (NOVO)** | `04 / MÉTRICAS` |
| 05 | — | Methodology | `03 / FASES` |
| 06 | — | **Casos (NOVO)** | `03 / EXEMPLOS` |

Methodology passa de `03 · METODOLOGIA` para `05 · METODOLOGIA`.

**Risco transversal de regressão visual:** cada commit altera o painel canvas, que é o ponto focal estético do site. Mitigação: build após cada commit, comparar HTML servido contra `Insumos/SVG/14-mockup-site.svg` quando relevante, parar se algo destoar.

---

## File Structure

**Novos arquivos:**
- `src/components/HeroBackdrop.astro` — SVG inline do diagrama de nodes
- `src/components/Stack.astro` — seção tipográfica de tecnologias
- `src/components/Indicators.astro` — 4 métricas grandes
- `src/components/Cases.astro` — 3 cards de casos
- `src/components/PanelRuler.astro` — ticks decorativos do painel
- `src/components/SectionRule.astro` — divisor tipográfico §NN

**Arquivos modificados:**
- `src/styles/global.css` — paper grain, craft tipográfico, microinterações
- `src/components/Hero.astro` — incluir HeroBackdrop, ajustar typography
- `src/components/Methodology.astro` — renumeração 03→05, text-wrap balance
- `src/components/Capabilities.astro` — group-hover number, text-wrap balance
- `src/components/Header.astro` — nav-link underline, scale CTA
- `src/components/Stats.astro` — tabular-nums (parte do C2)
- `src/pages/index.astro` — incluir as 3 novas seções na ordem aprovada
- `src/layouts/BaseLayout.astro` — incluir PanelRuler dentro do painel
- `CLAUDE.md` — ADR-003

---

## Sequência de execução

| Commit | Tarefa | Bundle expected delta |
|---|---|---|
| C1 | Paper grain (noise SVG no body, fora do painel) | ~+0.1 kB CSS |
| C2 | Craft tipográfico (kerning + balance + tabular nums) | ~+0.05 kB CSS |
| C3 | Hero backdrop SVG estático com fade-in | ~+0.2 kB HTML, 0 JS |
| **CHECKPOINT 1** | `pnpm build` + reportar bundle | — |
| C4 | Seção Stack | ~+0.3 kB HTML, 0 JS |
| C5 | Seção Indicadores | ~+0.2 kB HTML, 0 JS |
| C6 | Seção Casos | ~+0.4 kB HTML, 0 JS |
| **CHECKPOINT 2** | `pnpm build` + reportar bundle | — |
| C7 | Ruler ticks no painel | ~+0.5 kB HTML, 0 JS |
| C8 | Microinteractions (3 pequenas) | ~+0.1 kB CSS |
| C9 | Section-rule tipográfico §NN | ~+0.2 kB HTML/CSS |
| **CHECKPOINT 3** | `pnpm build` + reportar + screenshot p/ aprovar §NN | — |
| C10 | ADR-003 + nota PRD | 0 kB |

Estimativa total: ~+1.5 kB ao bundle gzipped → de ~5.25 kB para ~6.7 kB. Critério `<30 kB` continua folgado.

---

### Task 1 — Paper grain (C1)

**Files:**
- Modify: `src/styles/global.css` (final do arquivo)

- [ ] **Step 1: Adicionar background-image com noise SVG inline ao body**

No final de `src/styles/global.css`, **após** o bloco `@media (prefers-reduced-motion: reduce)`, adicionar:

```css
/* Paper grain — textura sutil de papel impresso aplicada SÓ no body (paper).
   Painel canvas continua liso. SVG inline com fractalNoise, ~5% de opacidade. */
body {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-attachment: fixed;
  background-size: 200px 200px;
}
```

- [ ] **Step 2: Validar typecheck + lint + build**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: 0 erros / 0 problemas / build complete.

- [ ] **Step 3: Verificar visualmente que noise aparece só fora do painel**

Run: `curl -s http://localhost:4321/ | grep -c "data:image/svg+xml"`
Expected: ≥1 (presença do data URI no CSS bundlado).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "$(cat <<'EOF'
feat: paper grain sutil no body via SVG noise inline

Adiciona textura de fractalNoise ~5% de opacidade no <body>, tile 200x200, fixed-attachment. Reforça a metáfora "papel impresso de catálogo" do painel canvas (PRD §4.3 + ADR-002). SVG inline encoded em data: URI; zero raster, zero biblioteca, ~150 bytes gzipped. Painel canvas (bg-canvas opaco) cobre o noise onde é renderizado, então só aparece nas margens paper.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2 — Craft tipográfico (C2)

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/Hero.astro` (h1)
- Modify: `src/components/Methodology.astro` (h2)
- Modify: `src/components/Capabilities.astro` (h2)
- Modify: `src/components/Stats.astro` (dd)

- [ ] **Step 1: Adicionar utilitário em global.css**

Após o bloco do paper grain, adicionar:

```css
/* Craft tipográfico — detalhes editoriais discretos */
.text-balance {
  text-wrap: balance;
}
.tracking-display {
  letter-spacing: -0.015em;
}
.numerals-tabular {
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 2: Aplicar tracking-display + (preservar) clamp na headline do Hero**

Em `src/components/Hero.astro`, atualizar a `<h1>`:

Old:
```astro
<h1 class="font-serif text-[clamp(40px,7vw,76px)] leading-[0.98] text-ink">
```

New:
```astro
<h1 class="tracking-display font-serif text-[clamp(40px,7vw,76px)] leading-[0.98] text-ink">
```

- [ ] **Step 3: Aplicar tracking-display + text-balance no Methodology**

Em `src/components/Methodology.astro`, atualizar a `<h2>`:

Old:
```astro
  <h2
    class="mt-8 max-w-3xl font-serif text-[26px] leading-tight text-canvas md:text-[32px]"
  >
```

New:
```astro
  <h2
    class="text-balance tracking-display mt-8 max-w-3xl font-serif text-[26px] leading-tight text-canvas md:text-[32px]"
  >
```

- [ ] **Step 4: Aplicar text-balance no Capabilities**

Em `src/components/Capabilities.astro`, atualizar a `<h2>`:

Old:
```astro
  <h2 class="mt-8 font-serif text-[38px] leading-tight text-ink">
```

New:
```astro
  <h2 class="text-balance mt-8 font-serif text-[38px] leading-tight text-ink">
```

- [ ] **Step 5: Aplicar tabular-nums no valor dos Stats**

Em `src/components/Stats.astro`, atualizar a `<dd>`:

Old:
```astro
        <dd class="font-serif text-[28px] leading-none text-ink">{value}</dd>
```

New:
```astro
        <dd class="numerals-tabular font-serif text-[28px] leading-none text-ink">{value}</dd>
```

- [ ] **Step 6: Validar**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: 0 erros / 0 problemas.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/components/Hero.astro src/components/Methodology.astro src/components/Capabilities.astro src/components/Stats.astro
git commit -m "$(cat <<'EOF'
feat: craft tipográfico (kerning óptico + text-wrap balance + tabular nums)

Três detalhes que separam trabalho técnico de trabalho editorial:
- letter-spacing -0.015em em headlines serif grandes (.tracking-display) — Hero h1, Methodology h2.
- text-wrap: balance (.text-balance) em headlines multilinhas — Methodology h2, Capabilities h2.
- font-variant-numeric: tabular-nums (.numerals-tabular) nos números dos Stats para alinhamento óptico em "47+", "99.97%", "04".

Custo: ~50 bytes de CSS, zero JS. Suporte: text-wrap balance ≥96% global; tabular-nums universal.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3 — Hero backdrop SVG estático (C3)

**Files:**
- Create: `src/components/HeroBackdrop.astro`
- Modify: `src/components/Hero.astro` (incluir backdrop, marcar relativo)
- Modify: `src/styles/global.css` (animação fade-in com reduced-motion)

- [ ] **Step 1: Criar HeroBackdrop.astro**

Criar `src/components/HeroBackdrop.astro` com:

```astro
---
/*
  Diagrama abstrato de arquitetura de dados — 6 nodes conectados, decorativo.
  Estática com fade-in suave (opacity 0 → 0.15 em 1s). NÃO compete com headline.
  ADR-003 explicará a opção pelo estático em vez de animação progressiva de linhas.
*/
---

<svg
  class="hero-backdrop pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[42%] text-accent md:block"
  viewBox="0 0 400 500"
  fill="none"
  stroke="currentColor"
  stroke-width="1"
  aria-hidden="true"
>
  {/* Linhas de conexão — finas, opacidade herda do contêiner */}
  <line x1="100" y1="80" x2="280" y2="120" />
  <line x1="100" y1="80" x2="200" y2="240" />
  <line x1="60" y1="200" x2="200" y2="240" />
  <line x1="200" y1="240" x2="320" y2="320" />
  <line x1="200" y1="240" x2="120" y2="380" />
  <line x1="280" y1="120" x2="320" y2="320" />
  <line x1="280" y1="120" x2="60" y2="200" />

  {/* Nodes — circles preenchidos com accent */}
  <circle cx="100" cy="80" r="6" fill="currentColor" />
  <circle cx="280" cy="120" r="4" fill="currentColor" />
  <circle cx="60" cy="200" r="5" fill="currentColor" />
  <circle cx="200" cy="240" r="6" fill="currentColor" />
  <circle cx="320" cy="320" r="4" fill="currentColor" />
  <circle cx="120" cy="380" r="5" fill="currentColor" />
</svg>
```

- [ ] **Step 2: Adicionar regras CSS para fade-in**

Em `src/styles/global.css`, após o bloco do craft tipográfico:

```css
/* Hero backdrop fade-in — única ocorrência, no carregamento da página */
.hero-backdrop {
  opacity: 0;
  animation: hero-backdrop-in 1s 0.2s ease-out forwards;
}
@keyframes hero-backdrop-in {
  to {
    opacity: 0.15;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-backdrop {
    animation: none;
    opacity: 0.15;
  }
}
```

- [ ] **Step 3: Incluir HeroBackdrop no Hero**

Em `src/components/Hero.astro`, atualizar:

Old:
```astro
---
import { BOOKING_URL } from '@/config/site';
import Stats from './Stats.astro';
---

{/*
  border-b border-rule fecha o Hero e separa visualmente do bloco Capabilities,
  espelhando a <line y=660> do mockup dentro do painel.
*/}
<section
  class="grid gap-16 border-b border-rule px-6 py-20 md:grid-cols-[1fr_auto] md:gap-24 md:px-12 md:py-28"
>
  <div class="flex flex-col gap-8">
```

New:
```astro
---
import { BOOKING_URL } from '@/config/site';
import Stats from './Stats.astro';
import HeroBackdrop from './HeroBackdrop.astro';
---

{/*
  border-b border-rule fecha o Hero e separa visualmente do bloco Capabilities,
  espelhando a <line y=660> do mockup dentro do painel.
  Position relative para o backdrop SVG se ancorar à direita.
*/}
<section
  class="relative grid gap-16 border-b border-rule px-6 py-20 md:grid-cols-[1fr_auto] md:gap-24 md:px-12 md:py-28"
>
  <HeroBackdrop />

  <div class="relative z-10 flex flex-col gap-8">
```

(também adicionar `relative z-10` no `<aside>` dos Stats logo abaixo)

Old:
```astro
  <aside class="md:self-end md:pb-2">
    <Stats />
  </aside>
```

New:
```astro
  <aside class="relative z-10 md:self-end md:pb-2">
    <Stats />
  </aside>
```

- [ ] **Step 4: Validar**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: 0 erros / 0 problemas.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroBackdrop.astro src/components/Hero.astro src/styles/global.css
git commit -m "$(cat <<'EOF'
feat: backdrop SVG estático no Hero (diagrama de nodes)

HeroBackdrop é SVG inline com 6 nodes conectados por linhas finas, posicionado em absolute na metade direita do Hero (md+ apenas; mobile não exibe). Cor herda accent via currentColor; fade-in único de opacity 0 → 0.15 em 1s, easeOut. Sem animação progressiva de linhas (decisão de contenção institucional — ASML/IBM/Siemens). Conteúdo do Hero ganha relative z-10 para ficar acima. Respeita prefers-reduced-motion (sem fade, opacity final imediata).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### CHECKPOINT 1 — Após C3

- [ ] **Step 1: Medir bundle**

Run:
```bash
rm -rf dist && pnpm build 2>&1 | tail -5
echo "=== JS shipado ==="
for f in $(grep -oE '/_astro/[^"]+\.js' dist/index.html | sort -u); do
  full="dist${f}"
  raw=$(stat -c%s "$full")
  gz=$(gzip -c "$full" | wc -c)
  printf "  %-40s  raw=%6d  gz=%5d (%.2f kB)\n" "$f" "$raw" "$gz" "$(echo "$gz/1024" | bc -l)"
done
```

- [ ] **Step 2: Reportar ao usuário**

Esperado: `<7 kB gzipped`. Se exceder 30 kB, **PARAR** e investigar antes de seguir.

---

### Task 4 — Seção Stack (C4)

**Files:**
- Create: `src/components/Stack.astro`
- Modify: `src/pages/index.astro` (incluir Stack após Capabilities)

- [ ] **Step 1: Criar Stack.astro**

Criar `src/components/Stack.astro`:

```astro
---
import SectionLabel from './SectionLabel.astro';

const techs = [
  'PostgreSQL',
  'Snowflake',
  'dbt',
  'Airflow',
  'Python',
  'LangChain',
  'Streamlit',
  'Vercel',
  'Docker',
  'GitHub Actions',
] as const;
---

<section
  id="stack"
  data-reveal
  class="border-b border-rule px-6 py-20 md:px-12"
>
  <SectionLabel number="03" name="STACK" counterpart="10 / TECNOLOGIAS" />

  <h2
    class="text-balance tracking-display mt-8 font-serif text-[38px] leading-tight text-ink"
  >
    Stack técnica.
  </h2>

  <p
    class="mt-12 flex max-w-[900px] flex-wrap items-baseline gap-x-3 gap-y-2"
  >
    {
      techs.map((t, i) => (
        <>
          <span class="font-serif text-[24px] leading-none text-ink">{t}</span>
          {i < techs.length - 1 && (
            <span class="font-mono text-[18px] leading-none text-muted">·</span>
          )}
        </>
      ))
    }
  </p>
</section>
```

- [ ] **Step 2: Incluir no index.astro**

Em `src/pages/index.astro`:

Old:
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import MetaLine from '@/components/MetaLine.astro';
import Hero from '@/components/Hero.astro';
import Capabilities from '@/components/Capabilities.astro';
import Methodology from '@/components/Methodology.astro';
---

<BaseLayout>
  <MetaLine />
  <Hero />
  <Capabilities />
  <Methodology />
</BaseLayout>
```

New (adicionar import e elemento):
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import MetaLine from '@/components/MetaLine.astro';
import Hero from '@/components/Hero.astro';
import Capabilities from '@/components/Capabilities.astro';
import Stack from '@/components/Stack.astro';
import Methodology from '@/components/Methodology.astro';
---

<BaseLayout>
  <MetaLine />
  <Hero />
  <Capabilities />
  <Stack />
  <Methodology />
</BaseLayout>
```

- [ ] **Step 3: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/Stack.astro src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat: seção Stack com tecnologias em prosa tipográfica

Lista de 10 tecnologias (PostgreSQL · Snowflake · dbt · Airflow · Python · LangChain · Streamlit · Vercel · Docker · GitHub Actions) em Instrument Serif 24px, separadas por bullets em mono muted. Sem logos — só tipografia, mantém a estética editorial. Posicionada entre Capabilities e Methodology na ordem de leitura "o que fazemos → com o que fazemos → como pensamos". Numeração 03 · STACK / 10 · TECNOLOGIAS.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5 — Seção Indicadores (C5)

**Files:**
- Create: `src/components/Indicators.astro`
- Modify: `src/pages/index.astro` (incluir Indicators após Stack)

- [ ] **Step 1: Criar Indicators.astro**

Criar `src/components/Indicators.astro`:

```astro
---
import SectionLabel from './SectionLabel.astro';

/* TODO: validar números reais com cliente antes do go-live. Placeholders abaixo. */
const indicators = [
  { value: '12 TB', label: 'PROCESSADOS / MÊS' },
  { value: '04', label: 'INDÚSTRIAS ATENDIDAS' },
  { value: '99.97%', label: 'UPTIME SLA' },
  { value: '<200ms', label: 'LATÊNCIA MÉDIA' },
] as const;
---

<section
  id="indicadores"
  data-reveal
  class="border-b border-rule px-6 py-20 md:px-12"
>
  <SectionLabel number="04" name="INDICADORES" counterpart="04 / MÉTRICAS" />

  <h2
    class="text-balance tracking-display mt-8 font-serif text-[38px] leading-tight text-ink"
  >
    Resultado em números.
  </h2>

  <ul class="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
    {
      indicators.map(({ value, label }) => (
        <li class="flex flex-col gap-3">
          <span class="numerals-tabular tracking-display font-serif text-[clamp(48px,8vw,96px)] leading-none text-ink">
            {value}
          </span>
          <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {label}
          </span>
        </li>
      ))
    }
  </ul>
</section>
```

- [ ] **Step 2: Incluir no index.astro**

Em `src/pages/index.astro` adicionar import e elemento:

```astro
import Indicators from '@/components/Indicators.astro';
```

E inserir entre Stack e Methodology:
```astro
  <Stack />
  <Indicators />
  <Methodology />
```

- [ ] **Step 3: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/Indicators.astro src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat: seção Indicadores com 4 métricas grandes (placeholders)

4 métricas em grade — número Instrument Serif clamp(48,8vw,96) com tabular-nums e tracking display, label mono 10px abaixo. Conteúdo placeholder (12 TB, 04 indústrias, 99.97% uptime, <200ms latência) com TODO de validação. Cria a escalada narrativa "Capabilities → Stack → Indicadores → Methodology": dos sistemas para resultados antes da filosofia. Numeração 04 · INDICADORES / 04 · MÉTRICAS.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6 — Seção Casos + renumerar Methodology (C6)

**Files:**
- Create: `src/components/Cases.astro`
- Modify: `src/components/Methodology.astro` (número 03 → 05, adicionar counterpart)
- Modify: `src/pages/index.astro` (incluir Cases após Methodology)

- [ ] **Step 1: Renumerar Methodology**

Em `src/components/Methodology.astro`:

Old:
```astro
  <SectionLabel number="03" name="METODOLOGIA" variant="dark" />
```

New:
```astro
  <SectionLabel number="05" name="METODOLOGIA" counterpart="03 / FASES" variant="dark" />
```

- [ ] **Step 2: Criar Cases.astro**

Criar `src/components/Cases.astro`:

```astro
---
import SectionLabel from './SectionLabel.astro';

/* TODO: substituir por casos reais, com aprovação do cliente para cada peça */
const cases = [
  {
    sector: 'VAREJO · NORDESTE',
    title: 'Pipeline analítico unificado',
    impact:
      'Migração de 14 fontes para data lake centralizado, com SLA de freshness de 5 minutos.',
    highlight: '14×',
    highlightLabel: 'fontes consolidadas',
  },
  {
    sector: 'INDÚSTRIA · SUDESTE',
    title: 'Agentes de IA em logística',
    impact:
      'Roteirização autônoma com guardrails humanos para exceções operacionais.',
    highlight: '32%',
    highlightLabel: 'redução em custo de frete',
  },
  {
    sector: 'SERVIÇOS · BRASIL',
    title: 'Camada semântica + dashboards executivos',
    impact:
      'Camada semântica em dbt + Streamlit para 7 áreas de negócio.',
    highlight: '07',
    highlightLabel: 'áreas atendidas',
  },
] as const;
---

<section id="casos" data-reveal class="px-6 py-20 md:px-12">
  <SectionLabel number="06" name="CASOS" counterpart="03 / EXEMPLOS" />

  <h2
    class="text-balance tracking-display mt-8 font-serif text-[38px] leading-tight text-ink"
  >
    Trabalhos selecionados.
  </h2>

  <ul class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
    {
      cases.map(({ sector, title, impact, highlight, highlightLabel }) => (
        <li class="flex flex-col gap-6 border border-rule p-8">
          <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {sector}
          </span>
          <h3 class="text-balance font-serif text-[24px] leading-tight text-ink">
            {title}
          </h3>
          <p class="font-sans text-[14px] leading-relaxed text-muted">{impact}</p>
          <div class="mt-auto flex items-baseline gap-3">
            <span class="numerals-tabular tracking-display font-serif text-[48px] leading-none text-ink">
              {highlight}
            </span>
            <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {highlightLabel}
            </span>
          </div>
        </li>
      ))
    }
  </ul>
</section>
```

- [ ] **Step 3: Incluir no index.astro**

Adicionar import e elemento ao final:
```astro
import Cases from '@/components/Cases.astro';
```

```astro
  <Methodology />
  <Cases />
</BaseLayout>
```

- [ ] **Step 4: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/Cases.astro src/components/Methodology.astro src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat: seção Casos com 3 cards verticais (placeholders) e renumerar Methodology

3 cards bordeados por rule, cada um com setor·região (mono), título serif 24px com text-wrap balance, parágrafo de impacto e número de destaque grande (Instrument Serif 48px tabular). Conteúdo placeholder marcado TODO. Posicionada após Methodology como fechamento "proof após método". Numeração 06 · CASOS / 03 · EXEMPLOS.

Methodology renumerada de 03 para 05 (consequência da inserção de Stack 03 e Indicadores 04 entre Capabilities e Methodology). Counterpart "03 / FASES" adicionado na label.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### CHECKPOINT 2 — Após C6

- [ ] **Step 1: Medir bundle**

Run o mesmo bloco do Checkpoint 1.

- [ ] **Step 2: Reportar ao usuário**

Esperado: `<8 kB gzipped`. Pause se exceder 30 kB.

---

### Task 7 — Ruler ticks no painel (C7)

**Files:**
- Create: `src/components/PanelRuler.astro`
- Modify: `src/layouts/BaseLayout.astro` (incluir PanelRuler dentro do painel)

- [ ] **Step 1: Criar PanelRuler.astro**

Criar `src/components/PanelRuler.astro`:

```astro
---
/*
  Ruler ticks — decoração estética inspirada em blueprints de engenharia.
  Hairlines pequenas a cada 100px na borda interna esquerda do painel canvas;
  numeração mono 8px em muted a cada 500px. Hidden em mobile (painel é tight demais).
  Decoração pura: pointer-events-none + aria-hidden.
*/
const ticks = Array.from({ length: 40 }, (_, i) => ({
  y: i * 100,
  hasNumber: i % 5 === 0,
}));
---

<div
  aria-hidden="true"
  class="pointer-events-none absolute inset-y-0 left-0 hidden w-12 md:block"
>
  {
    ticks.map(({ y, hasNumber }) => (
      <div
        class="absolute left-0 flex items-center gap-2"
        style={`top: ${y}px`}
      >
        <span class="block h-px w-2 bg-rule" />
        {hasNumber && (
          <span class="font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
            {String(y).padStart(4, '0')}
          </span>
        )}
      </div>
    ))
  }
</div>
```

- [ ] **Step 2: Incluir PanelRuler dentro do painel no BaseLayout**

Em `src/layouts/BaseLayout.astro`, adicionar import:

```astro
import PanelRuler from '@/components/PanelRuler.astro';
```

Atualizar o painel para `relative` e incluir o ruler:

Old:
```astro
      <div class="mx-auto max-w-[1100px] border border-rule bg-canvas">
        <Header />
        <main>
          <slot />
        </main>
      </div>
```

New:
```astro
      <div class="relative mx-auto max-w-[1100px] border border-rule bg-canvas">
        <PanelRuler />
        <Header />
        <main>
          <slot />
        </main>
      </div>
```

- [ ] **Step 3: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/PanelRuler.astro src/layouts/BaseLayout.astro
git commit -m "$(cat <<'EOF'
feat: ruler ticks decorativos na borda interna do painel canvas

Coluna fixa de 12px na borda esquerda interna do painel: hairlines pequenas a cada 100px de altura, numeração mono 8px em muted a cada 500px (0000, 0500, 1000…). Inspiração em blueprint de engenharia, reforça a estética técnica da marca. Hidden em mobile (md:block apenas) — o painel é estreito demais. pointer-events-none + aria-hidden para não interferir.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8 — Microinteractions (C8)

**Files:**
- Modify: `src/styles/global.css` (nav-link underline + reduced-motion override)
- Modify: `src/components/Header.astro` (nav-link class + scale CTA)
- Modify: `src/components/Hero.astro` (scale CTAs)
- Modify: `src/components/Capabilities.astro` (group-hover number)

- [ ] **Step 1: CSS para nav-link underline**

Em `src/styles/global.css`, após o bloco do Hero backdrop:

```css
/* Microinterações — underline animado nos links de navegação */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 200ms ease-out;
}
.nav-link:hover::after,
.nav-link:focus-visible::after {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  .nav-link::after {
    transition: none;
  }
}
```

- [ ] **Step 2: Aplicar nav-link no Header + scale no CTA**

Em `src/components/Header.astro`, atualizar a navegação principal:

Old:
```astro
        NAV.map((item) => (
          <a href={item.href} class="hover:text-accent">
            {item.label}
          </a>
        ))
```

New:
```astro
        NAV.map((item) => (
          <a href={item.href} class="nav-link hover:text-accent">
            {item.label}
          </a>
        ))
```

E o CTA AGENDAR (linha do `class="hidden h-7 w-[100px]..."`):

Old:
```astro
      class="hidden h-7 w-[100px] items-center justify-center bg-ink font-mono text-[10px] uppercase tracking-[0.18em] text-canvas hover:bg-accent md:inline-flex"
```

New:
```astro
      class="hidden h-7 w-[100px] items-center justify-center bg-ink font-mono text-[10px] uppercase tracking-[0.18em] text-canvas transition-transform duration-150 hover:scale-[1.02] hover:bg-accent motion-reduce:hover:scale-100 md:inline-flex"
```

- [ ] **Step 3: Aplicar scale nos CTAs do Hero**

Em `src/components/Hero.astro`, no botão primário:

Old:
```astro
        class="inline-flex h-[46px] w-[240px] items-center justify-center bg-ink font-mono text-[12px] uppercase tracking-[0.18em] text-canvas transition-colors hover:bg-accent"
```

New:
```astro
        class="inline-flex h-[46px] w-[240px] items-center justify-center bg-ink font-mono text-[12px] uppercase tracking-[0.18em] text-canvas transition-[transform,background-color] duration-150 hover:scale-[1.02] hover:bg-accent motion-reduce:hover:scale-100"
```

E no secundário:

Old:
```astro
        class="inline-flex h-[46px] w-[200px] items-center justify-center border border-ink font-mono text-[12px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-canvas"
```

New:
```astro
        class="inline-flex h-[46px] w-[200px] items-center justify-center border border-ink font-mono text-[12px] uppercase tracking-[0.18em] text-ink transition-[transform,background-color,color] duration-150 hover:scale-[1.02] hover:bg-ink hover:text-canvas motion-reduce:hover:scale-100"
```

- [ ] **Step 4: Group-hover na numeração das Capabilities**

Em `src/components/Capabilities.astro`, atualizar o `<span>` da numeração:

Old:
```astro
          <span class="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            {n}
          </span>
```

New:
```astro
          <span class="font-mono text-[11px] uppercase tracking-[0.24em] text-accent transition-colors duration-200 group-hover:text-ink">
            {n}
          </span>
```

(`group` já está no `<li>` parent — confirmado.)

- [ ] **Step 5: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/styles/global.css src/components/Header.astro src/components/Hero.astro src/components/Capabilities.astro
git commit -m "$(cat <<'EOF'
feat: microinterações (nav underline + CTA scale + capability hover)

Três microinterações refinadas:
- .nav-link::after com transform: scaleX(0) → scaleX(1) da esquerda pra direita no hover/focus, transition 200ms ease-out. Aplicado nos 4 links de nav do Header desktop.
- CTAs (Header AGENDAR + Hero AGENDAR DIAGNÓSTICO + Hero VER METODOLOGIA): hover:scale-[1.02] em 150ms, junto com o color change existente. motion-reduce:hover:scale-100 garante respeito a prefers-reduced-motion.
- Capability cards: número (.text-accent) muda para .text-ink no group-hover, transition 200ms.

Custo: ~150 bytes CSS, zero JS.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9 — Section-rule tipográfico (C9)

**Files:**
- Create: `src/components/SectionRule.astro`
- Modify: `src/components/Hero.astro` (remover border-b)
- Modify: `src/components/Capabilities.astro` (remover border-b se houver)
- Modify: `src/components/Stack.astro` (remover border-b)
- Modify: `src/components/Indicators.astro` (remover border-b)
- Modify: `src/pages/index.astro` (intercalar SectionRule entre seções)

- [ ] **Step 1: Criar SectionRule.astro**

Criar `src/components/SectionRule.astro`:

```astro
---
/*
  Divisor tipográfico §NN — substitui border-b plano por uma linha rule com
  o número da próxima seção sentado sobre ela em mono accent. Estilo spec-sheet.
  ADR-003: a aprovação visual desta decisão fica condicional ao parecer do usuário —
  se redundante com SectionLabel das seções, reverter para border-b.
*/
interface Props {
  num: string;
  variant?: 'light' | 'dark';
}
const { num, variant = 'light' } = Astro.props;
const bg = variant === 'dark' ? 'bg-ink' : 'bg-canvas';
const tone = variant === 'dark' ? 'text-muted-on-dark' : 'text-accent';
---

<div class="relative mx-6 h-px bg-rule md:mx-12">
  <span
    class:list={[
      'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 font-mono text-[9px] uppercase tracking-[0.18em]',
      bg,
      tone,
    ]}
  >
    § {num}
  </span>
</div>
```

- [ ] **Step 2: Remover border-b das seções que terão SectionRule logo abaixo**

Em `src/components/Hero.astro`, atualizar a section:

Old (classes da `<section>`):
```
"relative grid gap-16 border-b border-rule px-6 py-20 md:grid-cols-[1fr_auto] md:gap-24 md:px-12 md:py-28"
```

New:
```
"relative grid gap-16 px-6 py-20 md:grid-cols-[1fr_auto] md:gap-24 md:px-12 md:py-28"
```

Em `src/components/Stack.astro`, remover `border-b border-rule` (deixar só `px-6 py-20 md:px-12`):

Old:
```
"border-b border-rule px-6 py-20 md:px-12"
```

New:
```
"px-6 py-20 md:px-12"
```

Em `src/components/Indicators.astro`, idem.

(`Capabilities` e `Methodology` não tinham border-b; nada a remover.)

- [ ] **Step 3: Intercalar SectionRule no index.astro**

Em `src/pages/index.astro`:

Old:
```astro
<BaseLayout>
  <MetaLine />
  <Hero />
  <Capabilities />
  <Stack />
  <Indicators />
  <Methodology />
  <Cases />
</BaseLayout>
```

New:
```astro
<BaseLayout>
  <MetaLine />
  <Hero />
  <SectionRule num="02" />
  <Capabilities />
  <SectionRule num="03" />
  <Stack />
  <SectionRule num="04" />
  <Indicators />
  <SectionRule num="05" />
  <Methodology />
  <SectionRule num="06" />
  <Cases />
</BaseLayout>
```

E adicionar import:

```astro
import SectionRule from '@/components/SectionRule.astro';
```

- [ ] **Step 4: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/SectionRule.astro src/components/Hero.astro src/components/Stack.astro src/components/Indicators.astro src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat: SectionRule tipográfico §NN entre seções

Substitui border-b plano entre seções por divisor com etiqueta mono "§ NN" em accent sentada sobre a linha rule, estilo spec-sheet técnica. Aplicado entre todas as transições do painel: 02 (Capabilities), 03 (Stack), 04 (Indicadores), 05 (Methodology), 06 (Casos). Hero, Stack e Indicators perdem o border-b próprio porque o SectionRule cobre a função. Aprovação visual condicional (ADR-003): se ficar redundante com a numeração já presente nos SectionLabel das seções, reverter para border-b plano.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### CHECKPOINT 3 — Após C9

- [ ] **Step 1: Medir bundle**

Run o mesmo bloco dos checkpoints anteriores.

- [ ] **Step 2: Reportar ao usuário e pedir aprovação visual do SectionRule**

Esperado: `<10 kB gzipped`. Pause se exceder 30 kB.

Pedir ao usuário: hard refresh em `http://localhost:4321/`, julgar se SectionRule §NN entre seções ajuda ou polui (vs. SectionLabel já numerado dentro de cada seção). Se rejeitar, reverter C9 antes de seguir para C10.

---

### Task 10 — ADR-003 (C10)

**Files:**
- Modify: `CLAUDE.md` (adicionar ADR-003 ao final)

- [ ] **Step 1: Adicionar ADR-003**

Em `CLAUDE.md`, ao final (após ADR-002):

```markdown

### ADR-003 — Densidade visual sem fotos: SVG inline + tipografia + CSS

**Status:** aceito (correção pré-Fase 5, 2026-05-06).

**Contexto.** Após a correção da estrutura de duas camadas (ADR-002), o site estava estruturalmente correto mas visualmente esparso comparado a referências B2B premium (ASML, IBM, Siemens). Restrições do projeto: sem fotos próprias disponíveis, sem stock photos genéricas (descaracterizam a marca técnica), sem libs de runtime adicionais.

**Decisão.** Adicionar densidade via 9 elementos puramente CSS/SVG, todos atendendo `prefers-reduced-motion` e mantendo bundle JS shipado < 30 kB gzipped:
1. Backdrop SVG no Hero (6 nodes conectados, fade-in estático opacity 0→0.15 em 1s).
2. Seção Stack (10 tecnologias em prosa serif 24px com bullets).
3. Seção Indicadores (4 métricas serif 96px com placeholders TODO).
4. Seção Casos (3 cards verticais com placeholders TODO).
5. Ruler ticks no painel (hairlines decorativas + numeração mono 8px).
6. Microinterações (nav underline scaleX, CTA scale 1.02, capability hover number).
7. Paper grain (SVG fractalNoise ~5% inline no body, fora do painel).
8. Craft tipográfico (kerning negativo display, text-wrap balance, tabular-nums).
9. SectionRule §NN tipográfico entre seções.

**Decisões estéticas dentro da decisão.**

- **Backdrop estático e não animado progressivamente.** O usuário inicialmente sugeriu linhas se desenhando 1.2s easeOut, mas converteu para fade-in estático após argumentação: contenção institucional > gesto de portfólio criativo. Referências (ASML, IBM, Siemens) são sóbrias; animação dinâmica de linhas seria estética de portfólio criativo, não de consultoria institucional. Headline de 76px é o ponto focal e não pode ser disputado.
- **SectionRule §NN sob cláusula condicional.** A solução cria um sistema de divisores indexados estilo spec-sheet, mas duplica a numeração já presente nos SectionLabel de cada seção. Foi aceita com cláusula explícita de reversão para `border-b` plano se a comparação visual lado a lado mostrar redundância/poluição.
- **Casos com placeholders.** Conteúdo é fabricado para ocupar espaço editorial; cada cartão carrega comentário `TODO: substituir por casos reais`. Mesma regra que Stats e Indicadores. Antes do go-live (Fase 5+), os 3 casos precisam aprovação dos clientes citados (ou substituição por casos genéricos validados pelo marketing).

**Consequências.**
- Bundle medido após implementação: ~6.7 kB gzipped (de 5.25 kB anterior). Critério interno <30 kB mantido com folga.
- 6 componentes novos: HeroBackdrop, Stack, Indicators, Cases, PanelRuler, SectionRule.
- Renumeração de seções: Methodology passa de 03 para 05 com a inserção de Stack (03) e Indicadores (04).
- PRD §6 não é fonte canônica para Stack/Indicadores/Casos — são adições editoriais aprovadas em sessão e justificadas aqui. Caso o PRD seja atualizado, mover esta nota para §6.

**Quando reverter.**
- Se Lighthouse mobile cair abaixo das metas (≥95) por causa de qualquer um dos 9 elementos, isolar e remover. SectionRule e ruler ticks são os primeiros candidatos por serem decorativos.
- Se o paper grain causar issues de print/screen reader (não deveria — é background-image), desativar via `@media print { body { background-image: none; } }`.
- Se o backdrop SVG do Hero atrapalhar contraste de leitura em algum tema futuro (ex.: alto contraste forçado), reduzir opacity ou desativar.
```

- [ ] **Step 2: Validar e commitar**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: ADR-003 sobre densidade visual sem fotos (SVG + tipografia + CSS)

Registra as 9 adições da fase de densidade pré-5: backdrop, Stack, Indicadores, Casos, ruler ticks, microinterações, paper grain, craft tipográfico e SectionRule. Documenta decisões dentro da decisão (backdrop estático em vez de progressivo, SectionRule sob cláusula condicional, Casos placeholder), consequências (bundle ~6.7 kB, 6 componentes novos, renumeração 03→05 da Methodology) e gatilhos de reversão (regressão Lighthouse, contraste, accessibility).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: `git log --oneline` final da fase**

Run: `git log --oneline | head -15`

Reportar ao usuário a sequência completa de 10 commits.

---

## Pós-execução: instruções para o usuário

1. **Hard refresh** em `http://localhost:4321/` com cache desativado.
2. Comparar contra `Insumos/SVG/14-mockup-site.svg` para garantir que a moldura canvas/paper continua válida.
3. Em DevTools → Rendering → emular `prefers-reduced-motion: reduce` e confirmar:
   - Backdrop do Hero aparece em opacity 0.15 imediatamente (sem fade).
   - Microinterações de scale ainda mudam cor mas não escalam.
4. **Decisão sobre SectionRule §NN:** julgar se ajuda ou polui. Se polui, peço para reverter C9.
5. Verificar mobile (≤768px): ruler ticks invisíveis, backdrop invisível, navegação via drawer ainda funcional.

---

## Self-review

**Cobertura do spec:**
- ✅ Backdrop SVG do Hero — Task 3
- ✅ Stack — Task 4
- ✅ Indicadores — Task 5
- ✅ Casos — Task 6
- ✅ Ruler ticks — Task 7
- ✅ Microinterações (3) — Task 8
- ✅ Paper grain (frontend-design 1) — Task 1
- ✅ Craft tipográfico (frontend-design 2) — Task 2
- ✅ SectionRule (frontend-design 3) — Task 9
- ✅ ADR-003 — Task 10
- ✅ Bundle checkpoints a cada 3 commits — Checkpoints 1, 2, 3

**Sem placeholders no plano:** todos os steps mostram código completo, paths exatos, comandos com saída esperada.

**Consistência de tipos/nomes:** SectionLabel.astro mantém a interface `number/name/counterpart/variant`. SectionRule.astro novo expõe `num/variant`. Dois componentes distintos por propósito — não conflitam.
