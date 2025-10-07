/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // Ativa o modo escuro baseado em classe
  theme: {
    extend: {
      colors: {
        primario: '#10b981',
        secundario: '#0ea5e9',
        neutro: '#111827'
      }
    }
  },
  plugins: []
}
