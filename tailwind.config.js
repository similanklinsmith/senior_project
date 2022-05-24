const path = require('path');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  purge: [
    path.resolve(__dirname, './node_modules/litepie-datepicker/**/*.js')
  ],
  darkMode: 'class',
  theme: {
    fontSize: {
      'xs': '8px',
    },
    extend: {
      colors: {
        'litepie-primary': colors.violet, // color system for light mode
        'litepie-secondary': colors.black // color system for dark mode
      }
    }
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      textOpacity: ['disabled'],
      textColor: ['disabled']
    }
  },
  plugins: []
};