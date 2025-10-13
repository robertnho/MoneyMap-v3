import { Router } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

const amountSchema = z
  .union([z.string(), z.number()])
  .transform((v) => {
    if (typeof v === 'string') {
      const normalized = v.replace(/\s/g, '').replace(',', '.')
      return Number(normalized)
    }
    return Number(v)
  })
  .pipe(z.number().finite())
  .transform((v) => new Prisma.Decimal((Math.round(v * 100) / 100).toFixed(2)))

const CreateBudgetSchema = z.object({
  name: z.string().trim().min(2).max(120),
  limitAmount: amountSchema,
  period: z.enum(['monthly', 'yearly', 'weekly']).optional(),
  categoryId: z.coerce.number().int().positive(),
})

const UpdateBudgetSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  limitAmount: amountSchema.optional(),
  currentSpent: amountSchema.optional(),
  period: z.enum(['monthly', 'yearly', 'weekly']).optional(),
  status: z.enum(['active', 'paused', 'archived']).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
})

const budgetsQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  includeArchived: z
    .preprocess((value) => {
      if (value === undefined || value === null || value === '') return undefined
      if (typeof value === 'boolean') return value
      if (typeof value === 'string') return value === 'true' || value === '1'
      return Boolean(value)
    }, z.boolean().optional())
    .optional(),
})

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100

function getPeriodRange(monthInput, yearInput) {
  const today = new Date()
  const month = monthInput ?? today.getUTCMonth() + 1
  const year = yearInput ?? today.getUTCFullYear()
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
  return { month, year, start, end }
}

async function ensureCategory(userId, categoryId) {
  if (!categoryId) return null
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } })
  if (!category) {
    const error = new Error('Categoria não encontrada')
    error.status = 404
    throw error
  }
  return category
}

router.get('/', requireAuth, async (req, res) => {
  try {
  const { month, year, includeArchived } = budgetsQuerySchema.parse(req.query)
  const { month: resolvedMonth, year: resolvedYear, start, end } = getPeriodRange(month, year)

    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user.id,
        ...(includeArchived ? {} : { status: { not: 'archived' } }),
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    })

    const categoryTotals = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        account: { userId: req.user.id },
        status: 'confirmado',
        tipo: 'despesa',
        data: { gte: start, lte: end },
      },
      _sum: { valor: true },
    })

    const categoryNameTotals = budgets.some((b) => b.categoryId == null)
      ? await prisma.transaction.groupBy({
          by: ['categoria'],
          where: {
            account: { userId: req.user.id },
            status: 'confirmado',
            tipo: 'despesa',
            data: { gte: start, lte: end },
          },
          _sum: { valor: true },
        })
      : []

    const spentByCategoryId = new Map()
    categoryTotals.forEach((entry) => {
      const key = entry.categoryId ?? 'null'
      spentByCategoryId.set(key, Number(entry._sum?.valor ?? 0))
    })

    const spentByCategoryName = new Map()
    categoryNameTotals.forEach((entry) => {
      spentByCategoryName.set(entry.categoria, Number(entry._sum?.valor ?? 0))
    })

    const enriched = budgets.map((budget) => {
      const limitValue = Number(budget.limitAmount ?? 0)
      const rawSpent = budget.categoryId != null
        ? spentByCategoryId.get(budget.categoryId) ?? 0
        : spentByCategoryId.get('null') ?? spentByCategoryName.get(budget.category?.name ?? budget.name) ?? Number(budget.currentSpent ?? 0)

  const spent = round2(rawSpent)
  const remaining = round2(limitValue - spent)
      const progress = limitValue > 0 ? Math.min(spent / limitValue, 1) * 100 : 0
      let monthStatus = 'ok'
      if (limitValue <= 0) monthStatus = 'undefined'
      else if (spent >= limitValue) monthStatus = 'exceeded'
      else if (spent >= limitValue * 0.9) monthStatus = 'warning'

      return {
        id: budget.id,
        name: budget.name,
        period: budget.period,
        status: budget.status,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
        limitAmount: limitValue,
        currentSpent: Number(budget.currentSpent ?? 0),
        category: budget.category ? { ...budget.category } : null,
        monthlyStatus: {
          month: resolvedMonth,
          year: resolvedYear,
          spent,
          remaining: round2(remaining),
          progress: round2(progress),
          status: monthStatus,
        },
      }
    })

    res.json({
      budgets: enriched,
      meta: {
        period: {
          month: resolvedMonth,
          year: resolvedYear,
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(422).json({ error: 'Parâmetros inválidos', issues: e.flatten() })
    }
    console.error('List budgets error:', e)
    res.status(e.status ?? 500).json({ error: e.message ?? 'Falha ao listar orçamentos' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const payload = CreateBudgetSchema.parse(req.body)
    await ensureCategory(req.user.id, payload.categoryId)

    const budget = await prisma.budget.create({
      data: {
        userId: req.user.id,
        name: payload.name,
        limitAmount: payload.limitAmount,
        currentSpent: new Prisma.Decimal('0'),
        period: payload.period ?? 'monthly',
        categoryId: payload.categoryId,
      },
      include: { category: { select: { id: true, name: true, color: true } } },
    })

    res.status(201).json({
      budget: {
        ...budget,
        limitAmount: Number(budget.limitAmount ?? 0),
        currentSpent: Number(budget.currentSpent ?? 0),
      },
    })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(422).json({ error: 'Dados inválidos', issues: e.flatten() })
    console.error('Create budget error:', e)
    const status = e.status ?? 500
    res.status(status).json({ error: e.message ?? 'Falha ao criar orçamento' })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' })
    const payload = UpdateBudgetSchema.parse(req.body)

    const existing = await prisma.budget.findFirst({ where: { id, userId: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Orçamento não encontrado' })

    if (payload.categoryId) {
      await ensureCategory(req.user.id, payload.categoryId)
    }

    const data = { ...payload }

    const updated = await prisma.budget.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true, color: true } } },
    })

    res.json({
      budget: {
        ...updated,
        limitAmount: Number(updated.limitAmount ?? 0),
        currentSpent: Number(updated.currentSpent ?? 0),
      },
    })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(422).json({ error: 'Dados inválidos', issues: e.flatten() })
    console.error('Update budget error:', e)
    const status = e.status ?? 500
    res.status(status).json({ error: e.message ?? 'Falha ao atualizar orçamento' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' })
    const existing = await prisma.budget.findFirst({ where: { id, userId: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Orçamento não encontrado' })
    await prisma.budget.delete({ where: { id } })
    res.status(204).send()
  } catch (e) {
    console.error('Delete budget error:', e)
    res.status(500).json({ error: 'Falha ao remover orçamento' })
  }
})

router.post('/:id/reset-spent', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' })
    const existing = await prisma.budget.findFirst({ where: { id, userId: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Orçamento não encontrado' })

    const updated = await prisma.budget.update({
      where: { id },
      data: { currentSpent: new Prisma.Decimal('0') },
      include: { category: { select: { id: true, name: true, color: true } } },
    })

    res.json({
      budget: {
        ...updated,
        limitAmount: Number(updated.limitAmount ?? 0),
        currentSpent: 0,
      },
    })
  } catch (e) {
    console.error('Reset budget error:', e)
    res.status(500).json({ error: 'Falha ao resetar orçamento' })
  }
})

export default router
