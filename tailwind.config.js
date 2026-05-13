/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./apps/**/*.html",
    "./static/src/js/**/*.js",
  ],

  theme: {
    extend: {},
  },

  plugins: [require("daisyui")],
}