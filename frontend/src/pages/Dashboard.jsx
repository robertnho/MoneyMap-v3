import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  PlusCircle,
  Target,
  BarChart3,
  BookOpen,
  Wallet,
  Clock,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts'

// ============================================================================
// DADOS MOCKADOS (mantidos como estavam)
// ============================================================================
const mockData = {
  saldo: 12450.8,
  receitas: 8500.0,
  despesas: 4250.3,
  economia: 4249.7,
  receitasVsDespesas: [
    { mes: 'Jul', receitas: 7200, despesas: 4800 },
    { mes: 'Ago', receitas: 7800, despesas: 4200 },
    { mes: 'Set', receitas: 8100, despesas: 4500 },
    { mes: 'Out', receitas: 8500, despesas: 4250 },
  ],
  categorias: [
    { name: 'Alimentação', value: 1200, color: '#16a34a' }, // emerald 600
    { name: 'Transporte', value: 800, color: '#0ea5e9' },   // sky 500
    { name: 'Moradia', value: 1500, color: '#dc2626' },     // red 600
    { name: 'Lazer', value: 600, color: '#8b5cf6' },        // violet 500
    { name: 'Outros', value: 150.3, color: '#64748b' },     // slate 500
  ],
  transacoesRecentes: [
    { id: 1, tipo: 'receita', descricao: 'Salário', valor: 5500.0, data: '2024-10-01', categoria: 'Trabalho' },
    { id: 2, tipo: 'receita', descricao: 'Freelance', valor: 1200.0, data: '2024-10-02', categoria: 'Trabalho' },
    { id: 3, tipo: 'despesa', descricao: 'Supermercado', valor: 320.5, data: '2024-10-02', categoria: 'Alimentação' },
    { id: 4, tipo: 'despesa', descricao: 'Combustível', valor: 180.0, data: '2024-10-03', categoria: 'Transporte' },
    { id: 5, tipo: 'despesa', descricao: 'Aluguel', valor: 1200.0, data: '2024-10-05', categoria: 'Moradia' },
  ],
}

// ============================================================================
// HELPERS
// ============================================================================
const money = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const tooltipCurrency = (v) => [`R$ ${Number(v).toLocaleString('pt-BR')}`, '']

// ============================================================================
// COMPONENTES DE UI (internos para esta tela)
// ============================================================================
function SectionCard({ title, right, className = '', children }) {
  return (
    <section className={`rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur shadow-sm dark:border-white/10 dark:bg-zinc-900/60 ${className}`}>
      <header className="flex items-center justify-between border-b border-zinc-200/60 px-5 py-4 dark:border-white/10">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        {right}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

function BadgeIcon({ children, className = '' }) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${className}`} >
      {children}
    </div>
  )
}

function KpiCard({ title, value, trend = 'up', trendValue = '', icon: Icon, tone = 'emerald' }) {
  const scheme = useMemo(
    () => ({
      emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        fg: 'text-emerald-600 dark:text-emerald-400',
        chipBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        chipFg: 'text-emerald-600 dark:text-emerald-400',
      },
      red: {
        bg: 'bg-rose-100 dark:bg-rose-900/30',
        fg: 'text-rose-600 dark:text-rose-400',
        chipBg: 'bg-rose-50 dark:bg-rose-900/20',
        chipFg: 'text-rose-600 dark:text-rose-400',
      },
      sky: {
        bg: 'bg-sky-100 dark:bg-sky-900/30',
        fg: 'text-sky-600 dark:text-sky-400',
        chipBg: 'bg-sky-50 dark:bg-sky-900/20',
        chipFg: 'text-sky-600 dark:text-sky-400',
      },
      violet: {
        bg: 'bg-violet-100 dark:bg-violet-900/30',
        fg: 'text-violet-600 dark:text-violet-400',
        chipBg: 'bg-violet-50 dark:bg-violet-900/20',
        chipFg: 'text-violet-600 dark:text-violet-400',
      },
    })[tone],
    [tone]
  )

  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <BadgeIcon className={`${scheme.bg}`}>
            <Icon className={`h-5 w-5 ${scheme.fg}`} />
          </BadgeIcon>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{title}</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm ${scheme.chipBg} ${scheme.chipFg}`}>
          {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {trendValue}
        </span>
      </div>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">vs mês anterior</p>
    </div>
  )
}

