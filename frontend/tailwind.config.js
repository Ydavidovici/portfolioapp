// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#b9ff66',      // Light Green
        dark: '#191a23',         // Dark Color
        white: '#ffffff',
        black: '#000000',
        gray: {
          100: '#f3f3f3',
          200: '#e5e5e5',
          700: '#898989',
          800: '#292a32',
        },
        // Add other custom colors as needed
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'], // Custom Font
        // Add other font families if necessary
      },
      spacing: {
        '7': '1.75rem',    // 28px
        '10': '2.5rem',    // 40px
        '14': '3.5rem',    // 56px
        '35': '8.75rem',   // 140px
        '60': '15rem',     // 240px
        // Add other custom spacing values
      },
      borderRadius: {
        '7px': '0.4375rem',     // 7px
        '14px': '0.875rem',     // 14px
        '45px': '2.8125rem',    // 45px
        '29px': '1.8125rem',    // 29px
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1)',
        // Add other custom shadows
      },
      // Add other extensions as needed
    },
  },
  plugins: [],
};
