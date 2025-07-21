/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'Nedian-Bold': ['Nedian-Bold', 'sans-serif'], // custom fontUrbanJungleDEMO
        'UrbanJungleDEMO': ['UrbanJungleDEMO', 'sans-serif'], // custom fontUrbanJungleDEMO
      },
    },
  },
  plugins: [],
};
