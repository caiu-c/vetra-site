import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF', // Papel
        surface: '#F2F4F8', // Névoa
        ink: '#0C1838', // Tinta — azul-marinho, texto e faixa escura
        brand: '#1640D6', // Cobalto — único acento
        muted: '#586178', // Aço — texto secundário (6.2:1 em Papel)
        subtle: '#8A93A6', // só decorativo ou texto ≥24px (3.1:1)
        line: '#DCE1EA', // Linha
        'line-strong': '#C5CCD8',
        'brand-deep': '#0C1838',
        'brand-soft': '#E8EDFB',
        'on-deep-muted': '#A9B6DA', // texto secundário sobre Tinta (8.6:1)
        'line-deep': '#24325A',
        'on-brand-muted': '#DCE3FC', // texto secundário sobre Cobalto (6.0:1)
        // Dados de gráfico sobre Tinta. Validado com o script da skill dataviz (modo
        // escuro, superfície #0C1838): L dentro de 0.48–0.67, croma ≥ 0.10, ≥ 3:1.
        'brand-light': '#6A8CF7',
        'chart-context': '#6B7699', // série de contexto (antes/depois) sobre Tinta, 3.9:1
        danger: '#B42318', // erro de formulário
      },
      fontFamily: {
        sans: ['"Archivo Variable"', 'system-ui', 'sans-serif'],
      },
      // Escala de Bringhurst (12 · 14 · 16 · 18 · 21 · 24 · 36 · 48 · 60 · 72),
      // com os passos de título fluidos entre dois pontos da escala.
      fontSize: {
        meta: ['14px', { lineHeight: '1.45' }],
        body: ['16px', { lineHeight: '1.6' }],
        lead: ['18px', { lineHeight: '1.55' }],
        h4: ['21px', { lineHeight: '1.3' }],
        h3: ['24px', { lineHeight: '1.25' }],
        h2: ['clamp(30px, 3.6vw, 48px)', { lineHeight: '1.08' }],
        cta: ['clamp(36px, 4.8vw, 60px)', { lineHeight: '1.02' }],
        display: ['clamp(44px, 6vw, 72px)', { lineHeight: '1' }],
        stat: ['clamp(36px, 3.6vw, 48px)', { lineHeight: '1' }],
        // Exceção à escala: só a métrica de destaque de cada caso.
        metric: ['clamp(56px, 6.5vw, 96px)', { lineHeight: '0.95' }],
      },
      maxWidth: {
        measure: '36rem',
      },
      letterSpacing: {
        display: '-0.035em',
        heading: '-0.02em',
      },
    },
  },
  plugins: [typography, forms],
};
