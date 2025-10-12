import React from 'react'
import { Target, TrendingUp, Calendar, Plus, CheckCircle, Circle, DollarSign, Percent } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext.jsx'

// Dados mockados para demonstração
const mockMetas = [
  {
    id: 1,
    titulo: 'Reserva de Emergência',
    valorAtual: 8500.00,
    valorMeta: 12000.00,
    prazo: '2024-12-31',
    categoria: 'Emergência',
    cor: 'blue',
    status: 'ativo'
  },
  {
    id: 2,
    titulo: 'Viagem para Europa',
    valorAtual: 3200.00,
    valorMeta: 8000.00,
    prazo: '2025-06-15',
    categoria: 'Lazer',
    cor: 'purple',
    status: 'ativo'
  },
  {
    id: 3,
    titulo: 'Entrada do Carro',
    valorAtual: 15000.00,
    valorMeta: 15000.00,
    prazo: '2024-09-30',
    categoria: 'Transporte',
    cor: 'green',
    status: 'concluido'
  },
  {
    id: 4,
    titulo: 'Curso de Especialização',
    valorAtual: 800.00,
    valorMeta: 2500.00,
    prazo: '2025-03-01',
    categoria: 'Educação',
    cor: 'orange',
    status: 'ativo'
  },
  {
    id: 5,
    titulo: 'Investimento Inicial',
    valorAtual: 2100.00,
    valorMeta: 10000.00,
    prazo: '2025-12-31',
    categoria: 'Investimentos',
    cor: 'indigo',
    status: 'ativo'
  }
]

