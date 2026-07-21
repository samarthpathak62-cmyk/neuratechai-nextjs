import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#05070d",
        deep: "#0a0e18",
        panel: "#0d1220",
        cyan: {
          DEFAULT: "#35d4ff",
          dim: "#1a8fb8",
        },
        violet: {
          DEFAULT: "#7c6cf6",
        },
        ink: {
          DEFAULT: "#e7ecf6",
          dim: "#9aa4bc",
          faint: "#5c6480",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grad-brand": "linear-gradient(120deg, #35d4ff 0%, #7c6cf6 100%)",
        "grad-glow": "radial-gradient(circle at 50% 0%, rgba(53,212,255,0.16), transparent 60%)",
      },
      borderRadius: {
        lg: "20px",
        md: "14px",
        sm: "8px",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.8s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
