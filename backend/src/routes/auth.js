// backend/src/routes/auth.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import crypto from 'crypto'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { normalizeEmail } from '../lib/strings.js'
import { signToken } from '../lib/jwt.js'

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

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
})

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
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

// Esqueceu a senha - Solicitar token de redefinição
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = ForgotPasswordSchema.parse(req.body)
    const emailNorm = normalizeEmail(email)

    const user = await prisma.user.findUnique({ where: { email: emailNorm } })
    
    // Por segurança, sempre retornamos a mesma mensagem (não revelamos se o e-mail existe)
    if (!user) {
      return res.json({ 
        message: 'Se o e-mail existir em nossa base, um token de redefinição foi gerado.' 
      })
    }

    // Gera token aleatório seguro de 32 bytes (64 caracteres hex)
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Token expira em 15 minutos
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000)

    // Atualiza o usuário com o token e data de expiração
    await prisma.user.update({
      where: { email: emailNorm },
      data: {
        resetToken,
        resetTokenExpires,
      },
    })

    // 🔗 SIMULAÇÃO: Mostra o token no console (em produção, enviaria por e-mail)
    console.log('\n' + '='.repeat(70))
    console.log('🔐 TOKEN DE REDEFINIÇÃO DE SENHA')
    console.log('='.repeat(70))
    console.log(`📧 E-mail: ${email}`)
    console.log(`🔑 Token: ${resetToken}`)
    console.log(`⏰ Expira em: ${resetTokenExpires.toLocaleString('pt-BR')}`)
    console.log(`⏳ Válido por: 15 minutos`)
    console.log('='.repeat(70) + '\n')

    res.json({ 
      message: 'Se o e-mail existir em nossa base, um token de redefinição foi gerado.',
      // Em desenvolvimento, podemos retornar o token para facilitar testes
      ...(process.env.NODE_ENV === 'development' && { token: resetToken })
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(422).json({ error: 'E-mail inválido', issues: e.flatten() })
    }
    console.error('Erro em /forgot-password:', e)
    res.status(500).json({ error: 'Erro ao processar solicitação' })
  }
})

// Redefinir senha com token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = ResetPasswordSchema.parse(req.body)

    // Busca usuário com token válido e não expirado
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(), // maior que agora (não expirado)
        },
      },
    })

    if (!user) {
      return res.status(400).json({ 
        error: 'Token inválido ou expirado. Solicite um novo token de redefinição.' 
      })
    }

    // Gera hash da nova senha
    const newPasswordHash = await hashPassword(newPassword)

    // Atualiza a senha e limpa os campos de reset
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    console.log(`✅ Senha redefinida com sucesso para o usuário: ${user.email}`)

    res.json({ 
      message: 'Senha redefinida com sucesso! Você já pode fazer login com a nova senha.' 
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(422).json({ 
        error: 'Dados inválidos. Token e nova senha são obrigatórios.', 
        issues: e.flatten() 
      })
    }
    console.error('Erro em /reset-password:', e)
    res.status(500).json({ error: 'Erro ao redefinir senha' })
  }
})

export default router
