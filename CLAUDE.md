# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Vetra Solutions Site

Este projeto segue o PRD em `.llm/prd.MD`. Planos de fase em `docs/superpowers/plans/`.
Sempre consulte o PRD antes de tomar decisões de implementação — **exceto em identidade visual**: desde o redesign de 2026-10 (ADR-004 a ADR-006), o visual segue este arquivo, não o PRD §4, o brand book (`Insumos/SVG/10-cor-tipografia.svg`) nem o mockup `Insumos/SVG/14-mockup-site.svg`.

## Stack
- Astro 4.x (site estático, uma rota) + TypeScript strict
- Tailwind CSS 3.x (`applyBaseStyles: false` — estilos base vivem em `src/styles/global.css`)
- React instalado mas **não usado em runtime** (ver ADR-001); usar só se surgir ilha realmente interativa
- pnpm como package manager
- Manter-se em Astro 4: integrações de versões mais novas (`@astrojs/react@5`, `@astrojs/sitemap@3.7`) são incompatíveis

## Arquitetura
- Rotas em `src/pages/`: `index.astro` (home; só compõe as seções em ordem, cada seção é um componente em `src/components/`), `servicos/[slug].astro` (uma página por serviço, gerada de `src/data/services.ts`), `privacidade.astro`, `404.astro` (o Cloudflare Pages a serve com status 404) e `sitemap.xml.ts`.
- `src/layouts/BaseLayout.astro` concentra `<head>` (meta, `canonical`, OG/Twitter, JSON-LD `Organization`, preload da fonte), import da fonte Archivo, `Cursor` e o único `<script>` client-side (`src/scripts/main.ts`). Props: `title`, `description`, `noindex` (404) e `contactOnPage` (`false` em páginas sem o formulário: os CTAs do cabeçalho e do rodapé levam ao da home). Não há preloader (ADR-009) nem moldura: cada seção desenha a sua.
- JS client-side: `src/scripts/main.ts` orquestra os módulos de `src/scripts/motion/` (GSAP + ScrollTrigger + SplitText sobre scroll nativo, ver ADR-008). Hooks por atributo: `data-split` (título revelado linha a linha), `data-magnetic`, `data-cursor="view|drag|default"` + `data-cursor-label`, `data-marquee`, `data-carousel` (+ `-viewport`/`-track`/`-prev`/`-next`/`-status`, em `motion/carousel.ts`), `data-count`, `data-subject` (CTA que pré-seleciona o assunto do formulário). A entrada do hero é só CSS (`.hero-word`/`.hero-fade` em `global.css`, palavras divididas no build em `Hero.astro`), para pintar no primeiro quadro. A lente 3D do hero fica em `src/scripts/three/` (`lens.ts` + `aperture-geometry.ts`), carregada por `import()` dinâmico só com tela ≥ 768px e ponteiro fino. Fora de `motion/`: `src/scripts/charts.ts` (gráficos dos casos como `role="slider"`) e `src/scripts/contact-form.ts` (envio do formulário). Para animar algo novo, usar um desses atributos em vez de JS novo. Com `prefers-reduced-motion`, sem JS ou se o script falhar, tudo aparece estático (failsafes em `global.css`).
- Dados institucionais (SITE, CONTACT com `whatsapp`, ADDRESS, NAV, BOOKING_URL/HOME_CONTACT_URL, CONTACT_FORM, CONTACT_SUBJECTS, FOUNDER) ficam em `src/config/site.ts` — fonte única usada por layout, header, footer, formulário e JSON-LD. Campos vazios escondem o que dependem deles: sem `CONTACT.whatsapp` não há link de WhatsApp; sem `FOUNDER.name` a home mostra o manifesto no lugar do bloco "Quem conduz" (`Founder.astro`). Os serviços (cards da home e páginas) ficam em `src/data/services.ts`; os casos de clientes (texto + dados do gráfico) em `src/data/cases.ts`.
- Fonte do site: Archivo Variable (`@fontsource-variable/archivo/wdth.css`, eixos de peso e largura), empacotada pelo Vite. `public/og-image.png`, `favicon.ico` e `apple-touch-icon.png` são gerados por scripts (ver Comandos), não editados à mão.
- Import alias `@/*` → `src/*`.

