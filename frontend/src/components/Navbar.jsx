import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar() {
  const { token, sair, usuario, modoDemo } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `hidden md:inline text-sm px-3 py-1.5 rounded border transition-all duration-200
     ${isActive 
       ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' 
       : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`

  function aoSair() {
    sair()
    // Se estiver em modo demo, volta para home, senão vai para login
    navigate(modoDemo ? '/home' : '/login', { replace: true })
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        <Link to={token ? '/dashboard' : '/home'} className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">
          MoneyMapp TCC
        </Link>

        {token ? (
          <div className="flex items-center gap-2">
            {/* Links principais quando autenticado */}
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/transacoes" className={linkClass}>Transações</NavLink>
            <NavLink to="/metas" className={linkClass}>Metas</NavLink>
            <NavLink to="/relatorios" className={linkClass}>Relatórios</NavLink>
            <NavLink to="/educacao" className={linkClass}>Educação</NavLink>
            <NavLink to="/configuracoes" className={linkClass}>Configurações</NavLink>

            {/* Toggle de tema */}
            <ThemeToggle className="!relative !top-auto !right-auto !z-auto !p-2" />

            {/* Saudação + sair */}
            {usuario?.nome && (
              <span className="hidden lg:inline text-sm text-gray-600 dark:text-gray-300 mx-2">
                Olá, <strong className="font-medium">{usuario.nome.split(' ')[0]}</strong>
                {modoDemo && <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">DEMO</span>}
              </span>
            )}
            <button
              onClick={aoSair}
              className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 transition-colors"
            >
              {modoDemo ? 'Sair da Demo' : 'Sair'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle className="!relative !top-auto !right-auto !z-auto !p-2" />
            <Link to="/login" className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">Entrar</Link>
            <Link to="/registrar" className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">Criar conta</Link>
          </div>
        )}
      </div>
    </header>
  )
}
