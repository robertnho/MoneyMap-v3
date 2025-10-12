// backend/src/routes/auth.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { normalizeEmail } from '../lib/strings.js'
import { signToken } from '../lib/jwt.js'
import { requireAuth } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

// Aceita password OU senha (para evitar 422 por nome de campo)
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).optional(),
  senha: z.string().min(1).optional(),
})

const RegisterSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  avatarUrl: z.string().url().optional(),
})

const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
})

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = RegisterSchema.parse(req.body)
    const emailNorm = normalizeEmail(email)

    const existing = await prisma.user.findUnique({ where: { email: emailNorm } })
    if (existing) return res.status(409).json({ error: 'E-mail já cadastrado' })

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email: emailNorm, passwordHash, avatarUrl },
      select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true }
    })

    const token = signToken({ sub: String(user.id) })
    res.status(201).json({ user, token })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(422).json({ error: 'Dados inválidos', issues: e.flatten() })
    console.error(e)
    res.status(500).json({ error: 'Falha ao registrar' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, senha } = LoginSchema.parse(req.body)
    const pwd = password ?? senha
    if (!pwd) return res.status(422).json({ error: 'Senha obrigatória' })

    const emailNorm = normalizeEmail(email)
    const user = await prisma.user.findUnique({ where: { email: emailNorm } })
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })

    const ok = await verifyPassword(pwd, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' })

    const safeUser = { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, createdAt: user.createdAt }
    const token = signToken({ sub: String(user.id) })
    res.json({ user: safeUser, token })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(422).json({ error: 'Dados inválidos', issues: e.flatten() })
    console.error(e)
    res.status(500).json({ error: 'Falha no login' })
  }
})

// Troca de senha
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = ChangePasswordSchema.parse(req.body)
    if (oldPassword === newPassword) {
      return res.status(422).json({ error: 'A nova senha deve ser diferente da atual.' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, passwordHash: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const valid = await verifyPassword(oldPassword, user.passwordHash)
    if (!valid) {
      return res.status(400).json({ error: 'Senha atual incorreta' })
    }

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    return res.status(204).send()
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(422).json({ error: 'Dados inválidos', issues: e.flatten() })
    }
    console.error('Change password error:', e)
    return res.status(500).json({ error: 'Falha ao alterar a senha' })
  }
})

export default router
