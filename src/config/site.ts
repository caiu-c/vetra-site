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

// TODO: substituir pelo link real de agendamento (Cal.com / Google Calendar)
export const BOOKING_URL = '#';

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
  { label: 'SISTEMAS', href: '#sistemas' },
  { label: 'METODOLOGIA', href: '#metodologia' },
  { label: 'CASOS', href: '#casos' },
  { label: 'SOBRE', href: '#sobre' },
] as const;
