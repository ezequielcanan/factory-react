/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["montserrat", "sans-serif"],
        "montserrat-bold": ["montserrat-bold", "sans-serif"]
      },
      colors: {
        primary: "#001483",
        secondary: "#000c62",
        third: "#000748",
        fourth: "#000322",
        action: "#0036a5",
        important: "#00aaee"
      }
    },
  },
  plugins: [],
}

