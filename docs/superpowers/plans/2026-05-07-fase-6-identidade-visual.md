# Fase 6 — Aplicação completa da identidade visual

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar fielmente os ativos canônicos (`Insumos/SVG/01-symbol-aperture.svg` + manual de cores em `10-cor-tipografia.svg`) onde o site hoje subutiliza a marca: trocar o "V" texto por símbolo aperture vetorial, completar a paleta com `azure` e `bone`, introduzir o símbolo como watermark decorativo, criar uma seção Manifesto e usar `azure` para os pontos de microinteração definidos no manual.

**Architecture:** Tudo SVG inline e CSS. Zero dependências novas, zero JS shipado adicional. Componentes Astro puros: um primitivo `ApertureSymbol` reutilizável (Header + Footer + Watermark + futuras superfícies), um `ApertureWatermark` que envolve o primitivo com positioning decorativo, e um `Manifesto` como seção full-width-no-painel. CSS: 2 tokens novos no Tailwind (azure, bone) + ajuste de classes existentes para usar `text-azure`.

**Tech Stack:** Astro 4, Tailwind 3, SVG inline. Sem novas deps.

**Convenções herdadas:**
- Commits atômicos em pt-BR, formato `tipo: descrição curta`.
- **Validação obrigatória** antes de cada commit: `pnpm typecheck && pnpm lint && pnpm build` (CLAUDE.md ## Convenções).
- Estrutura de duas camadas (PRD §4.3 + ADR-002): seções claras dentro do painel canvas; Manifesto e Watermark seguem essa regra.
- Tokens Tailwind atuais: `canvas`, `paper`, `ink`, `accent` (= Steel Blue), `muted` (= Graphite), `rule` (= Line), `rule-dark`, `muted-on-dark`. Tokens **a adicionar**: `azure`, `bone`.

**Discrepância de naming não corrigida nesta fase:** o brand book usa `paper`=#F5F3EE e `paper-2`=#E8E4DA, enquanto nossa config Tailwind usa `canvas`=#F5F3EE e `paper`=#E8E4DA — os nomes estão **trocados** em relação ao manual. Mexer nisso cascata por toda a base de componentes; fica registrado para uma fase futura de "alinhamento de nomenclatura". Não é objetivo desta fase.

---

## File Structure

**Novos arquivos:**
- `src/components/ApertureSymbol.astro` — primitivo SVG inline do símbolo aperture (3 chevrons + ponto na base), tamanho configurável via prop
- `src/components/ApertureWatermark.astro` — wrapper decorativo que posiciona ApertureSymbol como watermark
- `src/components/Manifesto.astro` — seção full-panel com headline serif + tagline mono

**Arquivos modificados:**
- `tailwind.config.mjs` — adicionar tokens `azure` e `bone`
- `src/components/Header.astro` — substituir `<span>V</span>` por `<ApertureSymbol size={28} />`; CTA AGENDAR ↗ com seta em azure
- `src/components/Footer.astro` — substituir `<span>V</span>` por `<ApertureSymbol size={20} />`
- `src/components/Hero.astro` — eyebrow `text-accent` → `text-azure`; setas dos CTAs em azure
- `src/components/MobileMenu.astro` — substituir o V do drawer header pelo ApertureSymbol
- `src/styles/global.css` — `.nav-link::after` background trocar `currentColor` por `theme('colors.azure')`
- `src/pages/index.astro` — incluir `<ApertureWatermark />` entre Methodology e Cases; incluir `<Manifesto />` entre Cases e Footer
- `CLAUDE.md` — documentar uso de azure (microinteração) e bone (terceira camada de profundidade)

---

## Sequência de execução

| Commit | Tarefa | Bundle expected delta |
|---|---|---|
| C1 | Tokens azure + bone no Tailwind | 0 (CSS purgado por uso) |
| C2 | ApertureSymbol primitivo + Header + Footer + MobileMenu | ~+0.4 kB HTML, 0 JS |
| C3 | text-azure em CTAs, nav underline, Hero eyebrow | ~+0.2 kB CSS |
| C4 | ApertureWatermark entre Methodology e Cases | ~+0.3 kB HTML |
| C5 | Manifesto entre Cases e Footer | ~+0.5 kB HTML |
| C6 | Docs CLAUDE.md sobre azure/bone | 0 |
| **VALIDATION** | typecheck + lint + build limpo + bundle final | — |
| **LIGHTHOUSE** | re-validar pelo usuário (Chrome incógnito mobile, ≥95) | — |

Estimativa total: ~+1.5 kB HTML, ~+0.2 kB CSS gzipped. Zero JS. Bundle final esperado: ~5.25 kB JS gz (inalterado), ~5.6 kB CSS gz.

---

### Task 1 — Tokens azure + bone no Tailwind

**Files:**
- Modify: `tailwind.config.mjs`

- [ ] **Step 1: Adicionar azure e bone em colors.extend**

Em `tailwind.config.mjs`, atualizar o bloco `colors`:

Old:
```javascript
      colors: {
        canvas: '#F5F3EE',
        paper: '#E8E4DA',
        ink: '#0A1628',
        accent: '#1E4D8C',
        muted: '#5A6470',
        rule: '#C8CDD4',
        'rule-dark': '#2A3A52',
        'muted-on-dark': '#8A96A8',
      },
```

New:
```javascript
      colors: {
        canvas: '#F5F3EE',
        paper: '#E8E4DA',
        ink: '#0A1628',
        accent: '#1E4D8C',
        azure: '#4A90E2',
        bone: '#FAFAF7',
        muted: '#5A6470',
        rule: '#C8CDD4',
        'rule-dark': '#2A3A52',
        'muted-on-dark': '#8A96A8',
      },
```

- [ ] **Step 2: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: 0 erros / 0 problemas / build complete.

```bash
git add tailwind.config.mjs
git commit -m "$(cat <<'EOF'
feat: tokens azure (#4A90E2) e bone (#FAFAF7) no Tailwind

Completa a paleta canônica do manual de cores (Insumos/SVG/10-cor-tipografia.svg). azure é o highlight interativo (microinterações: setas ↗, hover de nav, focus rings); bone é surface light para criar terceira camada de profundidade quando canvas e paper não bastam. Tokens ficam disponíveis como bg-azure / text-azure / bg-bone / etc.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2 — ApertureSymbol primitivo + uso no Header, Footer, MobileMenu

**Files:**
- Create: `src/components/ApertureSymbol.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/MobileMenu.astro`

- [ ] **Step 1: Criar ApertureSymbol.astro**

Criar `src/components/ApertureSymbol.astro`:

```astro
---
/*
  Símbolo aperture oficial (3 chevrons + ponto na base).
  Source: Insumos/SVG/01-symbol-aperture.svg.
  viewBox 56×56, stroke-width 1.6 (proporcional ao tamanho).
  Cor herda via currentColor para permitir text-ink, text-accent etc no parent.
*/
interface Props {
  size?: number;
  class?: string;
  ariaLabel?: string;
}

const {
  size = 28,
  class: className = '',
  ariaLabel = 'Vetra Solutions',
} = Astro.props;
---

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 56 56"
  width={size}
  height={size}
  class={className}
  aria-label={ariaLabel}
  role="img"
>
  <g
    stroke="currentColor"
    fill="none"
    stroke-width="1.6"
    stroke-linejoin="miter"
    stroke-linecap="square"
  >
    <path d="M8 10 L28 46 L48 10" />
    <path d="M14 10 L28 38 L42 10" />
    <path d="M20 10 L28 30 L36 10" />
  </g>
  <circle cx="28" cy="46" r="2.2" fill="currentColor" />
</svg>
```

- [ ] **Step 2: Substituir V no Header**

Em `src/components/Header.astro`, atualizar:

Old:
```astro
---
import { NAV, BOOKING_URL, SITE } from '@/config/site';
import MobileMenu from './MobileMenu.astro';
---
```

New (adicionar import):
```astro
---
import { NAV, BOOKING_URL, SITE } from '@/config/site';
import MobileMenu from './MobileMenu.astro';
import ApertureSymbol from './ApertureSymbol.astro';
---
```

Trocar a logo:

Old:
```astro
    <a href="/" class="flex items-center gap-3" aria-label={SITE.name}>
      <span aria-hidden="true" class="font-serif text-2xl leading-none">V</span>
      <span class="font-serif text-[14px] tracking-wide">VETRA SOLUTIONS</span>
    </a>
```

New:
```astro
    <a href="/" class="flex items-center gap-3 text-ink" aria-label={SITE.name}>
      <ApertureSymbol size={28} ariaLabel="" />
      <span class="font-serif text-[14px] tracking-wide">VETRA SOLUTIONS</span>
    </a>
```

(`ariaLabel=""` no SVG porque o `<a>` parent já tem o aria-label — evita duplicação para screen readers. `text-ink` no `<a>` para que o `currentColor` do SVG resolva para ink.)

- [ ] **Step 3: Substituir V no Footer**

Em `src/components/Footer.astro`, atualizar:

Old:
```astro
---
import { NAV, SITE, CONTACT } from '@/config/site';
const year = new Date().getFullYear();
---
```

New:
```astro
---
import { NAV, SITE, CONTACT } from '@/config/site';
import ApertureSymbol from './ApertureSymbol.astro';
const year = new Date().getFullYear();
---
```

Old (logo do Footer):
```astro
      <div class="flex items-center gap-3">
        <span aria-hidden="true" class="font-serif text-2xl leading-none">V</span>
        <span class="font-serif text-[14px] tracking-wide">VETRA SOLUTIONS</span>
      </div>
```

New:
```astro
      <div class="flex items-center gap-3 text-ink">
        <ApertureSymbol size={20} ariaLabel="" />
        <span class="font-serif text-[14px] tracking-wide">VETRA SOLUTIONS</span>
      </div>
```

- [ ] **Step 4: Substituir wordmark no MobileMenu**

Em `src/components/MobileMenu.astro`, o cabeçalho do drawer hoje só mostra "VETRA SOLUTIONS" sem símbolo. Adicionar o aperture para consistência.

Old:
```astro
    <div class="flex h-[60px] items-center justify-between">
      <span class="font-serif text-[14px] tracking-wide">VETRA SOLUTIONS</span>
```

New (também precisa importar ApertureSymbol no frontmatter):

Frontmatter:
```astro
---
import { NAV, BOOKING_URL } from '@/config/site';
import ApertureSymbol from './ApertureSymbol.astro';
---
```

Markup:
```astro
    <div class="flex h-[60px] items-center justify-between">
      <div class="flex items-center gap-3 text-ink">
        <ApertureSymbol size={24} ariaLabel="" />
        <span class="font-serif text-[14px] tracking-wide">VETRA SOLUTIONS</span>
      </div>
```

(o `</div>` extra fica fechando antes do botão FECHAR ✕. Verificar a estrutura final.)

- [ ] **Step 5: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/ApertureSymbol.astro src/components/Header.astro src/components/Footer.astro src/components/MobileMenu.astro
git commit -m "$(cat <<'EOF'
feat: ApertureSymbol primitivo substituindo V texto no Header, Footer e MobileMenu

Replica fielmente Insumos/SVG/01-symbol-aperture.svg como componente Astro reutilizável: 3 chevrons aninhados (M8,10→48,10 / M14,10→42,10 / M20,10→36,10) + ponto na base em (28,46). viewBox 56x56, stroke-width 1.6, currentColor para herdar tom do parent.

Header: 28px (era texto serif 24px); Footer: 20px (proporcional ao wordmark menor); MobileMenu: 24px (também ganhou o símbolo, antes só tinha wordmark). Alt text fica no <a>/<div> parent — SVG com ariaLabel="" para não duplicar para screen readers.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3 — text-azure em CTAs, nav underline e Hero eyebrow

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Hero eyebrow para text-azure**

Em `src/components/Hero.astro`:

Old:
```astro
    <p
      class="stagger stagger-1 font-mono text-[11px] uppercase tracking-[0.24em] text-accent"
    >
      ↳ ENGENHARIA DE DADOS &amp; IA
    </p>
```

New:
```astro
    <p
      class="stagger stagger-1 font-mono text-[11px] uppercase tracking-[0.24em] text-azure"
    >
      ↳ ENGENHARIA DE DADOS &amp; IA
    </p>
```

- [ ] **Step 2: Setas ↗ dos CTAs do Hero em azure**

Em `src/components/Hero.astro`, os CTAs hoje têm a seta inline no texto. Para colorir só a seta, separar em `<span>`:

Old (CTA primário):
```astro
      <a
        href={BOOKING_URL}
        class="inline-flex h-[46px] w-[240px] items-center justify-center bg-ink font-mono text-[12px] uppercase tracking-[0.18em] text-canvas transition-[transform,background-color] duration-150 hover:scale-[1.02] hover:bg-accent motion-reduce:hover:scale-100"
      >
        AGENDAR DIAGNÓSTICO ↗
      </a>
```

New:
```astro
      <a
        href={BOOKING_URL}
        class="inline-flex h-[46px] w-[240px] items-center justify-center gap-1 bg-ink font-mono text-[12px] uppercase tracking-[0.18em] text-canvas transition-[transform,background-color] duration-150 hover:scale-[1.02] hover:bg-accent motion-reduce:hover:scale-100"
      >
        <span>AGENDAR DIAGNÓSTICO</span>
        <span class="text-azure" aria-hidden="true">↗</span>
      </a>
```

(O secundário "VER METODOLOGIA" não tem seta — não mexer.)

- [ ] **Step 3: Seta ↗ do CTA do Header em azure**

Em `src/components/Header.astro`:

Old:
```astro
    <a
      href={BOOKING_URL}
      class="hidden h-7 w-[100px] items-center justify-center bg-ink font-mono text-[10px] uppercase tracking-[0.18em] text-canvas transition-transform duration-150 hover:scale-[1.02] hover:bg-accent motion-reduce:hover:scale-100 md:inline-flex"
    >
      AGENDAR ↗
    </a>
```

New:
```astro
    <a
      href={BOOKING_URL}
      class="hidden h-7 w-[100px] items-center justify-center gap-1 bg-ink font-mono text-[10px] uppercase tracking-[0.18em] text-canvas transition-transform duration-150 hover:scale-[1.02] hover:bg-accent motion-reduce:hover:scale-100 md:inline-flex"
    >
      <span>AGENDAR</span>
      <span class="text-azure" aria-hidden="true">↗</span>
    </a>
```

- [ ] **Step 4: Seta ↗ do CTA AGENDAR DIAGNÓSTICO no MobileMenu em azure**

Em `src/components/MobileMenu.astro`:

Old:
```astro
    <a
      href={BOOKING_URL}
      class="mt-auto inline-flex h-[46px] w-full items-center justify-center bg-ink font-mono text-[12px] uppercase tracking-[0.18em] text-canvas hover:bg-accent"
    >
      AGENDAR DIAGNÓSTICO ↗
    </a>
```

New:
```astro
    <a
      href={BOOKING_URL}
      class="mt-auto inline-flex h-[46px] w-full items-center justify-center gap-1 bg-ink font-mono text-[12px] uppercase tracking-[0.18em] text-canvas hover:bg-accent"
    >
      <span>AGENDAR DIAGNÓSTICO</span>
      <span class="text-azure" aria-hidden="true">↗</span>
    </a>
```

- [ ] **Step 5: nav-link underline em azure**

Em `src/styles/global.css`:

Old:
```css
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
```

New:
```css
.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 1px;
  background: theme('colors.azure');
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 200ms ease-out;
}
```

- [ ] **Step 6: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/Hero.astro src/components/Header.astro src/components/MobileMenu.astro src/styles/global.css
git commit -m "$(cat <<'EOF'
style: azure como cor de microinteração (CTAs ↗, nav underline, Hero eyebrow)

Conforme manual de cores (Insumos/SVG/10-cor-tipografia.svg, "Highlight · interactive"): trocar accent (steel blue, semântico técnico) por azure (highlight interativo) nos pontos de interação:
- Setas ↗ dos CTAs (Header AGENDAR, Hero AGENDAR DIAGNÓSTICO, MobileMenu AGENDAR DIAGNÓSTICO) — separadas em <span aria-hidden="true"> para colorir só a seta sem mudar o texto principal.
- Hero eyebrow "↳ ENGENHARIA DE DADOS & IA" — text-accent → text-azure.
- .nav-link::after (underline animado de hover/focus) — background currentColor → theme('colors.azure'), tornando a interação consistente independente da cor do link parent.

accent (Steel Blue) permanece reservado para numeração de seções, label da SectionLabel e elementos institucionais — semântica do manual.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4 — ApertureWatermark entre Methodology e Cases

**Files:**
- Create: `src/components/ApertureWatermark.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Criar ApertureWatermark.astro**

