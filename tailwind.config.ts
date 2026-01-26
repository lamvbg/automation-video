import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(16 185 129 / 0.2), 0 0 20px rgb(16 185 129 / 0.1)' },
          '100%': { boxShadow: '0 0 10px rgb(16 185 129 / 0.4), 0 0 40px rgb(16 185 129 / 0.2)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
