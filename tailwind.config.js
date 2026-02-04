/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        sidebar: 'var(--bg-sidebar)',
        main: 'var(--bg-main)',
        muted: 'var(--text-muted)',
        border: 'var(--border-color)',
      },
      borderRadius: {
        custom: 'var(--radius)',
      },
      fontFamily: {
        custom: ['var(--font-family)', 'sans-serif'],
      },
      boxShadow: {
        custom: 'var(--shadow)',
      }
    },
  },
  plugins: [],
}
