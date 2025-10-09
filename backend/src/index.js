// backend/src/index.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import morgan from 'morgan'

import authRouter from './routes/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Prisma com logs no terminal
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

const app = express()

app.use(cors())
app.use(express.json())

// ===== LOGS NO TERMINAL =====

// Linha de acesso (método, url, status, tempo)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// Logar também o corpo (request/response) — habilitado por padrão
const LOG_BODY = (process.env.LOG_BODY ?? 'true') !== 'false'
app.use((req, res, next) => {
  const started = process.hrtime.bigint()
  const originalJson = res.json.bind(res)

  res.json = (payload) => {
    const elapsed = Number(process.hrtime.bigint() - started) / 1e6
    const safe = (o) => {
      try { return JSON.stringify(o).slice(0, 800) } catch { return String(o) }
    }

    console.log(`↪ ${req.method} ${req.originalUrl} → ${res.statusCode} (${elapsed.toFixed(1)}ms)`)
    if (LOG_BODY) {
      if (req.body && Object.keys(req.body).length) {
        console.log('   req.body:', safe(req.body))
      }
      console.log('   res.body:', safe(payload))
    }

    return originalJson(payload)
  }

  next()
})

// ===== ARQUIVOS ESTÁTICOS /public (sem index em "/") =====
app.use('/public', express.static(path.join(__dirname, '..', 'public'), { index: false }))

// ===== HEALTHCHECK =====
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, db: 'up', time: new Date().toISOString() })
  } catch (e) {
    console.error('healthcheck error:', e)
    res.status(500).json({ ok: false, error: 'db down' })
  }
})

// ===== DOCS RÁPIDOS =====
app.get('/docs', (req, res) => {
  res.json({
    health: '/health',
    auth: {
      register: { method: 'POST', path: '/auth/register' },
      login: { method: 'POST', path: '/auth/login' },
    },
  })
})

// ===== ROTAS =====
app.use('/auth', authRouter)

// ===== ROTA RAIZ =====
app.get('/', (req, res) => {
  res.json({
    message: '🚀 MoneyMap API está funcionando!',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      docs: '/docs',
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login'
      }
    }
  })
})

// ===== SERVE SPA (produção - opcional) =====
const STATIC_DIR = process.env.STATIC_DIR
if (STATIC_DIR && fs.existsSync(STATIC_DIR) && fs.existsSync(path.join(STATIC_DIR, 'index.html'))) {
  console.log('[server] Serving SPA from', STATIC_DIR)
  app.use(express.static(STATIC_DIR))
  const apiPrefixes = ['/auth', '/health', '/docs', '/public']
  app.get('*', (req, res, next) => {
    if (apiPrefixes.some((p) => req.path.startsWith(p))) return next()
    res.sendFile(path.join(STATIC_DIR, 'index.html'))
  })
}

// ===== HANDLER GLOBAL DE ERROS =====
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err)
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'Erro interno' })
})
/* eslint-enable no-unused-vars */

// ===== START =====
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`[auth] listening on http://localhost:${PORT}`)
})

export default app
