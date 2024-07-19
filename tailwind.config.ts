/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        jet: {
          DEFAULT: '#1E1E1E', // Dark background
          light: '#252526', // Slightly lighter dark
          highlight: '#007ACC', // Highlight color (e.g., for links or accents)
          accent: '#4EC9B0', // Secondary accent color
        },
      },
    },
  },
  plugins: [],
};
