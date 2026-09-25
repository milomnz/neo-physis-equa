/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
theme: {
  extend: {
    colors: {
      'noche': '#011824',     // Azul Noche Profundo
      'turquesa': '#17536D',  // Azul turquesa oscuro
      'accent': '#6B979A',    // Verde Turquesa
      'crema': '#F3F4F4',     // Beige
    },
    fontFamily: {
      sans: ['Inter_400Regular', 'sans-serif'],
      inter: ['Inter_400Regular', 'sans-serif'],
      'inter-semibold': ['Inter_600SemiBold', 'sans-serif'],
      'inter-bold': ['Inter_700Bold', 'sans-serif'],
      bricolage: ['BricolageGrotesque_700Bold', 'sans-serif'],
    }
  }
},
  plugins: [],
};