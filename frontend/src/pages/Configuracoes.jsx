// frontend/src/pages/Configuracoes.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../contexts/ThemeContext.jsx'
import api from '../services/api'
import {
  Settings,
  User,
  Shield,
  Palette,
  Globe,
  Lock,
  Download,
  Moon,
  Sun,
  Database,
  CheckCircle,
  Camera,
  Wallet,
  Star,
  StarOff,
  Pencil,
  Trash2
} from 'lucide-react'

const SECTIONS = [
  { id: 'Perfil', label: 'Perfil', icon: User },
  { id: 'Segurança', label: 'Segurança', icon: Shield },
  { id: 'Preferências', label: 'Preferências', icon: Palette },
  { id: 'Dados', label: 'Dados', icon: Database },
  { id: 'Contas', label: 'Contas', icon: Wallet }
]

// Componente para Switch customizado
function CustomSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 dark:bg-zinc-800/50 dark:border-white/10">
      <div className="flex-1">
        <div className="font-medium text-zinc-800 dark:text-zinc-200">{label}</div>
        {description && <div className="text-sm text-zinc-500 dark:text-zinc-400">{description}</div>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
          checked ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-zinc-300 dark:bg-zinc-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

// Componente para Toast de feedback
function Toast({ message, onClose }) {
  if (!message) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
          ×
        </button>
      </div>
    </div>
  )
}

