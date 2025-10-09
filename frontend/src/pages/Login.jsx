import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

export default function Login () {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [resetError, setResetError] = useState('')

  function onChange (e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function onSubmit (e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await entrar({ email: form.email, password: form.senha })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setErro(e?.response?.data?.error || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword (e) {
    e.preventDefault()
    setForgotError('')
    setForgotMessage('')
    setForgotLoading(true)
    
    try {
      const response = await api.instancia.post('/auth/forgot-password', { email: forgotEmail })
      setForgotMessage(response.data.message)
      
      if (response.data.token) {
        setResetToken(response.data.token)
        setTimeout(() => {
          setShowForgotModal(false)
          setShowResetModal(true)
        }, 2000)
      } else {
        setTimeout(() => {
          setShowForgotModal(false)
          setShowResetModal(true)
        }, 3000)
      }
    } catch (err) {
      setForgotError(err?.response?.data?.error || 'Erro ao solicitar redefinição')
    } finally {
      setForgotLoading(false)
    }
  }

  async function handleResetPassword (e) {
    e.preventDefault()
    setResetError('')
    setResetMessage('')
    setResetLoading(true)
    
    try {
      const response = await api.instancia.post('/auth/reset-password', {
        token: resetToken,
        newPassword: newPassword
      })
      setResetMessage(response.data.message)
      
      setTimeout(() => {
        setShowResetModal(false)
        setResetToken('')
        setNewPassword('')
        setForgotEmail('')
        setResetMessage('')
      }, 2000)
    } catch (err) {
      setResetError(err?.response?.data?.error || 'Erro ao redefinir senha')
    } finally {
      setResetLoading(false)
    }
  }

  function openForgotModal () {
    setShowForgotModal(true)
    setForgotEmail(form.email)
    setForgotError('')
    setForgotMessage('')
  }

  function closeForgotModal () {
    setShowForgotModal(false)
    setForgotEmail('')
    setForgotError('')
    setForgotMessage('')
  }

  function closeResetModal () {
    setShowResetModal(false)
    setResetToken('')
    setNewPassword('')
    setResetError('')
    setResetMessage('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow border border-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-2">Entrar</h1>
        <p className="text-sm text-gray-600 mb-6">Acesse sua conta para continuar.</p>

        {erro && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{erro}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              required type="email" name="email" value={form.email} onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              required type="password" name="senha" value={form.senha} onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button disabled={loading}
            className="w-full rounded-lg bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-60">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Não tem conta? <Link to="/registrar" className="text-emerald-700 hover:underline">Criar conta</Link>
          </p>
          <p className="text-sm text-gray-600">
            <button 
              onClick={openForgotModal}
              type="button"
              className="text-emerald-700 hover:underline focus:outline-none"
            >
              Esqueceu a senha? Redefina aqui
            </button>
          </p>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={closeForgotModal} />
          <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-semibold mb-4">Esqueceu a senha?</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Digite seu e-mail cadastrado. Um token de redefinição será gerado e exibido no console do servidor.
            </p>
            
            {forgotMessage && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
                {forgotMessage}
              </div>
            )}
            
            {forgotError && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                {forgotError}
              </div>
            )}
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  required
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 rounded-lg bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 disabled:opacity-60"
                >
                  {forgotLoading ? 'Enviando...' : 'Solicitar Token'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={closeResetModal} />
          <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-semibold mb-4">Redefinir senha</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Cole o token recebido e defina sua nova senha.
            </p>
            
            {resetMessage && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
                {resetMessage}
              </div>
            )}
            
            {resetError && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                {resetError}
              </div>
            )}
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Token</label>
                <input
                  required
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Cole o token aqui"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Verifique o console do servidor para obter o token
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nova senha</label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 rounded-lg bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 disabled:opacity-60"
                >
                  {resetLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
