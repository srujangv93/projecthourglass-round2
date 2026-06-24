/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sci-bg-dark': '#030309',
        'neon-cyan': '#00f3ff',
        'neon-magenta': '#bd00ff',
        'neon-yellow': '#e2a74c',
        'neon-alert': '#ff3366',
        'neon-green': '#2ecc71',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        orbitron: ['"Orbitron"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
