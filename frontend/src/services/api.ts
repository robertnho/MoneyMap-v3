import { apiFetch } from '../lib/api'

type RequestParams = Record<string, unknown>

type RequestOptions = {
  params?: RequestParams
  body?: unknown
  headers?: HeadersInit
  method?: string
} & Omit<RequestInit, 'body' | 'headers' | 'method'>

type ApiResponse<T = unknown> = {
  data: T
  status: number
  ok: boolean
}

let authToken: string | null = null

const CONTENTLESS_STATUSES = new Set([204, 205])

const toQueryString = (params: RequestParams = {}): string => {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (Array.isArray(value)) {
      value.forEach((entry) => search.append(key, String(entry)))
      return
    }

    search.append(key, String(value))
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get('content-type') || ''
  let payload: T | null = null

  if (!CONTENTLESS_STATUSES.has(response.status)) {
    if (contentType.includes('application/json')) {
      payload = (await response.json()) as T
    } else {
      const text = await response.text()
      payload = (text ? (text as unknown as T) : null)
    }
  }

  if (!response.ok) {
    const errorMessage = typeof payload === 'string' && payload ? payload : 'Falha na requisição'
    const error = new Error(errorMessage)
    ;(error as Error & { status?: number; data?: unknown }).status = response.status
    ;(error as Error & { status?: number; data?: unknown }).data = payload
    throw error
  }

  return { data: payload as T, status: response.status, ok: response.ok }
}

const send = async <T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const { params, body, headers, method, ...rest } = options
  const query = params ? toQueryString(params) : ''

  const outgoingHeaders: HeadersInit = headers instanceof Headers ? headers : { ...(headers || {}) }
  if (authToken) {
    if (outgoingHeaders instanceof Headers) {
      outgoingHeaders.set('Authorization', `Bearer ${authToken}`)
    } else if (Array.isArray(outgoingHeaders)) {
      outgoingHeaders.push(['Authorization', `Bearer ${authToken}`])
    } else {
      outgoingHeaders.Authorization = `Bearer ${authToken}`
    }
  }

  let finalBody = body as BodyInit | null | undefined
  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    typeof body !== 'string' &&
    !(body instanceof Blob)
  ) {
    finalBody = JSON.stringify(body)
  }

  const response = await apiFetch(`${path}${query}`, {
    method,
    body: finalBody,
    headers: outgoingHeaders,
    ...rest,
  })

  return parseResponse<T>(response)
}

const api = {
  auth: {
    login: (payload: unknown) => send('/auth/login', { method: 'POST', body: payload }),
    register: (payload: unknown) => send('/auth/register', { method: 'POST', body: payload }),
    changePassword: (payload: unknown) => send('/auth/change-password', { method: 'POST', body: payload }),
  },
  transacoes: {
    listar: (filtros: RequestParams = {}) => send('/transacoes', { params: filtros }),
    criar: (payload: unknown) => send('/transacoes', { method: 'POST', body: payload }),
    atualizar: (id: number | string, payload: unknown) => send(`/transacoes/${id}`, { method: 'PUT', body: payload }),
    remover: (id: number | string) => send(`/transacoes/${id}`, { method: 'DELETE' }),
    migrar: (payload: unknown) => send('/transacoes/migrate', { method: 'POST', body: payload }),
    transferir: (payload: unknown) => send('/transacoes/transfer', { method: 'POST', body: payload }),
    importar: (formData: FormData) =>
      send('/transacoes/import', {
        method: 'POST',
        body: formData,
        headers: {},
      }),
    recorrentes: {
      listar: () => send('/transacoes/recorrentes'),
      criar: (payload: unknown) => send('/transacoes/recorrentes', { method: 'POST', body: payload }),
      atualizar: (id: number | string, payload: unknown) =>
        send(`/transacoes/recorrentes/${id}`, { method: 'PUT', body: payload }),
      remover: (id: number | string) => send(`/transacoes/recorrentes/${id}`, { method: 'DELETE' }),
      executar: (id: number | string) => send(`/transacoes/recorrentes/${id}/executar`, { method: 'POST' }),
      processarPendentes: () => send('/transacoes/recorrentes/processar', { method: 'POST' }),
    },
  },
  metas: {
    listar: () => send('/metas'),
    criar: (payload: unknown) => send('/metas', { method: 'POST', body: payload }),
    atualizar: (id: number | string, payload: unknown) => send(`/metas/${id}`, { method: 'PUT', body: payload }),
    remover: (id: number | string) => send(`/metas/${id}`, { method: 'DELETE' }),
  },
  relatorios: {
    totais: (periodo?: string) => send('/relatorios/totais', { params: periodo ? { periodo } : undefined }),
    categorias: (periodo?: string) => send('/relatorios/categorias', { params: periodo ? { periodo } : undefined }),
    mensal: (periodo: string) => send('/relatorios/mensal', { params: { periodo } }),
  },
  dashboard: {
    overview: (periodo?: string) => send('/dashboard', { params: periodo ? { periodo } : undefined }),
  },
  budgets: {
    listar: () => send('/budgets'),
    criar: (payload: unknown) => send('/budgets', { method: 'POST', body: payload }),
    atualizar: (id: number | string, payload: unknown) => send(`/budgets/${id}`, { method: 'PUT', body: payload }),
    remover: (id: number | string) => send(`/budgets/${id}`, { method: 'DELETE' }),
  },
  debts: {
    listar: () => send('/debts'),
    criar: (payload: unknown) => send('/debts', { method: 'POST', body: payload }),
    atualizar: (id: number | string, payload: unknown) => send(`/debts/${id}`, { method: 'PUT', body: payload }),
    remover: (id: number | string) => send(`/debts/${id}`, { method: 'DELETE' }),
  },
  accounts: {
    list: (params: RequestParams = {}) => send('/accounts', { params }),
    create: (payload: unknown) => send('/accounts', { method: 'POST', body: payload }),
    update: (id: number | string, payload: unknown) => send(`/accounts/${id}`, { method: 'PUT', body: payload }),
    remove: (id: number | string) => send(`/accounts/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => send('/categories'),
    create: (payload: unknown) => send('/categories', { method: 'POST', body: payload }),
    update: (id: number | string, payload: unknown) => send(`/categories/${id}`, { method: 'PUT', body: payload }),
    remove: (id: number | string) => send(`/categories/${id}`, { method: 'DELETE' }),
  },
  notifications: {
    listar: (params: RequestParams = {}) => send('/notifications', { params }),
    criar: (payload: unknown) => send('/notifications', { method: 'POST', body: payload }),
    marcarTodasComoLidas: () => send('/notifications/mark-all-read', { method: 'POST' }),
    marcarComoLida: (id: number | string) => send(`/notifications/${id}/read`, { method: 'POST' }),
    marcarComoNaoLida: (id: number | string) => send(`/notifications/${id}/unread`, { method: 'POST' }),
    remover: (id: number | string) => send(`/notifications/${id}`, { method: 'DELETE' }),
    preferencias: {
      obter: () => send('/notifications/prefs'),
      salvar: (payload: unknown) => send('/notifications/prefs', { method: 'PUT', body: payload }),
    },
    executarAgora: () => send('/notifications/run-now', { method: 'POST' }),
  },
  settings: {
    obter: () => send('/settings'),
    salvar: (payload: unknown) => send('/settings', { method: 'PUT', body: payload }),
  },
  education: {
    progresso: () => send('/education/progress'),
    salvarProgresso: (payload: unknown) => send('/education/progress', { method: 'POST', body: payload }),
  },
}

export const setAuthToken = (token: string | null) => {
  authToken = token || null
}

export default api
