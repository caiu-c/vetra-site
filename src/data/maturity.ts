/*
  Teste de maturidade de dados (ADR-012, auditoria de conversão C3): 8 perguntas, cada
  resposta vale 0 a 3 pontos (máx. 24). A pontuação é calculada no navegador
  (página /teste-de-maturidade/). TODO: validar perguntas e textos com o dono.
*/

export interface MaturityQuestion {
  id: string;
  text: string;
  options: readonly { label: string; points: 0 | 1 | 2 | 3 }[];
}

export const QUESTIONS: readonly MaturityQuestion[] = [
  {
    id: 'relatorios',
    text: 'Como os relatórios de gestão são montados hoje?',
    options: [
      { label: 'À mão, em planilhas, a cada fechamento', points: 0 },
      { label: 'Planilhas com algumas fórmulas e modelos prontos', points: 1 },
      { label: 'Uma ferramenta de BI, mas alimentada à mão', points: 2 },
      { label: 'Painéis que se atualizam sozinhos', points: 3 },
    ],
  },
  {
    id: 'fontes',
    text: 'Os dados dos seus sistemas (ERP, CRM, estoque) estão integrados?',
    options: [
      { label: 'Não, cada um fica no seu sistema', points: 0 },
      { label: 'Exportamos e juntamos quando precisa', points: 1 },
      { label: 'Alguns estão integrados', points: 2 },
      { label: 'Sim, numa base central', points: 3 },
    ],
  },
  {
    id: 'confianca',
    text: 'Quando duas áreas olham o mesmo indicador, os números batem?',
    options: [
      { label: 'Quase nunca', points: 0 },
      { label: 'Às vezes, depois de muita conferência', points: 1 },
      { label: 'Na maior parte das vezes', points: 2 },
      { label: 'Sempre: a regra de cálculo é uma só', points: 3 },
    ],
  },
  {
    id: 'tempo',
    text: 'Quanto tempo leva para responder uma pergunta nova da diretoria?',
    options: [
      { label: 'Dias ou semanas', points: 0 },
      { label: 'Um ou dois dias', points: 1 },
      { label: 'Algumas horas', points: 2 },
      { label: 'Minutos: a própria diretoria consulta', points: 3 },
    ],
  },
  {
    id: 'automacao',
    text: 'Quanto trabalho manual existe entre sistemas (copiar, colar, redigitar)?',
    options: [
      { label: 'Muito, todo dia', points: 0 },
      { label: 'Bastante, em rotinas fixas', points: 1 },
      { label: 'Pouco, só em exceções', points: 2 },
      { label: 'Quase nenhum', points: 3 },
    ],
  },
  {
    id: 'qualidade',
    text: 'Como vocês descobrem que um dado está errado?',
    options: [
      { label: 'Quando alguém reclama', points: 0 },
      { label: 'Numa conferência manual', points: 1 },
      { label: 'Com algumas checagens automáticas', points: 2 },
      { label: 'Alertas avisam antes de chegar ao relatório', points: 3 },
    ],
  },
  {
    id: 'ia',
    text: 'Como está a inteligência artificial na sua operação?',
    options: [
      { label: 'Ainda não usamos', points: 0 },
      { label: 'Testes pontuais, sem uso no dia a dia', points: 1 },
      { label: 'Um ou dois usos em produção', points: 2 },
      { label: 'Vários usos, com regras e acompanhamento', points: 3 },
    ],
  },
  {
    id: 'responsavel',
    text: 'Existe alguém responsável pelos dados da empresa?',
    options: [
      { label: 'Não, cada área cuida do seu', points: 0 },
      { label: 'O TI cuida, entre outras coisas', points: 1 },
      { label: 'Uma pessoa dedicada, sem estrutura', points: 2 },
      { label: 'Um time ou um parceiro com processo definido', points: 3 },
    ],
  },
];

export interface MaturityLevel {
  id: string;
  min: number;
  title: string;
  summary: string;
  next: string;
}

/** Faixas de pontuação (0–24), da menor para a maior. */
export const LEVELS: readonly MaturityLevel[] = [
  {
    id: 'planilha',
    min: 0,
    title: 'Planilha no comando',
    summary:
      'As decisões dependem de planilhas montadas à mão, e cada área tem a sua versão do número. É o ponto em que mais se ganha com pouco.',
    next: 'Comece pela base: reunir os dados dos sistemas num lugar só, com atualização automática.',
  },
  {
    id: 'organizacao',
    min: 9,
    title: 'Em organização',
    summary:
      'Já há integrações e ferramentas, mas ainda com trabalho manual e números que nem sempre batem. Falta uma regra única e confiável.',
    next: 'Padronize os indicadores e automatize as cargas que ainda passam por planilha.',
  },
  {
    id: 'escala',
    min: 17,
    title: 'Pronto para escalar',
    summary:
      'A base está de pé e os números são confiáveis. O próximo salto é colocar IA e automações para trabalhar em cima dela.',
    next: 'Escolha um processo com muito trabalho repetitivo e leve IA para produção, com supervisão.',
  },
];

export const MAX_SCORE = QUESTIONS.length * 3;
