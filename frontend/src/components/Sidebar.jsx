import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  BarChart3, 
  BookOpen, 
  Settings,
  PiggyBank,
  LogOut,
  X
} from 'lucide-react'

const itens = [
  { to: '/dashboard', rotulo: 'Dashboard', icone: LayoutDashboard },
  { to: '/transacoes', rotulo: 'Transações', icone: CreditCard },
  { to: '/metas', rotulo: 'Metas', icone: Target },
  { to: '/relatorios', rotulo: 'Relatórios', icone: BarChart3 },
  { to: '/educacao', rotulo: 'Educação', icone: BookOpen },
  { to: '/configuracoes', rotulo: 'Configurações', icone: Settings },
]

export default function Sidebar({ aberto, onFechar }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('demoMode')
    navigate('/home')
  }

  return (
    <>
      {/* Overlay para mobile */}
      {aberto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onFechar}
        />
      )}
      
      {/* Sidebar Desktop */}
      <aside 
        className={`
          hidden md:flex md:flex-col
          fixed left-0 top-0 h-full
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg
          transition-all duration-300 ease-in-out z-30
          ${expanded ? 'w-64' : 'w-20'}
        `}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            {expanded && (
              <div className="ml-3 overflow-hidden">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  MoneyMapp
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Versão TCC
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {itens.map((item) => {
              const IconeComponente = item.icone
              return (
                <li key={item.to} className="px-3">
                  <NavLink
                    to={item.to}
                    onClick={onFechar}
                    className={({ isActive }) => `
                      flex items-center px-3 py-3 rounded-xl transition-all duration-200
                      group relative overflow-hidden
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <IconeComponente className="w-6 h-6 flex-shrink-0" />
                    
                    {expanded && (
                      <span className="ml-3 font-medium whitespace-nowrap">
                        {item.rotulo}
                      </span>
                    )}
                    
                    {/* Tooltip para quando collapsed */}
                    {!expanded && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.rotulo}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-900 dark:border-r-gray-700 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                      </div>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group relative"
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            {expanded && (
              <span className="ml-3 font-medium whitespace-nowrap">
                Sair
              </span>
            )}
            
            {/* Tooltip para logout quando collapsed */}
            {!expanded && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Sair
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-900 dark:border-r-gray-700 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <aside 
        className={`
          md:hidden fixed left-0 top-0 h-full w-80 max-w-[85vw]
          bg-white dark:bg-gray-800 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${aberto ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header Mobile */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">MoneyMapp</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Versão TCC</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Mobile */}
        <nav className="flex-1 py-6">
          <ul className="space-y-2">
            {itens.map((item) => {
              const IconeComponente = item.icone
              return (
                <li key={item.to} className="px-6">
                  <NavLink
                    to={item.to}
                    onClick={onFechar}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <IconeComponente className="w-6 h-6" />
                    <span className="ml-4 font-medium">{item.rotulo}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Mobile */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-6 h-6" />
            <span className="ml-4 font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
