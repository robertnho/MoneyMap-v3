import React, { useState, useEffect } from 'react'
import { Target, TrendingUp, Calendar, Plus, CheckCircle, Circle, DollarSign, Percent } from 'lucide-react'
import { SkeletonList } from '../components/ui'

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

function MetaCard({ meta }) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{meta.titulo}</h3>
            {meta.status === 'concluido' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-500">{meta.categoria}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${corClasses[meta.cor]} rounded-xl flex items-center justify-center`}>
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Progresso */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-semibold text-gray-900">{progresso.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 bg-gradient-to-r ${corClasses[meta.cor]} rounded-full transition-all duration-300`}
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        {/* Valores */}
        <div className="flex justify-between items-center py-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Valor Atual</p>
            <p className="text-lg font-bold text-gray-900">{formatMoney(meta.valorAtual)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Meta</p>
            <p className="text-lg font-bold text-gray-900">{formatMoney(meta.valorMeta)}</p>
          </div>
        </div>

        {/* Prazo */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Prazo: {formatDate(meta.prazo)}</span>
          </div>
          {meta.status === 'ativo' && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              diasRestantes > 30 ? 'bg-green-100 text-green-700' :
              diasRestantes > 7 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {diasRestantes > 0 ? `${diasRestantes} dias` : 'Vencido'}
            </span>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            Adicionar Valor
          </button>
          <button className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Metas() {
  const [loading, setLoading] = useState(true)
  
  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
  
  // Mostrar skeleton enquanto carrega
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="mb-8">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-48 rounded mb-2"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-64 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-20 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
            </div>
          ))}
        </div>
        <SkeletonList items={6} />
      </div>
    )
  }

  const metasAtivas = mockMetas.filter(m => m.status === 'ativo')
  const metasConcluidas = mockMetas.filter(m => m.status === 'concluido')
  
  const totalEconomizado = mockMetas.reduce((acc, meta) => acc + meta.valorAtual, 0)
  const totalMetas = mockMetas.reduce((acc, meta) => acc + meta.valorMeta, 0)
  const progressoGeral = ((totalEconomizado / totalMetas) * 100)

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Metas Financeiras</h1>
          <p className="text-gray-600">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Metas Ativas</p>
              <p className="text-3xl font-bold text-blue-600">{metasAtivas.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Economizado</p>
              <p className="text-2xl font-bold text-green-600">{formatMoney(totalEconomizado)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progresso Geral</p>
              <p className="text-2xl font-bold text-purple-600">{progressoGeral.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Metas Concluídas</p>
              <p className="text-3xl font-bold text-green-600">{metasConcluidas.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Metas Ativas */}
      {metasAtivas.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metas em Progresso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metasAtivas.map((meta) => (
              <MetaCard key={meta.id} meta={meta} />
            ))}
          </div>
        </div>
      )}

      {/* Metas Concluídas */}
      {metasConcluidas.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metas Concluídas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metasConcluidas.map((meta) => (
              <MetaCard key={meta.id} meta={meta} />
            ))}
          </div>
        </div>
      )}

      {/* Dicas */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Dica para suas Metas</h3>
        </div>
        
        <p className="text-gray-700 mb-4">
          Parabéns! Você já conquistou <strong>{metasConcluidas.length} meta(s)</strong> e está com {progressoGeral.toFixed(1)}% de progresso geral. 
          Para acelerar seus objetivos, considere definir um valor mensal fixo para cada meta ativa.
        </p>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            Definir Aportes Automáticos
          </button>
          <button className="px-4 py-2 bg-white text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
            Ver Dicas de Economia
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-right text-sm text-gray-500">
        © 2024 MoneyMapp TCC. Todos os direitos reservados.
      </div>
    </div>
  )
}
