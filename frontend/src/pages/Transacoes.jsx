import React, { useState, useEffect } from 'react'
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
  TrendingDown,
  Eye
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { dadosDemo } from '../data/dadosDemo'
import { SkeletonTable } from '../components/ui'

// Componente de indicador do modo demo
function IndicadorModoDemo() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 mb-6">
      <Eye className="w-5 h-5" />
      <span className="font-medium">Modo Demonstração</span>
      <span className="text-blue-100 text-sm">• Todos os dados são fictícios</span>
    </div>
  )
}

// Dados mockados para demonstração (fallback)
const mockTransacoesFallback = [
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
  const { modoDemo } = useAuth()
  const [loading, setLoading] = useState(true)
  
  // Usar dados demo se estiver em modo demo
  const transacoesIniciais = modoDemo ? dadosDemo.transacoes : mockTransacoesFallback
  const [transacoes, setTransacoes] = useState(transacoesIniciais)
  
  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    
    return () => clearTimeout(timer)
  }, [])
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

  // Mostrar skeleton enquanto carrega
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="mb-8">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-48 rounded mb-2"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-64 rounded"></div>
        </div>
        <SkeletonTable rows={8} columns={5} />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Indicador de Modo Demo */}
      {modoDemo && <IndicadorModoDemo />}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Transações</h1>
          <p className="text-gray-600">Gerencie suas receitas e despesas</p>
        </div>
        <button 
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Transação
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas do Mês</p>
              <p className="text-2xl font-bold text-green-600">{formatMoney(resumoMes.receitas)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas do Mês</p>
              <p className="text-2xl font-bold text-red-600">{formatMoney(resumoMes.despesas)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo do Mês</p>
              <p className={`text-2xl font-bold ${resumoMes.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatMoney(resumoMes.saldo)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar transação..."
              value={filtros.busca}
              onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
          
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          
          <select
            value={filtros.status}
            onChange={(e) => setFiltros({...filtros, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="confirmado">Confirmado</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Lista de Transações ({transacoesFiltradas.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {transacoesFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma transação encontrada com os filtros aplicados.
            </div>
          ) : (
            transacoesFiltradas.map((transacao) => (
              <div key={transacao.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transacao.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transacao.tipo === 'receita' ? (
                        <ArrowUpRight className="w-6 h-6 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{transacao.descricao}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transacao.status === 'confirmado' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transacao.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {transacao.categoria} • {formatDate(transacao.data)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-semibold ${
                      transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transacao.tipo === 'receita' ? '+' : '-'}{formatMoney(transacao.valor)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Nova Transação</h3>
            <p className="text-gray-600 mb-4">Esta é uma versão de demonstração. Em produção, aqui seria exibido um formulário completo para adicionar/editar transações.</p>
            <button 
              onClick={() => setModalAberto(false)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Copyright */}
      <div className="mt-8 text-right text-sm text-gray-500">
        © 2024 MoneyMapp TCC. Todos os direitos reservados.
      </div>
    </div>
  )
}
