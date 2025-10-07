import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { token, sair, usuario } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `hidden md:inline text-sm px-3 py-1.5 rounded border transition
     ${isActive ? 'bg-gray-100 border-gray-300' : 'border-transparent hover:bg-gray-50'}`

  function aoSair() {
    sair()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        <Link to={token ? '/dashboard' : '/home'} className="text-emerald-600 font-bold text-xl">
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

            {/* Saudação + sair */}
            {usuario?.name && (
              <span className="hidden lg:inline text-sm text-gray-600 mx-2">
                Olá, <strong className="font-medium">{usuario.name.split(' ')[0]}</strong>
              </span>
            )}
            <button
              onClick={aoSair}
              className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50">Entrar</Link>
            <Link to="/registrar" className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50">Criar conta</Link>
          </div>
        )}
      </div>
    </header>
  )
}
