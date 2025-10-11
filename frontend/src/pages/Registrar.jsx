import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { User, Mail, Lock } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/30 rounded-3xl border border-white/50 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">Criar conta</h1>
          <p className="text-gray-700 font-medium">Preencha os dados para começar</p>
        </div>

        {ok && (
          <div className="mb-6 text-sm text-emerald-800 bg-emerald-100/80 backdrop-blur-sm border border-emerald-300/50 rounded-2xl p-4">
            Conta criada! Redirecionando…
          </div>
        )}
        {erro && (
          <div className="mb-6 text-sm text-red-800 bg-red-100/80 backdrop-blur-sm border border-red-300/50 rounded-2xl p-4">
            {erro}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                required 
                type="text" 
                name="nome" 
                value={form.nome} 
                onChange={onChange}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/50 bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                placeholder="Digite seu nome"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                required 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={onChange}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/50 bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                placeholder="Digite seu e-mail"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                required 
                type="password" 
                name="senha" 
                value={form.senha} 
                onChange={onChange}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/50 bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Cadastrando…' : 'Criar conta'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-700 font-medium">
            Já tem conta?{' '}
            <Link 
              to="/login" 
              className="text-blue-800 font-bold hover:text-blue-900 transition-colors duration-300 underline underline-offset-2"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
