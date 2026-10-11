/**
 * Medição de conversão (ADR-012, auditoria de conversão C10). `track()` grava o evento
 * em `window.dataLayer` e repassa para o provedor de analytics que estiver na página
 * (Plausible, Umami ou GA4) — nenhum é carregado por padrão; a escolha é do dono
 * (README → Medição). Sem provedor, os eventos ficam só no dataLayer.
 *
 * Eventos: agenda_aberta, formulario_inicio, formulario_enviado, exemplo_mapa_liberado,
 * teste_concluido, calculadora_usada, além de cliques em elementos com `data-track`.
 */
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    plausible?: (event: string, options?: { props?: Props }) => void;
    umami?: { track: (event: string, data?: Props) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Props = {}): void {
  (window.dataLayer ??= []).push({ event, ...props });
  window.plausible?.(event, { props });
  window.umami?.track(event, props);
  window.gtag?.('event', event, props);
}

export function initTracking(): void {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
    if (!el?.dataset.track) return;
    track(el.dataset.track, {
      label: el.dataset.trackLabel ?? el.textContent?.trim().slice(0, 60) ?? '',
      section: el.closest('section')?.id ?? '',
    });
  });

  document.addEventListener('vetra:booking-open', (e) => {
    const { url, section } = (e as CustomEvent<{ url: string; section: string }>).detail;
    track('agenda_aberta', { url, section });
  });
}
