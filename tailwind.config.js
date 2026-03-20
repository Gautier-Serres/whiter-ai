/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./frontend/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#6366F1",
        accent: "#A78BFA",
        dark: "#0A0A0F",
      },
    },
  },
  plugins: [],
};
