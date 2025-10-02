import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
      'inset-game-panel': 'inset 0 0 50px rgba(0, 0, 0, 0.5)',
      'inset-game-panel-background': 'inset 0 0 25px rgba(0, 0, 0, 0.5)',
    },
      colors: {
        console: "#4d4479",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
