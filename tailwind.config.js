/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.svg"],
  theme: {
    extend: {
      colors: {
        primary: "#f5f5f5",
        secondary: "#121212",
        brand: "#2D6960", // Your main color
        brandLight: "#E7F0EE", // Light variant
        brandDark: "#1A4840", // Dark variant for hovers
      },
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
