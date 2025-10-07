import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function BotaoVoltar() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Páginas que não devem mostrar o botão voltar
  const paginasSemVoltar = ['/home', '/login']
  
  if (paginasSemVoltar.includes(location.pathname)) {
    return null
  }

  const handleVoltar = () => {
    // Dashboard volta para home
    if (location.pathname === '/dashboard') {
      navigate('/home')
      return
    }
    
    // Artigos voltam para educação
    if (location.pathname.startsWith('/educacao/artigo/')) {
      navigate('/educacao')
      return
    }
    
    // Outras páginas voltam para dashboard ou histórico
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <button
      onClick={handleVoltar}
      className="fixed top-6 left-24 md:left-28 z-20 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out text-gray-600 hover:text-gray-800 hover:scale-105 active:scale-95 group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
      <span className="font-medium hidden sm:inline">Voltar</span>
    </button>
  )
}