Criar `src/components/ApertureWatermark.astro`:

```astro
---
import ApertureSymbol from './ApertureSymbol.astro';

/*
  Watermark decorativo: símbolo aperture em escala grande (~600px),
  posicionado parcialmente fora do painel à direita, em accent (Steel Blue)
  com opacidade 0.07. Container tem overflow:hidden para clipar a parte que
  vaza, criando sensação de continuidade. Hidden em mobile (md:block) para
  não poluir telas estreitas.
  Decoração pura: aria-hidden + pointer-events-none.
*/
---

<aside
  aria-hidden="true"
  class="pointer-events-none relative hidden h-[200px] overflow-hidden md:block"
>
  <div class="absolute -right-32 top-1/2 -translate-y-1/2 text-accent opacity-[0.07]">
    <ApertureSymbol size={600} ariaLabel="" />
  </div>
</aside>
```

- [ ] **Step 2: Inserir entre Methodology e Cases no index.astro**

Em `src/pages/index.astro`:

Old:
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import MetaLine from '@/components/MetaLine.astro';
import Hero from '@/components/Hero.astro';
import Capabilities from '@/components/Capabilities.astro';
import Stack from '@/components/Stack.astro';
import Indicators from '@/components/Indicators.astro';
import Methodology from '@/components/Methodology.astro';
import Cases from '@/components/Cases.astro';
---

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

