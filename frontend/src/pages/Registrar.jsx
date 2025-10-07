import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Registrar() {
  const { registrar } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErro(''); setOk(false); setLoading(true)
    try {
      await registrar({ name: form.nome, email: form.email, password: form.senha })
      setOk(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 600)
    } catch (e) {
      setErro(e?.response?.data?.error || 'Falha ao registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow border border-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-2">Criar conta</h1>
        <p className="text-sm text-gray-600 mb-6">Preencha os dados para começar.</p>

        {ok && <div className="mb-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-3">Conta criada! Redirecionando…</div>}
        {erro && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{erro}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input required type="text" name="nome" value={form.nome} onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input required type="email" name="email" value={form.email} onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input required type="password" name="senha" value={form.senha} onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button disabled={loading}
            className="w-full rounded-lg bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-60">
            {loading ? 'Cadastrando…' : 'Criar conta'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Já tem conta? <Link to="/login" className="text-emerald-700 hover:underline">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}
