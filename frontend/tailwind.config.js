/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bright-yellow': '#D3FF56',
        'navy-blue': '#071FFF',
        'pink': '#FBB5ED'
      }
    },
  },
  plugins: [],
}

