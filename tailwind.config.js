/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: "#141414",
          red: "#FF3B30",
          yellow: "#FFCC00",
          blue: "#1E3A8A",    
          purple: "#4C1D95",
        },
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "monospace"],
      },
      boxShadow: {
        "hard-red": "6px 6px 0 0 #FF3B30",
        "hard-yellow": "6px 6px 0 0 #FFCC00",
        "hard-white": "6px 6px 0 0 #FFFFFF",
        "hard-red-sm": "3px 3px 0 0 #FF3B30",
        "hard-yellow-sm": "3px 3px 0 0 #FFCC00",
        "hard-white-sm": "3px 3px 0 0 #FFFFFF",
      },
    },
  },
  plugins: [],
};
