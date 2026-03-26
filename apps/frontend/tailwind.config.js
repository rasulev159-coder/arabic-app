/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a84c',
          light:   '#e8c96d',
          dim:     '#8a6f2e',
        },
        bg: {
          DEFAULT: '#0d0a07',
          2:       '#141008',
          3:       '#1c160e',
          card:    '#1a1208',
        },
      },
      fontFamily: {
        cinzel:      ['Cinzel', 'serif'],
        scheherazade:['Scheherazade New', 'serif'],
        raleway:     ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
