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
        'primary': '#3B82F6', // Blue
        'secondary': '#10B981', // Emerald
        'accent': '#F59E0B', // Amber
        'neutral': '#6B7280', // Gray
        'base-100': '#FFFFFF',
        'info': '#3ABFF8',
        'success': '#36D399',
        'warning': '#FBBD23',
        'error': '#F87272',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'),require('flowbite/plugin')],
  

}