# Auditoria UI/UX e SEO — Vetra Solutions
https://vetrasolutions.com.br · Coleta em 11/10/2026 · Escopo: site inteiro (a home é a única página) · Dispositivos: desktop 1440 px, celular 390 px

## 1. Resumo executivo

O site precisa fazer um decisor de empresa entender, em segundos, que a Vetra é uma consultoria de engenharia de dados em Fortaleza. Depois, precisa fazer esse decisor confiar o bastante para pedir um diagnóstico.

Hoje o site tem um sistema visual coerente e bem construído: uma família tipográfica, paleta contida, boa legibilidade e acessibilidade acima da média. Mas três coisas estão no ar e impedem o objetivo.

**Os 3 problemas mais graves**
1. **O contato não funciona.** O formulário está publicado com a chave `TODO`. O endereço `contato@vetrasolutions.com.br` não recebe e-mail, porque o domínio não tem registro MX. Os dois caminhos da ação principal estão quebrados (A1).
2. **Há prova fabricada publicada.** Os números (47 projetos, 12 TB/mês, 99,97% de uptime), os três "Casos de clientes" e os setores atendidos são de exemplo, mas a empresa ainda não tem clientes (A2).
3. **A identificação da empresa é falsa ou incompleta.** O CNPJ no rodapé é `00.000.000/0001-00`. Os dados estruturados lidos pelo Google têm `"telephone":"TODO"` e `"streetAddress":"TODO"` (A3).

**Os 3 ganhos rápidos**
1. Ativar o Email Routing e a chave do Web3Forms. São tarefas do dono, de cerca de 15 minutos, e destravam a ação principal.
2. Ocultar Indicadores, Casos, Setores e FAQ até haver conteúdo real. É uma mudança só de composição da página (`index.astro`), reversível.
3. Mostrar o texto e o botão do topo sem esperar o preloader e não carregar a lente 3D no celular. No teste de laboratório para celular, o conteúdo principal levou 5,8 s para aparecer, dos quais 4,4 s esperando o JavaScript (A7).

**Veredito sobre as suas hipóteses:** as três se confirmam, com nuances (seção 2). O "algo" que falta é **uma pessoa e uma oferta concreta**: nada no site diz quem está por trás da Vetra, e o diagnóstico não diz quanto dura, quanto custa nem o que acontece depois do contato (seção 3).

## 2. Suas hipóteses

| Hipótese do dono | Veredito | Evidência |
|---|---|---|
| O site não tem nenhuma foto | **Confirmada, com ressalva** | Inventário: `imagens.total = 0` no desktop e no celular. O site tem bons artefatos visuais (lente 3D, diagrama do pipeline, gráficos dos casos), que são o tipo certo de imagem para serviço técnico. O que falta não é "imagem", é **rosto**: nenhuma pessoa aparece no site (A5). |
| Há muita coisa para ler | **Parcial** | O volume de texto é moderado: ~5.650 caracteres visíveis (~1.030 palavras), corpo de 16 px com altura de linha 1,5 e parágrafos curtos. O cansaço vem de três outras fontes: **comprimento** (12.592 px no celular, cerca de 15 telas, em 11 seções), **repetição** (o diagnóstico aparece em 4 seções) e **jargão** (ETL/ELT, CDC, camada semântica, guardrails, SLA de freshness, data lake, RPA). Ver A11 e A12. |
| O visitante não entende o propósito | **Confirmada** | O título "A coluna vertebral dos seus dados." é uma metáfora. Não diz que a Vetra é uma consultoria, para quem trabalha nem onde fica; "Fortaleza" só aparece no bloco Sobre e no rodapé. No celular, o subtítulo e o botão ficam ocultos enquanto a animação de entrada não roda: o inventário registrou 0 caracteres visíveis no topo no momento da coleta (A4, A7). |
| "Falta algo" | **Identificado** | Ver seção 3: falta quem está por trás, para quem é, um resultado real e como começar de forma concreta. |

## 3. O que falta

Lente das sete perguntas do visitante:

| # | Pergunta | Situação | O que falta |
|---|---|---|---|
| 1 | É para mim? | **Ausente** | O que falta é nomear o cliente. O site fala de "empresa" e "operação" sem segmento, porte ou cargo; a seção Setores lista Varejo, Indústria e Serviços, que cobrem quase todo mundo. |
| 2 | Resolve meu problema? | Parcial | A lista "Sinais de que é hora de um diagnóstico" é a melhor descrição de problema do site, mas está na 7ª seção. O que falta é trazer esses sinais para perto do topo. |
| 3 | O que eu ganho? | **Fabricado** | Os únicos resultados concretos (14×, −32%, 7 dashboards) são de exemplo. O que falta é um resultado verdadeiro, mesmo pequeno, ou uma promessa de processo verificável ("diagnóstico entregue em X dias úteis"). |
| 4 | Como funciona? | Fraca | Metodologia tem 3 fases com 3 ou 4 palavras cada ("Arquitetura e implantação."). O que falta são prazos, entregáveis por fase e o que o cliente precisa fornecer. |
| 5 | Por que confiar? | **Fabricado** | Hoje a confiança se apoia em números e casos que não existem. Removidos, sobra nada. O que falta é prova de competência: credenciais do fundador, método detalhado, dados da empresa (A2, A5). |
| 6 | Quem está por trás? | **Ausente** | Nenhum nome, foto ou cargo. Uma das perguntas do FAQ é "Quem vai trabalhar no nosso projeto?", e a resposta é "A definir.". O que falta é o fundador, com nome, foto, trajetória e LinkedIn. |
| 7 | Como começo? | Parcial | O botão "Agendar diagnóstico" é consistente (5 ocorrências), mas leva a um formulário que hoje não envia. O diagnóstico não tem duração, formato, preço nem prazo de resposta. O que falta é uma oferta de entrada descrita, como a Data85 e a Maraca Hub fazem (A6). |

**Em uma frase:** o site explica bem *o que* a Vetra constrói, mas não diz *quem* a Vetra é, *para quem* trabalha nem *o que acontece* quando alguém clica no botão.

## 4. Contexto e premissas

- **Organização:** consultoria de engenharia de dados, B2B, sede em Fortaleza-CE, atendimento remoto no Brasil e no exterior. Empresa em início de operação, sem clientes ainda.
- **Ação principal recomendada:** "Agendar diagnóstico". O rótulo atual pode ficar, mas precisa de uma oferta descrita (duração, formato, entregável, custo) e de um destino que funcione: agenda online (Cal.com, já previsto em `BOOKING_URL`) ou o formulário com resposta garantida. Justificativa: serviço B2B consultivo, ticket médio a alto, ciclo longo. Ver `proposta-e-confianca.md` §3.
- **Tarefas do visitante (Premissa):**
  1. entender se a Vetra resolve o problema de dados da empresa dele;
  2. avaliar se pode confiar (quem é, o que já fez);
  3. saber como começar e quanto custa o primeiro passo.
- **Premissa:** o público decisor inclui diretoria e operações, não só TI. Isso afeta o peso do jargão (A11).
- **Correção ao contexto:** o contexto diz que não há ferramenta de medição, mas o site carrega `static.cloudflareinsights.com`, o beacon do Cloudflare Web Analytics. Provavelmente ativado pelo Cloudflare Pages. Isso entra em A16.
- **Coleta:**
  - coletor da skill (Playwright) contra produção, em 11/10/2026 às 15:35 UTC, com Lighthouse local para celular e desktop;
  - leitura do código-fonte (Astro 4, Cloudflare Pages);
  - checagens de DNS e HTTP;
  - 6 concorrentes via WebFetch.
