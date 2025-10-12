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
        ? 'bg-[#09090b]'
        : 'bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="text-center sm:text-left">
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 drop-shadow-sm transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Transações
            </h1>
            <p className={`text-lg font-medium transition-colors duration-300 ${
              isDark ? 'text-zinc-300' : 'text-gray-700'
            }`}>
              Gerencie suas receitas e despesas
            </p>
          </div>
          <button 
            onClick={() => setModalAberto(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mx-auto sm:mx-0"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="backdrop-blur-lg bg-white/30 rounded-3xl border border-white/50 shadow-xl p-8 hover:bg-white/40 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Receitas do Mês</p>
                <p className="text-3xl font-bold text-green-600 drop-shadow-sm">{formatMoney(resumoMes.receitas)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-lg bg-white/30 rounded-3xl border border-white/50 shadow-xl p-8 hover:bg-white/40 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Despesas do Mês</p>
                <p className="text-3xl font-bold text-red-600 drop-shadow-sm">{formatMoney(resumoMes.despesas)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-lg bg-white/30 rounded-3xl border border-white/50 shadow-xl p-8 hover:bg-white/40 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Saldo do Mês</p>
                <p className={`text-3xl font-bold drop-shadow-sm ${resumoMes.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
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
        <div className="backdrop-blur-lg bg-white/25 rounded-3xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar transação..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                className="w-full pl-12 pr-4 py-3 border border-white/30 bg-white/40 backdrop-blur-sm rounded-2xl text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
              />
            </div>
            
            <select
              value={filtros.categoria}
              onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
              className="w-full px-4 py-3 border border-white/30 bg-white/40 backdrop-blur-sm rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
            >
              <option value="">Todas as categorias</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
              className="w-full px-4 py-3 border border-white/30 bg-white/40 backdrop-blur-sm rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
            >
              <option value="">Todos os tipos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
            
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              className="w-full px-4 py-3 border border-white/30 bg-white/40 backdrop-blur-sm rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
            >
              <option value="">Todos os status</option>
              <option value="confirmado">Confirmado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="backdrop-blur-lg bg-white/25 rounded-3xl border border-white/40 shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-white/30 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <h3 className="text-xl font-bold text-gray-800">Lista de Transações ({transacoesFiltradas.length})</h3>
          </div>
          
          <div className="divide-y divide-white/20">
            {transacoesFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium text-lg">
                  Nenhuma transação encontrada com os filtros aplicados.
                </p>
              </div>
            ) : (
              transacoesFiltradas.map((transacao) => (
                <div key={transacao.id} className="p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer">
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
                          <p className="font-bold text-gray-800 text-lg">{transacao.descricao}</p>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            transacao.status === 'confirmado' 
                              ? 'bg-green-100/80 text-green-700 border border-green-200/50' 
                              : 'bg-yellow-100/80 text-yellow-700 border border-yellow-200/50'
                          }`}>
                            {transacao.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium">
                          {transacao.categoria} • {formatDate(transacao.data)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className={`text-xl font-bold ${
                        transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transacao.tipo === 'receita' ? '+' : '-'}{formatMoney(transacao.valor)}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300 transform hover:scale-110">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all duration-300 transform hover:scale-110">
                          <Trash2 className="w-5 h-5" />
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
            <div className="backdrop-blur-lg bg-white/30 rounded-3xl border border-white/50 shadow-2xl max-w-md w-full p-8 transform animate-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Nova Transação</h3>
              <p className="text-gray-700 font-medium mb-8 leading-relaxed">
                Esta é uma versão de demonstração. Em produção, aqui seria exibido um formulário completo para adicionar/editar transações.
              </p>
              <button 
                onClick={() => setModalAberto(false)}
                className="w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="text-center text-sm text-gray-600 font-medium backdrop-blur-sm bg-white/20 rounded-2xl p-4 border border-white/30">
          © 2024 MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
