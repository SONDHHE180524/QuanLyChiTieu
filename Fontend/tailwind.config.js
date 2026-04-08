/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB6C1',    // LightPink
        secondary: '#98FB98',  // PaleGreen
        danger: '#FF6B6B',     // Soft Red/Coral
        accent: '#FFD700',     // Gold/Yellow
        warning: '#FFE4B5',    // Moccasin
        info: '#ADD8E6',       // LightBlue
        cute_pink: '#ff85a2',
        cute_blue: '#7dd3fc',
        cute_purple: '#c4b5fd',
        cute_mint: '#a7f3d0',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
