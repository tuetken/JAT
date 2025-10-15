/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ Scan all your React source files
  ],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0D1117", // your dashboard background
      },
    },
  },
  plugins: [],
};
