import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0F",
        iris: "#6C63FF",
        lavender: "#C084FC",
        "iris-light": "#EEEDFE",
        "iris-mid": "#534AB7",
        teal: "#0F6E56",
        "teal-light": "#E1F5EE",
        coral: "#993C1D",
        "coral-light": "#FAECE7",
        amber: "#854F0B",
        "amber-light": "#FAEEDA",
        "red-dark": "#A32D2D",
        "red-light": "#FCEBEB",
        "text-pri": "#0A0A0F",
        "text-sec": "#5A5875",
        "text-ter": "#9E9CB8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;