## Convenções
- Componentes Astro têm extensão .astro; React só quando há interatividade.
- Cores: usar os tokens do `tailwind.config.mjs` — `canvas` (Papel #FFF), `surface` (Névoa #F2F4F8), `ink` (Tinta #0C1838: texto e faixa escura), `brand` (Cobalto #1640D6: único acento), `muted` (Aço #586178: texto secundário), `line`/`line-strong` (bordas decorativas; nunca como único limite de um campo), `line-input` (borda de campo, 6,2:1), `subtle` (#8A93A6: só decorativo ou texto ≥24px, falha AA em texto pequeno); na faixa escura, `line-deep` e `on-deep-muted`. Pares de contraste aprovados em `auditoria-ux/identidade-proposta.md`.
- Tipografia: só Archivo. Títulos com `.font-expanded` (`font-stretch: 112%`) + `font-semibold` + `tracking-display`/`tracking-heading`. Tamanhos pela escala de Bringhurst (12 · 14 · 16 · 18 · 21 · 24 · 36 · 48 · 60 · 72) via utilitários `text-meta`, `text-body`, `text-lead`, `text-h4`, `text-h3`, `text-h2`, `text-cta`, `text-display`, `text-stat`. Nada acima de 72px.
- **Regras da revisão frontend-design (ADR-005), não reintroduzir:** eyebrow em caixa alta acima de título, fonte mono para labels, "·" ou "—" como separador de metadados, "→" em botões, frase do título em outra cor, numeração em conteúdo que não é sequência (só as fases de `Phases.astro` e as etapas do pipeline são numeradas), gradiente/sombra como decoração, fade-up genérico em parágrafos e cards. Alinhamento à esquerda em toda a página.
- **Layout de ponta a ponta (ADR-006):** toda seção é `<section class="bg-…">` com fundo de borda a borda e o conteúdo dentro de `<div class="wrap">` (container de 1600px com padding lateral, sem bordas). Não há moldura, linhas verticais nem cruzes. O ritmo vem da alternância de fundos — Papel, Névoa, Tinta e uma única faixa Cobalto (Indicadores); a ordem da home está no ADR-009. Ao criar uma seção, escolher o fundo para manter a alternância.
- **Header fixo flutuante:** `Header.astro` é `fixed` (barra Tinta sólida e arredondada, afastada das bordas). A área que ele ocupa (88px) precisa bater em dois lugares: `scroll-padding-top` (`global.css`) e o padding-top do hero. Sem transparência nem `backdrop-blur` (ADR-008/009).
- **CTAs:** a ação principal se chama sempre "Agendar diagnóstico gratuito" (oferta: conversa de 30 min por vídeo, gratuita, mapa por escrito em até 5 dias úteis; resposta ao contato em até 1 dia útil) e leva ao formulário (`BOOKING_URL = '#contato'` até existir um link de agendamento); use `data-subject` para pré-selecionar o assunto. O diagnóstico é explicado só em `Diagnosis.astro`; as outras seções apenas o referenciam. Cada seção pode ter um CTA contextual (ex.: "Falar sobre meu projeto" nos casos).
- **Links entre páginas:** itens de menu e links para seções da home usam href absoluto (`/#diagnostico`), para funcionar em qualquer rota. Ao criar uma página, acrescentá-la ao `sitemap.xml.ts`.
- **Raios:** botão `rounded-full`; card e cartão do formulário `rounded-[20px]`; campo `rounded-xl`; cabeçalho `rounded-2xl`; elementos internos de diagrama `rounded-lg`. Sem sombra.
- **Números:** sempre em pt-BR (vírgula decimal, ponto de milhar), via `toLocaleString('pt-BR')`.
- **Imagens:** sem banco de imagens. Preferência: retrato real do fundador → trabalho real → artefatos do serviço (diagramas, gráficos) → símbolo aperture. Direção completa em `auditoria-ux/identidade-proposta.md`.
- Componentes de UI em `global.css` (`@layer components`): `.wrap`, `.btn-primary`, `.btn-secondary`, `.btn-inverse` e `.btn-outline-inverse` (fundos Tinta), `.btn-sm`, `.font-expanded`, `.field-label`/`.field-input` (formulário). Cabeçalho de seção padrão: `SectionHeader.astro` (título com `data-split` + descrição opcional; `variant` light/deep/brand conforme o fundo).
- Gráficos dos casos (`CaseChart.astro`): seguir a skill `dataviz` (carregar antes de mexer). A série usa `brand-light` e o contexto `chart-context`, ambos validados com o script da skill contra o fundo Tinta; qualquer cor nova de gráfico precisa passar pelo validador.
- Conteúdo placeholder (casos e seus gráficos, indicadores, setores, textos de serviço e das páginas de serviço, política de privacidade, FAQ, CNPJ/endereço/telefone, chave do Web3Forms) está marcado com `TODO`. Por decisão do dono (2026-10-11), casos, indicadores, setores e dados da empresa seguem no ar até ele preencher os oficiais; o FAQ fica fora da home até ter respostas.
- Não adicionar dependências sem justificar a escolha.
- Commits em português, formato: "tipo: descrição curta" (ex: "feat: hero section").
- **Validação obrigatória antes de cada commit:** rodar `pnpm typecheck && pnpm lint && pnpm build` antes de `git commit`, sem exceção — inclui commits de scripts e infra. Pular qualquer um é fonte conhecida de débito que vaza para commits posteriores (incidente da Fase 5: lint não rodou em commits de geração de assets em `scripts/`, erros surgiram em commit subsequente).
- **Sitemap:** gerado no build por `src/pages/sitemap.xml.ts` (home, serviços a partir de `services.ts` e privacidade; a 404 fica de fora). Ao criar uma página, acrescentá-la à lista `ROUTES`. `@astrojs/sitemap` foi avaliado e descartado em 2026-05-06: 3.7.2 incompatível com Astro 4 (mesmo padrão do `@astrojs/react@5`).

## Comandos
- `pnpm dev` — ambiente local (porta 4321)
- `pnpm build` — build de produção em `dist/`
- `pnpm preview` — testar build localmente
- `pnpm typecheck` — `astro check && tsc --noEmit`
- `pnpm lint` — ESLint (inclui `.astro` e `scripts/`)
- `pnpm format` / `pnpm format:check` — Prettier (com plugins astro e tailwind)
- `pnpm gen:og` — regenera `public/og-image.png` (rodar quando título/descrição mudarem)
- `pnpm gen:icons` — regenera `favicon.ico` e `apple-touch-icon.png` a partir de `public/favicon.svg`
- Não há suíte de testes; a validação é typecheck + lint + build (+ checagem visual).

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

**Status:** substituído pelo ADR-004 (2026-10-10). Mantido como histórico.

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

**Status:** parcialmente substituído pelo ADR-004 (2026-10-10). Continua valendo: sem fotos, visuais em SVG inline, placeholders TODO em números e casos. Os elementos visuais específicos (backdrop, ruler, paper grain, serif) foram removidos.

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

### ADR-004 — Redesign: grid Vercel + registro institucional ASML, tema claro

**Status:** aceito (2026-10-10). Substitui ADR-002 e a parte visual do ADR-003.

**Contexto.** O dono do projeto avaliou o site no ar e pediu um visual que misturasse o Vercel e a ASML, descartando explicitamente as definições visuais anteriores (paleta paper/canvas, Instrument Serif, painel com moldura). Escolheu tema claro e substituição completa da identidade, mantendo apenas o símbolo aperture.

**Decisão.**
- Do Vercel: fundo branco, grid de linhas de 1px com cruzes nos cantos, botões pill, diagrama de pipeline (`PipelineDiagram.astro`) com feixes animados em CSS.
- Da ASML: azul institucional (`brand`) como única cor de destaque, faixa full-bleed `brand-deep` na Metodologia, seção de números em destaque (Indicadores, que absorveu os antigos Stats do Hero), bloco editorial "Sobre".
- Nova seção `CallToAction` (`#contato`) no fim da página.

**Consequências.**
- JS inalterado (~5.3 kB gz; só Lenis + reveal + menu). Fontes carregam só o subset latin via `unicode-range`.
- `scripts/generate-og.mjs` converte todo texto em paths via `fontkit` (`getVariation({ wght, wdth })`), porque o resvg ignora peso/largura em fonte variável. Tipografia e cores foram depois substituídas pelo ADR-005.
- `Insumos/SVG/` (brand book e mockup) deixou de ser referência visual.

### ADR-005 — Motion com GSAP e revisão pela skill frontend-design

**Status:** aceito (2026-10-11). Ajusta o ADR-004 (tipografia e cor) e o orçamento de bundle do ADR-001.

**Contexto.** O dono pediu padrão Awwwards (preloader, texto revelado por linha, cursor customizado, marquee, scroll horizontal, depois uma lente 3D em Three.js). Ao ver o resultado, achou as fontes grandes demais e pediu para aplicar a skill frontend-design. A skill apontou o cromo de template (eyebrows em caixa alta, mono em labels, separadores "·", setas em botões, frase do título colorida) e a fonte padrão (Geist).

**Decisão.**
- Motion em GSAP 3.13+ (ScrollTrigger e SplitText, gratuitos inclusive para uso comercial), sem React. O Lenis era dirigido pelo `gsap.ticker` (removido no ADR-008). Fallbacks: reduced motion, sem JS e failsafes por animação CSS.
- Archivo com eixo de largura no lugar da Geist: títulos levemente expandidos (placa de engenharia), uma família só.
- Paleta com tinta azul-marinho (#0C1838) no lugar do quase-preto, Cobalto como único acento.
- Escala tipográfica de Bringhurst, com no máximo 72px.
- Seções novas inspiradas nos concorrentes (Indicium, A3Data, BIX): Setores, Como funciona o diagnóstico, Perguntas frequentes. Logos e depoimentos só quando houver clientes autorizando.

**Consequências.**
- JS inicial: ~55 kB gz (GSAP + plugins + Lenis), contra ~5 kB antes. A meta passa a ser JS inicial < 60 kB gz; o Three.js (fase seguinte) entra só via `import()` dinâmico.
- `@fontsource-variable/archivo` substitui Geist e Geist Mono; as fontes da identidade antiga (`public/fonts/` e pacotes `@fontsource/*`) foram removidas.

### ADR-006 — Layout de ponta a ponta e ritmo por blocos de cor (referência Genux)

**Status:** aceito (2026-10-11). Substitui o "grid estilo Vercel" do ADR-004 (moldura de 1200px, linhas verticais, cruzes) e o scroll horizontal fixado dos casos do ADR-005.

**Contexto.** O dono mandou a genuxconsult.com.br como referência: transições por blocos de cor, header fixo, um CTA por seção, serviços descritos por resultado e casos em Dor/Solução/Resultado. Ele também reprovou as margens laterais em todo o site, o bloco do diagnóstico ("parece formulário"), a falta de um formulário de contato e a seção de casos.

**Decisão.**
- Fundos de ponta a ponta com conteúdo no `.wrap` (1600px). Ordem: Hero (Papel) → Stack (Tinta) → Capacidades (Papel) → Indicadores (Cobalto) → Setores (Papel) → Metodologia (Tinta) → Diagnóstico (Névoa) → Casos (Tinta) → Sobre (Papel) → FAQ (Névoa) → Contato + Rodapé (Tinta).
- Header fixo flutuante em Tinta.
- Serviços com título de resultado + entregáveis; diagnóstico no formato "sinais + o que você recebe"; CTA "Agendar diagnóstico" consistente, levando ao formulário.
- Casos em carrossel (setas, teclado, arraste; slides inativos `inert`), com métrica de destaque (`text-metric`, exceção documentada à escala) e o gráfico do próprio resultado no lugar de foto.
- Formulário de contato via Web3Forms (grátis até 250 envios/mês, sem servidor; chave pública em `CONTACT_FORM.accessKey`). Sem JS, POST direto; com JS, envio inline com estados de sucesso e erro.
- Não copiamos o cromo da Genux (caixa alta, rótulos amarelos, setas, nomes com ®, fotos de banco); as regras do ADR-005 continuam valendo.

**Consequências.**
- JS inicial ~57 kB gz (carrossel e formulário substituem o pin do ScrollTrigger), dentro da meta de 60 kB.
- Removidos `.frame`, `.frame-deep`, `.corners`, `motion/horizontal.ts` e `CallToAction.astro`.
- A lente 3D (fases seguintes) precisa ser replanejada: com seções de fundo opaco, ela só aparece no hero e entre blocos claros.

### ADR-007 — Lente 3D em Three.js só no hero

**Status:** aceito (2026-10-11). Substitui a "cena contínua" planejada e ajusta a meta de bundle do ADR-005.

**Contexto.** O dono pediu Three.js e uma lente 3D (o símbolo aperture em vidro). O plano inicial era um canvas fixo atrás da página inteira, mas desde o ADR-006 quase todas as seções têm fundo opaco de ponta a ponta, que esconderia o canvas.

**Decisão.**
- A lente vive só no hero (`[data-lens-anchor]`), como o único gesto ousado da página. Ao rolar para fora do hero, o grupo gira e as 4 peças se afastam em profundidade, antecipando as "Quatro camadas" das Capacidades.
- Geometria a partir das mesmas coordenadas do `ApertureSymbol.astro` (manter em sincronia): traço com miter extrudado, mais uma esfera para o ponto.
- Vidro com `MeshPhysicalMaterial` (transmissão) sobre `RoomEnvironment`; um disco desenhado em canvas atrás da lente dá o que refratar.
- Three num chunk assíncrono (`import('./three/lens')`), que entra como tarefa do preloader (teto de 2,5s).

**Consequências.**
- JS inicial ~57 kB gz (meta < 60 kB); chunk da lente ~142 kB gz, baixado depois.
- Fallbacks: sem WebGL ou se o import falhar, fica o SVG do hero. Com reduced motion, um quadro estático. O loop pausa com o hero fora da tela ou a aba oculta; no tier baixo, transmissão em meia resolução e menos segmentos.

### ADR-008 — Scroll nativo no lugar do Lenis

**Status:** aceito (2026-10-11). Ajusta o ADR-005.

**Contexto.** Com o site no ar, o dono notou o scroll travado, "como se tivesse poucos fps", no Safari de um MacBook Pro (tela de 120 Hz). O Lenis calcula cada quadro do scroll em JS, e o Safari limita o `requestAnimationFrame` a 60 fps, enquanto o scroll nativo roda a 120. Além disso, o Lenis dividia o `gsap.ticker` com a renderização da lente 3D, então um quadro pesado da lente atrasava o scroll. Dois efeitos agravavam o problema: `backdrop-blur` no header fixo e `mix-blend-mode` numa camada de cursor do tamanho da tela.

**Decisão.**
- Scroll nativo. O que o Lenis fazia passou para:
  - rolagem suave das âncoras: `scroll-behavior: smooth` (só sem reduced motion);
  - desconto do header nas âncoras: `scroll-padding-top`;
  - trava durante o preloader: classe `.scroll-locked` no `<html>` (removida junto com o preloader no ADR-009).
- Header sem `backdrop-blur`: com o fundo a 95%, o blur não aparecia.
- Cursor com `mix-blend-mode` no ponto e no anel, e não numa camada `fixed; inset: 0`.
- Lente com DPR máximo de 1,5 e `transmissionResolutionScale` 0,75 no tier alto.

**Consequências.**
- O scroll roda no compositor, sem depender da thread principal, e o JS inicial perde o Lenis (~5 kB gz).
- Some a inércia extra do Lenis; o trackpad e o mouse mantêm a inércia nativa do sistema.
- **Não reintroduzir smooth scroll em JS** (Lenis, Locomotive etc.) nem `backdrop-filter`/`mix-blend-mode` em elementos fixos grandes sem medir no Safari com tela de 120 Hz.

### ADR-009 — Ajustes da auditoria UX de 2026-10-11

**Status:** aceito (2026-10-11). Ajusta o ADR-005 (preloader e intro do hero), o ADR-006 (ordem das seções) e o ADR-007 (onde a lente carrega).

**Contexto.** A auditoria (`auditoria-ux/relatorio-2026-10-11.md`, skill `auditoria-ux-site-institucional`) mediu o site em produção.
- **Celular (laboratório):** nota 39 e LCP de 5,8 s, dos quais 4,4 s de atraso de renderização. O título e os botões esperavam o preloader e a intro em JS, e o Three.js consumia 7 s de CPU.
- **Proposta:** o topo não dizia o que a Vetra é, para quem trabalha nem onde fica.
- **Repetição:** o diagnóstico era explicado em 4 seções, sem formato nem custo.
- **Estrutura:** o site tinha uma página só.

O dono aprovou aplicar tudo, menos A1 a A3 (contato, prova e dados da empresa), que ele preenche depois.

**Decisão.**
- **Sem preloader.** O hero pinta no primeiro quadro, e a entrada do título é só CSS: palavras divididas no build, subida mascarada e fade de opacidade no subtítulo e nos botões, sem `visibility: hidden`. A fonte do texto tem `preload`.
- **Lente 3D só com tela ≥ 768px e ponteiro fino.** No celular fica o SVG estático, com opacidade 0,12 atrás do texto, e o Three.js não é baixado.
- **Ordem da home:**

  | # | Seção | Fundo |
  |---|---|---|
  | 1 | Hero | Papel |
  | 2 | Diagnóstico | Névoa |
  | 3 | Serviços | Papel |
  | 4 | Stack | Tinta |
  | 5 | Indicadores | Cobalto |
  | 6 | Setores | Papel |
  | 7 | Casos | Tinta |
  | 8 | Sobre/Quem conduz | Papel |
  | 9 | Contato + Rodapé | Tinta |

  - A Metodologia foi incorporada ao Diagnóstico (`Phases.astro`).
  - O FAQ saiu até ter respostas.
- **Oferta de entrada:** diagnóstico gratuito de 30 min por vídeo, com mapa por escrito em até 5 dias úteis e resposta ao contato em até 1 dia útil. O CTA virou "Agendar diagnóstico gratuito".
- **Várias rotas:**
  - uma página por serviço (`servicos/[slug]`, de `src/data/services.ts`);
  - `privacidade` (rascunho para validação jurídica);
  - `404` real;
  - sitemap gerado no build;
  - `canonical` em todas as páginas;
  - HSTS no `_headers`.
- **Pronto, mas oculto até haver dados:** WhatsApp (`CONTACT.whatsapp`) e bloco "Quem conduz" (`FOUNDER`).

**Consequências.**
- **Lighthouse local (laboratório):** celular de 39 para 99 (LCP 1,7 s, TBT 80 ms, CLS 0); desktop 100; acessibilidade 100.
- **JS inicial:** ~52 kB gz.
- **Comprimento da home:** caiu no desktop (8.955 → 8.198 px), mas não no celular (~12.600 px). Indicadores, Setores e Casos ficaram no ar, e o diagnóstico ganhou oferta e fases. O próximo corte é rever o diagrama do pipeline e a faixa Stack no celular.
- **Rodada seguinte da auditoria:** rodar o coletor contra o preview e comparar com `auditoria-ux/coletas/`.