New (adicionar import + colocar entre Methodology e Cases):
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import MetaLine from '@/components/MetaLine.astro';
import Hero from '@/components/Hero.astro';
import Capabilities from '@/components/Capabilities.astro';
import Stack from '@/components/Stack.astro';
import Indicators from '@/components/Indicators.astro';
import Methodology from '@/components/Methodology.astro';
import ApertureWatermark from '@/components/ApertureWatermark.astro';
import Cases from '@/components/Cases.astro';
---

<BaseLayout>
  <MetaLine />
  <Hero />
  <Capabilities />
  <Stack />
  <Indicators />
  <Methodology />
  <ApertureWatermark />
  <Cases />
</BaseLayout>
```

- [ ] **Step 3: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/ApertureWatermark.astro src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat: ApertureWatermark decorativo entre Methodology e Cases

Símbolo aperture em escala grande (600px), posicionado absolute com -right-32 dentro de um container overflow-hidden de 200px de altura. Cor: accent (Steel Blue) com opacity 0.07 — visível mas sutil. Hidden em mobile para não poluir; aria-hidden + pointer-events-none. Cria respiração visual entre o bloco escuro de Methodology e o grid de Cases.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5 — Manifesto entre Cases e Footer

**Files:**
- Create: `src/components/Manifesto.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Criar Manifesto.astro**