- **Limitações:**
  - **Dados de campo:** o PageSpeed Insights retornou HTTP 429 (cota sem chave esgotada), então não há dados de usuários reais. Um domínio novo dificilmente teria esses dados no CrUX, de qualquer forma.
  - **Laboratório:** o Lighthouse roda o WebGL por software (SwiftShader), o que exagera o custo da lente 3D em relação a um celular real. Os números servem para diagnóstico, não para veredito.
  - **Buscas:** as pesquisas de concorrentes foram feitas por um buscador localizado nos EUA, sem ver a página de resultados do Google Brasil, os AI Overviews nem o pacote de mapa.
  - **LinkedIn:** a URL `linkedin.com/company/vetra-solutions` respondeu 200, mas o LinkedIn devolve 200 também na tela de login. Não confirmei que a página existe.
  - **Teste de envio:** para verificar a falha do formulário sem JavaScript, enviei **uma** requisição de teste ao Web3Forms com a chave `TODO` e um e-mail fictício. Foi recusada (HTTP 403) e nenhuma mensagem foi gerada. Não enviei o formulário do site.

## 5. Quadro de conformidade

| Dimensão | Conforme | Parcial | Não conforme | Não verificado | Situação geral |
|---|---|---|---|---|---|
| 1. Contexto e proposta (CTX) | 1 | 2 | 3 | 0 | Visual coerente; mensagem genérica, sem público nem local. |
| 2. Tipografia (TIP) | 10 | 1 | 0 | 1 | Ponto forte: uma família, escala clara, corpo 16 px/1,5. |
| 3. Layout (LAY) | 5 | 1 | 2 | 0 | Grade e componentes consistentes; conteúdo provisório no ar. |
| 4. Imagens (IMG) | 7 | 1 | 1 | 1 | Sem fotos; artefatos técnicos bons; nenhuma pessoa. |
| 5. Hierarquia (HIE) | 5 | 2 | 0 | 0 | CTA único e consistente; ordem da home repetitiva. |
| 6. Navegação (NAV) | 6 | 2 | 3 | 0 | Formulário bem construído, mas sem envio; soft 404; sem WhatsApp. |
| 7. Conteúdo (CON) | 2 | 3 | 4 | 0 | Prova fabricada, nenhuma pessoa, FAQ sem respostas. |
| 8. Acessibilidade (ACE) | 8 | 2 | 1 | 0 | Acima da média; bordas de campo com 1,62:1. |
| 9. SEO | 14 | 4 | 5 | 3 | Base técnica boa; sem canonical, www duplicado, dados estruturados com "TODO". |
| 10. Performance (PER) | 3 | 0 | 1 | 1 | Desktop 96; celular 39 em laboratório, por causa do preloader e da lente. |
| 11. Conformidade (LEG) | 2 | 1 | 3 | 1 | CNPJ fictício, sem política de privacidade, sem HSTS. |
| 12. Medição (MED) | 0 | 1 | 4 | 2 | Só o beacon do Cloudflare; sem Search Console nem conversão. |

## 6. O que manter

- **Sistema tipográfico.** Uma família (Archivo Variable, em WOFF2 hospedada no domínio), 10 a 11 tamanhos distintos em escala, corpo de 16 px com altura de linha 1,5 e linha máxima de 60 caracteres no desktop. Atende TIP-01 a TIP-06 e TIP-10.
- **Contraste.** 263 a 265 pares de texto verificados, 0 falhas. Tinta sobre Papel 17,45:1, Aço sobre Papel 6,18:1, Cobalto sobre Papel 7,67:1.
- **CTA consistente.** "Agendar diagnóstico" com o mesmo rótulo e estilo em 5 pontos, mais um CTA contextual nos casos ("Falar sobre meu projeto"). Atende HIE-01, HIE-02 e HIE-07.
- **Teclado e foco.** Ordem de tabulação lógica (cabeçalho → topo → seções), foco visível com anel branco no cabeçalho escuro (`teclado-foco-02.png`) e carrossel e gráficos operáveis por setas.
- **Formulário bem desenhado.** Rótulos visíveis, só 3 campos obrigatórios, telefone opcional, sem CPF, assunto pré-selecionado pelo CTA, estados de sucesso e erro. Falta só funcionar (A1).
- **Artefatos visuais técnicos.** O diagrama "Da fonte bruta à decisão automatizada" e os gráficos dos casos são o tipo de imagem que informa mais que foto em serviço técnico (`proposta-e-confianca.md` §7, item 3). Mantenha o formato e troque os dados quando houver casos reais.
- **Base técnica de SEO e privacidade.** HTTPS com redirecionamento de http, `lang="pt-BR"`, H1 único, title e description únicos, Open Graph completo com imagem 1200×630, `robots.txt` e sitemap válidos, conteúdo no HTML estático e nenhum cookie de rastreio.
- **Desempenho no desktop.** Lighthouse 96, LCP 0,5 s, CLS 0, página de 317 KiB no total.
- **"Sinais de que é hora de um diagnóstico".** É o texto mais próximo da dor do cliente no site inteiro.

## 7. Achados

### A1. Os dois canais da ação principal não entregam a mensagem
**Severidade:** Crítica · **Esforço:** Baixo
**Dimensão:** Navegação e jornada · **Critério:** NAV-08, CTX-03, NAV-03 · **Página/elemento:** home, seção Contato e todos os botões "Agendar diagnóstico"
**Arquivo:** `src/config/site.ts:23` (`accessKey: 'TODO'`), `src/components/Contact.astro:32`, `src/scripts/contact-form.ts:42`

- **Observação:**
  - O formulário publicado tem `access_key="TODO"`. Com JavaScript, o envio mostra um erro e oferece o e-mail. Sem JavaScript, o POST ao Web3Forms é recusado (HTTP 403).
  - `dig MX vetrasolutions.com.br` retorna vazio: o e-mail oferecido como alternativa (`contato@vetrasolutions.com.br`, visível na seção Contato e no rodapé) não tem para onde ser entregue.
  - Todos os 5 CTAs da página levam a esse formulário.
- **Impacto:** quem decide entrar em contato vê uma mensagem de erro. Se tentar o e-mail, a mensagem volta com falha de entrega ou se perde. É o pior momento para perder alguém: depois de ele ter se convencido.
- **Necessidade:** quem quer falar com a Vetra precisa de um canal que funcione na primeira tentativa.
- **Recomendação:**
  1. *(Dono)* Ativar o Cloudflare Email Routing para `contato@` → Gmail.
  2. *(Dono)* Criar a chave no Web3Forms com esse e-mail.
  3. *(Código)* Gravar a chave em `CONTACT_FORM.accessKey`.
  4. Enquanto 1 a 3 não estiverem prontos, mostrar um canal alternativo que funcione (WhatsApp ou e-mail pessoal ativo).
- **Critério de aceite:** `dig MX` retorna os registros da Cloudflare; um envio de teste feito pelo dono chega ao Gmail; o HTML publicado não contém `value="TODO"`.
- **Evidência:** `dig +short MX` vazio (11/10/2026); `curl` do HTML com `access_key" value="TODO"`; resposta 403 do Web3Forms à chave `TODO`.

### A2. Números, casos e setores de exemplo estão publicados como fatos
**Severidade:** Crítica · **Esforço:** Baixo (ocultar) / Alto (substituir por conteúdo real)
**Dimensão:** Conteúdo; Conformidade · **Critério:** CON-08, CON-02, LAY-06 · **Página/elemento:** home, seções Indicadores, Setores e Casos; item "Casos" do menu
**Arquivo:** `src/components/Indicators.astro:7-10`, `src/data/cases.ts:55`, `src/components/Sectors.astro:4`, `src/components/Cases.astro:25`

