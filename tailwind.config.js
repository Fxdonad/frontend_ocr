/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#0b0a18",
        background: "#f4f3fc",
        primary: "#402ed9",
        secondary: "#887bf2",
        accent: "#533efb",
      },
      translate: {
        "65": "260px",
      },
      screens: {
        nor:"800px",
        sm: "640px",
        md: "1325px",
        lg: "1920px",
        xl: "2640px",
      },
    },
  },
  plugins: [],
};
