export const SITE = {
  name: 'Vetra Solutions',
  domain: 'vetrasolutions.com.br',
  url: 'https://vetrasolutions.com.br',
  // Termo principal no início, marca no fim (auditoria A4). TODO: validar texto.
  title: 'Consultoria de Engenharia de Dados | Vetra Solutions',
  description:
    'Consultoria de engenharia de dados em Fortaleza para empresas de todo o Brasil: base de dados única, dashboards, IA e automações. Diagnóstico gratuito.',
  city: 'Fortaleza/CE',
  founded: 2026,
} as const;

// "Agendar diagnóstico gratuito" leva ao formulário de contato (assunto pré-selecionado via
// data-subject="diagnostico"). TODO: trocar pelo link de agendamento (Cal.com /
// Google Agenda) quando existir.
// Âncora do formulário na própria página. Páginas sem o formulário (404, privacidade)
// passam `contactOnPage={false}` ao BaseLayout, e o cabeçalho/rodapé usam HOME_CONTACT_URL.
export const BOOKING_URL = '#contato';
export const HOME_CONTACT_URL = '/#contato';

// Formulário de contato via Web3Forms (https://web3forms.com): a chave é pública por
// desenho do serviço e define para qual e-mail as mensagens vão.
// TODO: criar a chave grátis com o e-mail que vai receber os contatos. Enquanto for
// 'TODO', o envio mostra o erro com o link mailto: como alternativa.
export const CONTACT_FORM = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: 'TODO',
} as const;

export const CONTACT_SUBJECTS = [
  { value: 'diagnostico', label: 'Diagnóstico gratuito' },
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
  // TODO: número do WhatsApp só com dígitos, com país e DDD (ex.: '5585999990000').
  // Vazio = o link não aparece no site (auditoria A14).
  whatsapp: '',
} as const;

/** Link do WhatsApp com mensagem pré-preenchida, ou null enquanto não houver número. */
export function whatsappUrl(
  message = 'Olá, vim pelo site e quero saber sobre o diagnóstico gratuito.',
): string | null {
  const digits = CONTACT.whatsapp.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

// TODO: confirmar endereço completo antes do go-live (validar com cliente)
export const ADDRESS = {
  streetAddress: 'TODO',
  addressLocality: 'Fortaleza',
  addressRegion: 'CE',
  postalCode: 'TODO',
  addressCountry: 'BR',
} as const;

// Bloco "Quem conduz" (auditoria A5): substitui o manifesto na home assim que `name`
// for preenchido. TODO: preencher com os dados reais.
// - photo: retrato em WebP (~800×1000 px) dentro de public/, ex.: '/fundador.webp'.
//   Fundo neutro, luz natural, olhar para a câmera (auditoria-ux/identidade-proposta.md).
//   Sem foto, entram as iniciais.
// - credentials: 3 ou 4 fatos verificáveis (formação, certificações, anos de
//   experiência, setores), sem nomear ex-empregadores sem autorização.
export const FOUNDER: {
  name: string;
  role: string;
  photo: string;
  linkedin: string;
  credentials: readonly string[];
} = {
  name: '',
  role: '',
  photo: '',
  linkedin: '',
  credentials: [],
};

// Seções da home com href absoluto: funcionam também nas outras páginas (na própria
// home, "/#x" é navegação no mesmo documento e rola suave).
export const NAV = [
  { label: 'Diagnóstico', href: '/#diagnostico' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Casos', href: '/#casos' },
  { label: 'Sobre', href: '/#sobre' },
] as const;
