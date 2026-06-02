/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#6366f1", dark: "#4f46e5", light: "#818cf8" },
        accent: { DEFAULT: "#ec4899", dark: "#db2777", light: "#f472b6" },
        dark: { DEFAULT: "#0f172a", card: "#1e293b", hover: "#334155" },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}
