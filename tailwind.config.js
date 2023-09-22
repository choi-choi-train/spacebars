/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark':'#121212',
        'yellow':'rgba(249, 200, 14)',
        'pink':'rgba(255, 67, 101)',
        'purple':'rgba(84, 13, 110)',
      }
    },
  },
  plugins: [],
}