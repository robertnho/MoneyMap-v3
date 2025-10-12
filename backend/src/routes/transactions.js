import { Router } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

const TIPO_VALUES = ['receita', 'despesa']
const STATUS_VALUES = ['confirmado', 'pendente']

const valorSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => {
    if (typeof valor === 'string') {
      const normalized = valor.replace(',', '.').trim()
      if (!normalized) throw new Error('Valor inválido')
      return Number(normalized)
    }
    return valor
  })
  .pipe(z.number().finite())
  .refine((valor) => valor >= 0, 'Valor deve ser positivo')
  .refine((valor) => Number.isFinite(valor) && Math.abs(valor) <= 1_000_000_000, 'Valor excede o limite permitido')
  .transform((valor) => new Prisma.Decimal((Math.round(valor * 100) / 100).toFixed(2)))

const dateSchema = z
  .union([z.string(), z.date()])
  .transform((input) => {
    const date = typeof input === 'string' ? new Date(input) : input
    if (Number.isNaN(date.getTime())) throw new Error('Data inválida')
    return date
  })
  .transform((date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())))

const tipoSchema = z.enum([TIPO_VALUES[0], TIPO_VALUES[1]])
const statusSchema = z.enum([STATUS_VALUES[0], STATUS_VALUES[1]])

const CreateTransactionSchema = z.object({
  accountId: z.coerce.number().int().positive(),
  descricao: z.string().trim().min(2).max(180),
  categoria: z.string().trim().min(1).max(80),
  valor: valorSchema,
  tipo: tipoSchema,
  status: statusSchema.default('confirmado'),
  data: dateSchema,
  observacao: z.string().trim().max(500).optional(),
})

const UpdateTransactionSchema = z.object({
  descricao: z.string().trim().min(2).max(180).optional(),
  categoria: z.string().trim().min(1).max(80).optional(),
  valor: valorSchema.optional(),
  tipo: tipoSchema.optional(),
  status: statusSchema.optional(),
  data: dateSchema.optional(),
  observacao: z.string().trim().max(500).optional(),
})

const optionalQueryNumber = z.preprocess(
  (value) => (value === undefined || value === '' ? undefined : value),
  z.coerce.number().int().positive().optional()
)

const optionalQueryEnum = (schema) =>
  z.preprocess((value) => (value === undefined || value === '' ? undefined : value), schema.optional())

const optionalQueryDate = z.preprocess(
  (value) => (value === undefined || value === '' ? undefined : value),
  dateSchema.optional()
)

const ListQuerySchema = z.object({
  accountId: optionalQueryNumber,
  tipo: optionalQueryEnum(tipoSchema),
  status: optionalQueryEnum(statusSchema),
  from: optionalQueryDate,
  to: optionalQueryDate,
})

const serializeTransaction = (transaction) => ({
  id: transaction.id,
  accountId: transaction.accountId,
  descricao: transaction.descricao,
  categoria: transaction.categoria,
  valor: transaction.valor.toNumber(),
  tipo: transaction.tipo,
  status: transaction.status,
  data: transaction.data.toISOString().slice(0, 10),
  observacao: transaction.observacao ?? null,
  createdAt: transaction.createdAt.toISOString(),
  updatedAt: transaction.updatedAt.toISOString(),
  account: transaction.account
    ? {
        id: transaction.account.id,
        name: transaction.account.name,
        color: transaction.account.color,
        isDefault: transaction.account.isDefault,
      }
    : undefined,
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const { accountId, tipo, status, from, to } = ListQuerySchema.parse(req.query)

    const where = {
      account: { userId: req.user.id },
    }

    if (accountId !== undefined) where.accountId = accountId
    if (tipo) where.tipo = tipo
    if (status) where.status = status

    if (from || to) {
      where.data = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: [{ data: 'desc' }, { id: 'desc' }],
      include: { account: { select: { id: true, name: true, color: true, isDefault: true } } },
    })

    res.json({ transactions: transactions.map(serializeTransaction) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Filtros inválidos', issues: error.flatten() })
    }
    console.error('List transactions error:', error)
    return res.status(500).json({ error: 'Falha ao listar transações' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const payload = CreateTransactionSchema.parse(req.body)

    const account = await prisma.account.findFirst({ where: { id: payload.accountId, userId: req.user.id } })
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' })
    }

    const transaction = await prisma.transaction.create({
      data: {
        account: { connect: { id: account.id } },
        user: { connect: { id: req.user.id } },
        descricao: payload.descricao,
        categoria: payload.categoria,
        valor: payload.valor,
        tipo: payload.tipo,
        status: payload.status,
        data: payload.data,
        observacao: payload.observacao,
      },
      include: { account: { select: { id: true, name: true, color: true, isDefault: true } } },
    })

    res.status(201).json({ transaction: serializeTransaction(transaction) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Dados inválidos', issues: error.flatten() })
    }
    console.error('Create transaction error:', error)
    return res.status(500).json({ error: 'Falha ao registrar transação' })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const transactionId = Number(req.params.id)
    if (!Number.isInteger(transactionId)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const parsed = UpdateTransactionSchema.parse(req.body)
    if (!Object.keys(parsed).length) {
      return res.status(422).json({ error: 'Nenhum dado informado' })
    }

    const existing = await prisma.transaction.findFirst({
      where: { id: transactionId, account: { userId: req.user.id } },
    })

    if (!existing) {
      return res.status(404).json({ error: 'Transação não encontrada' })
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        descricao: parsed.descricao ?? undefined,
        categoria: parsed.categoria ?? undefined,
        valor: parsed.valor ?? undefined,
        tipo: parsed.tipo ?? undefined,
        status: parsed.status ?? undefined,
        data: parsed.data ?? undefined,
        observacao: parsed.observacao ?? undefined,
      },
      include: { account: { select: { id: true, name: true, color: true, isDefault: true } } },
    })

    res.json({ transaction: serializeTransaction(updated) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Dados inválidos', issues: error.flatten() })
    }
    console.error('Update transaction error:', error)
    return res.status(500).json({ error: 'Falha ao atualizar transação' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const transactionId = Number(req.params.id)
    if (!Number.isInteger(transactionId)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const existing = await prisma.transaction.findFirst({
      where: { id: transactionId, account: { userId: req.user.id } },
      select: { id: true },
    })

    if (!existing) {
      return res.status(404).json({ error: 'Transação não encontrada' })
    }

    await prisma.transaction.delete({ where: { id: transactionId } })

    res.status(204).send()
  } catch (error) {
    console.error('Delete transaction error:', error)
    return res.status(500).json({ error: 'Falha ao remover transação' })
  }
})

export default router