function TransactionRow({ t }) {
  const receita = t.tipo === 'receita'
  return (
    <div className="group flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <BadgeIcon className={`${receita ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
          {receita ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
        </BadgeIcon>
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{t.descricao}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.categoria} • {t.data}</p>
        </div>
      </div>
      <div className={`font-semibold ${receita ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
        {receita ? '+' : '-'}{money(t.valor)}
      </div>
    </div>
  )
}

function QuickActionCard({ title, desc, icon: Icon, onClick, color = 'text-zinc-400', hover = 'group-hover:text-emerald-600' }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-zinc-200/60 bg-white/70 p-5 text-left shadow-sm backdrop-blur transition-all hover:-translate-y-[1px] hover:shadow-md active:scale-[0.99] dark:border-white/10 dark:bg-zinc-900/60"
      aria-label={title}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-zinc-900 transition-colors dark:text-zinc-100">{title}</h4>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
        </div>
        <Icon className={`h-6 w-6 ${color} ${hover}`} />
      </div>
    </button>
  )
}

// ============================================================================
// PÁGINA
// ============================================================================
export default function Dashboard() {
  const navigate = useNavigate()

  // total categorias para o centro do donut
  const totalCategorias = useMemo(
    () => mockData.categorias.reduce((acc, c) => acc + c.value, 0),
    []
  )

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 pb-10 pt-4 lg:px-8">
      {/* Topo "sticky": título + CTA */}
      <div className="sticky top-0 z-10 -mx-6 mb-2 bg-white/70 px-6 py-3 backdrop-blur dark:bg-zinc-900/60 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl">
              Dashboard Financeiro
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Bem-vindo de volta! Aqui está um resumo das suas finanças.
            </p>
          </div>
          <button
            onClick={() => navigate('/transacoes')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <PlusCircle className="h-4 w-4" />
            Adicionar transação
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Saldo Total" value={money(mockData.saldo)} trend="up" trendValue="+12,3%" icon={Wallet} tone="emerald" />
          <KpiCard title="Receitas do Mês" value={money(mockData.receitas)} trend="up" trendValue="+8,2%" icon={TrendingUp} tone="emerald" />
          <KpiCard title="Despesas do Mês" value={money(mockData.despesas)} trend="down" trendValue="-5,1%" icon={TrendingDown} tone="red" />
          <KpiCard title="Economia" value={money(mockData.economia)} trend="up" trendValue="+15,7%" icon={PiggyBank} tone="sky" />
        </div>

        {/* Receitas vs Despesas (7 col) */}
        <div className="col-span-12 lg:col-span-7">
          <SectionCard title="Receitas vs Despesas">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.receitasVsDespesas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={tooltipCurrency} labelFormatter={(l) => `Mês: ${l}`} />
                  <Bar dataKey="receitas" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="despesas" fill="#dc2626" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* Donut por Categoria (5 col) */}
        <div className="col-span-12 lg:col-span-5">
          <SectionCard title="Gastos por Categoria">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData.categorias}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {mockData.categorias.map((c, i) => (
                        <Cell key={i} fill={c.color} />
                      ))}
                      <Label
                        value={money(totalCategorias)}
                        position="center"
                        className="text-zinc-800"
                      />
                    </Pie>
                    <Tooltip formatter={tooltipCurrency} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* legenda 2 col */}
              <div className="space-y-2">
                {mockData.categorias.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-zinc-700 dark:text-zinc-300">{c.name}</span>
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{money(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Transações (8 col) */}
        <div className="col-span-12 lg:col-span-8">
          <SectionCard
            title="Transações Recentes"
            right={
              <button
                onClick={() => navigate('/transacoes')}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Ver todas
              </button>
            }
          >
            <div className="divide-y divide-zinc-200/60 dark:divide-white/10">
              {mockData.transacoesRecentes.map((t) => (
                <TransactionRow key={t.id} t={t} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Ações rápidas / Aprendizado (4 col) */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
          <QuickActionCard
            title="Transações"
            desc="Gerencie receitas e despesas"
            icon={ExternalLink}
            onClick={() => navigate('/transacoes')}
            color="text-zinc-400"
            hover="group-hover:text-emerald-600"
          />
          <QuickActionCard
            title="Metas"
            desc="Acompanhe seus objetivos"
            icon={Target}
            onClick={() => navigate('/metas')}
            color="text-zinc-400"
            hover="group-hover:text-emerald-600"
          />
          <QuickActionCard
            title="Relatórios"
            desc="Análise financeira"
            icon={BarChart3}
            onClick={() => navigate('/relatorios')}
            color="text-zinc-400"
            hover="group-hover:text-violet-600"
          />
          <QuickActionCard
            title="Educação"
            desc="Aprenda sobre finanças"
            icon={BookOpen}
            onClick={() => navigate('/educacao')}
            color="text-zinc-400"
            hover="group-hover:text-amber-600"
          />
        </div>

        {/* Dica do dia (callout) */}
        <div className="col-span-12">
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50 p-6 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/20">
            <div className="mb-3 flex items-center gap-3">
              <BadgeIcon className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <Clock className="h-5 w-5" />
              </BadgeIcon>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Dica do Dia</h3>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-800 dark:text-zinc-200">
              Parabéns! Você economizou <strong>{money(mockData.economia)}</strong> este mês.
              Considere alocar parte dessa quantia para sua reserva de emergência ou um investimento de baixo risco.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/metas')}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <Target className="h-4 w-4" />
                Ver metas de economia
              </button>
              <button
                onClick={() => navigate('/educacao')}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-900/40 dark:bg-transparent dark:text-amber-300 dark:hover:bg-amber-900/20"
              >
                <BookOpen className="h-4 w-4" />
                Educação financeira
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="col-span-12 text-right text-sm text-zinc-500 dark:text-zinc-400">
          © 2024 MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
