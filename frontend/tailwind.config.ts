import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        focus: '0 0 0 3px rgb(37 99 235 / 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;
