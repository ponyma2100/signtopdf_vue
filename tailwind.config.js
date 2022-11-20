module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Barlow", "sans-serif"],
      },
      colors: {
        primary: "#1C8B6A",
        secondary: "#F0F0F0",
      },
    },
  },
  plugins: [],
};
