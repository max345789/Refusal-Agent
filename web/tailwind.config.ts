import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        highlight: 'var(--highlight)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      boxShadow: {
        'skeuo': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.6)',
        'skeuo-hover': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.08), inset 0 1px 0 0 rgba(255,255,255,0.7)',
        'skeuo-press': 'inset 0 2px 4px 0 rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.06)',
        'card': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05), inset 0 1px 0 0 rgba(255,255,255,0.8)',
        'card-hover': '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05), inset 0 1px 0 0 rgba(255,255,255,0.9)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.4)',
      },
      backgroundImage: {
        'gradient-button': 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 50%), linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%)',
        'gradient-surface': 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
