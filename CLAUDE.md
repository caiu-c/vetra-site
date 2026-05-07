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
- Cores: usar tokens do tailwind.config (canvas, paper, ink, accent, azure, bone, muted, rule, rule-dark, muted-on-dark). Semântica conforme `Insumos/SVG/10-cor-tipografia.svg`:
  - **`accent` (Steel Blue #1E4D8C)** — institucional/técnico: numeração de SectionLabel, símbolo aperture em watermarks, elementos de marca.
  - **`azure` (#4A90E2)** — *highlight interativo*: setas ↗ de CTA (sobre fundo `ink`), underline animado de nav (decorativo, 1px), focus rings. **Nunca usar como texto pequeno (<18px) sobre fundo claro** — ratio com `canvas` é 2.75:1, falha AA. Para eyebrows/labels em fundo claro, usar `accent` (Steel Blue, ratio 8.29:1). Também nunca como fundo de bloco grande (vira tom "vendedor", oposto ao registro institucional).
  - **`bone` (#FAFAF7)** — *surface light*: terceira camada de profundidade quando `canvas` e `paper` não bastam (ex.: card destacado dentro de Indicadores; modal sobre canvas). Usar com parcimônia — as duas camadas paper+canvas já cobrem 95% dos casos.
  - **TODO — alinhamento de nomenclatura com brand book:** o manual em `Insumos/SVG/10-cor-tipografia.svg` usa `paper`=#F5F3EE e `paper-2`=#E8E4DA, enquanto nossa config Tailwind usa `canvas`=#F5F3EE e `paper`=#E8E4DA — **trocados**. Mexer cascata por toda a base de componentes (~30 arquivos, regressão visual provável). Reservado para uma fase dedicada de "naming alignment" com checkpoint visual obrigatório.
- Tipografia: classes utilitárias font-serif, font-sans, font-mono.
- Não adicionar dependências sem justificar a escolha.
- Commits em português, formato: "tipo: descrição curta" (ex: "feat: hero section").
- **Validação obrigatória antes de cada commit:** rodar `pnpm typecheck && pnpm lint && pnpm build` antes de `git commit`, sem exceção — inclui commits de scripts e infra. Pular qualquer um é fonte conhecida de débito que vaza para commits posteriores (incidente da Fase 5: lint não rodou em commits de geração de assets em `scripts/`, erros surgiram em commit subsequente).
- **Estrutura visual de duas camadas (PRD §4.3 + ADR-002):** seção clara nunca renderiza direto sobre `paper`. Toda seção clara (Header, MetaLine, Hero, Capabilities) vive **dentro** do painel `canvas` (1100px max, com borda 1px solid `rule`). Methodology também fica dentro do painel mas com fundo `ink` edge-to-edge. Footer é a única exceção: fica fora do painel, sobre `paper`. Cantos do painel são retos (sem `rounded-*`) e sem `shadow-*`.
- **Sitemap:** gerado manualmente em `public/sitemap.xml`. Quando o site tiver 5+ rotas, considerar `src/pages/sitemap.xml.ts` dinâmico (com data do build e listagem de routes via `import.meta.glob`). `@astrojs/sitemap` foi avaliado e descartado em 2026-05-06: 3.7.2 incompatível com Astro 4 (mesmo padrão do `@astrojs/react@5`), e a alternativa manual cobre 100% do caso atual sem dependência.

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

### ADR-003 — Densidade visual sem fotos: SVG inline + tipografia + CSS

**Status:** aceito (correção pré-Fase 5, 2026-05-06).

**Contexto.** Após a correção da estrutura de duas camadas (ADR-002), o site estava estruturalmente correto mas visualmente esparso comparado a referências B2B premium (ASML, IBM, Siemens). Restrições do projeto: sem fotos próprias disponíveis, sem stock photos genéricas (descaracterizam a marca técnica), sem libs de runtime adicionais.

**Decisão.** Adicionar densidade via 9 elementos planejados, todos atendendo `prefers-reduced-motion` e mantendo bundle JS shipado < 30 kB gzipped. Após avaliação visual, **8 elementos foram aceitos integralmente e 1 foi revertido**:

1. ✅ Backdrop SVG no Hero (6 nodes conectados, fade-in estático opacity 0→0.15 em 1s).
2. ✅ Seção Stack (10 tecnologias em prosa serif 24px com bullets).
3. ✅ Seção Indicadores (4 métricas serif 96px com placeholders TODO).
4. ✅ Seção Casos (3 cards verticais com placeholders TODO).
5. ✅ Ruler ticks no painel (hairlines decorativas + numeração mono 8px, 60 ticks até 6000px).
6. ✅ Microinterações (nav underline scaleX, CTA scale 1.02, capability hover number).
7. ✅ Paper grain (SVG fractalNoise ~5% inline no body, fora do painel).
8. ✅ Craft tipográfico (kerning negativo display, text-wrap balance, tabular-nums).
9. ❌ SectionRule §NN tipográfico entre seções — **revertido após avaliação visual**.

**Decisões dentro da decisão.**

- **Backdrop estático e não animado progressivamente.** O usuário inicialmente sugeriu linhas se desenhando 1.2s easeOut, mas converteu para fade-in estático após argumentação: contenção institucional > gesto de portfólio criativo. Referências (ASML, IBM, Siemens) são sóbrias; animação dinâmica de linhas seria estética de portfólio criativo, não de consultoria institucional. Headline de 76px é o ponto focal e não pode ser disputado.
- **SectionRule §NN — aceito condicionalmente, revertido após avaliação visual.** A solução criava um sistema de divisores indexados estilo spec-sheet (§02..§06) entre cada seção. A comparação visual em screenshots confirmou a hipótese de duplicação que motivou a cláusula condicional: cada transição mostrava três marcações idênticas em ~120px verticais (`§ NN` no SectionRule + `NN · NOME` no SectionLabel esquerda + `NN / NOME` no counterpart direita). Reversão executada antes deste ADR (commit isolado): restaurado `border-b` plano em Hero, Stack e Indicadores; componente `SectionRule.astro` deletado. **Aprendizado**: ideia válida em isolamento (sistema de numeração contínuo) falha quando colide com sistemas adjacentes que já carregam a mesma informação. Para projetos futuros: se SectionLabel tem numeração visível, SectionRule precisa adotar OUTRO eixo (ex.: nome de seção em vez de número, ou rule sem etiqueta).
- **Casos com placeholders.** Conteúdo é fabricado para ocupar espaço editorial; cada cartão carrega comentário `TODO: substituir por casos reais`. Mesma regra que Stats e Indicadores. Antes do go-live (Fase 5+), os 3 casos precisam aprovação dos clientes citados (ou substituição por casos genéricos validados pelo marketing).

**Consequências.**
- Bundle medido após implementação: **5.25 kB JS gz** (inalterado de antes da fase — nenhum dos commits adicionou JS) e **~5.4 kB CSS gz**. Critério interno <30 kB JS mantido com folga de ~25 kB.
- 5 componentes novos sobreviveram (HeroBackdrop, Stack, Indicators, Cases, PanelRuler). SectionRule criado e deletado na mesma fase.
- Renumeração de seções: Methodology passa de 03 para 05 com a inserção de Stack (03) e Indicadores (04).
- PRD §6 não é fonte canônica para Stack/Indicadores/Casos — são adições editoriais aprovadas em sessão e justificadas aqui. Caso o PRD seja atualizado, mover esta nota para §6.

**Quando reverter.**
- Se Lighthouse mobile cair abaixo das metas (≥95) por causa de qualquer um dos 8 elementos sobreviventes, isolar e remover. Ruler ticks é o primeiro candidato por ser puramente decorativo.
- Se o paper grain causar issues de print/screen reader (não deveria — é background-image), desativar via `@media print { body { background-image: none; } }`.
- Se o backdrop SVG do Hero atrapalhar contraste de leitura em algum tema futuro (ex.: alto contraste forçado), reduzir opacity ou desativar.