/*
  Serviços: fonte única para os cards da home (Capabilities.astro) e as páginas
  /servicos/[slug] (auditoria A10 e A11). Texto em linguagem de negócio, com dor →
  resultado → como; termos técnicos e nomes de ferramentas ficam no fim, para quem
  procura por eles.
  TODO: validar todos os textos (rascunho de 2026-10-11, não aprovado). Ferramentas
  restritas às da faixa Stack (Stack.astro) — ajustar com o que o time de fato usa.
*/

import type { CONTACT_SUBJECTS } from '@/config/site';

type SubjectKey = (typeof CONTACT_SUBJECTS)[number]['value'];

export interface Service {
  slug: string;
  /** Nome curto do serviço (card e menu). */
  name: string;
  /** Assunto pré-selecionado no formulário. */
  subject: SubjectKey;
  /** Resultado em uma frase: título do card e da página. `*…*` = destaque (ADR-011). */
  outcome: string;
  /** Dor do cliente, na linguagem dele. */
  pain: string;
  /** O que a Vetra faz, em uma frase, sem jargão. `**…**` = negrito (ADR-011). */
  summary: string;
  /** Rótulo curto do que entrega (diagrama da home, ServicesDiagram.astro). */
  tagline: string;
  /** Para quem é (subtítulo da página). */
  audience: string;
  /** Três entregáveis em palavras simples (card da home). */
  highlights: readonly [string, string, string];
  /** Sinais de que a empresa precisa do serviço (página). */
  signals: readonly string[];
  /** Entregáveis detalhados (página): nome técnico + o que significa. */
  deliverables: readonly { title: string; desc: string }[];
  /** Ferramentas com que trabalhamos neste serviço (página). */
  tools: readonly string[];
  /** Title e description da página. */
  seoTitle: string;
  seoDescription: string;
}

