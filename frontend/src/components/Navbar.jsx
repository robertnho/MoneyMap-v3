import React, { useMemo } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { PiggyBank } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { token, sair, usuario } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const linkClass = ({ isActive }) =>
    `hidden md:inline text-sm px-3 py-1.5 rounded border transition-colors duration-200
     ${isActive ? 'bg-gray-100 border-gray-300 text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100' : 'border-transparent hover:bg-gray-50 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'}`

  const navItems = useMemo(() => [
    { to: '/dashboard', label: t('nav.links.dashboard') },
    { to: '/transacoes', label: t('nav.links.transactions') },
    { to: '/metas', label: t('nav.links.goals') },
    { to: '/relatorios', label: t('nav.links.reports') },
    { to: '/educacao', label: t('nav.links.education') },
    { to: '/configuracoes', label: t('nav.links.settings') },
  ], [t])

  function aoSair() {
    sair()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-gray-200 bg-white transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to={token ? '/dashboard' : '/home'}
          className="inline-flex items-center gap-3 text-slate-900 transition-colors duration-300 dark:text-slate-100"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-white via-blue-50/60 to-blue-100/60 shadow-[0_10px_30px_-18px_rgba(37,99,235,0.55)] ring-1 ring-blue-100 transition-colors duration-300 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700/80 dark:ring-slate-600">
            <PiggyBank className="h-5 w-5 text-slate-700 transition-colors duration-300 dark:text-slate-200" />
          </span>
          <span className="text-lg font-semibold tracking-tight">{t('brand.name')}</span>
        </Link>

        {token ? (
          <div className="flex items-center gap-2">
            {/* Links principais quando autenticado */}
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}

            {/* Saudação + sair */}
            {usuario?.name && (
              <span className="mx-2 hidden text-sm text-gray-600 dark:text-slate-300 lg:inline">
                {t('nav.auth.greeting', { name: usuario.name.split(' ')[0] })}
              </span>
            )}
            <button
              onClick={aoSair}
              className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-500 dark:hover:bg-emerald-500"
            >
              {t('nav.auth.logout')}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded border px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-gray-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">{t('nav.auth.login')}</Link>
            <Link to="/registrar" className="rounded border px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-gray-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">{t('nav.auth.register')}</Link>
          </div>
        )}
      </div>
    </header>
  )
}
