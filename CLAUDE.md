# CLAUDE.md — Vetra Solutions Site

Este projeto segue o PRD em ./docs/PRD-vetra-solutions-site.md.
Sempre consulte o PRD antes de tomar decisões de implementação.

## Stack
- Astro 4.x + TypeScript strict
- Tailwind CSS 3.x
- React (apenas para ilhas interativas)
- pnpm como package manager

## Convenções
- Componentes Astro têm extensão .astro; React só quando há interatividade.
- Cores: usar tokens do tailwind.config (canvas, paper, ink, accent, muted, rule).
- Tipografia: classes utilitárias font-serif, font-sans, font-mono.
- Não adicionar dependências sem justificar a escolha.
- Commits em português, formato: "tipo: descrição curta" (ex: "feat: hero section").

## Comandos
- pnpm dev — ambiente local
- pnpm build — build de produção
- pnpm preview — testar build localmente

## Ao implementar
- Pare nos checkpoints definidos no roadmap (seção 10 do PRD).
- Antes de criar arquivos novos, verifique se já não existem similares.
- Marque pendências como TODO no código, não invente conteúdo.

## Decisões arquiteturais

### ADR-001 — Smooth scroll e animação do Hero em vanilla, não em React + Framer Motion

**Status:** aceito (Fase 4, 2026-05-06).

**Contexto.** O PRD §6.3 sugere implementar a animação de stagger do Hero com **Framer Motion em ilha React isolada**, e §7.1 sugere **Lenis em ilha React** (`<SmoothScroll client:load />`). Em paralelo, §2.2 estabelece como métrica de sucesso `Bundle JS inicial < 50kB`.

Estimativa de bundle do caminho literal do PRD (gzipped):
- React + ReactDOM hidratados: ~45 kB
- Framer Motion (com `domAnimation` features): ~25 kB
- Lenis: ~13 kB
- **Total: ~80 kB** — estoura §2.2 com folga.

**Decisão.** Implementar com:
- **Lenis vanilla** chamado direto em `<script type="module">` no BaseLayout (sem ilha React)
- **Stagger do Hero** com `@keyframes` CSS + `animation-delay` (sem JS além do que o navegador já interpreta)
- **Reveal das seções** com `IntersectionObserver` puro (PRD §7.2 já prevê isso para todas as seções exceto o Hero — estendemos para incluir o Hero também)

**Consequências.**
- Bundle real esperado: **<15 kB JS gzipped** shipped na home — abaixo da meta de §2.2 e do critério interno mais apertado de 30 kB definido para a Fase 4.
- Resultado visual é equivalente: o stagger sai por delays acumulados; o reveal sai por classes alternadas pelo IO.
- React e Framer Motion ficam em `package.json` mas **não são importados em runtime na home** (Astro só inclui o que é referenciado).

**Quando reverter para o caminho do PRD literal.**
- Se a Fase 5 (ou posterior) pedir uma animação coreografada complexa que dependa de `useAnimate`, `AnimatePresence`, gestures ou orchestration cross-component — coisas que CSS animations não cobrem bem.
- Se entrar uma página adicional que já carregue React por outro motivo (ex.: form interativo, painel autenticado) — aí o custo marginal de Framer Motion cai e o trade-off muda.
- Sinal de alerta para reabrir esta decisão: PRD evoluir para exigir transições stateful (ex.: Hero que reage a interação contínua, não só entrada one-shot).