import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const withOpacity = (variable: string) =>
  (({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue === undefined) return `var(${variable})`;

    const opacityPercent = Number(opacityValue) * 100;
    if (Number.isNaN(opacityPercent)) {
      return `color-mix(in oklab, var(${variable}) calc(${opacityValue} * 100%), transparent)`;
    }

    return `color-mix(in oklab, var(${variable}) ${opacityPercent}%, transparent)`;
  }) as unknown as string;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        background: withOpacity("--background"),
        foreground: withOpacity("--foreground"),
        card: {
          DEFAULT: withOpacity("--card"),
          foreground: withOpacity("--card-foreground"),
        },
        popover: {
          DEFAULT: withOpacity("--popover"),
          foreground: withOpacity("--popover-foreground"),
        },
        primary: {
          DEFAULT: withOpacity("--primary"),
          foreground: withOpacity("--primary-foreground"),
        },
        secondary: {
          DEFAULT: withOpacity("--secondary"),
          foreground: withOpacity("--secondary-foreground"),
        },
        muted: {
          DEFAULT: withOpacity("--muted"),
          foreground: withOpacity("--muted-foreground"),
        },
        accent: {
          DEFAULT: withOpacity("--accent"),
          foreground: withOpacity("--accent-foreground"),
        },
        destructive: {
          DEFAULT: withOpacity("--destructive"),
          foreground: withOpacity("--destructive-foreground"),
        },
        border: withOpacity("--border"),
        input: withOpacity("--input"),
        ring: withOpacity("--ring"),
        ivory: withOpacity("--ivory"),
        canvas: withOpacity("--ivory"),
        forest: {
          DEFAULT: withOpacity("--forest"),
          deep: withOpacity("--forest-deep"),
          soft: withOpacity("--forest-soft"),
        },
        gold: {
          DEFAULT: withOpacity("--gold"),
          soft: withOpacity("--gold-soft"),
        },
        ink: {
          DEFAULT: withOpacity("--foreground"),
          soft: withOpacity("--muted-foreground"),
          faint: "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
        },
        line: withOpacity("--border"),
      },
      fontFamily: {
        display: ["var(--font-serif)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
