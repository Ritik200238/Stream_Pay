/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Rajdhani', 'monospace'],
      },
      colors: {
        bg: {
          main: '#0B0B15',
          card: '#151522',
          input: '#1E1E2D',
        },
        brand: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          green: '#10B981',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.15)',
      }
    },
  },
  plugins: [],
}
