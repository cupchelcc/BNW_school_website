/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            50: '#f0f5fc',
            100: '#e0ecf8',
            200: '#b9d7f2',
            300: '#7cb5e8',
            400: '#3a8fda',
            500: '#1b71c4',
            600: '#1056a2',
            700: '#0e4584',
            800: '#0f3a6e',
            900: '#12325c',
            950: '#0b1f3c', // Primary Navy
          },
          gold: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308', // Secondary Gold
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
        },
      },
      fontFamily: {
        thai: ['var(--font-ibm-plex-sans-thai)', 'IBM Plex Sans Thai', 'Sarabun', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
    },
  },
  plugins: [],
};