Criar `src/components/Manifesto.astro`:

```astro
---
/*
  Seção Manifesto — full-width dentro do painel, bg-ink (mesma escolha de
  Methodology, mantém o ritmo institucional sem inflar com bg-azure que daria
  tom "vendedor"). Headline serif grande centralizada + tagline mono abaixo.
  Ambos textos placeholder TODO até aprovação final.
*/
---

<section
  data-reveal
  class="bg-ink px-6 py-20 text-canvas md:px-12 md:py-28"
>
  <div class="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
    {/* TODO: aprovar headline final do manifesto */}
    <h2
      class="text-balance tracking-display font-serif text-[clamp(32px,5vw,52px)] leading-[1.1]"
    >
      Engenharia de dados não é commodity — é <em class="italic">fundação</em>.
    </h2>

    {/* TODO: confirmar tagline (atualmente repete a tagline canônica do Hero) */}
    <p
      class="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-on-dark"
    >
      A coluna vertebral dos seus dados.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Inserir entre Cases e o final do BaseLayout no index.astro**

Em `src/pages/index.astro`:

Old:
```astro
import ApertureWatermark from '@/components/ApertureWatermark.astro';
import Cases from '@/components/Cases.astro';
---

<BaseLayout>
  <MetaLine />
  <Hero />
  <Capabilities />
  <Stack />
  <Indicators />
  <Methodology />
  <ApertureWatermark />
  <Cases />
