import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a855f7',
          light: '#c084fc',
          dark: '#7e22ce'
        },
        accent: {
          blue: '#3b82f6',
          pink: '#ec4899'
        }
      }
    }
  },
  plugins: []
};

export default config;
