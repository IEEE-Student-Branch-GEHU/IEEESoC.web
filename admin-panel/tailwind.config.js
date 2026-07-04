/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1c1c16',
          bright: '#2a2a22',
          container: '#242419',
          'container-high': '#2e2e24',
          'container-highest': '#393930',
          'container-low': '#1f1f18',
          'container-lowest': '#161612',
        },
        'on-surface': {
          DEFAULT: '#e8e3d3',
          variant: '#c9c4b4',
        },
        primary: {
          DEFAULT: '#c9a96e',
          container: '#4a3f2a',
        },
        'on-primary': {
          DEFAULT: '#1c1c16',
          container: '#e8e3d3',
        },
      },
    },
  },
  plugins: [],
}
