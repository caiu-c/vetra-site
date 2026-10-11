# Identidade visual — proposta

**Status: aprovada e aplicada em 11/10/2026** (rodada 1 de correções da auditoria): `line-input` = `muted` (#586178), um raio por componente, cabeçalho sólido, números em pt-BR. Seguem pendentes os atributos da marca e a sessão de fotos (fim do arquivo). Gerada pela auditoria de 11/10/2026 ([relatório](relatorio-2026-10-11.md), Anexo A).

**Ponto de partida:** a Vetra não tem manual de marca, mas o site já tem um sistema visual definido, registrado nos ADR-004 a ADR-008 do `CLAUDE.md` e nos tokens do `tailwind.config.mjs`. Ele já funciona: uma família, paleta contida e contraste alto. Esta proposta **formaliza o que existe** como manual e acrescenta só o que os achados pedem:
- direção de fotografia (A5);
- token de borda de campo (A15);
- regra de números em pt-BR (A18);
- um único raio por tipo de componente.

Nada aqui muda a cara do site.

## Atributos

**Técnico · sóbrio · direto.**
- *Técnico:* a marca vende engenharia, não "inovação". Daí a Archivo levemente expandida (placa de engenharia), os diagramas como imagem e a ausência de efeitos decorativos.
- *Sóbrio:* um único acento (Cobalto) sobre azul-marinho e branco. No benchmark, os concorrentes usam tons genéricos de "IA" (gradientes, caixa alta, setas); a contenção é o que diferencia.
- *Direto:* frases curtas, sem adjetivos de autoelogio, CTA com rótulo que diz o que acontece.

A decidir com o dono: se "próximo" ou "acessível" deve entrar como quarto atributo, quando o fundador aparecer no site (A5). Isso afetaria o tom do texto, não a paleta.

## Tipografia

- **Família única:** Archivo Variable (eixos de peso e largura), em WOFF2 hospedada no próprio domínio, subset latin.
- **Títulos:** `font-stretch: 112%`, peso 600 (semibold) e espaçamento negativo.
- **Pesos em uso:** 400 (texto), 500 (rótulos, botões) e 600 (títulos). Três no total.

| Token | Tamanho | Altura de linha | Uso |
|---|---|---|---|
| `meta` | 14 px | 1,45 | Rótulos, texto de apoio, metadados |
| `body` | 16 px | 1,6 | Corpo de texto |
| `lead` | 18 px | 1,55 | Subtítulos de seção e do topo |
| `h4` | 21 px | 1,3 | Títulos de card |
| `h3` | 24 px | 1,25 | Subtítulos |
| `h2` | 30–48 px (fluido) | 1,08 | Título de seção |
| `cta` | 36–60 px | 1,02 | Título do bloco de contato |
| `display` | 44–72 px | 1,0 | H1 do topo (máximo 72 px) |
| `stat` | 36–48 px | 1,0 | Números de destaque |
| `metric` | 56–96 px | 0,95 | Exceção: só a métrica de cada caso real |

**Regras:**
- Largura de texto até 36rem (~66 caracteres).
- Alinhamento à esquerda.
- Sem caixa alta em rótulos e sem fonte mono.
- **Números em pt-BR:** vírgula decimal e ponto de milhar ("99,97%", "1.200"), sempre por `toLocaleString('pt-BR')` (A18).

## Cores

| Token | Hex | Uso |
|---|---|---|
| `canvas` (Papel) | #FFFFFF | Fundo principal |
| `surface` (Névoa) | #F2F4F8 | Fundo alternado de seção |
| `ink` (Tinta) | #0C1838 | Texto principal; faixa escura |
| `brand` (Cobalto) | #1640D6 | Único acento: links, foco, uma faixa por página |
| `muted` (Aço) | #586178 | Texto secundário |
| `subtle` | #8A93A6 | Só decorativo ou texto ≥ 24 px |
| `line` | #DCE1EA | Divisórias decorativas |
| `line-strong` | #C5CCD8 | Bordas de cards e botões secundários (não de campos) |
| **`line-input`** (novo) | #8A93A6 ou #586178 | **Borda de campo de formulário** (A15) |
| `on-deep-muted` | #A9B6DA | Texto secundário sobre Tinta |
| `on-brand-muted` | #DCE3FC | Texto secundário sobre Cobalto |
| `brand-light` | #6A8CF7 | Série de gráfico e detalhes sobre Tinta |
| `chart-context` | #6B7699 | Série de contexto em gráfico sobre Tinta |
| `danger` | #B42318 | Erro de formulário |

**Pares de contraste aprovados** (luminância relativa WCAG, calculada em 11/10/2026):

| Texto / elemento | Fundo | Razão | Uso permitido |
|---|---|---|---|
| ink | canvas | 17,45:1 | Qualquer texto |
| ink | surface | 15,85:1 | Qualquer texto |
| muted | canvas | 6,18:1 | Qualquer texto |
| muted | surface | 5,62:1 | Qualquer texto |
| brand | canvas | 7,67:1 | Links e texto |
| white | brand | 7,67:1 | Qualquer texto |
| on-brand-muted | brand | 6,00:1 | Qualquer texto |
| white | ink | 17,45:1 | Qualquer texto |
| on-deep-muted | ink | 8,63:1 | Qualquer texto |
| brand-light | ink | 5,57:1 | Texto e marcas de gráfico |
| danger | canvas | 6,57:1 | Mensagens de erro |
| subtle | canvas | 3,09:1 | **Só** texto ≥ 24 px ou decorativo; borda de campo (≥ 3:1) |
| line-strong | canvas | 1,62:1 | **Só** decorativo; **não** como único limite de campo |
| brand | ink | 2,28:1 | **Proibido** para texto ou ícone |

**Decisão pendente:** para `line-input`, `subtle` (#8A93A6, 3,09:1, mais leve, no limite) ou `muted` (#586178, 6,18:1, mais seguro). Recomendação: `muted`.

## Espaço, grade e forma

- **Espaçamento:** escala do Tailwind em múltiplos de 4 px (4, 8, 12, 16, 24, 32, 40, 64, 96…).
- **Container:** `.wrap`, até 1600 px, com margem lateral de 24 / 40 / 64 px (celular / tablet / desktop). Fundo de cada seção de ponta a ponta.
- **Ritmo por blocos de cor:** Papel → Tinta → Papel → Névoa…, com no máximo uma faixa Cobalto por página.
- **Raios:** hoje há 8 valores em uso (`full`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `20px`). Proposta, um por tipo de componente:

| Componente | Raio |
|---|---|
| Botão | `full` (pílula) |
| Card e cartão do formulário | 20 px |
| Campo de formulário | 12 px (`xl`) |
| Cabeçalho fixo | 16 px (`2xl`) |
| Elementos internos de diagrama | 8 px (`lg`) |

- **Sombra:** nenhuma. Elevação por borda e contraste de fundo.

## Componentes base

- **Botão primário:** pílula de 48 px de altura, Tinta → hover Cobalto, texto branco. Variante inversa em fundos escuros. **Um** primário por seção, sempre "Agendar diagnóstico" (ou o rótulo que vier da oferta de entrada, A6).
- **Botão secundário:** pílula com borda `line-strong`, texto Tinta.
- **Foco:** contorno de 2 px Cobalto com afastamento de 2 px. Em fundo escuro, anel branco.
- **Campo de formulário:** rótulo visível acima, borda `line-input`, foco com anel Cobalto a 25%, erro com borda `danger` e mensagem em texto.
- **Card:** fundo Papel, borda `line`, raio 20 px, sem sombra.
- **Cabeçalho de seção:** título `h2` expandido + descrição opcional (`SectionHeader.astro`).
- **Cabeçalho fixo:** barra Tinta **sólida** (A19), raio 16 px, afastada 12–16 px das bordas.

## Direção de imagem

Atualizada em 11/10/2026 (ADR-010): toda seção grande tem uma peça visual. Ordem de preferência:

1. **Retrato do fundador (prioridade, A5).**
   - Fundo neutro claro (próximo à Névoa #F2F4F8) ou ambiente de trabalho real desfocado.
   - Luz natural lateral, olhar para a câmera, roupa sem estampa.
   - Enquadramento do peito para cima.
   - Quando existir, substitui qualquer foto de banco nos lugares de "quem somos".
2. **Telas do que entregamos** (`src/components/mockups/`):
   - carga de dados, painel, agente de IA com aprovação humana, automação, mapa do diagnóstico;
   - nos tokens da marca, com dados fictícios e a legenda "Exemplo ilustrativo, com dados fictícios.";
   - gráficos no padrão da skill dataviz.
3. **Fotos de banco gratuito do mundo do cliente** (Pexels, origem em `src/assets/photos/CREDITOS.md`):
   - temas: armazém, fábrica, varejo, reunião, a cidade-base;
   - pessoas trabalhando em ambiente real, luz natural, tons frios ou neutros, que combinam com o azul-marinho;
   - em faixa de ponta a ponta, com véu Tinta de 70% para o texto.
4. **Símbolo aperture e lente 3D:** gesto de marca **só no topo** (ADR-007).
5. **Não usar:**
   - clichês de dados (código binário, cérebro brilhante, globo de rede, robô);
   - foto de banco apresentada como equipe ou cliente;
   - logos de clientes sem autorização (logos de **tecnologias**, sim, rotulados como tal).

## Logo

O símbolo aperture (três chevrons convergindo para um ponto) e o logotipo "Vetra Solutions" em Archivo expandida já existem e funcionam em 26 px de altura no cabeçalho. Recomendação: mantê-los. Quando a marca crescer, contratar um designer para um manual completo (versões, área de proteção, usos proibidos).

## Tokens CSS (equivalente aos tokens do Tailwind)

```css
:root {
  --cor-fundo: #FFFFFF;        /* canvas */
  --cor-fundo-alt: #F2F4F8;    /* surface */
  --cor-texto: #0C1838;        /* ink */
  --cor-texto-2: #586178;      /* muted */
  --cor-acao: #0C1838;         /* botão primário; hover → --cor-primaria */
  --cor-primaria: #1640D6;     /* brand */
  --cor-borda: #DCE1EA;        /* line */
  --cor-borda-forte: #C5CCD8;  /* line-strong */
  --cor-borda-campo: #586178;  /* line-input (novo, A15) */
  --cor-erro: #B42318;         /* danger */
  --fonte-texto: "Archivo Variable", system-ui, sans-serif;
  --fonte-titulo: "Archivo Variable", system-ui, sans-serif; /* font-stretch: 112% */
  --texto-base: 1rem;          /* 16px, altura de linha 1.6 */
  --esp-1: 4px; --esp-2: 8px; --esp-3: 12px; --esp-4: 16px;
  --esp-6: 24px; --esp-8: 32px; --esp-10: 40px; --esp-16: 64px; --esp-24: 96px;
  --raio-botao: 9999px; --raio-card: 20px; --raio-campo: 12px; --raio-barra: 16px;
  --sombra: none;
}
```

## Decisões pendentes do dono

1. Confirmar os atributos (técnico, sóbrio, direto) e decidir se "próximo" entra quando o fundador aparecer.
2. ~~Escolher o tom de `line-input`~~ — aplicado `muted` em 11/10/2026.
3. ~~Aprovar a redução para um raio por componente~~ — aplicado em 11/10/2026.
4. Agendar a sessão de fotos do retrato (o bloco "Quem conduz" já está pronto em `Founder.astro`, oculto até `FOUNDER` ser preenchido).
