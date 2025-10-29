// Checagem rápida de envs, localhost e saúde do backend para deploy Vercel/Render
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const readEnvFile = (name) => {
  const p = path.join(root, name)
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8')
  return ''
}

const parseEnv = (txt) =>
  Object.fromEntries(
    txt
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.trim().startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l, '']
      })
  )

const envBase = readEnvFile('.env')
const envLocal = readEnvFile('.env.local')
const envProd = readEnvFile('.env.production')

const envs = { ...parseEnv(envBase), ...parseEnv(envLocal), ...parseEnv(envProd) }

const VITE_API_URL = envs.VITE_API_URL || process.env.VITE_API_URL
const API_URL = envs.API_URL || process.env.API_URL

const issues = []
const warnings = []

const hasLocalhost = (v) => v && /(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(v)

if (!VITE_API_URL && !API_URL) {
  warnings.push(
    'Nenhuma base da API definida (API_URL/VITE_API_URL). Se estiver usando proxy \'/api\' no Vite, tudo bem; caso contrário, defina.'
  )
}
if (hasLocalhost(VITE_API_URL)) {
  issues.push(`VITE_API_URL aponta para host local: ${VITE_API_URL}`)
}
if (hasLocalhost(API_URL)) {
  issues.push(`API_URL aponta para host local: ${API_URL}`)
}

const SRC = path.join(root, 'src')
const localhostMatches = []
const hardcodedMatches = []
const localRegex = /(localhost|127\.0\.0\.1|0\.0\.0\.0)/gi
const segments = ['api', 'auth', 'accounts', 'transactions', 'transacoes', 'relatorios', 'metas', 'budgets', 'debts', 'notifications', 'categories', 'settings', 'dashboard', 'education', 'currency', 'investment']
const absoluteRegex = new RegExp(`https?:\\/\\/[^"'\\s]+\\/(?:${segments.join('|')})(?:[^"'\\s]*)?`, 'ig')

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      walk(full)
      continue
    }
    if (!/\.(ts|tsx|js|jsx)$/.test(entry)) continue
    const text = fs.readFileSync(full, 'utf8')

    let match
    localRegex.lastIndex = 0
    while ((match = localRegex.exec(text))) {
      const line = text.slice(0, match.index).split('\n').length
      localhostMatches.push({ file: path.relative(root, full), line, hit: match[0] })
    }

    absoluteRegex.lastIndex = 0
    while ((match = absoluteRegex.exec(text))) {
      const line = text.slice(0, match.index).split('\n').length
      hardcodedMatches.push({ file: path.relative(root, full), line, hit: match[0] })
    }
  }
}

if (fs.existsSync(SRC)) walk(SRC)

if (localhostMatches.length) {
  issues.push('Referências a localhost encontradas no código:')
  for (const m of localhostMatches) {
    issues.push(` - ${m.file}:${m.line} → ${m.hit}`)
  }
}

if (hardcodedMatches.length) {
  issues.push('URLs absolutas que parecem apontar para a API:')
  for (const m of hardcodedMatches) {
    issues.push(` - ${m.file}:${m.line} → ${m.hit}`)
  }
}

const formatValue = (v) => (v ? v : '(não definido)')
console.log('── Verificação Vercel/Render ───────────────────────────')
console.log('VITE_API_URL:', formatValue(VITE_API_URL))
console.log('API_URL:', formatValue(API_URL))
console.log('────────────────────────────────────────────────────────')

const fetchHealth = async () => {
  if (!API_URL) {
    console.log("Sem API_URL para testar /health (ok se você usa proxy '/api').")
    return
  }
  const url = API_URL.replace(/\/+$/, '') + '/health'
  console.log('Testando:', url)
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    if (res.ok) {
      console.log('✓ /health OK:', res.status)
    } else {
      issues.push(`/health respondeu status ${res.status} (${url})`)
    }
  } catch (error) {
    issues.push(`Falha ao acessar /health (${url}): ${error.message}`)
  }
}

const run = async () => {
  await fetchHealth()

  if (warnings.length) {
    console.log('\nAvisos:')
    for (const w of warnings) console.log('•', w)
  }

  if (issues.length) {
    console.log('\nProblemas encontrados:')
    for (const issue of issues) console.log('✗', issue)
    console.log('\nResumo: ✗ Verificações com pendências.')
    process.exitCode = 1
  } else {
    console.log('\nResumo: ✓ Tudo certo.')
  }
}

run()
