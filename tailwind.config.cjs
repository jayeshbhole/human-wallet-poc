/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryBg: '#FFFBFE',
        primaryText: '#04100F',
      },
    },
  },
  plugins: [],
};
