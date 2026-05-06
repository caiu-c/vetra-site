const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reduceMotion.matches) {
  document.documentElement.classList.add('js-reveal-enabled');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 },
  );

  for (const el of document.querySelectorAll('[data-reveal]')) {
    observer.observe(el);
  }
}