function MetaCard({ meta, isDark }) {
  const progresso = Math.min((meta.valorAtual / meta.valorMeta) * 100, 100)
  const diasRestantes = Math.ceil((new Date(meta.prazo) - new Date()) / (1000 * 60 * 60 * 24))
  
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const corClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600'
  }

  return (
    <div className={`backdrop-blur-lg rounded-2xl border shadow-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col ${
      meta.status === 'concluido'
        ? isDark
          ? 'bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/20'
          : 'bg-green-50/40 border-green-200/50 hover:bg-green-50/60'
        : isDark
          ? 'bg-white/5 border-white/10 hover:bg-white/10'
          : 'bg-white/30 border-white/50 hover:bg-white/40'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{meta.titulo}</h3>
            {meta.status === 'concluido' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{meta.categoria}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${corClasses[meta.cor]} rounded-xl flex items-center justify-center shadow-md`}>
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {/* Progresso */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-gray-700'}`}>Progresso</span>
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{progresso.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/40 shadow-inner backdrop-blur-sm dark:bg-slate-800/60">
            <div 
              className={`h-3 bg-gradient-to-r ${corClasses[meta.cor]} rounded-full transition-[width] duration-700 ease-out shadow-sm`}
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        {/* Valores */}
        <div className="flex items-center justify-between border-t border-white/30 py-3 dark:border-white/10">
          <div>
            <p className="mb-1 text-xs font-bold text-gray-600 dark:text-slate-300">Atual</p>
            <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{formatMoney(meta.valorAtual)}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs font-bold text-gray-600 dark:text-slate-300">Meta</p>
            <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{formatMoney(meta.valorMeta)}</p>
          </div>
        </div>

        {/* Prazo */}
        <div className="flex items-center justify-between border-t border-white/30 pt-3 dark:border-white/10">
          <div className={`flex items-center text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-gray-700'}`}>
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(meta.prazo)}</span>
          </div>
          {meta.status === 'ativo' && (
            <span className={`text-xs px-2 py-1 rounded-full font-bold backdrop-blur-sm ${
              diasRestantes > 30 ? 'border border-green-200/50 bg-green-100/80 text-green-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300' :
              diasRestantes > 7 ? 'border border-yellow-200/50 bg-yellow-100/80 text-yellow-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300' :
              'border border-red-200/50 bg-red-100/80 text-red-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-300'
            }`}>
              {diasRestantes > 0 ? `${diasRestantes}d` : 'Vencido'}
            </span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-3 mt-auto">
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
          Adicionar
        </button>
        <button className={`px-3 py-2 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md ${
          isDark
            ? 'bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20'
            : 'bg-white/40 text-gray-600 hover:text-gray-800 hover:bg-white/60'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function DicaCard({ metasConcluidas, progressoGeral, isDark }) {
  return (
    <div className={`backdrop-blur-lg rounded-2xl border shadow-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col ${
      isDark ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-white/70 border-white/50 hover:bg-white/80'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>Dica para suas Metas</h3>
          </div>
          <p className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Estratégias</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
          isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-green-100 text-green-600'
        }`}>
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <p className={`text-sm leading-relaxed mb-6 flex-1 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Parabéns! Você já conquistou <strong>{metasConcluidas} meta(s)</strong> e está com {progressoGeral}% de progresso geral. 
          Para acelerar seus objetivos, considere definir um valor mensal fixo para cada meta ativa.
        </p>
        
        <div className="flex flex-col gap-2 mt-auto">
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-1.5 px-3 rounded-lg text-xs font-semibold shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Definir Aportes Automáticos
          </button>
          <button className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold shadow-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
            isDark ? 'bg-white/10 text-emerald-300 hover:bg-white/20' : 'bg-white text-green-700 border border-green-200 hover:bg-gray-50'
          }`}>
            Ver Dicas de Economia
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Metas() {
  const { isDark } = useTheme()
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const metasAtivas = mockMetas.filter(m => m.status === 'ativo')
  const metasConcluidas = mockMetas.filter(m => m.status === 'concluido')
  
  const totalEconomizado = mockMetas.reduce((acc, meta) => acc + meta.valorAtual, 0)
  const totalMetas = mockMetas.reduce((acc, meta) => acc + meta.valorMeta, 0)
  const progressoGeral = ((totalEconomizado / totalMetas) * 100)

  // Reorganizar metas para o layout desejado: Entrada do Carro ao lado de Investimento Inicial
  const metasOrganizadas = [
    ...metasAtivas.slice(0, 2), // Reserva de Emergência, Viagem para Europa
    mockMetas.find(m => m.id === 3), // Entrada do Carro (concluída)
    ...metasAtivas.slice(2) // Curso de Especialização, Investimento Inicial
  ].filter(Boolean)

  return (
  <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 text-slate-900'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="text-center sm:text-left">
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 drop-shadow-sm transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Metas Financeiras
              </h1>
              <p className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-zinc-300' : 'text-gray-700'
              }`}>
                Defina e acompanhe seus objetivos financeiros
              </p>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mx-auto sm:mx-0">
              <Plus className="w-4 h-4" />
              Nova Meta
            </button>
          </div>

          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className={`backdrop-blur-lg rounded-2xl border shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              isDark ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-white/30 border-white/50 hover:bg-white/40'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Metas Ativas</p>
                  <p className="text-2xl lg:text-3xl font-bold text-blue-500 drop-shadow-sm">{metasAtivas.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className={`backdrop-blur-lg rounded-2xl border shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              isDark ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-white/30 border-white/50 hover:bg-white/40'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Total Economizado</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-500 drop-shadow-sm">{formatMoney(totalEconomizado)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className={`backdrop-blur-lg rounded-2xl border shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              isDark ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-white/30 border-white/50 hover:bg-white/40'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Progresso Geral</p>
                  <p className="text-2xl lg:text-3xl font-bold text-purple-500 drop-shadow-sm">{progressoGeral.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-md">
                  <Percent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className={`backdrop-blur-lg rounded-2xl border shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              isDark ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-white/30 border-white/50 hover:bg-white/40'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Metas Concluídas</p>
                  <p className="text-2xl lg:text-3xl font-bold text-green-500 drop-shadow-sm">{metasConcluidas.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Todas as Metas + Dica em Grid Uniforme */}
          <div className="mb-4">
            <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>Suas Metas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {metasOrganizadas.map((meta) => (
                <MetaCard key={meta.id} meta={meta} isDark={isDark} />
              ))}
              <DicaCard 
                metasConcluidas={metasConcluidas.length} 
                progressoGeral={progressoGeral.toFixed(1)} 
                isDark={isDark}
              />
            </div>
          </div>

          {/* Copyright */}
          <div className={`text-center text-sm font-medium backdrop-blur-sm rounded-xl p-3 border transition-colors duration-300 ${
            isDark ? 'text-zinc-400 bg-white/5 border-white/10' : 'text-gray-600 bg-white/20 border-white/30'
          }`}>
            © 2024 MoneyMapp TCC. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  )
}
