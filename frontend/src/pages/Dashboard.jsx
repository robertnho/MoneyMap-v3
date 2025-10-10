// src/pages/Dashboard.jsx
import React, { useMemo, useState } from 'react'
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
  CreditCard,
  Banknote,
  ShieldAlert,
  Settings,
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
  LineChart,
  Line,
} from 'recharts'

/* ============================================================================
   DADOS MOCKADOS
============================================================================ */
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
    { name: 'Alimentação', value: 1200, color: '#8b5cf6' },
    { name: 'Transporte', value: 800, color: '#6366f1' },
    { name: 'Moradia', value: 1500, color: '#a855f7' },
    { name: 'Lazer', value: 600, color: '#c084fc' },
    { name: 'Outros', value: 150.3, color: '#d8b4fe' },
  ],
  transacoesRecentes: [
    { id: 1, tipo: 'receita', descricao: 'Salário', valor: 5500.0, data: '2024-10-01', categoria: 'Trabalho' },
    { id: 2, tipo: 'receita', descricao: 'Freelance', valor: 1200.0, data: '2024-10-02', categoria: 'Trabalho' },
    { id: 3, tipo: 'despesa', descricao: 'Supermercado', valor: 320.5, data: '2024-10-02', categoria: 'Alimentação' },
    { id: 4, tipo: 'despesa', descricao: 'Combustível', valor: 180.0, data: '2024-10-03', categoria: 'Transporte' },
    { id: 5, tipo: 'despesa', descricao: 'Aluguel', valor: 1200.0, data: '2024-10-05', categoria: 'Moradia' },
  ],
}

/* ============================================================================
   HELPERS
============================================================================ */
const money = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const tooltipCurrency = (v) => [`R$ ${Number(v).toLocaleString('pt-BR')}`, '']

/* ============================================================================
   UI BASICS
============================================================================ */
function SectionCard({ title, right, className = '', children }) {
  return (
    <section
      className={`group rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-2xl ${className}`}
    >
      <header className="flex items-center justify-between border-b border-zinc-200/60 px-4 py-3 dark:border-white/10">
        <h3 className="text-base font-semibold text-zinc-900 transition-colors group-hover:text-zinc-800 dark:text-zinc-100 dark:group-hover:text-zinc-50">
          {title}
        </h3>
        {right}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

function BadgeIcon({ children, className = '' }) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${className}`}>
      {children}
    </div>
  )
}

function KpiCard({ title, value, trend = 'up', trendValue = '', icon: Icon, tone = 'violet' }) {
  const scheme = useMemo(
    () => ({
      violet: {
        bg: 'bg-gradient-to-br from-violet-100 via-violet-50 to-purple-100 dark:from-violet-900/30 dark:via-violet-900/20 dark:to-purple-900/30',
        fg: 'text-violet-600 dark:text-violet-400',
        chipBg: 'bg-violet-100/80 dark:bg-violet-900/30',
        chipFg: 'text-violet-700 dark:text-violet-300',
        border: 'border-violet-200/50 dark:border-violet-800/50',
      },
      blue: {
        bg: 'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-indigo-900/30',
        fg: 'text-blue-600 dark:text-blue-400',
        chipBg: 'bg-blue-100/80 dark:bg-blue-900/30',
        chipFg: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200/50 dark:border-blue-800/50',
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-100 via-purple-50 to-fuchsia-100 dark:from-purple-900/30 dark:via-purple-900/20 dark:to-fuchsia-900/30',
        fg: 'text-purple-600 dark:text-purple-400',
        chipBg: 'bg-purple-100/80 dark:bg-purple-900/30',
        chipFg: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200/50 dark:border-purple-800/50',
      },
      indigo: {
        bg: 'bg-gradient-to-br from-indigo-100 via-indigo-50 to-slate-100 dark:from-indigo-900/30 dark:via-indigo-900/20 dark:to-slate-900/30',
        fg: 'text-indigo-600 dark:text-indigo-400',
        chipBg: 'bg-indigo-100/80 dark:bg-indigo-900/30',
        chipFg: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200/50 dark:border-indigo-800/50',
      },
    })[tone],
    [tone]
  )

  return (
    <div
      className={`group rounded-2xl border ${scheme.border} ${scheme.bg} p-3 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:shadow-2xl min-h-[110px]`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110 ${scheme.bg}`}
          >
            <Icon className={`h-4 w-4 ${scheme.fg}`} />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {title}
            </p>
            <p className="leading-none text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {value}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium shadow-sm ${scheme.chipBg} ${scheme.chipFg}`}
        >
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trendValue}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className={`h-1 rounded-full transition-all duration-700 ${
              trend === 'up' ? 'w-3/4 bg-violet-500' : 'w-1/2 bg-purple-500'
            }`}
          />
        </div>
        <p className="whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">vs mês anterior</p>
      </div>
    </div>
  )
}

