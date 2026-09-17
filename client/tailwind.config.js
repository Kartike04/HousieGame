/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        housie: {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          dark: '#0f172a',
          card: '#1e293b',
          accent: '#8b5cf6',
          gold: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'bounce-short': 'bounce 0.5s ease-in-out 1',
        'pulse-glow': 'pulseGlow 2s infinite',
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'flip-number': 'flipNumber 0.6s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(245, 158, 11, 0.8)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flipNumber: {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
