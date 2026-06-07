import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fff3e0",
          100: "#ffe0b2",
          400: "#ffa726",
          500: "#ff9800",
          600: "#E65100",
          700: "#bf360c",
        },
        navy: {
          900: "#0d1b2a",
          800: "#1b2a3b",
          700: "#253545",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
};

export default config;
