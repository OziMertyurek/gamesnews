/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dbe4ff',
          500: '#4361ee',
          600: '#3a56d4',
          700: '#2f44a8',
          900: '#1a2563',
        },
        dark: {
          800: '#111827',
          900: '#0d1117',
        }
      },
    },
  },
  plugins: [],
}
