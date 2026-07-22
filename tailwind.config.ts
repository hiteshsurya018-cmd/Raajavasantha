import type { Config } from "tailwindcss";

/**
 * DESIGN TOKENS — Rajavasantha Welfare Trust
 * ------------------------------------------------------------------
 * Primary   #7A1E22  "Kumkum"      — deep maroon, trust & gravity
 * Secondary #D4A437  "Marigold"    — warmth, celebration, hope
 * Canvas    #FFFDF8  "Parchment"   — page background
 * Accent    #F8F3EA  "Sand"        — section background / cards
 * Ink       #2C2C2C  "Charcoal"    — primary text
 * Ink-soft  #6E6A63  — muted text, derived neutral (not a new hue)
 * Line      #E7DFCF  — hairline borders on Accent
 *
 * Dark mode mirrors the same relationships: maroon deepens further,
 * marigold becomes the dominant warm light source on near-black ground.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7A1E22",
          50: "#FBEDEC",
          100: "#F3D3D2",
          300: "#C36A65",
          500: "#7A1E22",
          600: "#651A1D",
          700: "#4F1417",
          900: "#2E0C0E",
        },
        secondary: {
          DEFAULT: "#D4A437",
          50: "#FCF6E6",
          100: "#F6E6BB",
          300: "#E4BE63",
          500: "#D4A437",
          600: "#B3872A",
          700: "#8A6A20",
        },
        canvas: "#FFFDF8",
        accent: "#F8F3EA",
        ink: {
          DEFAULT: "#2C2C2C",
          soft: "#6E6A63",
          faint: "#9A958C",
        },
        line: "#E7DFCF",
        dark: {
          canvas: "#1A1210",
          surface: "#241815",
          line: "#3A2A25",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(44,28,24,0.08)",
        lift: "0 24px 48px -12px rgba(122,30,34,0.22)",
        glass: "0 8px 32px rgba(44,28,24,0.10)",
      },
      backgroundImage: {
        "grain": "url('/textures/grain.png')",
      },
      keyframes: {
        "draw-line": {
          from: { strokeDashoffset: "1000" },
          to: { strokeDashoffset: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "ripple": {
          from: { transform: "scale(0)", opacity: "0.45" },
          to: { transform: "scale(2.8)", opacity: "0" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "draw-line": "draw-line 2.4s ease-out forwards",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "ripple": "ripple 0.7s ease-out",
        "marquee": "marquee 32s linear infinite",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
