const BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

if (!BASE) {
  throw new Error('VITE_API_URL não definida')
}

function buildHeaders(init: RequestInit) {
  const baseHeaders = init.headers instanceof Headers ? init.headers : new Headers(init.headers ?? {})

  const body = init.body
  const hasContentType = baseHeaders.has('Content-Type') || baseHeaders.has('content-type')
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  if (!hasContentType && !isFormData) {
    baseHeaders.set('Content-Type', 'application/json')
  }

  return baseHeaders
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`
  const headers = buildHeaders(init)

  return fetch(url, {
    // Ative se a autenticação do projeto usa cookie de sessão:
    // credentials: 'include',
    ...init,
    headers,
  })
}

export { BASE as API_BASE }
