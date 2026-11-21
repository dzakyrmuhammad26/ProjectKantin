import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--brand-50, #F0FDFA)",
          700: "var(--brand-700, #0F766E)",
          800: "var(--brand-800, #115E59)",
        },
        surface: "var(--surface, #F8F9FA)",
        line: "var(--line, #E2E8F0)",
        ink: "var(--ink, #1F2937)",
        muted: "var(--muted, #64748B)",
        faint: "var(--faint, #94A3B8)",
        status: {
          wait: "var(--st-wait, #D97706)",
          paid: "var(--st-paid, #059669)",
          done: "var(--st-done, #64748B)",
          cancel: "var(--st-cancel, #DC2626)",
        },
        gerai: {
          G01: "var(--g01, #F97316)",
          G02: "var(--g02, #F43F5E)",
          G03: "var(--g03, #9333EA)",
          G04: "var(--g04, #059669)",
        },
      },
      borderRadius: {
        panel: "12px",
        card: "12px",
        control: "8px",
      },
      fontSize: {
        "title-page": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "title-panel": ["16px", { lineHeight: "24px", fontWeight: "700" }],
        "item-name": ["15px", { lineHeight: "22px", fontWeight: "600" }],
        "body-default": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "control": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "caption": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "price-card": ["16px", { lineHeight: "24px", fontWeight: "700" }],
        "total-cart": ["20px", { lineHeight: "28px", fontWeight: "800" }],
        "display-card": ["32px", { lineHeight: "36px", fontWeight: "700" }],
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
