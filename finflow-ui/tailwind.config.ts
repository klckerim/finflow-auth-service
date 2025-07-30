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
        darkBg: "#0f0f0f",
        cardBg: "#1f2937",
        inputBg: "#374151",
      },
    },
  },
  plugins: [],
};
