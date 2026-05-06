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