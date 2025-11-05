/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",   // <- important for JSX files
  ],
  theme: { extend: {} },
  plugins: [],
};
