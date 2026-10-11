import { track } from './track';

interface Level {
  id: string;
  min: number;
  title: string;
  summary: string;
  next: string;
}

declare global {
  interface Window {
    __maturity?: { levels: Level[]; maxScore: number };
  }
}

/** Calcula o resultado do teste de maturidade (página /teste-de-maturidade/). */
export function initMaturityTest(): void {
  const form = document.querySelector<HTMLFormElement>('[data-maturity-form]');
  const result = document.querySelector<HTMLElement>('[data-maturity-result]');
  const config = window.__maturity;
  if (!form || !result || !config) return;

  const error = form.querySelector<HTMLElement>('[data-maturity-error]');
  const set = (sel: string, text: string) => {
    const el = result.querySelector<HTMLElement>(sel);
    if (el) el.textContent = text;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fieldsets = Array.from(form.querySelectorAll('fieldset'));
    const missing = fieldsets.findIndex((fs) => !fs.querySelector('input:checked'));
    if (missing >= 0) {
      if (error) error.textContent = `Falta responder a pergunta ${missing + 1}.`;
      fieldsets[missing].querySelector<HTMLInputElement>('input')?.focus();
      return;
    }
    if (error) error.textContent = '';

    const score = fieldsets.reduce(
      (sum, fs) => sum + Number(fs.querySelector<HTMLInputElement>('input:checked')?.value ?? 0),
      0,
    );
    const level = [...config.levels].reverse().find((l) => score >= l.min) ?? config.levels[0];

    set('[data-result-title]', level.title);
    set('[data-result-score]', `${score} de ${config.maxScore}`);
    set('[data-result-summary]', level.summary);
    set('[data-result-next]', level.next);
    result.classList.replace('hidden', 'flex');
    const bar = result.querySelector<HTMLElement>('[data-result-bar]');
    requestAnimationFrame(() => {
      if (bar) bar.style.width = `${Math.round((score / config.maxScore) * 100)}%`;
    });
    result.focus();
    result.scrollIntoView({ block: 'start' });
    track('teste_concluido', { nivel: level.id, pontos: score });
  });
}