- **Observação:**
  - A faixa "Resultado que se mede." afirma "47+ projetos entregues", "12 TB processados por mês", "99,97% de uptime contratado em SLA" e "< 200 ms de latência média de consulta".
  - A seção "Casos de clientes." mostra três projetos com setor, região e resultado ("Varejo, Nordeste", "14× fontes de dados consolidadas", "−32%").
  - "Setores que atendemos." lista Varejo, Indústria e Serviços.
  - Pelo contexto, a empresa ainda não tem clientes. O próprio código marca tudo isso como `TODO: substituir por casos reais`.
- **Impacto:**
  - É publicidade enganosa nos termos do CDC, art. 37.
  - Um decisor que pede referência sobre o "caso de varejo no Nordeste" descobre que ele não existe, e a confiança que o site tenta criar se inverte.
  - Em engenharia de dados, o comprador costuma ser técnico e pergunta.
- **Necessidade:** o visitante precisa de motivos verdadeiros para confiar. A empresa precisa não ter um passivo publicado.
- **Recomendação:**
  - **Já:** retirar Indicadores, Casos e Setores de `src/pages/index.astro` (os componentes ficam no código para quando houver dados) e tirar "Casos" do menu (`NAV` em `site.ts`).
  - **Depois:** trocar por prova de competência (A5, A6) e, quando houver, por um caso piloto com autorização escrita do cliente.
- **Critério de aceite:** a home publicada não contém "Projetos entregues", "Casos de clientes" nem "Setores que atendemos". Qualquer número restante tem fonte que o dono consiga mostrar.
- **Evidência:** capturas `01-home-desktop-faixa-04.png` e `-07.png`; contexto ("Clientes: nenhum ainda"); `proposta-e-confianca.md` §5.

### A3. CNPJ fictício no rodapé e "TODO" nos dados estruturados
**Severidade:** Crítica · **Esforço:** Baixo
**Dimensão:** Conformidade; SEO · **Critério:** LEG-04, SEO-23, SEO-42 · **Página/elemento:** rodapé; JSON-LD `Organization`
**Arquivo:** `src/config/site.ts:39`, `src/components/Footer.astro:57`, `src/layouts/BaseLayout.astro:30,36`

- **Observação:**
  - O rodapé exibe "© 2026 Vetra Solutions, CNPJ 00.000.000/0001-00".
  - O JSON-LD publicado contém `"telephone":"TODO"` e `"streetAddress":"TODO"` (também `postalCode`).
- **Impacto:**
  - Quem confere o CNPJ (comum em compras B2B) encontra um número inválido. Para o comprador, é sinal de empresa não constituída ou descuidada.
  - O Google lê os dados estruturados como fatos sobre a entidade. "TODO" como telefone e endereço contamina o que buscadores e assistentes de IA associam à Vetra.
- **Necessidade:** identificação verdadeira e consistente da empresa.
- **Recomendação:**
  - Preencher `cnpj`, endereço e telefone em `site.ts` com os dados reais.
  - Até lá, **omitir** os campos em vez de exibir valor falso: sem CNPJ no rodapé e sem `telephone`/`streetAddress` no JSON-LD.
- **Critério de aceite:** o HTML publicado não contém `00.000.000/0001-00` nem `"TODO"`; o Schema Validator não acusa valores inválidos.
- **Evidência:** `01-home-desktop-faixa-10.png`; `curl` do HTML publicado.

### A4. O topo não diz o que a Vetra é, para quem nem onde
**Severidade:** Alta · **Esforço:** Baixo (texto) · **Depende do dono:** público-alvo
**Dimensão:** Contexto e proposta · **Critério:** CTX-01, CTX-02, CTX-05 · **Página/elemento:** home, primeira dobra
**Arquivo:** `src/components/Hero.astro:34-45`

- **Observação:**
  - **Título:** "A coluna vertebral dos seus dados."
  - **Subtítulo:** "Construímos sistemas de dados, agentes de IA e automações com rigor de engenharia. Resultado de negócio sustentado por arquitetura técnica."
  - **Teste dos 5 segundos:**
    - quem é: o nome está só no logo;
    - o que faz: parcial (subtítulo);
    - para quem: ausente;
    - onde: ausente.
  - **Teste da troca de logo:** o subtítulo continua verdadeiro com o logo de qualquer concorrente do benchmark.
  - A palavra "consultoria" não aparece em nenhum lugar do texto visível.
- **Impacto:** o visitante que chega por indicação ou pelo LinkedIn não reconhece de imediato se é o fornecedor certo. A metáfora exige interpretação justamente no ponto em que ele decide se continua rolando.
- **Necessidade:** em uma leitura, saber que é uma consultoria de engenharia de dados, para que tipo de empresa e que atende de Fortaleza para o Brasil.
- **Recomendação:**
  - Título em linguagem do cliente, com o serviço e o resultado.
  - Subtítulo com público e local.
  - Exemplo de direção, a ajustar quando o público estiver definido: "Consultoria de engenharia de dados para empresas que decidem com planilhas." e "De Fortaleza para todo o Brasil: organizamos seus dados em uma base confiável e entregamos os indicadores prontos."
  - A metáfora "coluna vertebral" pode virar subtítulo ou fechamento.
- **Critério de aceite:** a captura da primeira dobra, desktop e celular, responde às 4 perguntas do CTX-01. A palavra "consultoria" e "Fortaleza" aparecem acima da dobra.
- **Evidência:** `01-home-desktop-faixa-01.png`; benchmark: Maraca Hub mostra "Consultoria de dados · Pernambuco · Brasil" acima do H1; Data85 usa "Consultoria de Dados e Analytics" no H1.

### A5. Nenhuma pessoa identificada no site
**Severidade:** Alta · **Esforço:** Médio (exige foto e texto do dono)
**Dimensão:** Conteúdo; Imagens · **Critério:** CON-07, CON-08, IMG-02 · **Página/elemento:** home inteira; FAQ "Quem vai trabalhar no nosso projeto?"
**Arquivo:** `src/components/Manifesto.astro` (bloco Sobre), `src/components/Faq.astro:34`

- **Observação:**
  - O inventário registra 0 imagens.
  - Nenhum nome, cargo ou perfil profissional aparece no texto.
  - O bloco "Sobre" é uma frase de manifesto ("Engenharia de dados não é commodity — é fundação…") assinada por "Vetra Solutions, Fortaleza/CE".
  - A pergunta "Quem vai trabalhar no nosso projeto?" responde "A definir.".
- **Impacto:** numa consultoria nova e pequena, o cliente compra a pessoa. Sem rosto nem trajetória, ele não tem o que verificar, e um logo sozinho não sustenta essa confiança.
- **Necessidade:** saber quem conduz o trabalho e por que essa pessoa é capaz.
- **Recomendação:** trocar o manifesto por um bloco "Quem conduz" com:
  - retrato profissional do fundador (fundo neutro, luz natural);
  - nome, cargo e 3 ou 4 fatos verificáveis (formação, certificações, anos de experiência, setores em que trabalhou, descritos sem nomear ex-empregadores sem autorização);
  - link para o LinkedIn pessoal.
- **Critério de aceite:** a home exibe ao menos 1 pessoa real com foto, nome, cargo e link para o perfil. O FAQ "Quem vai trabalhar" tem resposta.
- **Evidência:** inventário (`imagens.total: 0`); nenhum dos 6 concorrentes mostra o fundador. É uma **oportunidade** de diferenciação para quem tem porte de boutique (seção 8).

