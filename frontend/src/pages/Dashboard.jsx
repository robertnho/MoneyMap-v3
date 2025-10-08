import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Dados mockados para demonstração
const mockData = {
  saldo: 12450.80,
  receitas: 8500.00,
  despesas: 4250.30,
  economia: 4249.70,
  
  receitasVsDespesas: [
    { mes: 'Jul', receitas: 7200, despesas: 4800 },
    { mes: 'Ago', receitas: 7800, despesas: 4200 },
    { mes: 'Set', receitas: 8100, despesas: 4500 },
    { mes: 'Out', receitas: 8500, despesas: 4250 },
  ],
  
  categorias: [
    { name: 'Alimentação', value: 1200, color: '#FF6B6B' },
    { name: 'Transporte', value: 800, color: '#4ECDC4' },
    { name: 'Moradia', value: 1500, color: '#45B7D1' },
    { name: 'Lazer', value: 600, color: '#96CEB4' },
    { name: 'Outros', value: 150.30, color: '#FFEAA7' },
  ],
  
  transacoesRecentes: [
    { id: 1, tipo: 'receita', descricao: 'Salário', valor: 5500.00, data: '2024-10-01', categoria: 'Trabalho' },
    { id: 2, tipo: 'receita', descricao: 'Freelance', valor: 1200.00, data: '2024-10-02', categoria: 'Trabalho' },
    { id: 3, tipo: 'despesa', descricao: 'Supermercado', valor: 320.50, data: '2024-10-02', categoria: 'Alimentação' },
    { id: 4, tipo: 'despesa', descricao: 'Combustível', valor: 180.00, data: '2024-10-03', categoria: 'Transporte' },
    { id: 5, tipo: 'despesa', descricao: 'Aluguel', valor: 1200.00, data: '2024-10-05', categoria: 'Moradia' },
  ]
}

function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600', 
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 hover:-translate-y-1 group cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors">{title}</p>
          <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">{subtitle}</p>}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
        </div>
      )}
    </div>
  )
}

function TransactionItem({ transaction }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all duration-200 rounded-lg px-2 -mx-2 group">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          transaction.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {transaction.tipo === 'receita' ? (
            <ArrowUpRight className={`w-5 h-5 ${transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`} />
          ) : (
            <ArrowDownRight className={`w-5 h-5 ${transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`} />
          )}
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-900">{transaction.descricao}</p>
          <p className="text-sm text-gray-500">{transaction.categoria} • {transaction.data}</p>
        </div>
      </div>
      <span className={`font-semibold ${
        transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
      }`}>
        {transaction.tipo === 'receita' ? '+' : '-'}R$ {transaction.valor.toFixed(2).replace('.', ',')}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard Financeiro</h1>
        <p className="text-gray-600">Bem-vindo de volta! Aqui está um resumo das suas finanças.</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Saldo Total"
          value={formatMoney(mockData.saldo)}
          subtitle="Todas as contas"
          icon={DollarSign}
          trend="up"
          trendValue="+12,3%"
          color="blue"
        />
        
        <StatCard 
          title="Receitas do Mês"
          value={formatMoney(mockData.receitas)}
          subtitle="Outubro 2024"
          icon={TrendingUp}
          trend="up"
          trendValue="+8,2%"
          color="green"
        />
        
        <StatCard 
          title="Despesas do Mês"
          value={formatMoney(mockData.despesas)}
          subtitle="Outubro 2024"
          icon={TrendingDown}
          trend="down"
          trendValue="-5,1%"
          color="red"
        />
        
        <StatCard 
          title="Economia"
          value={formatMoney(mockData.economia)}
          subtitle="Este mês"
          icon={PiggyBank}
          trend="up"
          trendValue="+15,7%"
          color="purple"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Gráfico de Barras - Receitas vs Despesas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Receitas vs Despesas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.receitasVsDespesas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Bar dataKey="receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Gastos por Categoria */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.categorias}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {mockData.categorias.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legenda */}
          <div className="mt-4 space-y-2">
            {mockData.categorias.map((categoria, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: categoria.color }}
                  />
                  <span className="text-gray-700">{categoria.name}</span>
                </div>
                <span className="font-medium text-gray-900">
                  R$ {categoria.value.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transações Recentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Ver todas
          </button>
        </div>
        
        <div className="space-y-1">
          {mockData.transacoesRecentes.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>

      {/* Links Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <button
          onClick={() => navigate('/transacoes')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Transações</h4>
              <p className="text-sm text-gray-600 mt-1">Gerencie receitas e despesas</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => navigate('/metas')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Metas</h4>
              <p className="text-sm text-gray-600 mt-1">Acompanhe seus objetivos</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => navigate('/relatorios')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Relatórios</h4>
              <p className="text-sm text-gray-600 mt-1">Análise financeira detalhada</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => navigate('/educacao')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Educação</h4>
              <p className="text-sm text-gray-600 mt-1">Aprenda sobre finanças</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </div>
        </button>
      </div>

      {/* Dicas Rápidas */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Dica do Dia</h3>
        </div>
        
        <p className="text-gray-700 mb-4">
          Parabéns! Você economizou <strong>R$ 4.249,70</strong> este mês. 
          Considere investir essa quantia em uma reserva de emergência ou em investimentos de baixo risco.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/metas')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium hover:scale-105 active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            Ver Metas de Economia
          </button>
          <button 
            onClick={() => navigate('/educacao')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-300 text-sm font-medium hover:scale-105 active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            Educação Financeira
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
