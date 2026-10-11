/**
 * Mostra a barra de ação do celular (StickyCta.astro) depois que a primeira seção sai
 * da tela e a esconde enquanto o contato ou o rodapé estão visíveis — lá já há botões,
 * e a barra não pode cobrir o formulário.
 */
export function initStickyCta(): void {
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  const first = document.querySelector<HTMLElement>('main > section');
  if (!bar || !first) return;

  const blockers = [document.getElementById('contato'), document.querySelector('footer')].filter(
    (el): el is HTMLElement => el !== null,
  );
  let pastTop = false;
  const visibleBlockers = new Set<Element>();
  const update = () => bar.classList.toggle('is-visible', pastTop && visibleBlockers.size === 0);

  new IntersectionObserver(([entry]) => {
    pastTop = !entry.isIntersecting;
    update();
  }).observe(first);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) =>
      e.isIntersecting ? visibleBlockers.add(e.target) : visibleBlockers.delete(e.target),
    );
    update();
  });
  blockers.forEach((el) => io.observe(el));
}
