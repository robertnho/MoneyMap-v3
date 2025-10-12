import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { PiggyBank } from 'lucide-react'
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
        <Link
          to={token ? '/dashboard' : '/home'}
          className="inline-flex items-center gap-3 text-slate-900 dark:text-slate-100"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-white via-blue-50/60 to-blue-100/60 shadow-[0_10px_30px_-18px_rgba(37,99,235,0.55)] ring-1 ring-blue-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700/80 dark:ring-slate-600">
            <PiggyBank className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </span>
          <span className="text-lg font-semibold tracking-tight">MoneyMapp TCC</span>
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
