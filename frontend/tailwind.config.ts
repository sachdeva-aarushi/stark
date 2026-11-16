import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Literata", "Georgia", "Cambria", "'Times New Roman'", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        border: "#E5E7EB",
        "border-subtle": "#EEF0F2",
        "border-strong": "#D1D5DB",
        background: "#FFFFFF",
        surface: "#FAFAFA",
        "surface-muted": "#F4F5F7",
        "surface-card": "#FFFFFF",
        stark: {
          dark: "#0A0F1D",
          navy: "#0F172A",
          muted: "#64748B",
          blue: {
            DEFAULT: "#1D4ED8",
            50: "#EFF6FF",
            100: "#DBEAFE",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            900: "#1E3A8A",
          },
        },
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out 4s infinite",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
