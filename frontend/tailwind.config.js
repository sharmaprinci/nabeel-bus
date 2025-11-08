import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌈 Extended color palette for gradient cards and charts
        blue: colors.blue,
        indigo: colors.indigo,
        pink: colors.pink,
        purple: colors.purple,
        rose: colors.rose,
        emerald: colors.emerald,
        orange: colors.orange,
        yellow: colors.amber,
        gray: colors.gray,
      },

      // 🌤️ Custom shadow for glowing cards or icons
      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,0.25)",
        soft: "0 4px 12px rgba(0,0,0,0.08)",
        deep: "0 8px 25px rgba(0,0,0,0.15)",
      },

      // 🧊 Custom transition curve for smooth UI motion
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },

      // 💫 Optional: backdrop blur utilities for glass UI panels
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
      },

      // 📏 Smooth animation delay utilities
      animationDelay: {
        100: "100ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
      },

      // 🎨 Optional: professional font styling for admin UI
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },

  // 🧩 Safelist — ensures gradient utilities are never purged
  safelist: [
    "bg-gradient-to-r",
    "bg-gradient-to-br",
    "bg-gradient-to-tl",
    "from-blue-500",
    "from-indigo-500",
    "from-pink-500",
    "via-purple-500",
    "to-pink-500",
    "to-indigo-600",
    "to-emerald-600",
  ],

  plugins: [
    require("@tailwindcss/forms"), // 📋 for cleaner input UI in modals/forms
    require("@tailwindcss/typography"), // 📰 for better table/text formatting
  ],
};
