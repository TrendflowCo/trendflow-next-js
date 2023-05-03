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
          'dokuso-green': '#00D89D',
          'dokuso-black': '#272727',
          'dokuso-gray': '#D8D8D8',
          'dokuso-white': '#F9F9F9',
        },
      },
  },
  plugins: [require('@tailwindcss/typography')],
}