/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          green:  '#00e5a0',
          blue:   '#00aaff',
          amber:  '#ffb800',
          red:    '#ff4757',
          purple: '#a855f7',
        },
        dark: {
          900: '#030d1c',
          800: '#071528',
          700: '#0c1e3a',
          600: '#112548',
          500: '#1a3358',
        },
      },
      backgroundImage: {
        'grid-dark': "linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)",
        'grid-light': "linear-gradient(rgba(0,100,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,60,0.04) 1px, transparent 1px)",
        'glow-green': 'radial-gradient(circle at center, rgba(0,229,160,0.15) 0%, transparent 70%)',
        'glow-blue':  'radial-gradient(circle at center, rgba(0,170,255,0.12) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '44px 44px',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink':      'blink 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.8s infinite',
        'spin-slow':  'spin 1s linear infinite',
        'float':      'float 4s ease-in-out infinite',
        'slide-down': 'slideDown 0.2s ease forwards',
      },
      keyframes: {
        fadeUp:    { from: { opacity:0, transform:'translateY(16px)' }, to: { opacity:1, transform:'translateY(0)' } },
        fadeIn:    { from: { opacity:0 }, to: { opacity:1 } },
        blink:     { '0%,100%': { opacity:1 }, '50%': { opacity:0.2 } },
        shimmer:   { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
        float:     { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-6px)' } },
        slideDown: { from: { opacity:0, transform:'translateY(-8px)' }, to: { opacity:1, transform:'translateY(0)' } },
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(0,229,160,0.25)',
        'glow-sm':    '0 0 12px rgba(0,229,160,0.2)',
        'card':       '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
