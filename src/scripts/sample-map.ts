import { CONTACT_FORM } from '@/config/site';
import { track } from './track';

/** Libera o exemplo do mapa depois de nome e e-mail (SampleMapGate.astro). */
export function initSampleMapGates(): void {
  document.querySelectorAll<HTMLFormElement>('[data-sample-gate]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-sample-status]');
    const submit = form.querySelector<HTMLButtonElement>('[data-sample-submit]');
    // O campo `redirect` é absoluto (o Web3Forms exige, no envio sem JS); aqui basta o
    // caminho, para funcionar também em previews e no ambiente local.
    const redirect = (form.elements.namedItem('redirect') as HTMLInputElement | null)?.value;
    const target = redirect ? new URL(redirect).pathname : '/diagnostico/exemplo/';

    const release = () => {
      track('exemplo_mapa_liberado');
      window.location.assign(target);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Sem chave do Web3Forms ainda (dados de exemplo do site): libera sem captura.
      if (CONTACT_FORM.accessKey === 'TODO') return release();
      if (submit) submit.disabled = true;
      try {
        const res = await fetch(CONTACT_FORM.endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        const data = (await res.json()) as { success?: boolean };
        if (!res.ok || !data.success) throw new Error('recusado');
        release();
      } catch {
        if (status)
          status.textContent = 'Não foi possível registrar agora. Abrindo o exemplo mesmo assim…';
        setTimeout(release, 1200);
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  });
}
