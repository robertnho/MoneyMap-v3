import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext.jsx'
import api from '../services/api.js'
import { 
  Plus, 
  Filter, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit, 
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const CATEGORIAS_SUGERIDAS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Trabalho',
  'Investimentos',
  'Vendas',
  'Outros'
]

const TIPO_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'receita', label: 'Receitas' },
  { value: 'despesa', label: 'Despesas' }
]

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'pendente', label: 'Pendente' }
]

export default function Transacoes() {
  const { isDark } = useTheme()
  const [transacoes, setTransacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [accounts, setAccounts] = useState([])
  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: '',
    tipo: '',
    status: ''
  })
  const [modalAberto, setModalAberto] = useState(false)
  const hojeISO = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [form, setForm] = useState({
    accountId: '',
    descricao: '',
    categoria: '',
    valor: '',
    tipo: 'despesa',
    status: 'confirmado',
    data: hojeISO,
    observacao: '',
  })
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [modoEdicao, setModoEdicao] = useState(false)
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState(null)
  const [excluindoId, setExcluindoId] = useState(null)

  // Categorias dinâmicas baseadas nas transações existentes
  const categoriasDisponiveis = useMemo(() => {
    const dinamicas = transacoes.map((t) => t.categoria).filter(Boolean)
    const merged = new Set([...CATEGORIAS_SUGERIDAS, ...dinamicas])
    return Array.from(merged).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [transacoes])

  // Conta padrão para o formulário
  const defaultAccountId = useMemo(() => {
    if (!accounts.length) return ''
    const preferencial = accounts.find((conta) => conta.isDefault)
    return String((preferencial ?? accounts[0]).id)
  }, [accounts])

  // Atualizar accountId quando contas carregarem
  useEffect(() => {
    if (defaultAccountId) {
      setForm((prev) => ({
        ...prev,
        accountId: prev.accountId || defaultAccountId,
      }))
    }
  }, [defaultAccountId])

  // Carregar dados da API
  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const [contasResp, transResp] = await Promise.all([
          api.accounts.list(),
          api.transacoes.listar(),
        ])

        if (!ativo) return

        const contas = contasResp?.data?.accounts ?? []
        const lista = transResp?.data?.transactions ?? []

        setAccounts(contas)
        setTransacoes(lista)

      } catch (err) {
        if (!ativo) return
        console.error('Erro ao carregar dados:', err)
        const message = err?.response?.data?.error ?? 'Erro ao conectar com o servidor'
        setErro(message)
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregar()

    return () => {
      ativo = false
    }
  }, [])

  // Filtros com useMemo
  const transacoesFiltradas = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()

    return transacoes.filter((transacao) => {
      const matchBusca =
        !termo ||
        transacao.descricao?.toLowerCase().includes(termo) ||
        transacao.categoria?.toLowerCase().includes(termo)

      const matchCategoria = !filtros.categoria || transacao.categoria === filtros.categoria
      const matchTipo = !filtros.tipo || transacao.tipo === filtros.tipo
      const matchStatus = !filtros.status || transacao.status === filtros.status

      return matchBusca && matchCategoria && matchTipo && matchStatus
    })
  }, [transacoes, filtros])

  // Resumo do mês
  const resumoMes = useMemo(() => {
    const receitas = transacoes
      .filter((t) => t.tipo === 'receita')
      .reduce((acc, t) => acc + (Number(t.valor) || 0), 0)

    const despesas = transacoes
      .filter((t) => t.tipo === 'despesa')
      .reduce((acc, t) => acc + (Number(t.valor) || 0), 0)

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
    }
  }, [transacoes])

  // Funções do modal
  const abrirModalNovaTransacao = () => {
    setErroForm('')
    setMensagemSucesso('')
    setModoEdicao(false)
    setTransacaoEmEdicao(null)
    setForm({
      accountId: defaultAccountId,
      descricao: '',
      categoria: '',
      valor: '',
      tipo: 'despesa',
      status: 'confirmado',
      data: new Date().toISOString().slice(0, 10),
      observacao: '',
    })
    setModalAberto(true)
  }

  const abrirModalEditarTransacao = (transacao) => {
    setErroForm('')
    setMensagemSucesso('')
    setModoEdicao(true)
    setTransacaoEmEdicao(transacao)
    setForm({
      accountId: String(transacao.accountId ?? ''),
      descricao: transacao.descricao ?? '',
      categoria: transacao.categoria ?? '',
      valor: String(transacao.valor ?? '').replace('.', ','),
      tipo: transacao.tipo ?? 'despesa',
      status: transacao.status ?? 'confirmado',
      data: transacao.data ?? hojeISO,
      observacao: transacao.observacao ?? '',
    })
    setModalAberto(true)
  }

  const fecharModal = () => {
    if (salvando) return
    setModalAberto(false)
    setModoEdicao(false)
    setTransacaoEmEdicao(null)
  }

  const onInputChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitNovaTransacao = async (event) => {
    event.preventDefault()
    if (salvando) return

    setErroForm('')

    const accountIdNumber = Number(form.accountId)
    const valorNumber = Number(String(form.valor).replace(/\./g, '').replace(',', '.'))

    if (!modoEdicao && !accountIdNumber) {
      setErroForm('Selecione uma conta.')
      return
    }

    if (!form.descricao.trim()) {
      setErroForm('Informe a descrição da transação.')
      return
    }

    if (!Number.isFinite(valorNumber) || valorNumber <= 0) {
      setErroForm('Informe um valor válido (maior que zero).')
      return
    }

    setSalvando(true)

    try {
      const payloadBase = {
        descricao: form.descricao.trim(),
        categoria: form.categoria.trim() || 'Outros',
        valor: valorNumber,
        tipo: form.tipo,
        status: form.status,
        data: form.data || new Date().toISOString().slice(0, 10),
      }

      const observacaoTrim = form.observacao?.trim()
      if (observacaoTrim) {
        payloadBase.observacao = observacaoTrim
      }

      if (modoEdicao && transacaoEmEdicao) {
        const { data } = await api.transacoes.atualizar(transacaoEmEdicao.id, payloadBase)
        const atualizada = data?.transaction
        if (atualizada) {
          setTransacoes((prev) => prev.map((item) => (item.id === atualizada.id ? atualizada : item)))
        } else {
          const refresh = await api.transacoes.listar()
          setTransacoes(refresh?.data?.transactions ?? [])
        }

        setMensagemSucesso('Transação atualizada com sucesso!')
      } else {
        const payload = {
          ...payloadBase,
          accountId: accountIdNumber,
        }

        const { data } = await api.transacoes.criar(payload)
        const nova = data?.transaction

        if (nova) {
          setTransacoes((prev) => [nova, ...prev])
        } else {
          const refresh = await api.transacoes.listar()
          setTransacoes(refresh?.data?.transactions ?? [])
        }

        setMensagemSucesso('Transação registrada com sucesso!')
      }

      setModalAberto(false)
      setModoEdicao(false)
      setTransacaoEmEdicao(null)
      setForm((prev) => ({
        ...prev,
        descricao: '',
        categoria: '',
        valor: '',
        observacao: '',
        data: new Date().toISOString().slice(0, 10),
      }))
    } catch (err) {
      const fallback = modoEdicao ? 'Não foi possível atualizar a transação' : 'Não foi possível registrar a transação'
      const message = err?.response?.data?.error ?? fallback
      setErroForm(message)
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluirTransacao = async (transacao) => {
    if (!transacao?.id || excluindoId) return

    const confirmar = window.confirm('Tem certeza de que deseja excluir esta transação?')
    if (!confirmar) return

    setExcluindoId(transacao.id)
    setErro('')

    try {
      await api.transacoes.remover(transacao.id)
      setTransacoes((prev) => prev.filter((item) => item.id !== transacao.id))
      setMensagemSucesso('Transação removida com sucesso!')
    } catch (err) {
      console.error('Erro ao apagar transação:', err)
      const message = err?.response?.data?.error ?? 'Não foi possível remover a transação'
      setErro(message)
    } finally {
      setExcluindoId(null)
    }
  }

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const parsed = new Date(dateString)
    if (Number.isNaN(parsed.getTime())) return '-'
    return parsed.toLocaleDateString('pt-BR')
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${
      isDark
        ? 'bg-slate-950 text-slate-100'
        : 'bg-gradient-to-br from-slate-100 via-sky-100/50 to-indigo-100/40 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="mb-3 text-4xl font-bold drop-shadow-sm transition-colors duration-300 md:text-5xl text-slate-900 dark:text-slate-100">
              Transações
            </h1>
            <p className="text-lg font-medium transition-colors duration-300 text-slate-700 dark:text-slate-300">
              Gerencie suas receitas e despesas
            </p>
          </div>
          <button 
            onClick={abrirModalNovaTransacao}
            className="mx-auto flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:shadow-xl sm:mx-0 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:hover:shadow-slate-100/40"
          >
            <Plus className="h-5 w-5" />
            Nova Transação
          </button>
        </div>

        {/* Mensagens de Sucesso/Erro */}
        {mensagemSucesso && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
            {mensagemSucesso}
          </div>
        )}

        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {erro}
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/50 bg-white/30 p-8 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/40 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900/75">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-bold text-gray-700 dark:text-slate-300">Receitas do Mês</p>
                <p className="text-3xl font-bold text-emerald-600 drop-shadow-sm dark:text-emerald-400">{formatMoney(resumoMes.receitas)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/50 bg-white/30 p-8 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/40 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900/75">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-bold text-gray-700 dark:text-slate-300">Despesas do Mês</p>
                <p className="text-3xl font-bold text-rose-600 drop-shadow-sm dark:text-rose-400">{formatMoney(resumoMes.despesas)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/50 bg-white/30 p-8 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/40 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900/75">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-bold text-gray-700 dark:text-slate-300">Saldo do Mês</p>
                <p className={`text-3xl font-bold drop-shadow-sm ${
                  resumoMes.saldo >= 0
                    ? 'text-blue-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-rose-400'
                }`}>
                  {formatMoney(resumoMes.saldo)}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                resumoMes.saldo >= 0 
                  ? 'bg-gradient-to-br from-blue-400 to-indigo-500' 
                  : 'bg-gradient-to-br from-red-400 to-rose-500'
              }`}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="rounded-3xl border border-white/40 bg-white/25 p-8 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Buscar transação..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                className="w-full rounded-2xl border border-white/30 bg-white/40 py-3 pl-12 pr-4 text-gray-800 shadow-sm transition-all duration-300 placeholder:text-gray-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400"
              />
            </div>
            
            <select
              value={filtros.categoria}
              onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
              className="w-full rounded-2xl border border-white/30 bg-white/40 px-4 py-3 text-gray-800 shadow-sm transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-400"
            >
              <option value="">Todas as categorias</option>
              {categoriasDisponiveis.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
              className="w-full rounded-2xl border border-white/30 bg-white/40 px-4 py-3 text-gray-800 shadow-sm transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-400"
            >
              {TIPO_OPTIONS.map((option) => (
                <option key={option.value || '__all-tipo'} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              className="w-full rounded-2xl border border-white/30 bg-white/40 px-4 py-3 text-gray-800 shadow-sm transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-400"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || '__all-status'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/25 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/70">
          <div className="border-b border-white/30 bg-gradient-to-r from-blue-50/60 to-purple-50/60 px-8 py-6 dark:border-slate-700 dark:bg-slate-900/70">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Lista de Transações ({transacoesFiltradas.length})</h3>
          </div>
          
          <div className="divide-y divide-white/20 dark:divide-slate-800/60">
            {carregando ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">Carregando transações...</p>
              </div>
            ) : transacoesFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {filtros.busca || filtros.categoria || filtros.tipo || filtros.status ? (
                    <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">
                  {filtros.busca || filtros.categoria || filtros.tipo || filtros.status
                    ? 'Nenhuma transação encontrada'
                    : 'Nenhuma transação cadastrada'}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {filtros.busca || filtros.categoria || filtros.tipo || filtros.status
                    ? 'Tente ajustar os filtros para ver mais resultados.'
                    : 'Clique em "Nova Transação" para começar a registrar suas movimentações financeiras.'}
                </p>
              </div>
            ) : (
              transacoesFiltradas.map((transacao) => (
                <div key={transacao.id} className="cursor-pointer p-6 transition-all duration-300 transform hover:scale-[1.01] hover:bg-white/20 dark:hover:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        transacao.tipo === 'receita' 
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-br from-red-400 to-rose-500'
                      }`}>
                        {transacao.tipo === 'receita' ? (
                          <ArrowUpRight className="w-7 h-7 text-white" />
                        ) : (
                          <ArrowDownRight className="w-7 h-7 text-white" />
                        )}
                      </div>
                      
                      <div className="ml-5">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-lg font-bold text-gray-800 dark:text-slate-100">{transacao.descricao}</p>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            transacao.status === 'confirmado' 
                              ? 'border border-green-200/50 bg-green-100/80 text-green-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300' 
                              : 'border border-yellow-200/50 bg-yellow-100/80 text-yellow-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300'
                          }`}>
                            {transacao.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                        <p className="font-medium text-gray-600 dark:text-slate-300">
                          {transacao.categoria} • {formatDate(transacao.data)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className={`text-xl font-bold ${
                        transacao.tipo === 'receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-rose-400'
                      }`}>
                        {transacao.tipo === 'receita' ? '+' : '-'}{formatMoney(transacao.valor)}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirModalEditarTransacao(transacao)}
                          className="rounded-xl p-3 text-gray-500 transition-all duration-300 transform hover:scale-110 hover:bg-blue-50/50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleExcluirTransacao(transacao)}
                          disabled={excluindoId === transacao.id}
                          className="rounded-xl p-3 text-gray-500 transition-all duration-300 transform hover:scale-110 hover:bg-red-50/50 hover:text-red-600 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-rose-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal seria implementado aqui - versão demonstrativa */}
        {modalAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-white/30 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-slate-200">
                {modoEdicao ? 'Editar Transação' : 'Nova Transação'}
              </h2>

              {erroForm && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                  {erroForm}
                </div>
              )}

              <form onSubmit={handleSubmitNovaTransacao} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Conta *
                  </label>
                  <select
                    name="accountId"
                    value={form.accountId}
                    onChange={onInputChange}
                    required={!modoEdicao}
                    disabled={salvando || modoEdicao}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="">Selecione a conta</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} {account.isDefault && '(Padrão)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Tipo *
                    </label>
                    <select
                      name="tipo"
                      value={form.tipo}
                      onChange={onInputChange}
                      required
                      disabled={salvando}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="despesa">Despesa</option>
                      <option value="receita">Receita</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={onInputChange}
                      required
                      disabled={salvando}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="confirmado">Confirmado</option>
                      <option value="pendente">Pendente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Descrição *
                  </label>
                  <input
                    type="text"
                    name="descricao"
                    value={form.descricao}
                    onChange={onInputChange}
                    placeholder="Ex: Supermercado, Salário, etc."
                    required
                    disabled={salvando}
                    maxLength={180}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Categoria
                    </label>
                    <select
                      name="categoria"
                      value={form.categoria}
                      onChange={onInputChange}
                      disabled={salvando}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="">Selecione ou deixe em branco</option>
                      {categoriasDisponiveis.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Valor *
                    </label>
                    <input
                      type="text"
                      name="valor"
                      value={form.valor}
                      onChange={onInputChange}
                      placeholder="0,00"
                      required
                      disabled={salvando}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Data *
                  </label>
                  <input
                    type="date"
                    name="data"
                    value={form.data}
                    onChange={onInputChange}
                    required
                    disabled={salvando}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Observação
                  </label>
                  <textarea
                    name="observacao"
                    value={form.observacao}
                    onChange={onInputChange}
                    placeholder="Detalhes adicionais (opcional)"
                    disabled={salvando}
                    maxLength={500}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={fecharModal}
                    disabled={salvando}
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {salvando ? 'Salvando...' : modoEdicao ? 'Atualizar Transação' : 'Salvar Transação'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="rounded-2xl border border-white/30 bg-white/20 p-4 text-center text-sm font-medium text-gray-600 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          © 2024 MoneyMapp TCC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