### A6. O diagnóstico não diz quanto dura, quanto custa nem o que acontece depois
**Severidade:** Alta · **Esforço:** Baixo (texto) · **Depende do dono:** formato e preço
**Dimensão:** Conteúdo · **Critério:** CON-09, CON-01, CTX-06 (#7) · **Página/elemento:** seção "Como funciona o diagnóstico."
**Arquivo:** `src/components/Diagnosis.astro:6-8` (TODO já registrado no código)

- **Observação:**
  - A seção explica o propósito ("levantamento técnico do seu sistema de dados antes de qualquer proposta") e lista 3 entregáveis.
  - Não informa duração, formato (remoto/presencial), custo (gratuito ou pago), prazo de entrega, o que o cliente precisa preparar nem em quanto tempo a Vetra responde ao contato.
  - A Metodologia descreve cada fase em 3 ou 4 palavras.
- **Impacto:** "Agendar diagnóstico" sem preço nem duração soa como o começo de uma venda longa, e o visitante adia.
- **Necessidade:** saber exatamente o que recebe e qual o compromisso antes de pedir.
- **Recomendação:**
  - Definir uma oferta de entrada e descrevê-la em 4 linhas: "Conversa de 30 min, remota, gratuita → em até 5 dias úteis você recebe um mapa de X páginas com os 3 gargalos prioritários. Sem compromisso de contratação."
  - Valores ilustrativos: o dono define.
  - Ajustar o rótulo do botão para o mesmo vocabulário, por exemplo "Agendar diagnóstico gratuito".
  - Logo após o envio, dizer o prazo de resposta.
- **Critério de aceite:** a seção informa duração, formato, custo e prazo de entrega; a mensagem de sucesso do formulário informa o prazo de resposta.
- **Evidência:**
  - Data85 (Fortaleza): "Diagnóstico Gratuito", chamada de 30 a 45 min com mini-relatório, além de uma tabela de preços "a partir de" por serviço.
  - Maraca Hub (Recife): "Assessment Gratuito" com agendamento online direto.
  - BIX: "proposta sem compromisso".

### A7. O topo depende do preloader e da lente 3D para aparecer no celular
**Severidade:** Alta · **Esforço:** Baixo a médio
**Dimensão:** Performance; Hierarquia · **Critério:** PER-01, CTX-03 · **Página/elemento:** home, primeira dobra no celular
**Arquivo:** `src/scripts/main.ts:31-39` (lente como tarefa do preloader), `src/components/Hero.astro:36,42,47` (`data-intro` oculta título, subtítulo e botões até a animação)

- **Observação:**
  - **Lighthouse para celular (laboratório):** nota 39, LCP 5,8 s, Total Blocking Time 4.220 ms.
  - **Decomposição do LCP:** 247 ms de servidor e 4.360 ms de "atraso de renderização do elemento". O título só é pintado depois que o preloader sai e a animação de entrada começa.
  - **JavaScript por arquivo:** `lens.js` (Three.js) consome 7,0 s de execução e o script principal 3,5 s.
  - **Inventário no momento da coleta:** 0 caracteres visíveis no topo e nenhum botão do topo detectado. A captura `01-home-celular-faixa-01.png` mostra o título sem o subtítulo nem os botões.
  - No celular, a lente aparece com 40% de opacidade (`opacity-40` abaixo de `sm`).
  - **Desktop:** nota 96, LCP 0,5 s.
- **Impacto:**
  - Em celulares de entrada, o visitante olha para uma tela vazia ou incompleta por vários segundos.
  - O LCP pesa no ranqueamento.
  - Ressalva: o laboratório exagera o custo do WebGL (renderização por software), mas o atraso causado pelo preloader e pela animação independe disso.
- **Necessidade:** ver a proposta e o botão imediatamente, em qualquer aparelho.
- **Recomendação:**
  1. Renderizar título, subtítulo e botões visíveis desde o primeiro quadro. A animação pode existir, mas sem `visibility: hidden` por mais de ~300 ms.
  2. Não esperar a lente para liberar o preloader, ou remover o preloader. Ele também atrasa a primeira visita no desktop.
  3. Não carregar a lente em telas abaixo de `md` ou com ponteiro grosso. O SVG estático, que já existe como fallback, cumpre o papel com 40% de opacidade.
- **Critério de aceite:** Lighthouse para celular com LCP ≤ 2,5 s e TBT ≤ 600 ms. O inventário do celular encontra o subtítulo e o botão "Agendar diagnóstico" na primeira dobra. O chunk `lens` não é baixado em 390×844.
- **Evidência:** `lighthouse-mobile.json` (`lcp-breakdown-insight`, `bootup-time`); inventário do celular (`primeiraDobra.caracteresDeTexto: 0`).

### A8. As cinco perguntas do FAQ respondem "A definir."
**Severidade:** Alta · **Esforço:** Baixo (ocultar) / Médio (escrever)
**Dimensão:** Layout; Conteúdo · **Critério:** LAY-06, CON-01, SEO-41 · **Página/elemento:** seção "Perguntas frequentes."
**Arquivo:** `src/components/Faq.astro:4,34`

- **Observação:** as 5 perguntas ("Como vocês tratam a segurança e a privacidade…", "Quanto tempo leva um projeto…", "Como funciona a contratação…", "Vocês trabalham com as ferramentas que já usamos?" e "Quem vai trabalhar no nosso projeto?") abrem a resposta "A definir.".
- **Impacto:** o visitante que abre uma pergunta, em geral alguém já interessado, recebe a confirmação de que o site não está pronto. São as perguntas certas, e é justamente por isso que a frustração é maior.
- **Necessidade:** respostas reais às dúvidas que antecedem o contato.
- **Recomendação:**
  - **Já:** retirar a seção da home.
  - **Depois:** escrever 3 a 5 respostas de 2 ou 3 frases cada, com fatos (prazo típico, modelo de contratação, ferramentas, quem executa, acordo de sigilo). Respostas assim também servem a buscadores e assistentes de IA (SEO-41).
- **Critério de aceite:** nenhuma ocorrência de "A definir" no HTML publicado.
- **Evidência:** `Faq.astro:34`; contagem no HTML publicado.

### A9. Não há política de privacidade, e o formulário coleta dados pessoais
**Severidade:** Alta (passa a Crítica quando o formulário voltar a funcionar) · **Esforço:** Médio
**Dimensão:** Conformidade · **Critério:** LEG-01, LEG-03 · **Página/elemento:** formulário de contato; rodapé
**Arquivo:** `src/components/Contact.astro:146` (TODO registrado), `src/components/Footer.astro`

- **Observação:**
  - O formulário coleta nome, empresa, e-mail, telefone e mensagem, e os envia a um terceiro (Web3Forms).
  - A única informação é "Usamos seus dados só para responder a este contato.". Não há link para uma política.
  - O inventário registra `linkPoliticaDePrivacidade: false`.
- **Impacto:** a LGPD exige informar o controlador, a finalidade, o compartilhamento (aqui, um operador estrangeiro) e os direitos do titular. Um comprador corporativo com área de compliance nota a ausência.
- **Necessidade:** transparência sobre o uso dos dados, exigida por lei.
- **Recomendação:** criar `/privacidade` com controlador (razão social, CNPJ), dados coletados, finalidade, base legal, operadores (Web3Forms, Cloudflare), prazo de retenção, direitos do titular e contato. Linkar no rodapé e no texto do formulário. **Validar o texto com assessoria jurídica.**
- **Critério de aceite:** `/privacidade` responde 200 e é linkada no rodapé e junto ao botão "Enviar mensagem".
- **Evidência:** inventário (`privacidade`); LGPD, arts. 6º, 9º e 18.

### A10. Nenhum serviço tem página própria
**Severidade:** Média · **Esforço:** Médio
**Dimensão:** Conteúdo; SEO · **Critério:** CON-06, SEO-13 · **Página/elemento:** site inteiro (1 URL no sitemap)

- **Observação:** o site tem uma única página. Os quatro serviços (bancos de dados, dashboards, agentes de IA, automações) existem só como cards na home, com uma linha de descrição e 3 itens cada.
- **Impacto:** a busca "consultoria de engenharia de dados" ou "dashboard Power BI Fortaleza" não encontra uma página que responda especificamente a ela. Quem quer detalhes de um serviço não tem para onde ir.
- **Necessidade:** uma página por intenção de busca e um lugar para o detalhe que hoje não cabe na home (o que também alivia A12).
- **Recomendação:** criar uma página por serviço principal (ex.: `/servicos/engenharia-de-dados`, `/servicos/dashboards`), com problema, entregáveis, prazo típico, ferramentas e CTA. Começar pelo serviço que o dono quer vender primeiro. Atualizar o `sitemap.xml` (o `CLAUDE.md` já prevê um sitemap dinâmico a partir de 5 rotas).
- **Critério de aceite:** cada serviço principal tem URL própria, com title e description únicos, linkada pelo card da home e listada no sitemap.
- **Evidência:** sitemap com 1 URL; benchmark: 4 de 6 concorrentes (Data85, BIX, A3Data, Dataside) têm página por serviço.

### A11. O texto usa jargão técnico sem tradução para quem decide
**Severidade:** Média · **Esforço:** Médio
**Dimensão:** Conteúdo · **Critério:** CON-03, CON-04 · **Página/elemento:** Capacidades, Pipeline, Stack, Casos
**Arquivo:** `src/components/Capabilities.astro:20`, `src/components/PipelineDiagram.astro:10`, `src/components/Stack.astro`

- **Observação:**
  - **Termos sem explicação na home:** ETL/ELT, CDC e batch, camada semântica, guardrails, observabilidade, SLA de freshness, data lake, RPA, orquestração.
  - **Nomes de ferramentas:** dbt, Airflow, Snowflake, LangChain, Streamlit.
  - A faixa Stack é um letreiro só de nomes de ferramentas.
  - As descrições dos serviços repetem o título em outros termos (ex.: "Indicadores que viram decisão, não planilha." → "Camada analítica que vira decisão acionável.").
- **Impacto:** o leitor técnico entende. O diretor ou gerente de operações, que costuma decidir a contratação, sente o texto como "muito para ler" mesmo com poucos caracteres. É a origem provável da sua segunda hipótese.
- **Necessidade:** entender o benefício na linguagem do próprio negócio.
- **Recomendação:**
  - Reescrever cada card em três camadas: **dor** ("Seus relatórios são montados à mão em planilhas"), **resultado** ("Indicadores atualizados sozinhos toda manhã") e **como**, com o termo técnico no fim, para quem procura.
  - Aplicar o teste do "E daí?" a cada frase.
  - Manter os nomes de ferramentas nas páginas de serviço (A10), não no topo da home.
- **Critério de aceite:** nenhum card da home usa sigla sem explicação na mesma frase; cada card tem uma frase de dor e uma de resultado.
- **Evidência:** capturas `01-home-desktop-faixa-02.png` e `-03.png`; `proposta-e-confianca.md` §2 e §6.

### A12. Home longa e repetitiva: 11 seções, cerca de 15 telas no celular
**Severidade:** Média · **Esforço:** Médio
**Dimensão:** Layout; Hierarquia · **Critério:** LAY-08, HIE-04, LAY-05 · **Página/elemento:** home inteira
**Arquivo:** `src/pages/index.astro`

- **Observação:**
  - A home mede 12.592 px no celular (cerca de 15 telas de 844 px) e 8.955 px no desktop, em 11 seções.
  - O diagnóstico é explicado em 4 lugares: CTA de Capacidades, fase 01 da Metodologia, seção Diagnóstico e Contato.
  - Capacidades, Pipeline, Setores e Metodologia descrevem "o que fazemos" com ângulos parecidos.
  - **Metodologia no celular:** uma tela inteira (~700 px) para 3 fases com 3 ou 4 palavras cada (`01-home-celular-faixa-08.png`). O espaço não separa grupos, é baixa densidade.
- **Impacto:** quem chega ao fim já viu a mesma ideia várias vezes, e o formulário fica a ~10.500 px do topo no celular.
- **Necessidade:** uma sequência curta que responda às sete perguntas em ordem e leve ao contato.
- **Recomendação:** depois de A2 e A8, reorganizar em ~7 blocos, cada um respondendo a uma pergunta da seção 3, e fundir Metodologia com Diagnóstico:
  1. topo;
  2. sinais/dor;
  3. o que fazemos;
  4. como começar (diagnóstico com oferta);
  5. quem conduz;
  6. FAQ com respostas;
  7. contato.
- **Critério de aceite:** a home tem até 8 seções, o diagnóstico é explicado em um lugar e só referenciado nos demais, e a altura no celular cai pelo menos 30%.
- **Evidência:** inventário (`layout.secoes`, `lacunasCandidatas` com faixas de 258 a 356 px entre seções).

### A13. Página inexistente responde 200, www duplica o site, falta canonical e HSTS
**Severidade:** Média · **Esforço:** Baixo
**Dimensão:** SEO; Conformidade · **Critério:** NAV-07, SEO-01, SEO-04, LEG-07 · **Página/elemento:** técnico
**Arquivo:** `src/pages/` (não há `404.astro`), `src/layouts/BaseLayout.astro` (sem `rel="canonical"`), `public/_headers`

- **Observação:**
  - Uma URL inexistente responde 200 com a home. É um soft 404: o Cloudflare Pages serve o `index.html` quando não há `404.html`. Por isso `/llms.txt` também responde 200 com HTML, o que o Lighthouse acusa.
  - `https://www.vetrasolutions.com.br/` responde 200 em vez de redirecionar.
  - Não há `<link rel="canonical">`.
  - Falta o cabeçalho `Strict-Transport-Security`.
- **Impacto:** o Google pode indexar duas versões do site e tratar URLs inexistentes como páginas válidas. O visitante que erra um link vê a home sem aviso.
- **Necessidade:** uma única versão indexável e erros reconhecíveis.
- **Recomendação:**
  - *(Código)* Criar `src/pages/404.astro` com links para a home e o contato.
  - *(Código)* Adicionar `canonical` autorreferente no `BaseLayout`.
  - *(Código)* Adicionar `Strict-Transport-Security: max-age=31536000` ao `_headers`.
  - *(Dono)* Criar a regra de redirecionamento www → sem www no painel da Cloudflare.
- **Critério de aceite:**
  - `curl -o /dev/null -w "%{http_code}" https://vetrasolutions.com.br/xyz` retorna 404;
  - `www` retorna 301 para o domínio sem www;
  - o HTML contém `rel="canonical"`;
  - os cabeçalhos incluem HSTS.
- **Evidência:** `resumo.md` (seção Técnico); `curl` em 11/10/2026.

### A14. Não há WhatsApp nem telefone
**Severidade:** Média · **Esforço:** Baixo · **Depende do dono**
**Dimensão:** Navegação · **Critério:** NAV-03 · **Página/elemento:** Contato, rodapé, cabeçalho

- **Observação:** os únicos canais são o formulário e o e-mail, ambos hoje inoperantes (A1). O inventário registra `whatsapp: 0` e `telefoneClicavel: 0`.
- **Impacto:** no Brasil, boa parte dos decisores de PME prefere uma mensagem rápida a um formulário. Sem alternativa, quem não quer preencher formulário não tem outro caminho.
- **Necessidade:** um canal imediato para quem prefere conversar.
- **Recomendação:** se o dono aceitar atender por WhatsApp, adicionar um link `wa.me` com mensagem pré-preenchida ("Olá, vim pelo site e quero saber sobre o diagnóstico") na seção Contato e no rodapé. Botão flutuante é opcional; se usado, não pode cobrir o CTA no celular (HIE-05).
- **Critério de aceite:** o link `wa.me` com `text=` está presente e abre a conversa com a mensagem.
- **Evidência:** benchmark: Data85, Maraca Hub e BIX oferecem WhatsApp; Maraca Hub com mensagem pré-preenchida.

### A15. As bordas dos campos do formulário têm contraste 1,62:1
**Severidade:** Média · **Esforço:** Baixo
**Dimensão:** Acessibilidade · **Critério:** ACE-01 (WCAG 1.4.11) · **Página/elemento:** formulário de contato
**Arquivo:** `src/styles/global.css` (`.field-input` usa `border-line-strong`), `tailwind.config.mjs` (`line-strong: #C5CCD8`)

- **Observação:**
  - A borda dos campos (`#C5CCD8` sobre `#FFFFFF`) tem 1,62:1. A norma pede 3:1 para o limite de um componente de interface quando ele é o que identifica o campo.
  - O texto de exemplo (`subtle #8A93A6`) tem 3,09:1.
- **Impacto:** pessoas com baixa visão, ou sob sol forte no celular, têm dificuldade de ver onde clicar e de ler o exemplo.
- **Necessidade:** identificar cada campo sem esforço.
- **Recomendação:** escurecer a borda de `.field-input` para um tom com ≥ 3:1 sobre branco, por exemplo o `muted #586178` (6,18:1) ou um novo `line-input` validado. Para o texto de exemplo, usar `muted` ou garantir que o rótulo visível carregue toda a informação, o que já acontece.
- **Critério de aceite:** a borda dos campos tem ≥ 3:1 contra o fundo do cartão.
- **Evidência:** cálculo de luminância WCAG (seção "Identidade", tabela de pares).

### A16. Não há Search Console nem medição de conversão
**Severidade:** Média · **Esforço:** Baixo
**Dimensão:** Medição · **Critério:** MED-01, MED-03, MED-04, MED-05 · **Página/elemento:** site inteiro

- **Observação:**
  - O site carrega o beacon do Cloudflare Web Analytics (`static.cloudflareinsights.com`), sem cookies.
  - Não há sinal de verificação do Google Search Console nem do Bing.
  - O envio do formulário não é medido como evento.
- **Impacto:** depois das mudanças, não haverá como saber se o site gera mais contatos, nem por quais buscas as pessoas chegam.
- **Necessidade:** medir a ação principal para decidir com dados.
- **Recomendação (plano de instrumentação):**
  1. *(Dono)* Verificar o domínio no Search Console por registro TXT na Cloudflare e enviar o sitemap.
  2. *(Dono)* Importar no Bing Webmaster Tools.
  3. *(Dono)* Confirmar no painel do Pages que o Web Analytics está ativo.
  4. *(Código)* Registrar o envio bem-sucedido do formulário como evento. O Web3Forms também mantém o histórico de envios.
  5. *(Dono)* Usar links com UTM no LinkedIn.
  6. *(Dono)* Definir 1 indicador, por exemplo "pedidos de diagnóstico por mês".
- **Critério de aceite:** Search Console verificado com o sitemap processado; o indicador mensal é registrado a partir do primeiro mês.
- **Evidência:** `resumo.md` (terceiros carregados); ausência de meta de verificação no HTML.

### A17. Há marcação de lista e de ARIA inválida em dois componentes
**Severidade:** Baixa · **Esforço:** Baixo
**Dimensão:** Acessibilidade · **Critério:** ACE-05 · **Página/elemento:** bloco Sobre; carrossel de casos
**Arquivo:** `src/components/Manifesto.astro:13`, `src/components/Cases.astro:63`

- **Observação:**
  - O Lighthouse acusa `aria-label` em um `<p>` sem papel. O SplitText com `aria: 'auto'` aplica o rótulo ao parágrafo do manifesto.
  - A lista do carrossel (`<ul data-carousel-track>`) tem filhos com `role="group"`, o que invalida a lista.
- **Impacto:** leitores de tela podem anunciar o texto de forma inconsistente.
- **Necessidade:** semântica válida.
- **Recomendação:**
  - Usar `data-split` só em títulos (`h2`), ou um elemento com papel válido.
  - No carrossel, remover `role="group"` dos `li` (o `li` já agrupa) ou trocar `ul/li` por `div` com `role="group"`.
- **Critério de aceite:** os audits `aria-prohibited-attr` e `list` passam no Lighthouse.
- **Evidência:** `lighthouse-desktop.json`.

### A18. Números com ponto decimal em site em português
**Severidade:** Baixa · **Esforço:** Baixo
**Dimensão:** Conteúdo · **Critério:** CON-04 · **Página/elemento:** contadores animados
**Arquivo:** `src/scripts/motion/counters.ts:19`

- **Observação:** o contador formata com `toFixed`, e a captura mostra "90.44 %" durante a animação (valor final "99.97%"). Em português, o separador decimal é a vírgula.
- **Impacto:** pequena quebra de cuidado, perceptível a quem lê números com atenção (o público de dados).
- **Recomendação:** formatar com `toLocaleString('pt-BR', { minimumFractionDigits: n, maximumFractionDigits: n })`. Vale para os números futuros, mesmo que os atuais saiam por A2.
- **Critério de aceite:** números decimais exibidos com vírgula.
- **Evidência:** `01-home-desktop-faixa-04.png`.

### A19. Texto de fundo aparece através do cabeçalho fixo
**Severidade:** Baixa · **Esforço:** Baixo
**Dimensão:** Layout · **Critério:** LAY-07 · **Página/elemento:** cabeçalho fixo
**Arquivo:** `src/components/Header.astro:14` (`bg-ink/95`)

- **Observação:** com 95% de opacidade e sem desfoque (removido para fluidez do scroll), títulos que passam por trás do cabeçalho ficam visíveis em fantasma (`01-home-celular-faixa-03.png`, `-04.png` e `-07.png`; desktop `-05.png`, "Setores que atendemos").
- **Impacto:** ruído visual na área mais vista da tela.
- **Recomendação:** fundo sólido (`bg-ink`) no cabeçalho. Não afeta o desempenho.
- **Critério de aceite:** nenhuma captura mostra texto atrás do cabeçalho.
- **Evidência:** capturas citadas.

### A20. Não há versão em inglês
**Severidade:** Média (se o exterior for mercado-alvo) · **Esforço:** Alto · **Depende do dono**
**Dimensão:** SEO internacional · **Critério:** SEO-50 a SEO-53 · **Página/elemento:** site inteiro

- **Observação:** o site está só em português, sem `hreflang`, e o contexto diz que a Vetra atende o exterior. No benchmark, Indicium AI (EN padrão + `/pt-br`) e Maraca Hub (seletor PT/EN) têm versão em inglês.
- **Impacto:** um comprador estrangeiro não avalia a Vetra, e o site não aparece em buscas em inglês.
- **Recomendação:** decidir primeiro o mercado (pergunta em aberto). Se for o caso, criar `/en/` só depois de A2 a A12, com texto adaptado (fuso, idioma de trabalho, faturamento em USD/EUR), `hreflang` recíproco e seletor visível, sem redirecionamento automático.
- **Critério de aceite:** `/en/` com `hreflang` recíproco e `x-default`.
- **Evidência:** benchmark; `proposta-e-confianca.md` §8.

## 8. Benchmark de concorrentes

Coleta em 11/10/2026 via WebFetch (texto e estrutura; sem capturas nem desempenho dos concorrentes).

| Concorrente | Por que entrou | Porte |
|---|---|---|
| [Data85](https://data85.com.br/) | Consultoria de dados **de Fortaleza**, foco em PMEs | Comparável |
| [Maraca Hub](https://maracahub.com/) | Consultoria de dados de Recife, Nordeste | Comparável (boutique) |
| [BIX Tecnologia](https://www.bixtecnologia.com.br/) | Aparece em "consultoria de dados Brasil"; engenharia de dados + BI | Médio/grande |
| [A3Data](https://a3data.com.br/) | Referência nacional em dados e IA (BH) | Grande |
| [Dataside](https://www.dataside.com.br/) | Aparece em "diagnóstico de ambientes de dados" | Grande (300+) |
| [Indicium AI](https://indicium.ai/) | **Referência de excelência**: brasileira, atuação internacional, PT/EN | Grande (600+) |

Busca local: "consultoria engenharia de dados Fortaleza" não trouxe nenhuma consultoria especializada na primeira página do buscador usado, só diretórios de engenharia civil e perfis do LinkedIn. A Data85 surgiu numa busca regional mais ampla. Indício (Premissa) de que a busca local está pouco disputada.

| Critério | Vetra | Data85 | Maraca | BIX | A3Data | Dataside | Indicium (ref.) |
|---|---|---|---|---|---|---|---|
| Proposta clara na 1ª dobra (o quê + para quem) | ◐ | ✓ | ✓ | ✓ | ◐ | ◐ | ✓ |
| Diz "consultoria" e o local no topo | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| CTA principal visível na 1ª dobra | ◐ (oculto até a animação, no celular) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| WhatsApp/telefone clicável | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Prova social verdadeira | ✗ (fabricada) | ✗ | ✓ (números de casos) | ✓ | ✓ | ✓ | ✓ |
| Página própria por serviço | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Casos com resultados | ✗ (fabricados) | ✗ | ✓ | ◐ | ✓ | ✓ | ✓ |
| Rosto do fundador/equipe | ✗ | ✗ | ✗ | ✗ | ✗ | ◐ (depoimentos) | ✗ |
| Método / "como trabalhamos" | ◐ | ✓ (4 etapas) | ✗ | ✓ (3 etapas) | ✗ | ◐ | ✓ |
| Oferta de entrada descrita | ◐ | ✓ (gratuito, 30–45 min, mini-relatório) | ✓ (assessment gratuito, agenda online) | ◐ (proposta sem compromisso) | ✗ | ◐ (beta) | ✗ |
| Preço "a partir de" | ✗ | ✓ | ◐ (seção Investimento) | ✗ | ✗ | ✗ | ✗ |
| Selos de parceiro de tecnologia | ✗ | ✗ | ✓ (Microsoft, Databricks) | ✓ | ✓ (AWS) | ✓ | ✓ |
| Blog/conteúdo ativo | ✗ | ✗ | ◐ | ✓ | ◐ | ✓ | ✓ |
| Versão em outro idioma | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| Dados estruturados | ◐ (com "TODO") | ? | ? | ? | ? | ? | ? |
| CNPJ/endereço visíveis | ✗ (CNPJ fictício) | ◐ (cidade) | ✓ | ◐ | ✓ | ✓ | ◐ |
| Visual próprio (não template) | ✓ | ? | ? | ? | ? | ? | ? |

**Padrões do setor** (≥ metade faz):
- dizer o serviço no título;
- página por serviço;
- prova social logo depois do topo;
- selos de parceiro de nuvem;
- CTA "falar com especialista" ou equivalente.

**Diferenciais** (só os melhores):
- **Data85:** preço "a partir de" e diagnóstico gratuito com formato e entregável. Reduz o risco percebido como ninguém.
- **Maraca Hub:** resultados de casos em números concretos e agendamento online direto do botão.
- **Indicium:** conteúdo recente e versão bilíngue.

**Antipadrões:**
- **Títulos genéricos de IA:** "Revolucione seu negócio com IA generativa", "Enterprise AI, Delivered".
- **Caixa alta e setas nos botões:** "CONVERSAR COM ESPECIALISTA →".
- **Estatísticas sem fonte.**
- **Menus em inglês num site em português.**
- **Nenhum mostra pessoas,** nem os pequenos.

**Oportunidades:**
1. **Rosto do fundador.** Nenhum concorrente de porte comparável mostra quem conduz o trabalho. Para uma boutique, é o diferencial mais barato e mais forte.
2. **Busca local em Fortaleza** pouco disputada (Premissa, a validar no Search Console).
3. **Visual.** A Vetra já tem a identidade visual mais distinta entre os pares de porte comparável. Falta pôr conteúdo verdadeiro dentro dela.
4. **Transparência de preço e processo,** combinando o que a Data85 faz com o rigor de apresentação da Vetra.

## 9. Plano de ação

**Corrigir já (críticos)**

| Ordem | Achado | Ação | Severidade | Esforço | Critério de aceite | Status |
|---|---|---|---|---|---|---|
| 1 | A1 | Email Routing + chave Web3Forms em `site.ts` | Crítica | Baixo | Envio de teste chega ao Gmail; sem `TODO` no HTML | Mantido (decisão do dono) |
| 2 | A2 | Tirar Indicadores, Casos e Setores da home e "Casos" do menu | Crítica | Baixo | HTML sem "Projetos entregues"/"Casos de clientes"/"Setores" | Mantido (decisão do dono) |
| 3 | A3 | Omitir CNPJ e campos `TODO` até haver dados reais | Crítica | Baixo | HTML sem `00.000.000` e sem `"TODO"` | Mantido (decisão do dono) |

**Ganhos rápidos**

| Ordem | Achado | Ação | Severidade | Esforço | Critério de aceite | Status |
|---|---|---|---|---|---|---|
| 4 | A8 | Tirar o FAQ da home até haver respostas | Alta | Baixo | Sem "A definir" no HTML | Verificado |
| 5 | A7 | Topo visível sem esperar preloader; sem lente abaixo de `md` | Alta | Baixo/Médio | LCP celular ≤ 2,5 s (laboratório); CTA na 1ª dobra no inventário | Verificado |
| 6 | A13 | `404.astro`, `canonical`, HSTS no `_headers` | Média | Baixo | `/xyz` → 404; canonical e HSTS presentes | Feito (404 verificado; HSTS e canonical no build) |
| 7 | A15 | Borda de campo ≥ 3:1 | Média | Baixo | Contraste da borda ≥ 3:1 | Feito |
| 8 | A19 | Cabeçalho com fundo sólido | Baixa | Baixo | Sem texto fantasma nas capturas | Verificado |
| 9 | A17 | Corrigir ARIA do manifesto e lista do carrossel | Baixa | Baixo | Audits do Lighthouse passam | Verificado |
| 10 | A18 | Números em formato pt-BR | Baixa | Baixo | Decimais com vírgula | Feito |

**Estruturais** (dependem de decisões e conteúdo do dono)

| Ordem | Achado | Ação | Severidade | Esforço | Critério de aceite | Status |
|---|---|---|---|---|---|---|
| 11 | A4 | Novo título e subtítulo (serviço + público + local) | Alta | Baixo | 1ª dobra responde CTX-01 | Verificado |
| 12 | A6 | Descrever a oferta de entrada (duração, formato, custo, prazo) | Alta | Baixo | Seção e mensagem de sucesso com esses dados | Feito |
| 13 | A5 | Bloco "Quem conduz" com foto, nome, credenciais | Alta | Médio | 1 pessoa real com foto e LinkedIn | Feito (oculto até os dados) |
| 14 | A9 | Página `/privacidade` (validação jurídica) | Alta | Médio | `/privacidade` 200 e linkada | Feito (rascunho, falta validação jurídica) |
| 15 | A11 | Reescrever cards em dor → resultado → como | Média | Médio | Sem sigla sem explicação | Feito |
| 16 | A12 | Reorganizar a home em ~7 blocos | Média | Médio | ≤ 8 seções; altura no celular −30% | Parcial |
| 17 | A10 | Páginas por serviço (começar pelo principal) | Média | Médio | URL própria + sitemap | Verificado |
| 18 | A8 | Escrever respostas reais e devolver o FAQ | Média | Médio | 3–5 respostas com fatos | Pendente (dono) |
| 19 | A20 | Versão `/en/` (se o exterior for prioridade) | Média | Alto | `hreflang` recíproco | Pendente (depende do mercado) |

**Ações do dono fora do código**

| Ação | Onde | Achado |
|---|---|---|
| Ativar Email Routing `contato@` → Gmail | Cloudflare → Email → Email Routing | A1 |
| Criar a chave do Web3Forms e mandá-la para o código | web3forms.com | A1 |
| Informar CNPJ, endereço e telefone reais | — | A3 |
| Regra de redirecionamento www → sem www | Cloudflare → Rules → Redirect Rules | A13 |
| Verificar o Search Console (TXT) e enviar o sitemap; importar no Bing | Google Search Console | A16 |
| Fazer um retrato profissional e listar credenciais publicáveis | — | A5 |
| Definir a oferta de entrada (gratuita ou paga, duração, entregável) | — | A6 |
| Decidir sobre WhatsApp e idioma | — | A14, A20 |
| Validar a política de privacidade com assessoria jurídica | — | A9 |
| Criar link de agenda (Cal.com) se quiser agendamento direto | cal.com | A6 |

## 9.1 Rodada 1 de correções (11/10/2026)

Branch `feat/auditoria-ux`, um commit por achado. Verificação: coletor da skill contra o build local (`auditoria-ux/coletas/2026-10-11-16-11/`), comparado com a coleta de produção da mesma data.

| Indicador | Antes (produção) | Depois (build local) |
|---|---|---|
| Lighthouse celular: performance | 39 | 99 |
| LCP celular (laboratório) | 5,8 s | 1,7 s |
| Total Blocking Time celular | 4.220 ms | 80 ms |
| CLS celular | 0 | 0 |
| Acessibilidade (Lighthouse) | 89–93 | 100 |
| Botão principal na 1ª dobra do celular (inventário) | não | sim ("Agendar diagnóstico gratuito") |
| Seções da home (com rodapé) | 12 | 10 |
| Altura da home | 12.592 px celular · 8.955 px desktop | 12.597 px celular · 8.198 px desktop |
| Páginas no sitemap | 1 | 6 |
| JS inicial (gzip) | 52,7 kB | 52,0 kB |

**A12 ficou parcial:** o diagnóstico passou a ser explicado num lugar só e saíram o FAQ e a Metodologia avulsa, mas a altura no celular não caiu. Os motivos são que Indicadores, Setores e Casos ficaram no ar (decisão do dono), e o topo e o diagnóstico ganharam texto (oferta e fases). Os próximos cortes possíveis são o diagrama do pipeline e a faixa Stack no celular.

Ressalva: o build local não tem os scripts que a Cloudflare injeta (Web Analytics, ofuscação de e-mail). Rodar o coletor de novo contra o preview publicado.

## 10. Itens não verificados

| Item | Por quê | Como verificar |
|---|---|---|
| Core Web Vitals de campo (LCP, INP, CLS de usuários reais) | PSI retornou 429; domínio novo provavelmente sem dados no CrUX | Search Console → Core Web Vitals, após algumas semanas de tráfego; ou PSI com `PSI_API_KEY` |
| Indexação (`site:`) | Domínio recém-migrado | Search Console → Páginas |
| Existência da página do LinkedIn da empresa | O LinkedIn responde 200 até na tela de login | Abrir a URL logado |
| Comportamento real da lente em celulares | Laboratório usa WebGL por software | Testar em um Android de entrada |
| Zoom de 200% e espaçamento de texto (WCAG 1.4.4/1.4.12) | Não testado pelo coletor | Teste manual no navegador |
| Busca local real (Google Brasil, mapa, AI Overview) | Buscador usado é dos EUA | Busca anônima no Google a partir de Fortaleza |
| Desempenho e dados estruturados dos concorrentes | Coleta só por texto | Coletor com `--max 1` em cada concorrente |

## 11. Perguntas em aberto

1. **Que tipo de empresa você quer atender primeiro** (segmento, porte) e **quem decide** a contratação? Muda o título (A4), o texto (A11) e as páginas de serviço (A10).
2. **O diagnóstico será gratuito ou pago? Quanto dura, em que formato e o que entrega?** Muda A6 e o rótulo do botão.
3. **Você tem ou pode fazer uma foto profissional?** E quais credenciais (formação, certificações, anos de experiência, setores) podem ser publicadas? Destrava A5.
4. **Você aceita atender por WhatsApp?** (A14)
5. **Inglês para quais países?** Ou o exterior pode esperar? (A20)
6. **Você faz reuniões presenciais em Fortaleza?** Se sim, o Google Business Profile vale a pena. Se não, o perfil não é elegível.
7. **Qual serviço você quer vender primeiro?** Define a primeira página de serviço (A10).
8. **Algum trabalho anterior pode virar caso,** anonimizado e com autorização? Seria a primeira prova real.

## 12. Fontes

- WCAG 2.2 (W3C), critérios 1.1.1, 1.3.1, 1.4.3, 1.4.11, 2.4.4, 2.5.8 e 3.3.2
- Lei 13.709/2018 (LGPD), arts. 6º, 9º e 18; Lei 8.078/1990 (CDC), art. 37
- Google Search Central: soft 404, canonical, dados estruturados de organização, sites multirregionais (hreflang)
- web.dev: Core Web Vitals (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1)
- Concorrentes, acessados em 11/10/2026: [data85.com.br](https://data85.com.br/), [maracahub.com](https://maracahub.com/), [bixtecnologia.com.br](https://www.bixtecnologia.com.br/), [a3data.com.br](https://a3data.com.br/), [dataside.com.br](https://www.dataside.com.br/), [indicium.ai](https://indicium.ai/)
- Coleta: `auditoria-ux/coletas/2026-10-11-15-35/` (resumo, inventários, capturas, Lighthouse)

## Anexo A — Identidade visual

O contexto diz que não há manual de marca, mas o site já tem um sistema visual definido e coerente, registrado nos ADRs do `CLAUDE.md` e nos tokens do `tailwind.config.mjs`. A proposta em [`identidade-proposta.md`](identidade-proposta.md) **formaliza esse sistema como manual**, com os pares de contraste calculados, em vez de propor outro. Ela acrescenta só o que falta para os achados deste relatório: direção de fotografia (A5), token de borda de campo (A15) e regras de números em pt-BR (A18). É proposta para aprovação.
