/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFDF8",
        milk: "#FAF7F2",
        sky: "#5DADE2",
        mint: "#7FB77E",
        butter: "#FFD66B",
        darkText: "#2E2E2E",
        softText: "#6B6B6B",
      },
    },
  },
  plugins: [],
}