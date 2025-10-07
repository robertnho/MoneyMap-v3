import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

const instancia = axios.create({ baseURL })

// Wrappers de endpoints
const api = {
  instancia,
  auth: {
    login: (payload) => instancia.post('/auth/login', payload),
    register: (payload) => instancia.post('/auth/register', payload),
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
}

export default api