</BaseLayout>
```

New:
```astro
import ApertureWatermark from '@/components/ApertureWatermark.astro';
import Cases from '@/components/Cases.astro';
import Manifesto from '@/components/Manifesto.astro';
---

<BaseLayout>
  <MetaLine />
  <Hero />
  <Capabilities />
  <Stack />
  <Indicators />
  <Methodology />
  <ApertureWatermark />
  <Cases />
  <Manifesto />
</BaseLayout>
```

(O Footer real continua **fora** do painel, no BaseLayout — Manifesto é a última seção dentro do painel canvas, antes do painel terminar e o paper aparecer com o Footer.)

- [ ] **Step 3: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add src/components/Manifesto.astro src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat: seção Manifesto entre Cases e Footer (placeholder TODO)

Bloco bg-ink full-width dentro do painel canvas (mesma família de Methodology — mantém o ritmo institucional, evita expandir azure como fundo de bloco grande, que viraria tom "vendedor" oposto ao perfil ASML/IBM/Siemens). Headline serif clamp(32,5vw,52) com itálico em "fundação"; tagline mono abaixo em muted-on-dark. Texto placeholder TODO em ambos.

Posicionada como último bloco dentro do painel — Manifesto fecha o painel; o Footer real continua fora, ancorado ao paper.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6 — Documentar uso de azure e bone no CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Adicionar bullet sobre uso de azure e bone**

Em `CLAUDE.md`, na seção `## Convenções`, **após** o bullet "Cores: usar tokens do tailwind.config..." atualizar para refletir os novos tokens e seus papéis semânticos:

