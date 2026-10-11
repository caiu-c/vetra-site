/**
 * Gráficos dos casos (CaseChart.astro) como `role="slider"` (`[data-chart-scrub]`):
 * ←/→ (e Home/End) percorrem os meses, atualizando aria-valuenow/aria-valuetext, de
 * modo que teclado e leitor de tela recebem o mesmo que o hover. As setas não
 * propagam para o carrossel; Esc esconde a leitura.
 * - "line": crosshair + tooltip que encaixam no mês mais próximo do ponteiro.
 * - "columns": o hover é CSS por coluna; o teclado marca a coluna ativa.
 * O tooltip só complementa: os valores também estão na tabela "Ver dados".
 */
export function initChartScrubbers(): void {
  document.querySelectorAll<HTMLElement>('[data-chart-scrub]').forEach((plot) => {
    const texts = JSON.parse(plot.dataset.valuetexts ?? '[]') as string[];
    const n = texts.length;
    if (n < 2) return;

    const clamp = (i: number) => Math.max(0, Math.min(n - 1, i));
    let current = n - 1;
    const render = plot.dataset.chartScrub === 'line' ? lineRenderer(plot) : columnsRenderer(plot);
    if (!render) return;

    const show = (i: number) => {
      current = clamp(i);
      plot.setAttribute('aria-valuenow', String(current + 1));
      plot.setAttribute('aria-valuetext', texts[current]);
      render.show(current);
    };

    plot.addEventListener('keydown', (e) => {
      const step: Record<string, number> = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };
      if (e.key in step) show(current + step[e.key]);
      else if (e.key === 'Home') show(0);
      else if (e.key === 'End') show(n - 1);
      else if (e.key === 'Escape') render.hide();
      else return;
      e.preventDefault();
      e.stopPropagation();
    });
    plot.addEventListener('focus', () => show(current));
    plot.addEventListener('blur', () => render.hide());

    if (render.track) {
      plot.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const r = plot.getBoundingClientRect();
        show(Math.round(((e.clientX - r.left) / r.width) * (n - 1)));
      });
      plot.addEventListener('pointerleave', () => render.hide());
    } else {
      // Colunas: o hover por CSS assume; some a marcação de teclado.
      plot.addEventListener('pointerenter', () => render.hide());
    }
  });
}

interface Renderer {
  show: (i: number) => void;
  hide: () => void;
  /** true quando o ponteiro deve dirigir a leitura (crosshair). */
  track: boolean;
}

function lineRenderer(plot: HTMLElement): Renderer | null {
  const values = JSON.parse(plot.dataset.values ?? '[]') as number[];
  const labels = JSON.parse(plot.dataset.labels ?? '[]') as string[];
  const [min, max] = JSON.parse(plot.dataset.domain ?? '[0,1]') as [number, number];
  const cross = plot.querySelector<HTMLElement>('[data-cross]');
  const dot = plot.querySelector<HTMLElement>('[data-cross-dot]');
  const tip = plot.querySelector<HTMLElement>('[data-cross-tip]');
  const tipValue = tip?.querySelector<HTMLElement>('[data-tip-value]');
  const tipLabel = tip?.querySelector<HTMLElement>('[data-tip-label]');
  if (!cross || !dot || !tip || !tipValue || !tipLabel) return null;
  const n = values.length;

  return {
    track: true,
    show(i) {
      const x = (i / (n - 1)) * 100;
      const y = (1 - (values[i] - min) / (max - min)) * 100;
      cross.style.left = `${x}%`;
      dot.style.left = `${x}%`;
      dot.style.top = `${y}%`;
      tipValue.textContent = String(values[i]);
      tipLabel.textContent = labels[i] ?? '';
      // Acima do ponto; perto das bordas, ancorado para dentro do gráfico.
      const tx = x < 15 ? '0%' : x > 85 ? '-100%' : '-50%';
      tip.style.left = `${x}%`;
      tip.style.top = `${y}%`;
      tip.style.transform = `translate(${tx}, calc(-100% - 14px))`;
      plot.dataset.active = 'true';
    },
    hide() {
      plot.dataset.active = 'false';
    },
  };
}

function columnsRenderer(plot: HTMLElement): Renderer {
  const bars = Array.from(plot.querySelectorAll<HTMLElement>('[data-bar]'));
  return {
    track: false,
    show(i) {
      bars.forEach((bar, k) => {
        bar.dataset.active = String(k === i);
      });
    },
    hide() {
      bars.forEach((bar) => {
        bar.dataset.active = 'false';
      });
    },
  };
}
