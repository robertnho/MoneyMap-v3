// frontend/src/pages/Configuracoes.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api'

const SECTIONS = ['Perfil', 'Segurança', 'Preferências', 'Notificações', 'Dados']

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
    setPwdLoading(true)
    try {
      await api.instancia.post('/auth/change-password', {
        oldPassword: pwd.atual,
        newPassword: pwd.nova,
      })
      setToast('Senha alterada com sucesso.')
      setPwd({ atual: '', nova: '', confirma: '' })
    } catch {
      setToast('Alterar senha não disponível (adicione /auth/change-password no backend).')
    } finally {
      setPwdLoading(false)
    }
  }

  // --------- PREFERÊNCIAS ----------
  const [pref, setPref] = useState(() => ({
    temaEscuro: localStorage.getItem('pref_tema') === 'dark',
    modoDemo: localStorage.getItem('demoMode') === 'true',
  }))
  function togglePref(k) {
    setPref(p => {
      const v = !p[k]
      const nx = { ...p, [k]: v }
      if (k === 'temaEscuro') localStorage.setItem('pref_tema', v ? 'dark' : 'light')
      if (k === 'modoDemo') localStorage.setItem('demoMode', v ? 'true' : 'false')
      return nx
    })
  }

  // --------- NOTIFICAÇÕES ----------
  const [notif, setNotif] = useState(() => ({
    email: localStorage.getItem('pref_notif_email') !== 'false',
    push: localStorage.getItem('pref_notif_push') === 'true',
  }))
  function toggleNotif(k) {
    setNotif(p => {
      const v = !p[k]
      const nx = { ...p, [k]: v }
      localStorage.setItem(`pref_notif_${k}`, String(v))
      return nx
    })
  }

  // --------- DADOS ----------
  function baixarDados() {
    const data = {
      usuario: usuario ?? null,
      preferencias: pref,
      notificacoes: notif,
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

  // --------- FEEDBACK ----------
  const [toast, setToast] = useState('')
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(id)
  }, [toast])

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      {toast && (
        <div className="mb-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-3">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar de seções */}
        <aside className="md:col-span-1">
          <nav className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                className={`w-full text-left px-4 py-3 border-b border-gray-200 hover:bg-gray-50 ${
                  s === tab ? 'bg-emerald-50 text-emerald-700 font-medium' : ''
                } ${i === SECTIONS.length - 1 ? 'border-b-0' : ''}`}
                onClick={() => setTab(s)}
              >
                {s}
              </button>
            ))}
          </nav>
        </aside>

        {/* Conteúdo das seções */}
        <section className="md:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {tab === 'Perfil' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Informações do Perfil</h2>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold">
                    {inicial}
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="font-medium text-gray-700">Foto do Perfil</div>
                    <div>Clique no ícone para alterar sua foto</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={formPerfil.name}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={formPerfil.email}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </>
            )}

            {tab === 'Segurança' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Segurança</h2>
                <form onSubmit={salvarSenha} className="grid gap-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha atual</label>
                    <input
                      type="password"
                      value={pwd.atual}
                      onChange={(e) => setPwd(p => ({ ...p, atual: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
                    <input
                      type="password"
                      value={pwd.nova}
                      onChange={(e) => setPwd(p => ({ ...p, nova: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova senha</label>
                    <input
                      type="password"
                      value={pwd.confirma}
                      onChange={(e) => setPwd(p => ({ ...p, confirma: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={pwdLoading}
                      className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
                    >
                      {pwdLoading ? 'Salvando…' : 'Salvar'}
                    </button>
                  </div>
                </form>
                <p className="text-xs text-gray-500 mt-3">
                  Para funcionar de verdade, implemente no backend o endpoint <code>POST /auth/change-password</code>.
                </p>
              </>
            )}

            {tab === 'Preferências' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Preferências</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={pref.temaEscuro}
                      onChange={() => togglePref('temaEscuro')}
                    />
                    <span>Tema escuro</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={pref.modoDemo}
                      onChange={() => togglePref('modoDemo')}
                    />
                    <span>Modo demonstração</span>
                  </label>
                </div>
              </>
            )}

            {tab === 'Notificações' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Notificações</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notif.email}
                      onChange={() => toggleNotif('email')}
                    />
                    <span>Receber por e-mail</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notif.push}
                      onChange={() => toggleNotif('push')}
                    />
                    <span>Notificações push (navegador)</span>
                  </label>
                </div>
              </>
            )}

            {tab === 'Dados' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Seus dados</h2>
                <p className="text-gray-600 mb-4">
                  Faça o download de um arquivo JSON com os dados básicos do seu perfil salvos no app.
                </p>
                <button
                  onClick={baixarDados}
                  className="px-4 py-2 rounded bg-emerald-600 text-white"
                >
                  Baixar meus dados
                </button>
              </>
            )}
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            © {new Date().getFullYear()} MoneyMapp TCC. Todos os direitos reservados.
          </p>
        </section>
      </div>
    </div>
  )
}
