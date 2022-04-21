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
    // spacing: {
    //   '1': '4px',
    //   '2': '8px',
    //   '3': '12px',
    //   '4': '16px',
    //   '5': '20px',
    //   '6': '24px',
    // },
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