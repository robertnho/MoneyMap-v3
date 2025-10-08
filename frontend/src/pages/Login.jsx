import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login () {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange (e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function onSubmit (e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await entrar({ email: form.email, password: form.senha })
      // 👉 depois de logar, vai para a Home do app (Dashboard)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setErro(e?.response?.data?.error || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Entrar</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Acesse sua conta para continuar.</p>

        {erro && <div className="mb-4 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-3">{erro}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
            <input
              required type="email" name="email" value={form.email} onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
            <input
              required type="password" name="senha" value={form.senha} onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <button disabled={loading}
            className="w-full rounded-lg bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-60 transition-colors">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
          Não tem conta? <Link to="/registrar" className="text-emerald-700 dark:text-emerald-400 hover:underline">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}
