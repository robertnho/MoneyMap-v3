import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

async function getPrisma() {
  const module = await import('../lib/prisma.js')
  return module.default
}

const periodoSchema = z.enum(['3meses', '6meses', '1ano']).default('6meses')
const queryWithPeriodo = z.object({ periodo: periodoSchema.optional() })

const colorPalette = ['#8b5cf6', '#6366f1', '#a855f7', '#c084fc', '#22d3ee', '#34d399', '#facc15', '#fb7185']

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100
const round1 = (value) => Math.round((value + Number.EPSILON) * 10) / 10

const percentageChange = (current, previous) => {
  if (previous === 0) {
    if (current === 0) return 0
    return null
  }
  const delta = ((current - previous) / Math.abs(previous)) * 100
  return round1(delta)
}

const getPeriodRange = (periodo) => {
  const months = periodo === '3meses' ? 3 : periodo === '1ano' ? 12 : 6
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const startMonth = new Date(end.getFullYear(), end.getMonth() - months + 1, 1)
  const start = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1)
  return { start, end, months }
}

const getPreviousRange = ({ start, months }) => {
  const endPrev = new Date(start.getFullYear(), start.getMonth(), 0)
  endPrev.setHours(23, 59, 59, 999)
  const startPrev = new Date(endPrev.getFullYear(), endPrev.getMonth() - months + 1, 1)
  return { start: startPrev, end: endPrev, months }
}

