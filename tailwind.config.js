/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg0: '#070C1A',
        bg1: '#0B1224',
        surface: 'rgba(255,255,255,0.04)',
        border: 'rgba(255,255,255,0.10)',
        tx1: '#E6ECFF',
        tx2: '#9DA9C0',
        meta: '#1877F2',
        prospe: '#34A853',
        organ: '#FF6F61',
        good: '#58F178',
        warn: '#FFD84D',
        bad: '#FF6B6B',
      },
    },
  },
  plugins: [],
} 