Old:
```markdown
- Cores: usar tokens do tailwind.config (canvas, paper, ink, accent, muted, rule).
```

New:
```markdown
- Cores: usar tokens do tailwind.config (canvas, paper, ink, accent, azure, bone, muted, rule, rule-dark, muted-on-dark). Semântica conforme `Insumos/SVG/10-cor-tipografia.svg`:
  - **`accent` (Steel Blue #1E4D8C)** — institucional/técnico: numeração de SectionLabel, elementos de marca.
  - **`azure` (#4A90E2)** — *highlight interativo*: setas ↗ de CTA, underline animado de nav, focus rings. Nunca usar como fundo de bloco grande (vira tom "vendedor").
  - **`bone` (#FAFAF7)** — *surface light*: terceira camada de profundidade quando `canvas` e `paper` não bastam (ex.: card destacado dentro de Indicadores; modal sobre canvas). Usar com parcimônia — a duas camadas paper+canvas já cobrem 95% dos casos.
```

- [ ] **Step 2: Validar e commitar**

Run: `pnpm typecheck && pnpm lint && pnpm build`

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: documentar uso semântico de azure e bone na convenção de cores

Em CLAUDE.md ## Convenções, expandir o bullet de cores listando os tokens novos (azure, bone) com regras de uso semântico claras: azure = microinteração (nunca fundo grande), bone = terceira camada de profundidade (com parcimônia). Referência cruzada ao manual em Insumos/SVG/10-cor-tipografia.svg para qualquer revisão futura.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Validation — Build limpo + bundle final

- [ ] **Step 1: Build limpo**

Run:
```bash
rm -rf dist && pnpm typecheck && pnpm lint && pnpm build
```

Expected: 0 erros, 0 problemas, build complete.