export const SERVICES: readonly Service[] = [
  {
    slug: 'engenharia-de-dados',
    name: 'Engenharia de dados',
    subject: 'engenharia',
    outcome: 'Uma base *única e confiável* para a empresa inteira.',
    pain: 'Os números de cada área vêm de planilhas e sistemas diferentes, e ninguém sabe qual está certo.',
    summary:
      'Reunimos os dados de todos os sistemas numa base só, atualizada **sozinha** e com testes que avisam quando algo sai do padrão.',
    tagline: 'Base única e confiável',
    audience:
      'Para empresas que já têm ERP, CRM e planilhas, mas gastam horas conciliando números antes de cada reunião.',
    highlights: [
      'Os dados de todos os sistemas num lugar só',
      'Atualização automática, sem planilha no meio',
      'Alerta quando um número sai do padrão',
    ],
    signals: [
      'O fechamento do mês depende de planilhas cruzadas à mão',
      'Cada área tem a sua versão do mesmo número',
      'Relatórios quebram quando alguém muda uma coluna',
      'Uma pergunta nova exige pedir um relatório novo',
    ],
    deliverables: [
      {
        title: 'Mapa das fontes de dados',
        desc: 'Quais sistemas existem, que dados guardam e como se relacionam.',
      },
      {
        title: 'Base central (data warehouse)',
        desc: 'Um banco organizado por assunto do negócio, pronto para relatórios e para IA.',
      },
      {
        title: 'Rotinas de carga automáticas (pipelines)',
        desc: 'Os dados chegam dos sistemas no horário certo, sem ninguém exportar planilha.',
      },
      {
        title: 'Testes de qualidade',
        desc: 'Verificações que avisam antes de um número errado chegar a uma reunião.',
      },
    ],
    tools: ['PostgreSQL', 'Snowflake', 'dbt', 'Airflow', 'Python', 'Docker', 'GitHub Actions'],
    seoTitle: 'Engenharia de Dados para Empresas | Vetra Solutions',
    seoDescription:
      'Base de dados única e confiável para a sua empresa: integração de sistemas, data warehouse, cargas automáticas e testes de qualidade. Diagnóstico gratuito.',
  },
  {
    slug: 'dashboards',
    name: 'Dashboards',
    subject: 'dashboards',
    outcome: 'Indicadores que viram *decisão*, não planilha.',
    pain: 'Os relatórios chegam atrasados e cada reunião começa discutindo qual número está certo.',
    summary:
      'Definimos os indicadores com cada área e entregamos painéis que se atualizam sozinhos, com a **mesma regra para todos**.',
    tagline: 'Indicadores prontos',
    audience:
      'Para gestores que precisam acompanhar o negócio sem esperar alguém montar o relatório da semana.',
    highlights: [
      'Indicadores com a mesma definição em todas as áreas',
      'Painéis para a diretoria e para a operação',
      'Cada área vê só o que precisa',
    ],
    signals: [
      'O relatório da semana leva dias para ficar pronto',
      'Diretoria e operação olham números diferentes',
      'Ninguém sabe explicar de onde vem um indicador',
      'Os painéis existem, mas ninguém confia neles',
    ],
    deliverables: [
      {
        title: 'Dicionário de indicadores',
        desc: 'Cada métrica com definição, fórmula e responsável, acordados com as áreas.',
      },
      {
        title: 'Regras de cálculo centralizadas (camada semântica)',
        desc: 'As contas ficam num lugar só, e todos os painéis usam a mesma.',
      },
      {
        title: 'Painéis executivos e operacionais',
        desc: 'Visões para decidir e para acompanhar o dia a dia, atualizadas sozinhas.',
      },
      {
        title: 'Acesso por área',
        desc: 'Cada pessoa vê os dados de que precisa, com controle de permissão.',
      },
    ],
    tools: ['PostgreSQL', 'Snowflake', 'dbt', 'Streamlit', 'Python'],
    seoTitle: 'Dashboards e Indicadores para Empresas | Vetra Solutions',
    seoDescription:
      'Indicadores definidos com cada área e painéis que se atualizam sozinhos, com a mesma regra de cálculo para todos. Diagnóstico gratuito.',
  },
  {
    slug: 'agentes-de-ia',
    name: 'Agentes de IA',
    subject: 'agentes',
    outcome: 'IA *em produção*, com supervisão humana.',
    pain: 'A empresa testou IA, mas os pilotos não viraram rotina porque ninguém confia no resultado.',
    summary:
      'Colocamos a IA para executar tarefas reais, com regras claras, **revisão humana** nos pontos críticos e custo acompanhado.',
    tagline: 'Tarefas com aprovação humana',
    audience:
      'Para operações com tarefas de texto, triagem ou consulta que tomam horas da equipe toda semana.',
    highlights: [
      'Tarefas repetitivas feitas por IA, com regras claras',
      'Revisão humana nos pontos que importam',
      'Custo e qualidade acompanhados todo mês',
    ],
    signals: [
      'Pilotos de IA que não saíram do teste',
      'Equipe gastando horas em triagem e respostas repetidas',
      'Receio de a IA errar sem ninguém perceber',
      'Custo de IA sem controle',
    ],
    deliverables: [
      {
        title: 'Escolha do caso de uso',
        desc: 'A tarefa com mais ganho e menos risco para começar.',
      },
      {
        title: 'Agente integrado aos seus sistemas',
        desc: 'A IA lê e escreve onde a equipe já trabalha, dentro de limites definidos (guardrails).',
      },
      {
        title: 'Revisão humana',
        desc: 'Pontos de aprovação para decisões sensíveis, antes de qualquer ação.',
      },
      {
        title: 'Monitoramento',
        desc: 'Acompanhamento de custo, qualidade das respostas e erros.',
      },
    ],
    tools: ['Python', 'LangChain', 'PostgreSQL', 'Docker'],
    seoTitle: 'Agentes de IA para Empresas | Vetra Solutions',
    seoDescription:
      'IA executando tarefas reais da operação, integrada aos seus sistemas, com revisão humana e custo acompanhado. Diagnóstico gratuito.',
  },
  {
    slug: 'automacoes',
    name: 'Automações',
    subject: 'automacoes',
    outcome: '*Menos trabalho manual* entre sistemas.',
    pain: 'A equipe copia dados de um sistema para outro e confere tudo à mão.',
    summary:
      'Ligamos os sistemas entre si e automatizamos as rotinas repetitivas, com **aviso quando algo falha**.',
    tagline: 'Rotinas sem digitação',
    audience:
      'Para equipes que passam parte do dia movendo informação entre ERP, planilhas, e-mail e outros sistemas.',
    highlights: [
      'Sistemas que trocam dados sozinhos',
      'Rotinas que rodam no horário, sem lembrete',
      'Aviso imediato quando algo falha',
    ],
    signals: [
      'Dados copiados à mão de um sistema para outro',
      'Rotinas que dependem de alguém lembrar',
      'Erros de digitação que só aparecem no fim do mês',
      'Integrações que param sem ninguém perceber',
    ],
    deliverables: [
      {
        title: 'Integrações entre sistemas (APIs)',
        desc: 'Os sistemas conversam diretamente, sem exportar e importar planilhas.',
      },
      {
        title: 'Rotinas agendadas e encadeadas',
        desc: 'Cada tarefa roda na hora certa e dispara a seguinte.',
      },
      {
        title: 'Robôs para sistemas sem integração (RPA)',
        desc: 'Quando não há outro caminho, um robô faz o trabalho de tela.',
      },
      {
        title: 'Alertas e histórico',
        desc: 'Aviso quando algo falha e registro de tudo o que rodou.',
      },
    ],
    tools: ['Python', 'Airflow', 'Docker', 'GitHub Actions'],
    seoTitle: 'Automação de Processos | Vetra Solutions',
    seoDescription:
      'Sistemas que trocam dados sozinhos, rotinas automáticas e alerta quando algo falha. Menos trabalho manual para a equipe. Diagnóstico gratuito.',
  },
];

export const serviceUrl = (slug: string) => `/servicos/${slug}/`;
