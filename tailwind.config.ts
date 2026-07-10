import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        space: {
          black: "#030014",
          deep: "#05060f",
          navy: "#0a1128",
          panel: "#0b1026",
        },
        galaxy: {
          DEFAULT: "#2242a8",
          light: "#3b6af0",
        },
        nebula: {
          DEFAULT: "#7b2ff7",
          light: "#a855f7",
          soft: "#c084fc",
        },
        electric: "#4cc9f0",
        cyan: {
          glow: "#22d3ee",
        },
        star: "#e8f0ff",
        gold: {
          DEFAULT: "#f5c542",
          deep: "#d4a017",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "spin-slow": "spin 24s linear infinite",
        "orbit": "orbit 30s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        scanline: "scanline 6s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.3)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      backgroundImage: {
        "nebula-radial":
          "radial-gradient(ellipse at top, rgba(123,47,247,0.15), transparent 60%), radial-gradient(ellipse at bottom, rgba(34,66,168,0.2), transparent 60%)",
        "holo-grid":
          "linear-gradient(rgba(76,201,240,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(76,201,240,0.07) 1px, transparent 1px)",
      },
      boxShadow: {
        holo: "0 0 20px rgba(76,201,240,0.25), inset 0 0 20px rgba(76,201,240,0.05)",
        "holo-strong": "0 0 40px rgba(76,201,240,0.4), inset 0 0 30px rgba(76,201,240,0.08)",
        nebula: "0 0 30px rgba(123,47,247,0.3)",
        gold: "0 0 24px rgba(245,197,66,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
