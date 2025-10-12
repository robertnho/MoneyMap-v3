import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext.jsx'
import { 
  Plus, 
  Filter, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit, 
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

// Dados mockados para demonstração
const mockTransacoes = [
  {
    id: 1,
    descricao: 'Salário Mensal',
    valor: 5500.00,
    tipo: 'receita',
    categoria: 'Trabalho',
    data: '2024-10-01',
    status: 'confirmado'
  },
  {
    id: 2,
    descricao: 'Freelance Website',
    valor: 1200.00,
    tipo: 'receita',
    categoria: 'Trabalho',
    data: '2024-10-02',
    status: 'confirmado'
  },
  {
    id: 3,
    descricao: 'Supermercado Extra',
    valor: 320.50,
    tipo: 'despesa',
    categoria: 'Alimentação',
    data: '2024-10-02',
    status: 'confirmado'
  },
  {
    id: 4,
    descricao: 'Combustível Shell',
    valor: 180.00,
    tipo: 'despesa',
    categoria: 'Transporte',
    data: '2024-10-03',
    status: 'confirmado'
  },
  {
    id: 5,
    descricao: 'Aluguel Apartamento',
    valor: 1200.00,
    tipo: 'despesa',
    categoria: 'Moradia',
    data: '2024-10-05',
    status: 'confirmado'
  },
  {
    id: 6,
    descricao: 'Cinema',
    valor: 35.00,
    tipo: 'despesa',
    categoria: 'Lazer',
    data: '2024-10-06',
    status: 'confirmado'
  },
  {
    id: 7,
    descricao: 'Vendas Online',
    valor: 450.00,
    tipo: 'receita',
    categoria: 'Vendas',
    data: '2024-10-07',
    status: 'pendente'
  },
  {
    id: 8,
    descricao: 'Farmácia',
    valor: 85.30,
    tipo: 'despesa',
    categoria: 'Saúde',
    data: '2024-10-08',
    status: 'confirmado'
  },
  {
    id: 9,
    descricao: 'Restaurante',
    valor: 120.00,
    tipo: 'despesa',
    categoria: 'Alimentação',
    data: '2024-10-09',
    status: 'confirmado'
  },
  {
    id: 10,
    descricao: 'Investimento CDB',
    valor: 1000.00,
    tipo: 'despesa',
    categoria: 'Investimentos',
    data: '2024-10-10',
    status: 'confirmado'
  }
]

const categorias = [
  'Trabalho', 'Alimentação', 'Transporte', 'Moradia', 'Lazer', 
  'Saúde', 'Educação', 'Investimentos', 'Vendas', 'Outros'
]

export default function Transacoes() {
  const { isDark } = useTheme()
  const [transacoes, setTransacoes] = useState(mockTransacoes)
  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: '',
    tipo: '',
    status: ''
  })
  const [modalAberto, setModalAberto] = useState(false)
  const [transacaoEditando, setTransacaoEditando] = useState(null)

  
  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchBusca = !filtros.busca || 
      transacao.descricao.toLowerCase().includes(filtros.busca.toLowerCase())
    const matchCategoria = !filtros.categoria || transacao.categoria === filtros.categoria
    const matchTipo = !filtros.tipo || transacao.tipo === filtros.tipo
    const matchStatus = !filtros.status || transacao.status === filtros.status
    
    return matchBusca && matchCategoria && matchTipo && matchStatus
  })

  const resumoMes = {
    receitas: transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0),
    despesas: transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0),
    saldo: 0
  }
  resumoMes.saldo = resumoMes.receitas - resumoMes.despesas

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${
      isDark
        ? 'bg-slate-950 text-slate-100'
        : 'bg-gradient-to-br from-slate-100 via-sky-100/50 to-indigo-100/40 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="mb-3 text-4xl font-bold drop-shadow-sm transition-colors duration-300 md:text-5xl text-slate-900 dark:text-slate-100">
              Transações
            </h1>
            <p className="text-lg font-medium transition-colors duration-300 text-slate-700 dark:text-slate-300">
              Gerencie suas receitas e despesas
            </p>
          </div>
          <button 
            onClick={() => setModalAberto(true)}
            className="mx-auto flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:shadow-xl sm:mx-0 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:hover:shadow-slate-100/40"
          >
            <Plus className="h-5 w-5" />
            Nova Transação
          </button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/50 bg-white/30 p-8 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/40 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900/75">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-bold text-gray-700 dark:text-slate-300">Receitas do Mês</p>
                <p className="text-3xl font-bold text-emerald-600 drop-shadow-sm dark:text-emerald-400">{formatMoney(resumoMes.receitas)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/50 bg-white/30 p-8 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/40 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900/75">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-bold text-gray-700 dark:text-slate-300">Despesas do Mês</p>
                <p className="text-3xl font-bold text-rose-600 drop-shadow-sm dark:text-rose-400">{formatMoney(resumoMes.despesas)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/50 bg-white/30 p-8 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/40 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900/75">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-bold text-gray-700 dark:text-slate-300">Saldo do Mês</p>
                <p className={`text-3xl font-bold drop-shadow-sm ${
                  resumoMes.saldo >= 0
                    ? 'text-blue-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-rose-400'
                }`}>
                  {formatMoney(resumoMes.saldo)}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                resumoMes.saldo >= 0 
                  ? 'bg-gradient-to-br from-blue-400 to-indigo-500' 
                  : 'bg-gradient-to-br from-red-400 to-rose-500'
              }`}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="rounded-3xl border border-white/40 bg-white/25 p-8 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Buscar transação..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                className="w-full rounded-2xl border border-white/30 bg-white/40 py-3 pl-12 pr-4 text-gray-800 shadow-sm transition-all duration-300 placeholder:text-gray-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400"
              />
            </div>
            
            <select
              value={filtros.categoria}
              onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
              className="w-full rounded-2xl border border-white/30 bg-white/40 px-4 py-3 text-gray-800 shadow-sm transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-400"
            >
              <option value="">Todas as categorias</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
              className="w-full rounded-2xl border border-white/30 bg-white/40 px-4 py-3 text-gray-800 shadow-sm transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-400"
            >
              <option value="">Todos os tipos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
            
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              className="w-full rounded-2xl border border-white/30 bg-white/40 px-4 py-3 text-gray-800 shadow-sm transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-400"
            >
              <option value="">Todos os status</option>
              <option value="confirmado">Confirmado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/25 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/70">
          <div className="border-b border-white/30 bg-gradient-to-r from-blue-50/60 to-purple-50/60 px-8 py-6 dark:border-slate-700 dark:bg-slate-900/70">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Lista de Transações ({transacoesFiltradas.length})</h3>
          </div>
          
          <div className="divide-y divide-white/20 dark:divide-slate-800/60">
            {transacoesFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-600 dark:text-slate-300">
                  Nenhuma transação encontrada com os filtros aplicados.
                </p>
              </div>
            ) : (
              transacoesFiltradas.map((transacao) => (
                <div key={transacao.id} className="cursor-pointer p-6 transition-all duration-300 transform hover:scale-[1.01] hover:bg-white/20 dark:hover:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        transacao.tipo === 'receita' 
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-br from-red-400 to-rose-500'
                      }`}>
                        {transacao.tipo === 'receita' ? (
                          <ArrowUpRight className="w-7 h-7 text-white" />
                        ) : (
                          <ArrowDownRight className="w-7 h-7 text-white" />
                        )}
                      </div>
                      
                      <div className="ml-5">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-lg font-bold text-gray-800 dark:text-slate-100">{transacao.descricao}</p>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            transacao.status === 'confirmado' 
                              ? 'border border-green-200/50 bg-green-100/80 text-green-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300' 
                              : 'border border-yellow-200/50 bg-yellow-100/80 text-yellow-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300'
                          }`}>
                            {transacao.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                        <p className="font-medium text-gray-600 dark:text-slate-300">
                          {transacao.categoria} • {formatDate(transacao.data)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className={`text-xl font-bold ${
                        transacao.tipo === 'receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-rose-400'
                      }`}>
                        {transacao.tipo === 'receita' ? '+' : '-'}{formatMoney(transacao.valor)}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button className="rounded-xl p-3 text-gray-500 transition-all duration-300 transform hover:scale-110 hover:bg-blue-50/50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="rounded-xl p-3 text-gray-500 transition-all duration-300 transform hover:scale-110 hover:bg-red-50/50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-rose-300">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal seria implementado aqui - versão demonstrativa */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="max-w-md w-full rounded-3xl border border-white/50 bg-white/30 p-8 shadow-2xl backdrop-blur-lg transform animate-in slide-in-from-bottom-4 duration-300 dark:border-slate-700 dark:bg-slate-900/80">
              <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-slate-100">Nova Transação</h3>
              <p className="mb-8 font-medium leading-relaxed text-gray-700 dark:text-slate-300">
                Esta é uma versão de demonstração. Em produção, aqui seria exibido um formulário completo para adicionar/editar transações.
              </p>
              <button 
                onClick={() => setModalAberto(false)}
                className="w-full rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:shadow-xl dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="rounded-2xl border border-white/30 bg-white/20 p-4 text-center text-sm font-medium text-gray-600 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          © 2024 MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
