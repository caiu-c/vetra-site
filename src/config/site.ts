export const SITE = {
  name: 'Vetra Solutions',
  domain: 'vetrasolutions.com.br',
  url: 'https://vetrasolutions.com.br',
  title: 'Vetra Solutions — Engenharia de Dados & IA',
  description:
    'Construímos sistemas de dados, agentes de IA e automações com rigor de engenharia. Resultado de negócio sustentado por arquitetura técnica.',
  city: 'Fortaleza/CE',
  founded: 2026,
} as const;

// "Agendar diagnóstico" leva ao formulário de contato (assunto pré-selecionado via
// data-subject="diagnostico"). TODO: trocar pelo link de agendamento (Cal.com /
// Google Agenda) quando existir.
export const BOOKING_URL = '#contato';

// Formulário de contato via Web3Forms (https://web3forms.com): a chave é pública por
// desenho do serviço e define para qual e-mail as mensagens vão.
// TODO: criar a chave grátis com o e-mail que vai receber os contatos. Enquanto for
// 'TODO', o envio mostra o erro com o link mailto: como alternativa.
export const CONTACT_FORM = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: 'TODO',
} as const;

export const CONTACT_SUBJECTS = [
  { value: 'diagnostico', label: 'Diagnóstico de dados' },
  { value: 'engenharia', label: 'Engenharia de dados' },
  { value: 'dashboards', label: 'Dashboards' },
  { value: 'agentes', label: 'Agentes de IA' },
  { value: 'automacoes', label: 'Automações' },
  { value: 'outro', label: 'Outro' },
] as const;

// TODO: confirmar dados antes do go-live
export const CONTACT = {
  email: 'contato@vetrasolutions.com.br',
  linkedin: 'https://www.linkedin.com/company/vetra-solutions',
  cnpj: '00.000.000/0001-00',
} as const;

// TODO: confirmar endereço completo antes do go-live (validar com cliente)
export const ADDRESS = {
  streetAddress: 'TODO',
  addressLocality: 'Fortaleza',
  addressRegion: 'CE',
  postalCode: 'TODO',
  addressCountry: 'BR',
} as const;

export const NAV = [
  { label: 'Sistemas', href: '#sistemas' },
  { label: 'Metodologia', href: '#metodologia' },
  { label: 'Diagnóstico', href: '#diagnostico' },
  { label: 'Casos', href: '#casos' },
  { label: 'Sobre', href: '#sobre' },
] as const;
