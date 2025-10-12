// backend/src/middleware/auth.js
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../lib/jwt.js'

const prisma = new PrismaClient()

export async function requireAuth (req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token ausente' })
    }

    const token = header.slice(7).trim()
    if (!token) return res.status(401).json({ error: 'Token ausente' })

    const payload = verifyToken(token)
    const userId = payload?.sub ? Number(payload.sub) : NaN
    if (!payload || Number.isNaN(userId)) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

    req.user = user
    return next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ error: 'Falha na autenticação' })
  }
}
