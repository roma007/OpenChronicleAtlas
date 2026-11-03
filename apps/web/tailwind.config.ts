import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#231c15',
        'ink-soft': '#4a3d30',
        parchment: '#f3ead9',
        'parchment-deep': '#e6d8c0',
        cinnabar: '#8c2f24',
        ochre: '#b8863b',
        moss: '#5b7f6b',
      },
      fontFamily: {
        serif: ['Songti SC', 'STSong', 'Noto Serif SC', 'serif'],
        sans: ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 18px 50px rgba(35, 28, 21, 0.22)',
      },
    },
  },
  plugins: [],
} satisfies Config;