const buildMonthBuckets = (end, months) => {
  const buckets = []
  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - index, 1))
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`
    const label = date.toLocaleString('pt-BR', { month: 'short' })
    const formatted = label.charAt(0).toUpperCase() + label.slice(1)
    buckets.push({
      key,
      mes: formatted,
      ano: date.getUTCFullYear(),
      receitas: 0,
      despesas: 0,
    })
  }
  return buckets
}

const convertAmount = (amount, fromCurrency, baseCurrency, rateMap) => {
  const numeric = typeof amount === 'number' ? amount : Number(amount ?? 0)
  if (!Number.isFinite(numeric)) return 0
  const from = (fromCurrency || baseCurrency || 'BRL').toUpperCase()
  const base = (baseCurrency || 'BRL').toUpperCase()
  if (from === base) return numeric

  const forwardKey = `${from}:${base}`
  const backwardKey = `${base}:${from}`

  if (rateMap.has(forwardKey)) {
    return numeric * rateMap.get(forwardKey)
  }
  if (rateMap.has(backwardKey)) {
    const rate = rateMap.get(backwardKey)
    if (rate) return numeric / rate
  }
  return numeric
}

const serializeTotals = (transactions, baseCurrency, rateMap) =>
  transactions.reduce(
    (acc, tx) => {
      const valor = convertAmount(tx.valor, tx.account?.currency, baseCurrency, rateMap)
      if (tx.tipo === 'receita') acc.receitas += valor
      else acc.despesas += valor
      return acc
    },
    { receitas: 0, despesas: 0 }
  )

const loadTransactions = (prisma, userId, range, { includeCategory = false } = {}) => {
  const baseSelect = {
    valor: true,
    tipo: true,
    categoria: true,
    categoryId: true,
    data: true,
    account: { select: { currency: true } },
  }

  const select = includeCategory
    ? { ...baseSelect, category: { select: { id: true, name: true, color: true } } }
    : baseSelect

  return prisma.transaction.findMany({
    where: {
      account: { userId },
      status: 'confirmado',
      ...(range
        ? {
            data: {
              gte: range.start,
              lte: range.end,
            },
          }
        : {}),
    },
    select,
  })
}

const buildCurrencyContext = async (userId, queryBase) => {
  const prisma = await getPrisma()
  
  const baseCurrency = queryBase
    ? queryBase.toString().trim().toUpperCase()
    : (
        (
          await prisma.userSettings.findUnique({
            where: { userId },
            select: { currency: true },
          })
        )?.currency ?? 'BRL'
      ).toUpperCase()

  const rates = await prisma.fxRate.findMany({ select: { base: true, quote: true, rate: true } })
  const rateMap = new Map(rates.map((rate) => [`${rate.base.toUpperCase()}:${rate.quote.toUpperCase()}`, Number(rate.rate)]))

  return { baseCurrency, rateMap }
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const prisma = await getPrisma()
    const { periodo = '6meses' } = queryWithPeriodo.parse(req.query)
    const range = getPeriodRange(periodo)
    const previousRange = getPreviousRange(range)
    const { baseCurrency, rateMap } = await buildCurrencyContext(req.user.id, req.query.base)

    const [
      currentTransactions,
      previousTransactions,
      accounts,
      accountAggregates,
      transactionsBeforeRange,
      recentTransactions,
      activeGoal,
    ] = await Promise.all([
      loadTransactions(prisma, req.user.id, range, { includeCategory: true }),
      loadTransactions(prisma, req.user.id, previousRange),
      prisma.account.findMany({
        where: { userId: req.user.id, archivedAt: null },
        select: { id: true, name: true, color: true, isDefault: true, initialBalance: true, currency: true },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
      }),
      prisma.transaction.groupBy({
        by: ['accountId', 'tipo'],
        where: { account: { userId: req.user.id }, status: 'confirmado' },
        _sum: { valor: true },
      }),
      prisma.transaction.findMany({
        where: {
          account: { userId: req.user.id },
          status: 'confirmado',
          data: { lt: range.start },
        },
        select: { valor: true, tipo: true, account: { select: { currency: true } } },
      }),
      prisma.transaction.findMany({
        where: { account: { userId: req.user.id }, status: 'confirmado' },
        orderBy: [{ data: 'desc' }, { createdAt: 'desc' }],
        take: 5,
        include: {
          account: { select: { id: true, name: true, color: true, currency: true } },
          category: { select: { id: true, name: true, color: true } },
        },
      }),
      prisma.goal.findFirst({
        where: { userId: req.user.id, status: 'active' },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
      }),
    ])

    const currentTotalsRaw = serializeTotals(currentTransactions, baseCurrency, rateMap)
    const previousTotalsRaw = serializeTotals(previousTransactions, baseCurrency, rateMap)

    const currentTotals = {
      receitas: round2(currentTotalsRaw.receitas),
      despesas: round2(currentTotalsRaw.despesas),
    }
    const previousTotals = {
      receitas: round2(previousTotalsRaw.receitas),
      despesas: round2(previousTotalsRaw.despesas),
    }

    const saldoAtual = round2(currentTotals.receitas - currentTotals.despesas)
    const saldoAnterior = round2(previousTotals.receitas - previousTotals.despesas)

    const buckets = buildMonthBuckets(range.end, range.months)
    const bucketsMap = new Map(buckets.map((bucket) => [bucket.key, bucket]))

    currentTransactions.forEach((tx) => {
      const date = tx.data
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`
      const bucket = bucketsMap.get(key)
      if (!bucket) return
      const valor = convertAmount(tx.valor, tx.account?.currency, baseCurrency, rateMap)
      if (tx.tipo === 'receita') bucket.receitas += valor
      else bucket.despesas += valor
    })

    const receitasVsDespesas = buckets.map((bucket) => ({
      mes: bucket.mes,
      ano: bucket.ano,
      receitas: round2(bucket.receitas),
      despesas: round2(bucket.despesas),
    }))

    const saldoInicial = accounts.reduce(
      (acc, account) => acc + convertAmount(account.initialBalance, account.currency, baseCurrency, rateMap),
      0,
    )
    const saldoAnteriorRange = transactionsBeforeRange.reduce((acc, tx) => {
      const valor = convertAmount(tx.valor, tx.account?.currency, baseCurrency, rateMap)
      return tx.tipo === 'receita' ? acc + valor : acc - valor
    }, saldoInicial)

    let acumulado = round2(saldoAnteriorRange)
    const evolucaoSaldo = receitasVsDespesas.map((bucket) => {
      acumulado = round2(acumulado + bucket.receitas - bucket.despesas)
      return { mes: bucket.mes, ano: bucket.ano, saldo: acumulado }
    })

    const despesas = currentTransactions.filter((tx) => tx.tipo === 'despesa')
    const totalDespesas = despesas.reduce(
      (acc, tx) => acc + convertAmount(tx.valor, tx.account?.currency, baseCurrency, rateMap),
      0,
    )

    const categoryMap = new Map()
    despesas.forEach((tx) => {
      const key = tx.categoryId ?? tx.categoria ?? 'Outros'
      const entry = categoryMap.get(key) ?? {
        name: tx.category?.name ?? tx.categoria ?? 'Outros',
        color: tx.category?.color ?? null,
        value: 0,
      }
      entry.value += convertAmount(tx.valor, tx.account?.currency, baseCurrency, rateMap)
      if (!entry.color && tx.category?.color) entry.color = tx.category.color
      categoryMap.set(key, entry)
    })

    const categorias = Array.from(categoryMap.values())
      .sort((a, b) => b.value - a.value)
      .map((entry, index) => ({
        name: entry.name,
        value: round2(entry.value),
        percentage: totalDespesas ? round1((entry.value / totalDespesas) * 100) : 0,
        color: entry.color || colorPalette[index % colorPalette.length],
      }))

    const accountTotals = new Map()
    const accountCurrencyMap = new Map(accounts.map((account) => [account.id, account.currency || baseCurrency]))
    accountAggregates.forEach((item) => {
      const entry = accountTotals.get(item.accountId) ?? { receitas: 0, despesas: 0 }
      const currency = accountCurrencyMap.get(item.accountId) || baseCurrency
      const valor = convertAmount(item._sum?.valor ?? 0, currency, baseCurrency, rateMap)
      if (item.tipo === 'receita') entry.receitas += valor
      else entry.despesas += valor
      accountTotals.set(item.accountId, entry)
    })

    const contas = accounts.map((account) => {
      const totals = accountTotals.get(account.id) ?? { receitas: 0, despesas: 0 }
      const initial = convertAmount(account.initialBalance, account.currency, baseCurrency, rateMap)
      const balance = round2(initial + totals.receitas - totals.despesas)
      return {
        id: account.id,
        name: account.name,
        color: account.color,
        isDefault: account.isDefault,
        currency: account.currency,
        balance,
      }
    })

    const transacoesRecentes = recentTransactions.map((tx) => ({
      id: tx.id,
      descricao: tx.descricao,
      valor: convertAmount(tx.valor, tx.account?.currency, baseCurrency, rateMap),
      tipo: tx.tipo,
      data: tx.data.toISOString().slice(0, 10),
      categoria: tx.category?.name ?? tx.categoria,
      account: tx.account
        ? {
            id: tx.account.id,
            name: tx.account.name,
            color: tx.account.color,
            currency: tx.account.currency,
          }
        : null,
    }))

    const goalResumo = activeGoal
      ? {
          id: activeGoal.id,
          title: activeGoal.title,
          description: activeGoal.description ?? null,
          targetAmount: convertAmount(activeGoal.targetAmount, activeGoal.currency, baseCurrency, rateMap),
          currentAmount: convertAmount(activeGoal.currentAmount, activeGoal.currency, baseCurrency, rateMap),
          currency: baseCurrency,
          originalCurrency: activeGoal.currency,
          dueDate: activeGoal.dueDate ? activeGoal.dueDate.toISOString() : null,
          status: activeGoal.status,
        }
      : null

    res.json({
      baseCurrency,
      period: {
        periodo,
        inicio: range.start.toISOString(),
        fim: range.end.toISOString(),
      },
      totals: {
        receitas: {
          valor: currentTotals.receitas,
          variacaoPercentual: percentageChange(currentTotals.receitas, previousTotals.receitas),
        },
        despesas: {
          valor: currentTotals.despesas,
          variacaoPercentual: percentageChange(currentTotals.despesas, previousTotals.despesas),
        },
        saldo: {
          valor: saldoAtual,
          variacaoPercentual: percentageChange(saldoAtual, saldoAnterior),
        },
      },
      receitasVsDespesas,
      evolucaoSaldo,
      categorias,
      contas,
      transacoesRecentes,
      goalResumo,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Parâmetros inválidos', issues: error.flatten() })
    }
    console.error('Dashboard overview error:', error)
    return res.status(500).json({ error: 'Falha ao carregar resumo do dashboard' })
  }
})

export default router