export default function Configuracoes() {
  const { usuario } = useAuth() // ← sem token (não há mais sincronizar)
  const [tab, setTab] = useState('Perfil')

  // --------- PERFIL ----------
  const [formPerfil, setFormPerfil] = useState({ name: '', email: '' })
  useEffect(() => {
    setFormPerfil({
      name: usuario?.name ?? '',
      email: usuario?.email ?? '',
    })
  }, [usuario])

  const inicial = useMemo(
    () => (formPerfil.name?.trim()?.[0]?.toUpperCase() ?? 'U'),
    [formPerfil.name]
  )

  // --------- SEGURANÇA ----------
  const [pwd, setPwd] = useState({ atual: '', nova: '', confirma: '' })
  const [pwdLoading, setPwdLoading] = useState(false)

  async function salvarSenha(e) {
    e.preventDefault()
    if (!pwd.atual || !pwd.nova || !pwd.confirma) return setToast('Preencha todos os campos.')
    if (pwd.nova !== pwd.confirma) return setToast('A confirmação não confere.')
    if (pwd.nova.length < 8) return setToast('A nova senha deve ter ao menos 8 caracteres.')
    setPwdLoading(true)
    try {
      await api.auth.changePassword({
        oldPassword: pwd.atual,
        newPassword: pwd.nova,
      })
      setToast('Senha alterada com sucesso.')
      setPwd({ atual: '', nova: '', confirma: '' })
    } catch (error) {
      console.error('change password error', error)
      const msg = error?.response?.data?.error ?? 'Não foi possível alterar a senha.'
      setToast(msg)
    } finally {
      setPwdLoading(false)
    }
  }

  // --------- PREFERÊNCIAS ----------
  const { isDark, toggleTheme } = useTheme()

  // --------- DADOS ----------
  function baixarDados() {
    const data = {
      usuario: usuario ?? null,
      preferencias: {
        temaEscuro: isDark,
      },
      geradoEm: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'meus-dados-moneymapp.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // --------- CONTAS ----------
  const [accounts, setAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [accountsFetched, setAccountsFetched] = useState(false)
  const [accountForm, setAccountForm] = useState({ id: null, name: '', color: '#6366f1', isDefault: false })
  const [accountSaving, setAccountSaving] = useState(false)
  const [accountActionId, setAccountActionId] = useState(null)

  const resetAccountForm = useCallback(() => {
    setAccountForm({ id: null, name: '', color: '#6366f1', isDefault: false })
  }, [])

  const fetchAccounts = useCallback(async (force = false) => {
    if (accountsLoading && !force) return
    try {
      setAccountsLoading(true)
      const { data } = await api.accounts.list()
      setAccounts(data?.accounts ?? [])
      setAccountsFetched(true)
    } catch (error) {
      console.error('fetch accounts error', error)
      setToast('Falha ao carregar contas.')
    } finally {
      setAccountsLoading(false)
    }
  }, [accountsLoading])

  useEffect(() => {
    if (tab === 'Contas' && !accountsFetched) {
      fetchAccounts()
    }
  }, [tab, accountsFetched, fetchAccounts])

  const handleAccountSubmit = useCallback(async (event) => {
    event.preventDefault()
    const name = accountForm.name.trim()
    if (!name) {
      setToast('Informe um nome para a conta.')
      return
    }

    const payload = { name, color: accountForm.color, isDefault: accountForm.isDefault }
    setAccountSaving(true)

    try {
      if (accountForm.id) {
        await api.accounts.update(accountForm.id, payload)
        setToast('Conta atualizada com sucesso.')
      } else {
        await api.accounts.create(payload)
        setToast('Conta criada com sucesso.')
      }
      await fetchAccounts(true)
      resetAccountForm()
    } catch (error) {
      console.error('account submit error', error)
      const msg = error?.response?.data?.error ?? 'Não foi possível salvar a conta.'
      setToast(msg)
    } finally {
      setAccountSaving(false)
    }
  }, [accountForm, fetchAccounts, resetAccountForm])

  const startEditAccount = useCallback((account) => {
    setAccountForm({
      id: account.id,
      name: account.name,
      color: account.color || '#6366f1',
      isDefault: !!account.isDefault,
    })
  }, [])

  const handleDeleteAccount = useCallback(async (account) => {
    if (!window.confirm(`Excluir conta "${account.name}"?`)) return

    try {
      setAccountActionId(account.id)
      await api.accounts.remove(account.id)
      setToast('Conta removida.')
      await fetchAccounts(true)
      if (accountForm.id === account.id) resetAccountForm()
    } catch (error) {
      console.error('delete account error', error)
      setToast('Falha ao remover conta.')
    } finally {
      setAccountActionId(null)
    }
  }, [accountForm.id, fetchAccounts, resetAccountForm])

  const handleSetDefaultAccount = useCallback(async (account) => {
    try {
      setAccountActionId(account.id)
      await api.accounts.update(account.id, { isDefault: true })
      setToast(`"${account.name}" definida como padrão.`)
      await fetchAccounts(true)
      if (accountForm.id === account.id) {
        setAccountForm(prev => ({ ...prev, isDefault: true }))
      } else {
        resetAccountForm()
      }
    } catch (error) {
      console.error('default account error', error)
      setToast('Não foi possível definir a conta como padrão.')
    } finally {
      setAccountActionId(null)
    }
  }, [accountForm.id, fetchAccounts, resetAccountForm])

  const handleUnsetDefaultAccount = useCallback(async (account) => {
    try {
      setAccountActionId(account.id)
      await api.accounts.update(account.id, { isDefault: false })
      setToast(`"${account.name}" não é mais a conta padrão.`)
      await fetchAccounts(true)
      if (accountForm.id === account.id) {
        setAccountForm(prev => ({ ...prev, isDefault: false }))
      }
    } catch (error) {
      console.error('unset default account error', error)
      setToast('Não foi possível remover o padrão da conta.')
    } finally {
      setAccountActionId(null)
    }
  }, [accountForm.id, fetchAccounts])

  // --------- FEEDBACK ----------
  const [toast, setToast] = useState('')
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(id)
  }, [toast])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fundo full-bleed */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-zinc-950 dark:via-violet-950/20 dark:to-purple-950/30" />
        <div className="absolute -top-24 -left-24 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-violet-400/20 to-purple-500/20 blur-3xl" />
        <div
          className="absolute -bottom-32 -right-32 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-indigo-400/20 to-violet-500/20 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute left-1/4 top-1/3 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-purple-400/10 to-fuchsia-400/10 blur-2xl"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.9) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 w-full border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl shadow-lg shadow-zinc-100/50 dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-zinc-900/50">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">⚙️ Configurações</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Gerencie suas preferências e informações pessoais</p>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      <Toast message={toast} onClose={() => setToast('')} />

      {/* Conteúdo */}
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de seções */}
          <aside className="lg:w-72">
            <nav className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-lg overflow-hidden dark:border-white/10 dark:bg-zinc-900/70">
              {SECTIONS.map((section, i) => {
                const Icon = section.icon
                const isActive = section.id === tab
                return (
                  <button
                    key={section.id}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300 border-r-2 border-violet-500' 
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
                    } ${i !== SECTIONS.length - 1 ? 'border-b border-zinc-200/60 dark:border-white/10' : ''}`}
                    onClick={() => setTab(section.id)}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-500'}`} />
                    <span className="font-medium">{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Conteúdo das seções */}
          <main className="flex-1">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-lg p-6 dark:border-white/10 dark:bg-zinc-900/70">
              {tab === 'Perfil' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">Informações do Perfil</h2>
                  </div>

                  {/* Avatar e info */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg transition-transform duration-300 group-hover:scale-105">
                        {inicial}
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border-2 border-violet-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Camera className="h-3 w-3 text-violet-600" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold text-zinc-800 dark:text-white">{formPerfil.name || 'Usuário'}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400">{formPerfil.email}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Membro desde 2024</p>
                    </div>
                  </div>

                  {/* Formulário */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={formPerfil.name}
                        readOnly
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-600 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 cursor-not-allowed text-zinc-500 dark:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">E-mail</label>
                      <input
                        type="email"
                        value={formPerfil.email}
                        readOnly
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-600 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 cursor-not-allowed text-zinc-500 dark:text-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="bg-gradient-to-r from-indigo-500 to-sky-400 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg">
                      Editar Perfil
                    </button>
                  </div>
                </div>
              )}

              {tab === 'Segurança' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">Segurança</h2>
                  </div>

                  <form onSubmit={salvarSenha} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Senha atual</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                          <input
                            type="password"
                            value={pwd.atual}
                            onChange={(e) => setPwd(p => ({ ...p, atual: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-600 pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
                            placeholder="Digite sua senha atual"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nova senha</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                          <input
                            type="password"
                            value={pwd.nova}
                            onChange={(e) => setPwd(p => ({ ...p, nova: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-600 pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
                            placeholder="Digite sua nova senha"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Confirmar nova senha</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                          <input
                            type="password"
                            value={pwd.confirma}
                            onChange={(e) => setPwd(p => ({ ...p, confirma: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-600 pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
                            placeholder="Confirme sua nova senha"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={pwdLoading}
                        className="bg-gradient-to-r from-indigo-500 to-sky-400 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {pwdLoading ? 'Salvando…' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </form>
                  
                </div>
              )}

              {tab === 'Preferências' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">Preferências</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tema */}
                    <div className="rounded-2xl border border-zinc-200/60 bg-white/50 backdrop-blur-sm p-6 shadow-md hover:shadow-xl transition-all duration-300 dark:border-white/10 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-3 mb-4">
                        {isDark ? <Moon className="h-5 w-5 text-indigo-600" /> : <Sun className="h-5 w-5 text-amber-500" />}
                        <h3 className="font-semibold text-zinc-800 dark:text-white">🌙 Tema</h3>
                      </div>
                      <CustomSwitch
                        checked={isDark}
                        onChange={toggleTheme}
                        label="Modo escuro"
                        description="Ative para uma experiência visual mais suave"
                      />
                    </div>

                    {/* Idioma */}
                    <div className="rounded-2xl border border-zinc-200/60 bg-white/50 backdrop-blur-sm p-6 shadow-md hover:shadow-xl transition-all duration-300 dark:border-white/10 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-zinc-800 dark:text-white">🌐 Idioma</h3>
                      </div>
                      <select className="w-full rounded-xl border border-zinc-300 dark:border-zinc-600 p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500/50">
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>

                    {/* Modo Demo */}
                    {/* Privacidade */}

                  </div>
                </div>
              )}

              {tab === 'Dados' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Database className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">Seus Dados</h2>
                  </div>

                  <div className="rounded-2xl border border-zinc-200/60 bg-white/50 backdrop-blur-sm p-6 shadow-md hover:shadow-xl transition-all duration-300 dark:border-white/10 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Download className="h-5 w-5 text-emerald-600" />
                      <h3 className="font-semibold text-zinc-800 dark:text-white">📥 Download dos Dados</h3>
                    </div>
                    
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                      Faça o download de um arquivo JSON contendo todos os dados básicos do seu perfil salvos no aplicativo. 
                      Isso inclui suas preferências, configurações e informações pessoais.
                    </p>
                    
                    <button
                      onClick={baixarDados}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
                    >
                      <Download className="h-4 w-4" />
                      Baixar meus dados
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Privacidade:</strong> Seus dados são processados localmente e você tem controle total sobre eles.
                    </p>
                  </div>
                </div>
              )}

              {tab === 'Contas' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Wallet className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">Contas bancárias</h2>
                  </div>

                  <form onSubmit={handleAccountSubmit} className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm p-6 shadow-md space-y-6 dark:border-white/10 dark:bg-zinc-800/60">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nome da conta</label>
                      <input
                        type="text"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex.: Conta corrente Nubank"
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-600 px-4 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Cor</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={accountForm.color}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, color: e.target.value }))}
                          className="h-12 w-16 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 cursor-pointer"
                        />
                        <span className="font-mono text-sm text-zinc-600 dark:text-zinc-300">{accountForm.color}</span>
                      </div>
                    </div>

                    <CustomSwitch
                      checked={accountForm.isDefault}
                      onChange={() => setAccountForm(prev => ({ ...prev, isDefault: !prev.isDefault }))}
                      label="Definir como conta padrão"
                      description="Essa conta será utilizada por padrão em novos lançamentos."
                    />

                    <div className="flex flex-wrap justify-end gap-3 pt-2">
                      {accountForm.id && (
                        <button
                          type="button"
                          onClick={resetAccountForm}
                          className="px-5 py-3 rounded-xl border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700/60"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={accountSaving}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-400 text-white font-medium shadow-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {accountSaving ? 'Salvando…' : accountForm.id ? 'Atualizar conta' : 'Criar conta'}
                      </button>
                    </div>
                  </form>

                  <div className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-md p-6 space-y-4 dark:border-white/10 dark:bg-zinc-800/60">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Minhas contas</h3>

                    {accountsLoading ? (
                      <div className="py-10 text-center text-zinc-500 dark:text-zinc-400">Carregando contas…</div>
                    ) : accounts.length === 0 ? (
                      <div className="py-10 text-center text-zinc-500 dark:text-zinc-400">
                        Nenhuma conta cadastrada ainda. Crie a primeira usando o formulário acima.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {accounts.map((account) => {
                          const acting = accountActionId === account.id
                          return (
                            <div
                              key={account.id}
                              className="flex flex-col gap-4 rounded-xl border border-zinc-200/60 bg-white/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-zinc-700 dark:bg-zinc-900/70"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="h-10 w-10 rounded-full border border-white shadow-inner"
                                  style={{ backgroundColor: account.color || '#6366f1' }}
                                />
                                <div>
                                  <p className="font-semibold text-zinc-800 dark:text-zinc-100">{account.name}</p>
                                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    <span className="font-mono">{account.color}</span>
                                    {account.isDefault && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
                                        <Star className="h-3 w-3 fill-current" />
                                        Padrão
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 justify-end">
                                {!account.isDefault && (
                                  <button
                                    onClick={() => handleSetDefaultAccount(account)}
                                    disabled={acting}
                                    className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 transition dark:border-violet-500/40 dark:text-violet-300 dark:hover:bg-violet-500/10 disabled:opacity-50"
                                  >
                                    <Star className="h-4 w-4" />
                                    Padrão
                                  </button>
                                )}
                                {account.isDefault && (
                                  <button
                                    onClick={() => handleUnsetDefaultAccount(account)}
                                    disabled={acting}
                                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 transition dark:border-amber-500/40 dark:text-amber-300 dark:hover:bg-amber-500/10 disabled:opacity-50"
                                  >
                                    <StarOff className="h-4 w-4" />
                                    Remover padrão
                                  </button>
                                )}
                                <button
                                  onClick={() => startEditAccount(account)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteAccount(account)}
                                  disabled={acting}
                                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/10 disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Excluir
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Frase Motivacional */}
        <div className="text-center italic text-zinc-500 dark:text-zinc-400 mt-10">
          💡 "Personalize sua experiência no MoneyMapp do seu jeito."
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
          © {new Date().getFullYear()} MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
