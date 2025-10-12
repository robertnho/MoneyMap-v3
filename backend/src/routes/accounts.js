// backend/src/routes/accounts.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

const colorSchema = z.string().trim().min(1).max(20)

const CreateAccountSchema = z.object({
  name: z.string().trim().min(2).max(60),
  color: colorSchema,
  isDefault: z.boolean().optional(),
})

const UpdateAccountSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  color: colorSchema.optional(),
  isDefault: z.boolean().optional(),
})

// Lista contas do usuário
router.get('/', requireAuth, async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    })

    res.json({ accounts })
  } catch (error) {
    console.error('List accounts error:', error)
    res.status(500).json({ error: 'Falha ao listar contas' })
  }
})

// Cria conta
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, color, isDefault } = CreateAccountSchema.parse(req.body)
    const userId = req.user.id

    const account = await prisma.$transaction(async (tx) => {
      const hasDefault = await tx.account.findFirst({ where: { userId, isDefault: true } })
      const makeDefault = isDefault ?? !hasDefault

      if (makeDefault) {
        await tx.account.updateMany({ where: { userId }, data: { isDefault: false } })
      }

      return tx.account.create({
        data: { name, color, isDefault: makeDefault, userId },
      })
    })

    res.status(201).json({ account })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Dados inválidos', issues: error.flatten() })
    }

    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe uma conta com esse nome' })
    }

    console.error('Create account error:', error)
    res.status(500).json({ error: 'Falha ao criar conta' })
  }
})

// Atualiza conta
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const accountId = Number(id)
    if (!Number.isInteger(accountId)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const parsed = UpdateAccountSchema.parse(req.body)
    if (!Object.keys(parsed).length) {
      return res.status(422).json({ error: 'Nenhum dado para atualizar' })
    }

    const existing = await prisma.account.findFirst({ where: { id: accountId, userId: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Conta não encontrada' })

    const updated = await prisma.$transaction(async (tx) => {
      const updateData = {}
      if (parsed.name !== undefined) updateData.name = parsed.name
      if (parsed.color !== undefined) updateData.color = parsed.color

      if (parsed.isDefault === true) {
        await tx.account.updateMany({ where: { userId: req.user.id, NOT: { id: accountId } }, data: { isDefault: false } })
        updateData.isDefault = true
      } else if (parsed.isDefault === false && existing.isDefault) {
        updateData.isDefault = false
      }

      return tx.account.update({ where: { id: accountId }, data: updateData })
    })

    res.json({ account: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: 'Dados inválidos', issues: error.flatten() })
    }

    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe uma conta com esse nome' })
    }

    console.error('Update account error:', error)
    res.status(500).json({ error: 'Falha ao atualizar conta' })
  }
})

// Remove conta
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const accountId = Number(id)
    if (!Number.isInteger(accountId)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const existing = await prisma.account.findFirst({ where: { id: accountId, userId: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Conta não encontrada' })

    await prisma.$transaction(async (tx) => {
      await tx.account.delete({ where: { id: accountId } })

      if (existing.isDefault) {
        const fallback = await tx.account.findFirst({
          where: { userId: req.user.id },
          orderBy: { createdAt: 'asc' },
        })
        if (fallback) {
          await tx.account.update({ where: { id: fallback.id }, data: { isDefault: true } })
        }
      }
    })

    res.status(204).send()
  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({ error: 'Falha ao remover conta' })
  }
})

export default router
