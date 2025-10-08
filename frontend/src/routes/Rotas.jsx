import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Registrar from '../pages/Registrar.jsx'
import NotFound from '../pages/NotFound.jsx'
import DemoLoading from '../pages/DemoLoading.jsx'

// privadas
import Dashboard from '../pages/Dashboard.jsx'
import Transacoes from '../pages/Transacoes.jsx'
import Metas from '../pages/Metas.jsx'
import Relatorios from '../pages/Relatorios.jsx'
import Educacao from '../pages/Educacao.jsx'
import ArtigoDetalhes from '../pages/ArtigoDetalhes.jsx'
import Licoes from '../pages/Licoes.jsx'
import LicaoDetalhes from '../pages/LicaoDetalhes.jsx'
import Simuladores from '../pages/Simuladores.jsx'
import Quiz from '../pages/Quiz.jsx'
import Configuracoes from '../pages/Configuracoes.jsx'

import PublicLayout from '../layouts/PublicLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Privado({ children }) {
  const { token, modoDemo } = useAuth()
  
  // Permite acesso se tiver token válido OU estiver em modo demo
  const temAcesso = token || modoDemo
  
  return temAcesso ? children : <Navigate to="/login" replace />
}

export default function Rotas() {
  return (
    <Routes>
      {/* Público */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/demo-loading" element={<DemoLoading />} />
      </Route>

      {/* Privado: um layout para todas as rotas autenticadas */}
      <Route element={<Privado><DashboardLayout /></Privado>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/metas" element={<Metas />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/educacao" element={<Educacao />} />
        <Route path="/educacao/artigo/:id" element={<ArtigoDetalhes />} />
        <Route path="/educacao/licoes" element={<Licoes />} />
        <Route path="/educacao/licao/:id" element={<LicaoDetalhes />} />
        <Route path="/educacao/simuladores" element={<Simuladores />} />
        <Route path="/educacao/quiz" element={<Quiz />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
