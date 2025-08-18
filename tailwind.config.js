/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#c084fc",
          secondary: "#9333ea",
          accent: "#ddd6fe",
          neutral: "#2dd4bf",
          "base-100": "#1f2937",
          info: "#38bdf8",
          success: "#4ade80",
          warning: "#e11d48",
          error: "#ff0000",
        },
      },
      "light",
    ],
  },
};
