const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      screens: {
      },
      fontFamily: {
        'sans': ['Chivo', 'sans-serif'], // overriding 'sans' familiy with 'chivo'(desired) because its called as default in all the text
      },
      extend: {
        colors: {
          'stamm-primary': '#00D89D',
          'stamm-black': '#272727',
          'stamm-gray': '#D8D8D8',
          'stamm-white': '#F9F9F9',
        },
      },
  },
  plugins: [require('@tailwindcss/typography')],
}