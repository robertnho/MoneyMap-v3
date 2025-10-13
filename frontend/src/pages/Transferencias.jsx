import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, RefreshCcw, Sparkles, Wallet } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext.jsx'
import api from '../services/api.js'
import { formatarDataISOParaBR, formatarMoedaBRL } from '../utils/formatadores.js'

const STATUS_OPTIONS = [
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'pendente', label: 'Pendente' },
]

const CATEGORIAS_SUGERIDAS = [
  'Transferência',
  'Reserva',
  'Investimento',
  'Aporte',
  'Poupar',
]

function normalizarValor(valor) {
  if (typeof valor === 'number') return valor
  const texto = `${valor ?? ''}`.trim()
  if (!texto) return NaN
  let parsed = texto.replace(/\s/g, '')
  if (parsed.includes(',') && parsed.includes('.')) {
    parsed = parsed.replace(/\./g, '').replace(',', '.')
  } else if (parsed.includes(',')) {
    parsed = parsed.replace(',', '.')
  }
  const numero = Number(parsed)
  return Number.isFinite(numero) ? numero : NaN
}

export default function Transferencias() {
  const { isDark } = useTheme()
  const [accounts, setAccounts] = useState([])
  const [carregandoContas, setCarregandoContas] = useState(true)
  const [categorias, setCategorias] = useState([])
  const [carregandoCategorias, setCarregandoCategorias] = useState(false)
  const [status, setStatus] = useState({ tipo: 'idle', mensagem: '' })
  const [transferencia, setTransferencia] = useState(null)

  const hojeISO = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [form, setForm] = useState({
    fromAccountId: '',
    toAccountId: '',
    valor: '',
    descricao: '',
    categoria: 'Transferência',
    categoryId: '',
    data: hojeISO,
    observacao: '',
    status: 'confirmado',
  })

  const categoriasDisponiveis = useMemo(() => {
    const gerenciadas = categorias.map((cat) => cat.name)
    return Array.from(new Set([...CATEGORIAS_SUGERIDAS, ...gerenciadas])).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [categorias])

  const carregarContas = useCallback(async () => {
    setCarregandoContas(true)
    try {
      const { data } = await api.accounts.list()
      const ativas = (data?.accounts ?? []).filter((conta) => !conta.archivedAt)
      setAccounts(ativas)
      if (ativas.length >= 2) {
        setForm((prev) => ({
          ...prev,
          fromAccountId: prev.fromAccountId || String(ativas[0].id),
          toAccountId: prev.toAccountId || String(ativas[1].id),
        }))
      } else if (ativas.length === 1) {
        setForm((prev) => ({ ...prev, fromAccountId: String(ativas[0].id) }))
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
      setStatus({ tipo: 'erro', mensagem: 'Falha ao carregar contas.' })
    } finally {
      setCarregandoContas(false)
    }
  }, [])

  const carregarCategorias = useCallback(async () => {
    setCarregandoCategorias(true)
    try {
      const { data } = await api.categories.list()
      setCategorias(data?.categories ?? [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      setCategorias([])
    } finally {
      setCarregandoCategorias(false)
    }
  }, [])

  useEffect(() => {
    carregarContas()
    carregarCategorias()
  }, [carregarContas, carregarCategorias])

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'categoryId') {
      const categoriaSelecionada = categorias.find((cat) => String(cat.id) === value)
      setForm((prev) => ({
        ...prev,
        categoryId: value,
        categoria: categoriaSelecionada ? categoriaSelecionada.name : prev.categoria,
      }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const inverterContas = () => {
    setForm((prev) => ({
      ...prev,
      fromAccountId: prev.toAccountId,
      toAccountId: prev.fromAccountId,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ tipo: 'idle', mensagem: '' })

    const valorNormalizado = normalizarValor(form.valor)
    if (!Number.isFinite(valorNormalizado) || valorNormalizado <= 0) {
      setStatus({ tipo: 'erro', mensagem: 'Informe um valor válido maior que zero.' })
      return
    }

    if (!form.fromAccountId || !form.toAccountId) {
      setStatus({ tipo: 'erro', mensagem: 'Selecione as contas de origem e destino.' })
      return
    }

    if (form.fromAccountId === form.toAccountId) {
      setStatus({ tipo: 'erro', mensagem: 'As contas devem ser diferentes.' })
      return
    }

    try {
      setStatus({ tipo: 'processando', mensagem: '' })
      const categoryId = form.categoryId ? Number(form.categoryId) : undefined
      const payload = {
        fromAccountId: Number(form.fromAccountId),
        toAccountId: Number(form.toAccountId),
        valor: valorNormalizado,
        descricao: form.descricao?.trim() || undefined,
        categoria: form.categoria?.trim() || (categoryId ? undefined : 'Transferência'),
        categoryId,
        data: form.data || hojeISO,
        observacao: form.observacao?.trim() || undefined,
        status: form.status,
      }

      const { data } = await api.transacoes.transferir(payload)
      setTransferencia(data?.transfer ?? null)
      setStatus({ tipo: 'sucesso', mensagem: 'Transferência registrada com sucesso!' })

      setForm((prev) => ({
        ...prev,
        valor: '',
        descricao: '',
        observacao: '',
      }))
    } catch (error) {
      const mensagem = error?.response?.data?.error ?? 'Não foi possível concluir a transferência.'
      setStatus({ tipo: 'erro', mensagem })
    }
  }

  const contasDisponiveis = useMemo(() => accounts.map((conta) => ({ id: conta.id, nome: conta.name })), [accounts])

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${
      isDark
        ? 'bg-slate-950 text-slate-100'
        : 'bg-gradient-to-br from-slate-100 via-indigo-100/40 to-purple-100/30 text-slate-900'
    }`}>
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/70">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
              <ArrowLeftRight className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Transferências entre contas</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">Movimente valores entre contas internas sem perder o histórico.</p>
            </div>
          </div>
        </header>

        {status.tipo === 'erro' && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {status.mensagem}
          </div>
        )}

        {status.tipo === 'sucesso' && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
            {status.mensagem}
          </div>
        )}

        <section className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/70">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Conta de origem *</label>
                <select
                  name="fromAccountId"
                  value={form.fromAccountId}
                  onChange={handleChange}
                  disabled={carregandoContas}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">Selecione uma conta</option>
                  {contasDisponiveis.map((conta) => (
                    <option key={`from-${conta.id}`} value={conta.id}>{conta.nome}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-center">
                <button
                  type="button"
                  onClick={inverterContas}
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:-translate-y-0.5 hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-slate-800 dark:text-indigo-300"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Inverter
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Conta de destino *</label>
                <select
                  name="toAccountId"
                  value={form.toAccountId}
                  onChange={handleChange}
                  disabled={carregandoContas}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">Selecione uma conta</option>
                  {contasDisponiveis.map((conta) => (
                    <option key={`to-${conta.id}`} value={conta.id}>{conta.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Valor *</label>
                <input
                  type="text"
                  name="valor"
                  value={form.valor}
                  onChange={handleChange}
                  placeholder="0,00"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Categoria gerenciada</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  disabled={carregandoCategorias}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">Sem vínculo</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>{categoria.name}</option>
                  ))}
                </select>
                {carregandoCategorias && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Carregando categorias...</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Categoria (texto)</label>
                <input
                  type="text"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  list="categorias-transferencias"
                  maxLength={80}
                  placeholder="Transferência"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                />
                <datalist id="categorias-transferencias">
                  {categoriasDisponiveis.map((categoria) => (
                    <option key={categoria} value={categoria} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição opcional</label>
              <input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                maxLength={180}
                placeholder="Ex.: Transferência para reserva de emergência"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Data *</label>
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Observação</label>
                <textarea
                  name="observacao"
                  value={form.observacao}
                  onChange={handleChange}
                  maxLength={500}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
                disabled={status.tipo === 'processando'}
              >
                <Sparkles className="h-4 w-4" />
                {status.tipo === 'processando' ? 'Registrando...' : 'Registrar transferência'}
              </button>
            </div>
          </form>
        </section>

        {transferencia && (
          <section className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Resumo da transferência</h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Saída</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{transferencia.debito.descricao}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      {transferencia.debito.account?.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{formatarDataISOParaBR(transferencia.debito.data)} • {transferencia.debito.categoria}</p>
                  </div>
                  <span className="text-lg font-bold text-rose-500 dark:text-rose-300">-{formatarMoedaBRL(transferencia.debito.valor)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Entrada</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{transferencia.credito.descricao}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      {transferencia.credito.account?.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{formatarDataISOParaBR(transferencia.credito.data)} • {transferencia.credito.categoria}</p>
                  </div>
                  <span className="text-lg font-bold text-emerald-500 dark:text-emerald-300">+{formatarMoedaBRL(transferencia.credito.valor)}</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
