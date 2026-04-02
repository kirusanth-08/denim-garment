import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#F6F0E4',
        card: '#FFFDF8',
        accent: '#B86A28',
        accentSoft: '#EBC8A6',
        forest: '#214B4C',
        mist: '#E5DDD0',
        ink: '#1E293B',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 30px 80px -40px rgba(30, 41, 59, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;

