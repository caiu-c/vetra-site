/**
 * Agenda (ADR-012): links `a[data-booking]` (href = página do Cal.com) abrem a agenda
 * numa janela sobre a página. O iframe só é criado no primeiro clique, então nada do
 * Cal.com pesa no carregamento. Ctrl/Cmd+clique e clique do meio seguem abrindo em nova
 * aba; sem <dialog> (ou sem JS), o link funciona como link.
 */
export function initBooking(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-booking-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const frameBox = dialog.querySelector<HTMLElement>('[data-booking-frame]');
  const external = dialog.querySelector<HTMLAnchorElement>('[data-booking-external]');
  let current = '';

  const open = (url: string) => {
    if (frameBox && url !== current) {
      const src = new URL(url);
      src.searchParams.set('embed', 'true');
      src.searchParams.set('theme', 'light');
      src.searchParams.set('layout', 'month_view');
      const iframe = document.createElement('iframe');
      iframe.src = src.href;
      iframe.title = 'Agenda de horários';
      iframe.className = 'absolute inset-0 h-full w-full border-0 bg-canvas';
      frameBox.querySelector('iframe')?.remove();
      frameBox.append(iframe);
      current = url;
    }
    if (external) external.href = url;
    document.querySelector<HTMLDialogElement>('#mobile-menu[open]')?.close();
    dialog.showModal();
    document.dispatchEvent(new CustomEvent('vetra:booking-open', { detail: { url } }));
  };

  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-booking]');
    if (
      !link ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    open(link.href);
  });

  dialog.querySelector('[data-booking-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}
