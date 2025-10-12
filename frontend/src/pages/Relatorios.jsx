import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { BarChart3, TrendingUp, Calendar, Filter, Download, DollarSign, ArrowUpRight, ArrowDownRight, PiggyBank, TrendingDown } from 'lucide-react'

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
    { name: 'Moradia', value: 1500, color: '#8b5cf6', percentage: 35.3 },
    { name: 'Alimentação', value: 1200, color: '#6366f1', percentage: 28.2 },
    { name: 'Transporte', value: 800, color: '#a855f7', percentage: 18.8 },
    { name: 'Lazer', value: 600, color: '#c084fc', percentage: 14.1 },
    { name: 'Outros', value: 150, color: '#d8b4fe', percentage: 3.6 }
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
    blue: 'from-indigo-500 to-sky-400',
    green: 'from-emerald-500 to-teal-400', 
    red: 'from-red-500 to-pink-400',
    purple: 'from-purple-500 to-violet-400'
  }

  return (
    <div className="group rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 dark:border-white/10 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">{title}</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
          {subtitle && <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4 pt-4 border-t border-zinc-200/60 dark:border-white/10">
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-2" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-2" />
          )}
          <span className={`text-sm font-semibold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {trendValue}%
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">vs período anterior</span>
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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fundo full-bleed */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-zinc-950 dark:via-violet-950/20 dark:to-purple-950/30" />
        <div className="absolute -top-24 -left-24 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-violet-400/20 to-purple-500/20 blur-3xl" />
        <div
          className="absolute -bottom-32 -right-32 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-indigo-400/20 to-violet-500/20 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute left-1/4 top-1/3 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-purple-400/10 to-fuchsia-400/10 blur-2xl"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.9) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 w-full border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl shadow-lg shadow-zinc-100/50 dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-zinc-900/50">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-xl font-bold text-transparent dark:from-zinc-100 dark:to-zinc-300 md:text-2xl">
                Relatórios Financeiros
              </h1>
              <p className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                Análise detalhada das suas finanças
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={filtroSelecionado}
              onChange={(e) => setFiltroSelecionado(e.target.value)}
              className="rounded-xl border border-zinc-200/60 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300"
            >
              <option value="3meses">Últimos 3 meses</option>
              <option value="6meses">Últimos 6 meses</option>
              <option value="1ano">Último ano</option>
            </select>
            
            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/40 active:scale-95">
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto max-w-[1600px] px-6 pb-6 lg:px-8">
        {/* Cards Principais - Colados ao topo */}
        <div className="pt-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              icon={TrendingDown}
              trend="down"
              trendValue="7.7"
              color="red"
            />
            
            <StatCard 
              title="Saldo Acumulado"
              value={formatMoney(saldoTotal)}
              subtitle="Economia total"
              icon={PiggyBank}
              trend="up"
              trendValue="33.6"
              color="blue"
            />
          </div>
        </div>

        {/* Gráficos Principais */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receitas vs Despesas */}
          <div className="group rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 dark:border-white/10 dark:bg-zinc-900/70">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-lg">📊</span>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Receitas vs Despesas</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={mockData.receitasVsDespesas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="mes" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                  labelFormatter={(label) => `Mês: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesas" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Despesas por Categoria */}
          <div className="group rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 dark:border-white/10 dark:bg-zinc-900/70">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-lg">🥧</span>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Despesas por Categoria</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={mockData.categoriasDespesas}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {mockData.categoriasDespesas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legenda */}
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {mockData.categoriasDespesas.map((categoria, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3 shadow-sm" 
                      style={{ backgroundColor: categoria.color }}
                    />
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{categoria.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      R$ {categoria.value.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 ml-2 text-xs">({categoria.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evolução do Saldo */}
        <div className="mb-6 group rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 dark:border-white/10 dark:bg-zinc-900/70">
          <div className="mb-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-3">
              <span className="text-2xl">📈</span>
              <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Evolução do Saldo</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Acompanhe o crescimento do seu patrimônio</p>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={mockData.evolucaoSaldo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="mes" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Saldo']}
                labelFormatter={(label) => `Mês: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="saldo" 
                stroke="#8b5cf6" 
                fill="url(#colorSaldo)" 
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights Financeiros */}
        <div className="mb-6 group relative overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20 dark:border-purple-800/30">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br from-purple-400/20 to-violet-500/20 blur-2xl transition-all duration-700 group-hover:scale-125"></div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">💡 Insights Financeiros</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Análise inteligente dos seus dados</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/60 p-4 backdrop-blur dark:bg-zinc-800/60">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <span className="text-green-500">📈</span>
                  Padrão Positivo
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Suas receitas cresceram <span className="font-bold text-emerald-600 dark:text-emerald-400">8,2%</span> nos últimos meses, mostrando uma tendência de melhoria financeira consistente.
                </p>
              </div>
              
              <div className="rounded-xl bg-white/60 p-4 backdrop-blur dark:bg-zinc-800/60">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <span className="text-amber-500">💡</span>
                  Oportunidade
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  A categoria "Lazer" representa <span className="font-bold text-violet-600 dark:text-violet-400">14,1%</span> dos gastos. Considere revisar esses gastos para acelerar suas metas de economia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="pt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © 2024 MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
