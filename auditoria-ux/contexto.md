# Contexto da auditoria — Vetra Solutions

Arquivo lido pela skill auditoria-ux-site-institucional antes de cada auditoria. Atualize quando algo mudar.
Última atualização: 2026-10-11 (decisões da rodada 1 no fim)

## Site
- URL de produção: https://vetrasolutions.com.br
- URL de homologação: não há fixa; cada branch diferente de `main` gera um preview em `<branch>.vetra-site-bf5.pages.dev`
- Plataforma / hospedagem: Cloudflare Pages com deploy automático do `main` (GitHub `caiu-c/vetra-site`); site estático em Astro 4 + TypeScript + Tailwind 3, sem framework de UI em runtime (detalhes e ADRs em `CLAUDE.md`)
- Repositório do código: o próprio projeto onde a auditoria roda
- Quem edita o conteúdo: o dono
- Escopo da auditoria: site inteiro
- Modo de coleta: Claude Code com o coletor da skill

## Negócio
- O que a organização faz: consultoria de engenharia de dados
- Para quem: empresas (B2B). Segmento, porte e cargo de quem decide ainda não definidos (ver perguntas em aberto)
- Onde atua: sede em Fortaleza-CE; atende todo o Brasil e o exterior (remoto)
- Idiomas e mercados: site só em português; o dono considera que deveria ter outro idioma
- Clientes, cases ou depoimentos: nenhum ainda (empresa em início de operação) → aplicar "Confiança sem clientes"
- Credenciais do fundador que podem ser publicadas: preencher (formação, pós-graduação, certificações, experiência anterior)
- Concorrentes e referências: não mapeados → mapear nas camadas local (Fortaleza/CE), nacional/remoto e internacional, com pelo menos 2 de porte comparável

## Objetivo
- Ação principal esperada do visitante: não definida → a auditoria deve recomendar uma
- 3 tarefas mais comuns de quem visita: não informadas → inferir e registrar como Premissa
- Motivação da auditoria: "Eu vi, gostei, mas falta algo que não sei o que é"

## Hipóteses do dono (o que já incomoda)
- O site não tem nenhuma foto
- Há muita coisa para ler
- O visitante não entende o propósito
- "Falta algo" não identificado → aplicar a lente do "falta algo"

## Marca e dados
- Manual de marca: não existe → gerar `identidade-proposta.md` para aprovação
- Ferramentas de medição: nenhuma configurada pelo dono (sem GA4, Search Console, Business Profile). O site carrega o Cloudflare Web Analytics (beacon do Pages, sem cookies) → dimensão Medição vira plano de instrumentação; Business Profile só se houver atendimento presencial

## Restrições e preferências
- Tom do relatório: direto, nível auditor, com Comunicação Não Violenta
- Mudanças visuais amplas (paleta, fontes, layout da home) só depois de aprovação
- Não publicar (deploy) sem pedido explícito

## Perguntas em aberto
- Que tipo de empresa você quer atender primeiro (segmento, porte)? Quem decide a contratação (TI, diretoria, operações)?
- Qual idioma além do português (inglês?) e para quais países?
- Você tem ou pode fazer uma foto profissional sua para o site?
- Há algum serviço de entrada que você aceitaria oferecer (ex.: diagnóstico de 30 min, avaliação de maturidade de dados)?
- Você faz reuniões presenciais com clientes em Fortaleza (define elegibilidade ao Google Business Profile)?

## Decisões do dono (rodada 1, 2026-10-11)
- Mantidos no ar até ele preencher os dados oficiais: formulário com chave `TODO` e e-mail sem MX (A1), números/casos/setores de exemplo (A2), CNPJ e campos `TODO` do JSON-LD (A3).
- Preloader removido; entrada do título só em CSS.
- Oferta de entrada: diagnóstico gratuito, conversa de 30 min por vídeo, mapa por escrito em até 5 dias úteis; resposta ao contato em até 1 dia útil.
- Bloco "Quem conduz" pronto e oculto até preencher `FOUNDER` em `src/config/site.ts` (nome, cargo, foto, LinkedIn, credenciais).
- WhatsApp pronto e oculto até preencher `CONTACT.whatsapp`.
- Quatro páginas de serviço criadas em rascunho (textos a validar em `src/data/services.ts`).
- Fora desta rodada: versão em inglês (depende de escolher o mercado), Search Console e Bing (ações do dono).
