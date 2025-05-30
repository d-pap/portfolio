/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.svg"],
  theme: {
    //fontSize: {
    //   xs: ["0.75rem", { lineHeight: "1rem" }],
    //   sm: ["0.875rem", { lineHeight: "1.25rem" }],
    //   base: ["1rem", { lineHeight: "1.5rem" }],
    //   md: ["1.125rem", { lineHeight: "1.75rem" }],
    //   lg: ["1.5rem", { lineHeight: "2rem" }],
    //   xl: ["2rem", { lineHeight: "2.5rem" }],
    //   "2xl": ["2.5rem", { lineHeight: "3rem" }],
    //   "3xl": ["3rem", { lineHeight: "3.5rem" }],
    //   "4xl": ["3.5rem", { lineHeight: "4rem" }],
    //   "5xl": ["4rem", { lineHeight: "4.5rem" }],
    //   "6xl": ["4.5rem", { lineHeight: "5rem" }],
    //   "7xl": ["5rem", { lineHeight: "5.5rem" }],
    // },

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