- [ ] **Step 2: Verificar artefatos esperados em dist/**

Run: `ls dist/ | sort`
Expected (entre outros): `_astro/`, `apple-touch-icon.png`, `favicon.ico`, `favicon.svg`, `fonts/`, `index.html`, `og-image.png`, `robots.txt`, `sitemap.xml`.

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
echo ""
echo "=== CSS shipado ==="
for f in $(grep -oE '/_astro/[^"]+\.css' dist/index.html | sort -u); do
  full="dist${f}"
  raw=$(stat -c%s "$full")
  gz=$(gzip -c "$full" | wc -c)
  printf "  %-40s  raw=%6d B  gz=%5d B (%.2f kB)\n" "$f" "$raw" "$gz" "$(echo "$gz/1024" | bc -l)"
done
```

Expected: ~5.25 kB JS gzipped (inalterado — Fase 6 não adiciona JS); CSS ~5.5–5.7 kB gzipped (subiu marginalmente por classes novas — text-azure, bg-azure).

- [ ] **Step 4: Confirmar HTML renderiza ApertureSymbol e Manifesto**

Run:
```bash
echo "ApertureSymbol presente:"
grep -c "Vetra Solutions — symbol\|aperture" dist/index.html || true
echo "Manifesto presente:"
grep -c "Engenharia de dados não é commodity" dist/index.html
echo "azure usado:"
grep -oE '(text|bg)-azure' dist/index.html | sort -u || true
```

Expected: Manifesto contagem ≥1; classes `text-azure` aparecem.

---

### Lighthouse — você roda

Lighthouse precisa de Chrome. Mesmo procedimento da Fase 5:

- [ ] **Step 1: `pnpm preview`** em terminal próprio.

- [ ] **Step 2: Chrome incógnito → DevTools → Lighthouse → Mobile + 4G + todas categorias → Analyze.**

- [ ] **Step 3: Reportar 4 métricas.** Se qualquer ≥95 falhar, parar e investigar (sub-skill: superpowers:systematic-debugging) antes do go-live.

---

## Self-review

**Cobertura do escopo da Fase 6:**
- ✅ Substituir V simples por símbolo aperture (Header) — Task 2
- ✅ Mesma substituição em Footer e MobileMenu (consistência) — Task 2 (não estava no spec, mas é coerência)
- ✅ Tokens azure (#4A90E2) e bone (#FAFAF7) — Task 1
- ✅ Documentação de quando usar cada um — Task 6
- ✅ ApertureWatermark com escala configurável e posicionamento decorativo — Task 4
- ✅ Manifesto entre Cases e Footer com placeholder TODO — Task 5
- ✅ text-azure em CTAs (setas ↗), nav underline, Hero eyebrow — Task 3
- ✅ Sem novas deps, zero JS shipado — confirmado por design
- ✅ Lighthouse re-validação — Lighthouse step

**Sem placeholders no plano:** todos os steps mostram código completo, paths exatos, comandos com saída esperada.

**Consistência de tipos/nomes:**
- `ApertureSymbol` props: `size`, `class`, `ariaLabel` — usado consistentemente em Header (size=28), Footer (size=20), MobileMenu (size=24), ApertureWatermark (size=600).
- Tokens novos: `azure` e `bone` — usados consistentemente em todas as referências (`text-azure`, `bg-azure` na CSS via `theme('colors.azure')`).
- Componentes novos: `ApertureSymbol`, `ApertureWatermark`, `Manifesto` — sem colisão com nomes existentes.

**Riscos identificados e mitigações:**
1. **Discrepância de naming `paper`/`canvas` vs brand book.** Não corrigida nesta fase (cascata por toda a base). Registrada para fase futura. Mitigação: documentar em CLAUDE.md já feito (futuro: ADR de alinhamento).
2. **bone token não usado nesta fase.** Adicionar token sem consumidor parece YAGNI, mas o usuário pediu explicitamente — entra como parte do toolkit disponível. Documentação justifica o custo zero.
3. **Manifesto bg-ink vs bg-azure.** Escolhi ink por argumento institucional (azure como fundo grande vira "vendedor"). Se usuário rejeitar a escolha após ver, fix isolado é trocar `bg-ink` por `bg-azure` no Manifesto.astro — 1 linha. Não justifica branch separada.
4. **Watermark pode aparecer cortado em viewports >1280px** — o painel é centralizado e tem 1100px max; se a viewport for muito larga, paper aparece nas laterais e o watermark à direita do painel pode "encostar" na borda direita do paper. Mitigação: o `overflow-hidden` do container do watermark limita a parte visível ao próprio container (200px de altura, dentro do painel canvas). Garantia: watermark fica clipado pelo container, nunca extrapola para o paper.
