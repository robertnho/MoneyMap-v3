import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { BarChart3, TrendingUp, Calendar, Filter, Download, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

// Dados mockados para demonstração
const mockData = {
  receitasVsDespesas: [
    { mes: 'Mai', receitas: 7200, despesas: 4800 },
    { mes: 'Jun', receitas: 7800, despesas: 4200 },
    { mes: 'Jul', receitas: 8100, despesas: 4500 },
    { mes: 'Ago', receitas: 8300, despesas: 4300 },
    { mes: 'Set', receitas: 8000, despesas: 4600 },
    { mes: 'Out', receitas: 8500, despesas: 4250 }
  ],
  
  categoriasDespesas: [
    { name: 'Moradia', value: 1500, color: '#FF6B6B', percentage: 35.3 },
    { name: 'Alimentação', value: 1200, color: '#4ECDC4', percentage: 28.2 },
    { name: 'Transporte', value: 800, color: '#45B7D1', percentage: 18.8 },
    { name: 'Lazer', value: 600, color: '#96CEB4', percentage: 14.1 },
    { name: 'Outros', value: 150, color: '#FFEAA7', percentage: 3.6 }
  ],
  
  evolucaoSaldo: [
    { mes: 'Mai', saldo: 10200 },
    { mes: 'Jun', saldo: 11800 },
    { mes: 'Jul', saldo: 13400 },
    { mes: 'Ago', saldo: 15400 },
    { mes: 'Set', saldo: 14800 },
    { mes: 'Out', saldo: 17050 }
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
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
            {trendValue}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
        </div>
      )}
    </div>
  )
}

export default function Relatorios() {
  const [filtroSelecionado, setFiltroSelecionado] = useState('6meses')
  
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const totalReceitas = mockData.receitasVsDespesas.reduce((acc, item) => acc + item.receitas, 0)
  const totalDespesas = mockData.receitasVsDespesas.reduce((acc, item) => acc + item.despesas, 0)
  const saldoTotal = totalReceitas - totalDespesas

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="animate-in slide-in-from-left duration-700">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Relatórios Financeiros</h1>
            <p className="text-gray-600">Análise detalhada das suas finanças</p>
          </div>
        
          <div className="flex flex-col sm:flex-row gap-3 animate-in slide-in-from-right duration-700">
          <select 
            value={filtroSelecionado}
            onChange={(e) => setFiltroSelecionado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3meses">Últimos 3 meses</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="1ano">Último ano</option>
          </select>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 space-y-6">
        {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total de Receitas"
          value={formatMoney(totalReceitas)}
          subtitle="Últimos 6 meses"
          icon={TrendingUp}
          trend="up"
          trendValue="8.2"
          color="green"
        />
        
        <StatCard 
          title="Total de Despesas"
          value={formatMoney(totalDespesas)}
          subtitle="Últimos 6 meses"
          icon={ArrowDownRight}
          trend="down"
          trendValue="7.7"
          color="red"
        />
        
        <StatCard 
          title="Saldo Acumulado"
          value={formatMoney(saldoTotal)}
          subtitle="Economia total"
          icon={DollarSign}
          trend="up"
          trendValue="33.6"
          color="blue"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas vs Despesas */}
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

        {/* Despesas por Categoria */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.categoriasDespesas}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {mockData.categoriasDespesas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legenda */}
          <div className="mt-4 space-y-2">
            {mockData.categoriasDespesas.map((categoria, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: categoria.color }}
                  />
                  <span className="text-gray-700">{categoria.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">
                    R$ {categoria.value.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-gray-500 ml-2">({categoria.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolução do Saldo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Saldo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockData.evolucaoSaldo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="mes" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Saldo']}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="saldo" 
              stroke="#3b82f6" 
              fill="url(#colorSaldo)" 
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Insights Financeiros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">📈 Padrão Positivo</h4>
            <p className="text-sm text-gray-600">
              Suas receitas cresceram <strong>8,2%</strong> nos últimos meses, mostrando uma tendência de melhoria financeira consistente.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">💡 Oportunidade</h4>
            <p className="text-sm text-gray-600">
              A categoria "Lazer" representa 14,1% dos gastos. Considere revisar esses gastos para acelerar suas metas de economia.
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Copyright */}
      <div className="px-4 py-6 sm:px-6">
        <div className="text-right text-sm text-gray-500">
          © 2024 MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
