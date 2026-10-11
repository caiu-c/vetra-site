/**
 * Casos de clientes exibidos no carrossel (src/components/Cases.astro).
 * Cada caso traz o próprio gráfico do resultado (src/components/CaseChart.astro).
 */

export type CaseChart =
  | {
      kind: 'convergence';
      caption: string;
      sources: number;
      sourceLabel: string;
      targetLabel: string;
      targetDetail: string;
    }
  | {
      kind: 'line';
      caption: string;
      unit: string;
      labels: string[];
      values: number[];
      /** Domínio do eixo Y [mín, máx]. */
      domain: [number, number];
      yTicks: number[];
      /** Índice do primeiro ponto depois do evento (ex.: entrada em produção). */
      eventIndex: number;
      eventLabel: string;
      /** Rótulo do último ponto (ex.: "−32%"). */
      endLabel: string;
    }
  | {
      kind: 'columns';
      caption: string;
      unit: string;
      /** Unidade no singular, para "1 área" vs "5 áreas". */
      unitSingular: string;
      labels: string[];
      values: number[];
      domain: [number, number];
      yTicks: number[];
    };

export interface ClientCase {
  sector: string;
  title: string;
  metric: string;
  metricLabel: string;
  challenge: string;
  solution: string;
  result: string;
  chart: CaseChart;
}

const months = (n: number) => Array.from({ length: n }, (_, i) => `Mês ${i + 1}`);

/* TODO: substituir por casos reais, com aprovação do cliente para cada peça.
   A "solução" vem do texto aprovado anterior; "desafio" e "resultado" são rascunhos do
   redesign, e as séries dos gráficos são ilustrativas (coerentes com a métrica). */
export const CASES: ClientCase[] = [
  {
    sector: 'Varejo, Nordeste',
    title: 'Pipeline analítico unificado',
    metric: '14×',
    metricLabel: 'fontes de dados consolidadas',
    challenge: 'Vendas e estoque espalhados em 14 sistemas, conciliados à mão toda semana.',
    solution: 'Migração das 14 fontes para um data lake centralizado, com SLA de freshness de 5 minutos.',
    result: 'Uma base única, atualizada a cada 5 minutos, para todas as áreas.',
    chart: {
      kind: 'convergence',
      caption: '14 fontes de dados consolidadas em uma base',
      sources: 14,
      sourceLabel: '14 fontes',
      targetLabel: '1 base',
      targetDetail: 'atualizada a cada 5 min',
    },
  },
  {
    sector: 'Indústria, Sudeste',
    title: 'Agentes de IA em logística',
    metric: '32%',
    metricLabel: 'de redução no custo de frete',
    challenge: 'Roteirização feita à mão e exceções operacionais tratadas caso a caso.',
    solution: 'Roteirização autônoma com guardrails humanos para exceções operacionais.',
    result: 'Custo de frete 32% menor seis meses depois de os agentes entrarem em produção.',
    chart: {
      kind: 'line',
      caption: 'Custo de frete por mês, índice (mês 1 = 100)',
      unit: 'Índice',
      labels: months(12),
      values: [100, 102, 99, 101, 100, 98, 90, 82, 76, 72, 69, 68],
      domain: [60, 110],
      yTicks: [60, 80, 100],
      eventIndex: 6,
      eventLabel: 'Agentes em produção',
      endLabel: '−32%',
    },
  },
  {
    sector: 'Serviços, Brasil',
    title: 'Camada semântica e dashboards executivos',
    metric: '7',
    metricLabel: 'áreas com os mesmos indicadores',
    challenge: 'Cada área calculava os próprios indicadores, com números diferentes para a mesma métrica.',
    solution: 'Camada semântica em dbt + Streamlit para 7 áreas de negócio.',
    result: 'Um só número para cada indicador, usado pelas 7 áreas.',
    chart: {
      kind: 'columns',
      caption: 'Áreas usando a camada semântica, por mês',
      unit: 'Áreas',
      unitSingular: 'Área',
      labels: months(7),
      values: [1, 1, 2, 3, 5, 6, 7],
      domain: [0, 8],
      yTicks: [0, 4, 8],
    },
  },
];
