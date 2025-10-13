import { Router } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

const amountSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => {
    if (typeof valor === 'string') {
      const normalized = valor.replace(/\s/g, '').replace(',', '.').trim()
      if (!normalized) return 0
      return Number(normalized)
    }
    return Number(valor)
  })
  .pipe(z.number().finite())
  .refine((valor) => Math.abs(valor) <= 1_000_000_000, 'Valor excede o limite permitido')
  .transform((valor) => new Prisma.Decimal((Math.round(valor * 100) / 100).toFixed(2)))

const CreateGoalSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional(),
  targetAmount: amountSchema,
  currentAmount: amountSchema.optional(),
  currency: z.string().trim().length(3).optional(),
  dueDate: z.union([z.string(), z.date()]).optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
})

const UpdateGoalSchema = z.object({
  title: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().max(500).optional(),
  targetAmount: amountSchema.optional(),
  currentAmount: amountSchema.optional(),
  currency: z.string().trim().length(3).optional(),
  dueDate: z.union([z.string(), z.date()]).optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
})

const contributionSchema = z.object({
  amount: amountSchema.refine((valor) => valor.greaterThan(new Prisma.Decimal(0)), 'Valor deve ser maior que zero'),
  description: z.string().trim().max(180).optional(),
  contributedAt: z.union([z.string(), z.date()]).optional(),
})

const listQuerySchema = z.object({
  includeHistory: z
    .preprocess((value) => {
      if (value === undefined || value === null || value === '') return undefined
      if (typeof value === 'boolean') return value
      if (typeof value === 'string') return value === 'true' || value === '1'
      return Boolean(value)
    }, z.boolean().optional())
    .optional(),
})

const contributionsListSchema = z.object({
  take: z.coerce.number().int().min(1).max(100).optional(),
})

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100

const serializeContribution = (entry) => ({
  id: entry.id,
  goalId: entry.goalId,
  amount: Number(entry.amount ?? 0),
  description: entry.description ?? null,
  contributedAt: entry.contributedAt.toISOString(),
  createdAt: entry.createdAt.toISOString(),
})

const serializeGoal = (goal, { includeHistory = false } = {}) => {
  const target = Number(goal.targetAmount ?? 0)
  const current = Number(goal.currentAmount ?? 0)
  const progress = target > 0 ? Math.min(current / target, 1) * 100 : 0
  const remaining = round2(target - current)
  const contributionsArray = goal.contributions ? [...goal.contributions] : []
  const lastContributionAt = contributionsArray.length ? contributionsArray[0].contributedAt.toISOString() : null

  return {
    id: goal.id,
    title: goal.title,
    description: goal.description ?? null,
    targetAmount: target,
    currentAmount: current,
    currency: goal.currency,
    dueDate: goal.dueDate ? goal.dueDate.toISOString().slice(0, 10) : null,
    status: goal.status,
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString(),
    summary: {
      progress: round2(progress),
      remaining,
      contributionsCount: goal._count?.contributions ?? contributionsArray.length,
      lastContributionAt,
    },
    contributions: includeHistory
      ? contributionsArray.map(serializeContribution)
      : undefined,
  }
}

// Listar metas do usuário com resumo
router.get('/', requireAuth, async (req, res) => {
  try {
    const { includeHistory } = listQuerySchema.parse(req.query)

    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { contributions: true } },
        contributions: {
          orderBy: { contributedAt: 'desc' },
          ...(includeHistory ? {} : { take: 1 }),
        },
      },
    })

    res.json({ goals: goals.map((goal) => serializeGoal(goal, { includeHistory })) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Parâmetros inválidos', issues: error.flatten() })
    }
    console.error('List goals error:', error)
    res.status(500).json({ error: 'Falha ao listar metas' })
  }
})

// Criar meta
router.post('/', requireAuth, async (req, res) => {
  try {
    const payload = CreateGoalSchema.parse(req.body)

    const goal = await prisma.goal.create({
      data: {
        title: payload.title,
        description: payload.description ?? null,
        targetAmount: payload.targetAmount,
        currentAmount: payload.currentAmount ?? new Prisma.Decimal('0'),
        currency: payload.currency ?? 'BRL',
        dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        status: payload.status ?? 'active',
        userId: req.user.id,
      },
      include: {
        _count: { select: { contributions: true } },
        contributions: { orderBy: { contributedAt: 'desc' }, take: 1 },
      },
    })

    res.status(201).json({ goal: serializeGoal(goal) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Dados inválidos', issues: error.flatten() })
    }
    console.error('Create goal error:', error)
    res.status(500).json({ error: 'Falha ao criar meta' })
  }
})

// Atualizar meta
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' })

    const payload = UpdateGoalSchema.parse(req.body)
    if (!Object.keys(payload).length) return res.status(422).json({ error: 'Nenhum dado para atualizar' })

    const existing = await prisma.goal.findFirst({ where: { id, userId: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Meta não encontrada' })

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        title: payload.title ?? undefined,
        description: payload.description ?? undefined,
        targetAmount: payload.targetAmount ?? undefined,
        currentAmount: payload.currentAmount ?? undefined,
        currency: payload.currency ?? undefined,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
        status: payload.status ?? undefined,
      },
      include: {
        _count: { select: { contributions: true } },
        contributions: { orderBy: { contributedAt: 'desc' }, take: 1 },
      },
    })

    res.json({ goal: serializeGoal(updated) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Dados inválidos', issues: error.flatten() })
    }
    console.error('Update goal error:', error)
    res.status(500).json({ error: 'Falha ao atualizar meta' })
  }
})

