import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          cream: "#FAF7F5",       // Soft Cream background
          ivory: "#F5EFEB",       // Warm Ivory secondary bg / surface
          ivoryDark: "#EBDCD7",   // Ivory border / divider
          blush: "#F7E9E8",       // Soft Blush Rose card / container
          blushHover: "#F2DCDA",  // Blush hover state
          roseLight: "#FDF8F7",   // Light Rose tint
          roseDust: "#A35D67",    // Dusty Rose accent / secondary text
          roseMuted: "#8E4651",   // Muted Rose
          copper: "#B76E60",      // Muted Copper accent
          copperLight: "#C88A7D", // Light Copper highlight
          maroonLight: "#6B1D27", // Medium Maroon
          maroon: "#4A121A",      // Deep Maroon (primary text & key actions)
          maroonDark: "#360C13",  // Darkest Maroon for deep contrast
          glass: "rgba(255, 250, 248, 0.72)",
          glassCard: "rgba(253, 242, 241, 0.65)",
          glassBorder: "rgba(183, 110, 96, 0.2)",
          glassHighlight: "rgba(255, 255, 255, 0.6)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        'vault-sm': '0 2px 8px -1px rgba(74, 18, 26, 0.06), 0 1px 4px -1px rgba(183, 110, 96, 0.08)',
        'vault-md': '0 8px 24px -4px rgba(74, 18, 26, 0.08), 0 2px 8px -2px rgba(183, 110, 96, 0.12)',
        'vault-lg': '0 20px 40px -8px rgba(74, 18, 26, 0.12), 0 4px 16px -2px rgba(183, 110, 96, 0.16)',
        'vault-glow': '0 0 30px 4px rgba(200, 138, 125, 0.25)',
        'vault-glow-lg': '0 0 60px 8px rgba(183, 110, 96, 0.3)',
        'vault-inner': 'inset 0 1px 2px rgba(255, 255, 255, 0.6), inset 0 -1px 2px rgba(74, 18, 26, 0.05)',
      },
      backgroundImage: {
        'vault-gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'vault-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        'vault-card-glow': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(247,233,232,0.6) 100%)',
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse': 'spin-reverse 45s linear infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
