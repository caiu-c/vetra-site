/*
  Destaques no texto (ADR-011). Marcação mínima nas strings de conteúdo:
    *trecho*   → destaque de cor (Cobalto no claro, brand-light no escuro)
    **trecho** → ênfase de leitura (semibold, na cor de texto principal)
  O resultado vai para `set:html`; o texto é escapado antes, então só essas duas
  marcações viram HTML. Dose: um destaque de cor por título, até dois negritos por
  parágrafo, nunca em frase inteira.
*/

export type Tone = 'light' | 'dark';

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function emphasize(text: string, tone: Tone = 'light'): string {
  const color = tone === 'dark' ? 'text-brand-light' : 'text-brand';
  const strong = tone === 'dark' ? 'font-semibold text-white' : 'font-semibold text-ink';
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="${strong}">$1</strong>`)
    .replace(/\*(.+?)\*/g, `<span class="${color}">$1</span>`);
}

/** Texto sem a marcação (para title, meta description, aria-label). */
export const plain = (text: string) =>
  text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
