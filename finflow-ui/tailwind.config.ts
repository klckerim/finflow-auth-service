// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        soft: "0.5rem", // oval değil, hafif yuvarlak
      },
      colors: {
        primary: "#2563eb", // Tailwind'in blue-600 tonu
        darkBg: "#142638ff",
        cardBg: "#1b2636ff",
        inputBg: "#374151",
      },
    },
  },
  plugins: [],
};
