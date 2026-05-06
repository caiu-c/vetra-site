import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F3EE',
        paper: '#E8E4DA',
        ink: '#0A1628',
        accent: '#1E4D8C',
        muted: '#5A6470',
        rule: '#C8CDD4',
        'rule-dark': '#2A3A52',
        'muted-on-dark': '#8A96A8',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: '1280px',
        panel: '1100px',
      },
    },
  },
  plugins: [typography, forms],
};