// Remover meta
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' })

    const existing = await prisma.goal.findFirst({ where: { id, userId: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Meta não encontrada' })

    await prisma.goal.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    console.error('Delete goal error:', error)
    res.status(500).json({ error: 'Falha ao remover meta' })
  }
})

// Registrar contribuição
router.post('/:id/contributions', requireAuth, async (req, res) => {
  try {
    const goalId = Number(req.params.id)
    if (!Number.isInteger(goalId)) return res.status(400).json({ error: 'ID inválido' })

    const payload = contributionSchema.parse(req.body)

    const goal = await prisma.goal.findFirst({ where: { id: goalId, userId: req.user.id } })
    if (!goal) return res.status(404).json({ error: 'Meta não encontrada' })

    const contributedAt = payload.contributedAt ? new Date(payload.contributedAt) : new Date()

    const { contribution, updatedGoal } = await prisma.$transaction(async (tx) => {
      const createdContribution = await tx.goalContribution.create({
        data: {
          goalId,
          amount: payload.amount,
          description: payload.description ?? null,
          contributedAt,
        },
      })

      const nextAmount = goal.currentAmount.plus(payload.amount)
      const needsComplete = nextAmount.greaterThanOrEqualTo(goal.targetAmount) && goal.status === 'active'

      const updated = await tx.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: nextAmount,
          status: needsComplete ? 'completed' : undefined,
        },
        include: {
          _count: { select: { contributions: true } },
          contributions: { orderBy: { contributedAt: 'desc' }, take: 5 },
        },
      })

      return { contribution: createdContribution, updatedGoal: updated }
    })

    res.status(201).json({
      contribution: serializeContribution(contribution),
      goal: serializeGoal(updatedGoal, { includeHistory: false }),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Dados inválidos', issues: error.flatten() })
    }
    console.error('Create goal contribution error:', error)
    res.status(500).json({ error: 'Falha ao registrar contribuição' })
  }
})

// Listar contribuições de uma meta
router.get('/:id/contributions', requireAuth, async (req, res) => {
  try {
    const goalId = Number(req.params.id)
    if (!Number.isInteger(goalId)) return res.status(400).json({ error: 'ID inválido' })

    const { take } = contributionsListSchema.parse(req.query)

    const goal = await prisma.goal.findFirst({ where: { id: goalId, userId: req.user.id }, select: { id: true } })
    if (!goal) return res.status(404).json({ error: 'Meta não encontrada' })

    const contributions = await prisma.goalContribution.findMany({
      where: { goalId },
      orderBy: { contributedAt: 'desc' },
      take: take ?? undefined,
    })

    res.json({ contributions: contributions.map(serializeContribution) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Parâmetros inválidos', issues: error.flatten() })
    }
    console.error('List goal contributions error:', error)
    res.status(500).json({ error: 'Falha ao listar contribuições' })
  }
})

// Remover contribuição
router.delete('/contributions/:contributionId', requireAuth, async (req, res) => {
  try {
    const contributionId = Number(req.params.contributionId)
    if (!Number.isInteger(contributionId)) return res.status(400).json({ error: 'ID inválido' })

    const contribution = await prisma.goalContribution.findFirst({
      where: { id: contributionId },
      include: { goal: true },
    })

    if (!contribution || contribution.goal.userId !== req.user.id) {
      return res.status(404).json({ error: 'Contribuição não encontrada' })
    }

    await prisma.$transaction(async (tx) => {
      await tx.goalContribution.delete({ where: { id: contributionId } })

      const updatedAmount = contribution.goal.currentAmount.minus(contribution.amount)
      const newStatus = contribution.goal.status === 'completed' && updatedAmount.lessThan(contribution.goal.targetAmount)
        ? 'active'
        : contribution.goal.status

      await tx.goal.update({
        where: { id: contribution.goalId },
        data: {
          currentAmount: updatedAmount,
          status: newStatus,
        },
      })
    })

    res.status(204).send()
  } catch (error) {
    console.error('Delete goal contribution error:', error)
    res.status(500).json({ error: 'Falha ao remover contribuição' })
  }
})

export default router
