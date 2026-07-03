/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0A0F',
          '2': '#12121A',
        },
        charcoal: {
          DEFAULT: '#242433',
          '2': '#2E2E42',
        },
        gold: {
          DEFAULT: '#C9A84C',
          '2': '#E8C97A',
          '3': '#F5E4B0',
          tint: 'rgba(201,168,76,0.12)',
          border: 'rgba(201,168,76,0.25)',
        },
        ivory: {
          DEFAULT: '#F8F4EC',
          '2': '#EDE8DE',
        },
        smoke: {
          DEFAULT: '#6B6B7E',
          '2': '#9494A8',
        },
        emerald: {
          DEFAULT: '#1A4731',
          light: 'rgba(26,71,49,0.15)',
        },
        crimson: {
          DEFAULT: '#7A1F2E',
          light: 'rgba(122,31,46,0.12)',
        },
        sapphire: {
          DEFAULT: '#1A2B5C',
          light: 'rgba(26,43,92,0.12)',
        },
        success: '#6FCF97',
        error: '#E07085',
        info: '#7EB5F5',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.2)',
        md: '0 4px 16px rgba(0,0,0,0.25)',
        lg: '0 12px 40px rgba(0,0,0,0.35)',
        gold: '0 6px 24px rgba(201,168,76,0.3)',
      },
    },
  },
  plugins: [],
}