function TransactionRow({ t }) {
  const receita = t.tipo === 'receita'
  return (
    <div className="group flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            receita
              ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400'
              : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
          }`}
        >
          {receita ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.descricao}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {t.categoria} • {t.data}
          </p>
        </div>
      </div>
      <div
        className={`text-sm font-semibold ${
          receita ? 'text-violet-600 dark:text-violet-400' : 'text-purple-600 dark:text-purple-400'
        }`}
      >
        {receita ? '+' : '-'} {money(t.valor)}
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  desc,
  icon: Icon,
  onClick,
  color = 'text-zinc-400',
  hover = 'group-hover:text-emerald-600',
}) {
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

/* ============================================================================
   NOVOS COMPONENTES
============================================================================ */
function FilterPanel({ year, setYear, month, setMonth }) {
  const years = [2023, 2024, 2025]
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

  return (
    <SectionCard title="Filtros" className="h-fit">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Ano</p>
          <div className="flex flex-wrap gap-1">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`rounded-lg px-2 py-1.5 text-xs font-medium border transition-all duration-200 ${
                  year === y
                    ? 'border-transparent bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                    : 'border-zinc-200/60 hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-zinc-800'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Meses</p>
          <div className="grid grid-cols-4 gap-1">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={`rounded-lg px-1 py-1.5 text-xs font-medium capitalize border transition-all duration-200 ${
                  month === m
                    ? 'border-transparent bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md'
                    : 'border-zinc-200/60 hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-zinc-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function FinancialInsightsCard() {
  const insights = [
    { title: '💡 Economia Inteligente', desc: 'Você gastou 15% menos em alimentação este mês!', impact: 'Economizou R$ 180', color: 'violet' },
    { title: '⚠️ Atenção aos Gastos', desc: 'Gastos com lazer aumentaram 23% comparado ao mês passado', impact: 'R$ 138 a mais', color: 'amber' },
    { title: '🎯 Meta Próxima', desc: 'Faltam apenas R$ 1.400 para sua reserva de emergência', impact: '72% concluído', color: 'blue' },
  ]
  return (
    <SectionCard title="Insights Financeiros" className="h-full">
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`rounded-xl border p-3 ${
              insight.color === 'violet'
                ? 'border-violet-200 bg-violet-50 dark:border-violet-900/30 dark:bg-violet-950/20'
                : insight.color === 'amber'
                ? 'border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20'
                : 'border-purple-200 bg-purple-50 dark:border-purple-900/30 dark:bg-purple-950/20'
            }`}
          >
            <h4 className="mb-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">{insight.title}</h4>
            <p className="mb-2 text-xs leading-tight text-zinc-600 dark:text-zinc-400">{insight.desc}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                insight.color === 'violet'
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                  : insight.color === 'amber'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
              }`}
            >
              {insight.impact}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function InvestmentCard() {
  const investimentos = [
    { nome: 'Tesouro Selic', valor: 2500, rendimento: '+2.3%', cor: 'text-violet-600' },
    { nome: 'CDB Banco Inter', valor: 1800, rendimento: '+1.8%', cor: 'text-purple-600' },
    { nome: 'Ações ITSA4', valor: 920, rendimento: '-0.5%', cor: 'text-indigo-500' },
  ]
  const totalInvestido = investimentos.reduce((acc, inv) => acc + inv.valor, 0)
  return (
    <SectionCard
      title="Investimentos"
      right={<span className="text-sm font-medium text-violet-600 dark:text-violet-400">+R$ 87 este mês</span>}
      className="h-full"
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 p-4 text-center dark:from-violet-950/20 dark:to-purple-950/20">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Investido</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{money(totalInvestido)}</p>
          <p className="text-xs text-violet-600 dark:text-violet-400">+3.2% no mês</p>
        </div>
        <div className="space-y-3">
          {investimentos.map((inv, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-white/50 p-3 dark:bg-zinc-800/50">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{inv.nome}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{money(inv.valor)}</p>
              </div>
              <span className={`text-sm font-medium ${inv.cor}`}>{inv.rendimento}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

function WeatherFinanceCard() {
  return (
    <SectionCard title="Clima Financeiro" className="relative overflow-hidden h-full">
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 opacity-20"></div>
      <div className="relative">
        <div className="mb-3 flex items-center gap-3">
          <div className="text-3xl">☀️</div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Ensolarado</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Suas finanças estão saudáveis</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Saúde Financeira</p>
            <p className="font-medium text-violet-600 dark:text-violet-400">Excelente</p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Próximos 30 dias</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">Estável</p>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function GoalCard({ percent = 72 }) {
  const data = [
    { name: 'meta', value: percent },
    { name: 'faltando', value: 100 - percent },
  ]
  return (
    <SectionCard title="Progresso da Meta" className="h-full">
      <div className="flex items-center gap-6">
        <div className="h-[140px] w-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={65} startAngle={90} endAngle={-270}>
                <Cell key="ok" fill="#16a34a" />
                <Cell key="faltando" fill="#e5e7eb" />
                <Label value={`${percent}%`} position="center" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Meta: montar reserva de emergência</p>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{money(5000)}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Estimativa de conclusão em 3 meses</p>
          <button className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
            <Target className="h-4 w-4" />
            Ajustar metas
          </button>
        </div>
      </div>
    </SectionCard>
  )
}

function AccountsCard() {
  const contas = [
    { nome: 'Carteira', valor: 420.5, icon: Banknote },
    { nome: 'Nubank', valor: 6020.0, icon: CreditCard },
    { nome: 'Itaú', valor: 5980.3, icon: CreditCard },
  ]
  return (
    <SectionCard title="Saldo por Conta" className="h-full">
      <ul className="space-y-3">
        {contas.map(({ nome, valor, icon: Icon }, i) => (
          <li key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BadgeIcon className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <Icon className="h-5 w-5" />
              </BadgeIcon>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{nome}</span>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{money(valor)}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function AlertsCard() {
  const itens = [
    { tipo: 'Atraso', msg: 'Conta de energia vence amanhã', tone: 'amber' },
    { tipo: 'Dica', msg: 'Você pode economizar 8% trocando plano de celular', tone: 'emerald' },
  ]
  return (
    <SectionCard title="Alertas" right={<ShieldAlert className="h-5 w-5 text-amber-500" aria-hidden="true" />} className="h-full">
      <ul className="space-y-2">
        {itens.map((a, i) => (
          <li
            key={i}
            className={`rounded-lg border px-3 py-2 text-sm ${
              a.tone === 'amber'
                ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-200'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-200'
            }`}
          >
            {a.msg}
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function LineChartCard() {
  return (
    <SectionCard title="Receita x Despesa (Linha)" className="h-full">
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData.receitasVsDespesas}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip formatter={tooltipCurrency} />
            <Line type="monotone" dataKey="receitas" stroke="#16a34a" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="despesas" stroke="#dc2626" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}

/* ============================================================================
   PÁGINA
============================================================================ */
export default function Dashboard() {
  const navigate = useNavigate()
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState('out')

  const totalCategorias = useMemo(
    () => mockData.categorias.reduce((acc, c) => acc + c.value, 0),
    []
  )

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fundo full-bleed */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/30 to-indigo-100/50 dark:from-zinc-950 dark:via-violet-950/20 dark:to-purple-950/30" />
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
        <div className="mx-auto flex max-w-[1440px] 2xl:max-w-[1600px] items-center justify-between px-6 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-xl font-bold text-transparent dark:from-zinc-100 dark:to-zinc-300 md:text-2xl">
                Dashboard Financeiro
              </h1>
              <p className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                Bem-vindo de volta! Suas finanças estão sendo monitoradas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/transacoes')}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/40 active:scale-95"
            >
              <PlusCircle className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Nova Transação
            </button>
            <button
              onClick={() => navigate('/configuracoes')}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/60 bg-white/80 px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto max-w-[1440px] 2xl:max-w-[1600px] px-6 pb-6 lg:px-8">
        {/* SEÇÃO PRINCIPAL - Cards KPI e Filtros na mesma linha, colados no topo */}
        <div className="mb-3 grid grid-cols-12 gap-3 pt-3">
          {/* KPIs principais ocupando mais espaço */}
          <div className="col-span-12 lg:col-span-9 xl:col-span-10">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard title="Saldo Total" value={money(mockData.saldo)} trend="up" trendValue="+12,3%" icon={Wallet} tone="violet" />
              <KpiCard title="Receitas do Mês" value={money(mockData.receitas)} trend="up" trendValue="+8,2%" icon={TrendingUp} tone="blue" />
              <KpiCard title="Despesas do Mês" value={money(mockData.despesas)} trend="down" trendValue="-5,1%" icon={TrendingDown} tone="purple" />
              <KpiCard title="Economia" value={money(mockData.economia)} trend="up" trendValue="+15,7%" icon={PiggyBank} tone="indigo" />
            </div>
          </div>

          {/* Filtros compactos à direita */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2">
            <FilterPanel year={year} setYear={setYear} month={month} setMonth={setMonth} />
          </div>
        </div>

        {/* SEGUNDA SEÇÃO - Cards auxiliares logo abaixo, sem muito espaçamento */}
        <div className="mb-3 grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-6 lg:col-span-3"><WeatherFinanceCard /></div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3"><FinancialInsightsCard /></div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3"><GoalCard percent={72} /></div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3"><InvestmentCard /></div>
        </div>

        {/* TERCEIRA SEÇÃO - Gráficos compactos */}
        <div className="mb-3 grid grid-cols-12 gap-3 items-stretch">
          <div className="col-span-12 lg:col-span-4">
            <SectionCard title="Receitas vs Despesas" className="h-full">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.receitasVsDespesas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="mes" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip formatter={tooltipCurrency} labelFormatter={(l) => `Mês: ${l}`} />
                    <Bar dataKey="receitas" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="despesas" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <SectionCard title="Gastos por Categoria" className="h-full">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={mockData.categorias} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={2}>
                      {mockData.categorias.map((c, i) => <Cell key={i} fill={c.color} />)}
                      <Label value={money(totalCategorias)} position="center" className="text-zinc-800" />
                    </Pie>
                    <Tooltip formatter={tooltipCurrency} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-4"><LineChartCard /></div>
        </div>

        {/* QUARTA SEÇÃO - Transações / Contas / Alertas */}
        <div className="mb-3 grid grid-cols-12 gap-3 items-stretch">
          <div className="col-span-12 lg:col-span-4">
            <SectionCard
              title="Transações Recentes"
              className="h-full"
              right={
                <button onClick={() => navigate('/transacoes')} className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Ver todas
                </button>
              }
            >
              <div className="max-h-[200px] divide-y divide-zinc-200/60 overflow-y-auto dark:divide-white/10">
                {mockData.transacoesRecentes.slice(0, 3).map((t) => <TransactionRow key={t.id} t={t} />)}
              </div>
            </SectionCard>
          </div>
          <div className="col-span-12 lg:col-span-4"><AccountsCard /></div>
          <div className="col-span-12 lg:col-span-4"><AlertsCard /></div>
        </div>

        {/* QUINTA SEÇÃO - Ações rápidas */}
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <QuickActionCard title="Transações" desc="Gerencie receitas e despesas" icon={ExternalLink} onClick={() => navigate('/transacoes')} color="text-emerald-500" hover="group-hover:text-emerald-600" />
          <QuickActionCard title="Metas" desc="Acompanhe seus objetivos" icon={Target} onClick={() => navigate('/metas')} color="text-blue-500" hover="group-hover:text-blue-600" />
          <QuickActionCard title="Relatórios" desc="Análise financeira detalhada" icon={BarChart3} onClick={() => navigate('/relatorios')} color="text-violet-500" hover="group-hover:text-violet-600" />
          <QuickActionCard title="Educação" desc="Aprenda sobre finanças" icon={BookOpen} onClick={() => navigate('/educacao')} color="text-amber-500" hover="group-hover:text-amber-600" />
          <QuickActionCard title="Cadastrar Conta" desc="Adicione bancos e carteiras" icon={CreditCard} onClick={() => navigate('/configuracoes')} color="text-sky-500" hover="group-hover:text-sky-600" />
        </div>

        {/* SEXTA SEÇÃO - Insights e Recomendações (compacto) */}
        <div className="mb-3 grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <div className="group relative overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 p-4 shadow-xl transition-all duration-300 hover:shadow-2xl dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20 dark:border-purple-800/30">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br from-purple-400/20 to-violet-500/20 blur-2xl transition-all duration-700 group-hover:scale-125"></div>
              <div className="relative">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">💡 Insight Financeiro</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Baseado na sua performance mensal</p>
                  </div>
                </div>
                <div className="mb-3 rounded-xl bg-white/60 p-3 backdrop-blur dark:bg-zinc-800/60">
                  <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                    🎉 <strong>Parabéns!</strong> Você economizou <span className="font-bold text-purple-600 dark:text-purple-400">{money(mockData.economia)}</span> este mês — isso representa um aumento de <strong>15.7%</strong> comparado ao mês anterior!
                  </p>
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    💰 <strong>Recomendação:</strong> Considere alocar 70% dessa quantia ({money(mockData.economia * 0.7)}) para sua reserva de emergência e 30% ({money(mockData.economia * 0.3)}) para investimentos de baixo risco.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => navigate('/metas')} className="group/btn inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95">
                    <Target className="h-4 w-4 transition-transform group-hover/btn:rotate-12" />
                    Definir Novas Metas
                  </button>
                  <button onClick={() => navigate('/educacao')} className="inline-flex items-center gap-2 rounded-lg border-2 border-purple-300/60 bg-white/80 px-3 py-2 text-xs font-semibold text-purple-700 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-600/40 dark:bg-zinc-800/80 dark:text-purple-300 dark:hover:bg-purple-900/20">
                    <BookOpen className="h-4 w-4" />
                    Educação Financeira
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © 2024 MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
