const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  // corePlugins: {
  //   preflight: false,
  // },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    fontFamily: {
      // 'sans': ['Chivo', 'sans-serif'], // overriding 'sans' familiy with 'chivo'(desired) because its called as default in all the text
      'sans': ['Manrope', 'sans-serif'], // overriding 'sans' familiy with 'chivo'(desired) because its called as default in all the text

    },
    extend: {
      colors: {
        'trendflow-black': '#262626',
        'trendflow-white': '#FAFAFA',
        'trendflow-green': '#57FA3E',
        'trendflow-orange': '#FAB332',
        'trendflow-blue': '#318AFA',
        'trendflow-pink': '#FA39BE',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'),require('flowbite/plugin')],
  

}