import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import Rotas from './routes/Rotas.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <Rotas />
    </ThemeProvider>
  )
}
