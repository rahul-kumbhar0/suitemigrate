/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "./popup.html"],
  theme: {
    extend: {
      colors: {
        bg: "#050d1a",
        surface: "#0a1628",
        border: "#1e3a5f",
      },
    },
  },
  plugins: [],
}
