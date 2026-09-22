/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
theme: {
  extend: {
    colors: {
      'text-primary': '#011824', // Azul Noche Profundo
      'bg-primary': '#17536D',   // Azul turquesa oscuro
      'accent': '#6B979A',       // Verde Turquesa
      'bg-base': '#F3F4F4',      // Beige
    },
    fontFamily: {
      inter: ['Inter_400Regular', 'sans-serif'],
      bricolage: ['BricolageGrotesque_700Bold', 'sans-serif'],
    }
  }
},
  plugins: [],
};