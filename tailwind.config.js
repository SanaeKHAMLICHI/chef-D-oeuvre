// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        green: '#297E3B',
        lightGreen:'#DCEFDC'
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", ],
  }
}