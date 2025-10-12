import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

const instancia = axios.create({ baseURL })

// Garante que o token salvo seja aplicado em recarregamentos antes de qualquer requisição
try {
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('mm_token') : null
  if (storedToken) {
    instancia.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
  }
} catch (error) {
  console.warn('Não foi possível recuperar o token armazenado:', error)
}

// Wrappers de endpoints
const api = {
  instancia,
  auth: {
    login: (payload) => instancia.post('/auth/login', payload),
    register: (payload) => instancia.post('/auth/register', payload),
    changePassword: (payload) => instancia.post('/auth/change-password', payload),
  },
  transacoes: {
    listar: (filtros = {}) => instancia.get('/transacoes', { params: filtros }),
    criar: (payload) => instancia.post('/transacoes', payload),
    atualizar: (id, payload) => instancia.put(`/transacoes/${id}`, payload),
    remover: (id) => instancia.delete(`/transacoes/${id}`),
  },
  metas: {
    listar: () => instancia.get('/metas'),
    criar: (payload) => instancia.post('/metas', payload),
    atualizar: (id, payload) => instancia.put(`/metas/${id}`, payload),
    remover: (id) => instancia.delete(`/metas/${id}`),
  },
  relatorios: {
    resumo: (mes) => instancia.get('/relatorios/resumo', { params: { mes } }),
    categorias: (mes) => instancia.get('/relatorios/categorias', { params: { mes } }),
    mensal: (periodo) => instancia.get('/relatorios/mensal', { params: { periodo } }),
  },
  accounts: {
    list: () => instancia.get('/accounts'),
    create: (payload) => instancia.post('/accounts', payload),
    update: (id, payload) => instancia.put(`/accounts/${id}`, payload),
    remove: (id) => instancia.delete(`/accounts/${id}`),
  },
}

export default api
