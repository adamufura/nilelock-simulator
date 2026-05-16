/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "door-listen": {
          "0%, 100%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(-3deg)" },
        },
        "reader-scan": {
          "0%": { transform: "translateY(-140%)", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { transform: "translateY(420%)", opacity: "0" },
        },
        "nfc-breathe": {
          "0%, 100%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.07)", filter: "brightness(1.2)" },
        },
        "live-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 211, 238, 0.35), 0 0 20px rgba(34, 211, 238, 0.15)" },
          "50%": { boxShadow: "0 0 0 4px rgba(34, 211, 238, 0.12), 0 0 28px rgba(34, 211, 238, 0.35)" },
        },
        "led-flow": {
          "0%": { backgroundPosition: "200% 50%" },
          "100%": { backgroundPosition: "-200% 50%" },
        },
        "standby-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
        "crack-glow": {
          "0%, 100%": { opacity: "0.85", transform: "translateX(-50%) scaleY(1)" },
          "50%": { opacity: "1", transform: "translateX(-50%) scaleY(1.04)" },
        },
      },
      animation: {
        "door-listen": "door-listen 2.6s ease-in-out infinite",
        "reader-scan": "reader-scan 2.4s ease-in-out infinite",
        "nfc-breathe": "nfc-breathe 2.2s ease-in-out infinite",
        "live-ring": "live-ring 2s ease-in-out infinite",
        "led-flow": "led-flow 3s linear infinite",
        "standby-pulse": "standby-pulse 2.5s ease-in-out infinite",
        "crack-glow": "crack-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

