// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // <- ici©
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        green: '#297E3B',
        lightGreen:'#DCEFDC',
        grey: '#F5F5F5',
      },
      backgroundColor: {
        'figure': '#F5F5F5',
      },
      fontFamily: {
        'avenir': ['Avenir', 'sans-serif']
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", ],
  }
}
