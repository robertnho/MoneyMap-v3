import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import Rotas from './routes/Rotas.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Rotas />
      </div>
    </ThemeProvider>
  )
}
