import { CONTACT, CONTACT_FORM } from '@/config/site';
import { track } from './track';

const SUBMIT_LABEL = 'Enviar mensagem';

/**
 * Formulário de contato (Contact.astro) com envio inline para o Web3Forms.
 * A validação é a nativa do navegador: o evento submit só chega aqui com os campos
 * obrigatórios válidos. Também pré-seleciona o assunto quando a pessoa chega por um
 * CTA com `data-subject` (ex.: "Agendar diagnóstico gratuito").
 */
export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const submit = form.querySelector<HTMLButtonElement>('[data-contact-submit]');
  const status = form.querySelector<HTMLElement>('[data-contact-status]');
  const topic = form.querySelector<HTMLSelectElement>('[data-contact-topic]');
  const subjectField = form.querySelector<HTMLInputElement>('[data-contact-subject-field]');
  const success = document.querySelector<HTMLElement>('[data-contact-success]');

  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest<HTMLElement>('[data-subject]');
    if (!trigger || !topic) return;
    const option = Array.from(topic.options).find((o) => o.dataset.key === trigger.dataset.subject);
    if (option) topic.value = option.value;
  });

  const showError = (reason: string) => {
    if (!status) return;
    const mail = document.createElement('a');
    mail.href = `mailto:${CONTACT.email}`;
    mail.textContent = CONTACT.email;
    mail.className = 'underline underline-offset-2';
    status.className = 'text-meta text-danger';
    status.replaceChildren(`${reason} Tente de novo ou escreva para `, mail, '.');
  };

  form.addEventListener('focusin', () => track('formulario_inicio'), { once: true });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!submit || !status) return;

    if (CONTACT_FORM.accessKey === 'TODO') {
      showError('O envio pelo site ainda não está ativo.');
      return;
    }

    if (subjectField && topic) subjectField.value = `Novo contato pelo site: ${topic.value}`;
    submit.disabled = true;
    submit.textContent = 'Enviando…';
    status.className = 'text-meta text-muted';
    status.textContent = '';

    try {
      const response = await fetch(CONTACT_FORM.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = (await response.json()) as { success?: boolean };
      if (!response.ok || !data.success) throw new Error('Envio recusado');

      track('formulario_enviado', { assunto: topic?.value ?? '' });
      form.hidden = true;
      if (success) {
        success.classList.replace('hidden', 'flex');
        success.focus();
      }
    } catch {
      showError('Não foi possível enviar a mensagem.');
    } finally {
      submit.disabled = false;
      submit.textContent = SUBMIT_LABEL;
    }
  });
}
