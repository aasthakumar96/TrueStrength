/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0C0B09',
        surface: {
          DEFAULT: '#141210',
          2: '#1C1A17',
          3: '#242118',
          4: '#2C2920',
        },
        border: {
          DEFAULT: '#2A2725',
          light: '#363129',
        },
        accent: {
          DEFAULT: '#C9A96E',
          text: '#E2C898',
          dim: '#8A7448',
        },
        'text-1': '#F0EAE0',
        'text-2': '#8A837A',
        'text-3': '#52504C',
        success: '#5B9B70',
        danger: '#B85C5C',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '14px',
        pill: '100px',
      },
      boxShadow: {
        'glow-accent': '0 0 32px rgba(201, 169, 110, 0.18)',
        card: '0 1px 3px rgba(0,0,0,0.5)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.6)',
        nav: '0 -1px 0 rgba(255,255,255,0.04), 0 -8px 32px rgba(0,0,0,0.5)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
}
