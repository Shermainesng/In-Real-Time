/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bright-yellow": "#D3FF56",
        "navy-blue": "#071FFF",
        "light-green": "#A9E1EE",
        pink: "#FBB5ED",
        purple: "#CEB3FF",
      },
    },
  },
  plugins: [require("daisyui")],
};
