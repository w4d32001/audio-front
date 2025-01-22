import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'fondo': "url('https://www.latercera.com/resizer/v2/JV64RL4ZRND5TDLPSBOHRMZOWE.jpg?quality=80&smart=true&auth=4d31820ef3c5873d58d31cdf48c86d7a48380a760a3efadb20a89db1b1443555&width=1200&height=665')",
      }
    },
  },
  plugins: [],
} satisfies Config;
