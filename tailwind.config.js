/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minWidth: {
        4.5: "1.125rem",
      },
      minHeight: {
        4.5: "1.125rem",
      },
    },
    screens: {
      sm: "992px",
    },
  },
  plugins: [],
};
