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
- **Estrutura visual de duas camadas (PRD §4.3 + ADR-002):** seção clara nunca renderiza direto sobre `paper`. Toda seção clara (Header, MetaLine, Hero, Capabilities) vive **dentro** do painel `canvas` (1100px max, com borda 1px solid `rule`). Methodology também fica dentro do painel mas com fundo `ink` edge-to-edge. Footer é a única exceção: fica fora do painel, sobre `paper`. Cantos do painel são retos (sem `rounded-*`) e sem `shadow-*`.

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

### ADR-002 — Estrutura visual de duas camadas (paper externo + painel canvas)

**Status:** aceito (correção pós-Fase 4, 2026-05-06).

**Contexto.** O mockup canônico `Insumos/SVG/14-mockup-site.svg` é explícito: o site é renderizado como um painel canvas centralizado com borda 1px sobre um fundo paper. Até o final da Fase 4, a implementação tinha `bg-paper` no body mas **nenhum painel canvas envolvendo o conteúdo** — todas as seções claras renderizavam direto sobre paper. O resultado visual era "fundo bege uniforme" em vez do "catálogo dentro de uma capa" pretendido. A divergência era estrutural (camada inteira faltando), não cosmética.

**Decisão.**
- Body permanece `bg-paper`.
- Wrapper externo `mx-auto max-w-[1280px]` com padding lateral PRD §4.3 e padding vertical fluido (`pt/pb-8 sm:12 md:[50px]`) que cria a margem de paper visível ao redor do painel.
- Wrapper painel `mx-auto max-w-[1100px] bg-canvas border border-rule` envolvendo Header + `<main>`. **Cantos retos, sem sombra** (estética editorial; PRD §1.2 — não bombástico).
- Methodology, ainda dentro do painel, ocupa 100% da largura do painel (edge-to-edge) com `bg-ink`. É a única seção que troca a tonalidade interna do painel.
- Footer fica **fora** do painel, em `paper`. O mockup termina em Methodology; o Footer é a única zona de paper "abaixo" do painel.

**Consequências.**
- Reescrita do BaseLayout, dos componentes Methodology/Capabilities (este último ganha borda externa do mockup, antes ausente), Stats (passa a horizontal nos 2 breakpoints) e ajustes de padding interno (md:px-12 = 48px = pad-inner em vez de md:px-16 = 64px = pad-x-container). Header bg passa de paper/90 para canvas/90.
- Sem impacto em bundle (mudança puramente CSS/markup).
- Documentação: PRD §4.3 ganhou parágrafo "Estrutura visual de duas camadas"; este ADR fixa a justificativa.

**Quando reverter ou flexibilizar.**
- Se um redesign abandonar a metáfora "catálogo em capa" — improvável no v1, mas registrar.
- Se uma página futura precisar full-bleed (ex.: landing de campanha sem moldura), criar variante de BaseLayout em vez de remover a moldura aqui.
- Se acessibilidade reportar contraste insuficiente entre paper e canvas (são cores próximas; teste de contraste de bordas pode reabrir).