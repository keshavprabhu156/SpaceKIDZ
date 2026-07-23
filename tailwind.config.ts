import type { Config } from "tailwindcss";

/**
 * "Modern Planetarium" palette.
 *
 * Token names are kept stable (space-*, galaxy, nebula, electric, gold, star)
 * so every page that already references them inherits the new look — but the
 * values are repointed away from neon sci-fi toward a warm, editorial night-sky:
 * ink-indigo grounds, warm-white text, a single amber accent, and muted
 * astrophotography blues/roses used sparingly.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        space: {
          black: "#04060d", // primary ground — near-black, faintly blue
          deep: "#02040a", // deepest wells / footers
          navy: "#0c1120", // raised surface
          panel: "#121930", // cards / inputs
        },
        // Cinematic blue — the cool half of the signature gradient
        galaxy: {
          DEFAULT: "#2b4acb",
          light: "#6f8dfb",
        },
        // Violet — the warm half of the signature gradient
        nebula: {
          DEFAULT: "#7c3aed",
          light: "#8b5cf6",
          soft: "#a78bfa",
        },
        // THE accent. Vivid space blue.
        electric: "#4f7df9",
        cyan: {
          glow: "#60a5fa",
        },
        star: "#eef1f8", // cool starlight white — primary text
        gold: {
          DEFAULT: "#e0a860",
          deep: "#c1863c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "float-slow": "float 9s ease-in-out infinite",
        "float-slower": "float 14s ease-in-out infinite",
        "pulse-glow": "pulseSoft 5s ease-in-out infinite",
        "spin-slow": "spin 40s linear infinite",
        orbit: "orbit 34s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.8" },
        },
      },
      backgroundImage: {
        // Cosmic vignette — cool blue crown, violet base
        "nebula-radial":
          "radial-gradient(ellipse at 50% -10%, rgba(79,125,249,0.08), transparent 55%), radial-gradient(ellipse at 50% 120%, rgba(124,58,237,0.08), transparent 55%)",
        // Faint star-chart ruling
        "holo-grid":
          "linear-gradient(rgba(238,241,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(238,241,248,0.04) 1px, transparent 1px)",
        // Signature gradient — blue to violet
        "brand-grad": "linear-gradient(90deg, #4f7df9, #8b5cf6)",
      },
      boxShadow: {
        holo: "0 1px 0 rgba(238,241,248,0.05) inset, 0 18px 40px -24px rgba(0,0,0,0.8)",
        "holo-strong": "0 1px 0 rgba(238,241,248,0.07) inset, 0 30px 60px -28px rgba(0,0,0,0.85)",
        nebula: "0 20px 50px -30px rgba(0,0,0,0.9)",
        gold: "0 0 0 1px rgba(224,168,96,0.25)",
        // Soft blue bloom under gradient CTAs (like the reference's Log In button)
        glow: "0 10px 32px -8px rgba(79,125,249,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
