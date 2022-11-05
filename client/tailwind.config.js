/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scale: {
          1: "#161616",
          2: "#1c1c1c",
          3: "#232323",
          4: "#282828",
          5: "#2e2e2e",
          6: "#343434",
          7: "#3e3e3e",
          8: "#505050",
          9: "#707070",
          10: "#7e7e7e",
          11: "#a0a0a0",
          12: "#ededed",
        },
      },
    },
  },
  plugins: [],
};
