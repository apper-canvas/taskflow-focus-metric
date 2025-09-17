/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#f59e0b",
        surface: "#ffffff",
        background: "#f8fafc",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'completion': 'completion 0.6s ease-out',
        'lift': 'lift 0.2s ease-out',
        'pulse-scale': 'pulse-scale 0.4s ease-out',
      },
      keyframes: {
        completion: {
          '0%': { transform: 'scale(1)', backgroundColor: 'currentColor' },
          '50%': { transform: 'scale(1.2)', backgroundColor: '#10b981' },
          '100%': { transform: 'scale(1)', backgroundColor: '#10b981' },
        },
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        'pulse-scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}