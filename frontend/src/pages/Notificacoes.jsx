import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircleX,
  Info,
  RefreshCcw,
  Trash2,
} from 'lucide-react'
import api from '../services/api'
import Button from '../components/ui/Button.jsx'
import { SkeletonList } from '../components/ui/Skeleton.jsx'
import { dadosDemo } from '../data/dadosDemo.js'

const severityConfig = {
  info: {
    icon: Info,
    dot: 'bg-sky-500',
    border: 'border-sky-100 dark:border-sky-700',
    badge: 'bg-sky-100/80 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
  },
  success: {
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
    border: 'border-emerald-100 dark:border-emerald-700',
    badge: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  },
  warning: {
    icon: AlertTriangle,
    dot: 'bg-amber-500',
    border: 'border-amber-100 dark:border-amber-700',
    badge: 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  },
  error: {
    icon: CircleX,
    dot: 'bg-rose-500',
    border: 'border-rose-100 dark:border-rose-700',
    badge: 'bg-rose-100/80 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
  },
}

const typeLabels = {
  system: 'Sistema',
  transaction: 'Transação',
  recurring: 'Recorrência',
  budget: 'Orçamento',
  goal: 'Meta',
  reminder: 'Lembrete',
}

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'Não lidas' },
  { value: 'read', label: 'Lidas' },
]

const perPage = 10

const announceRefresh = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('moneymapp:notifications:refresh'))
  }
}

const readDemoNotifications = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('mm_demo_notifications')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({ ...item }))
        }
      }
    } catch (error) {
      console.warn('Falha ao ler notificações demo do storage:', error)
    }
  }

  return (dadosDemo.notificacoes ?? []).map((item) => ({ ...item }))
}

const formatDateTime = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

const formatRelativeTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffMinutes = Math.round(diffMs / 60000)
  const absMinutes = Math.abs(diffMinutes)

  const formatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
  if (absMinutes < 60) {
    return formatter.format(diffMinutes, 'minute')
  }
  const diffHours = Math.round(diffMinutes / 60)
  const absHours = Math.abs(diffHours)
  if (absHours < 24) {
    return formatter.format(diffHours, 'hour')
  }
  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 7) {
    return formatter.format(diffDays, 'day')
  }
  const diffWeeks = Math.round(diffDays / 7)
  if (Math.abs(diffWeeks) < 5) {
    return formatter.format(diffWeeks, 'week')
  }
  const diffMonths = Math.round(diffDays / 30)
  if (Math.abs(diffMonths) < 12) {
    return formatter.format(diffMonths, 'month')
  }
  const diffYears = Math.round(diffDays / 365)
  return formatter.format(diffYears, 'year')
}

function NotificacaoCard({ notification, onMarkRead, onMarkUnread, onRemove }) {
  const severity = severityConfig[notification.severity] ?? severityConfig.info
  const Icon = severity.icon
  const relativeTime = formatRelativeTime(notification.createdAt)
  const metadata = notification.metadata && typeof notification.metadata === 'object' && !Array.isArray(notification.metadata)
    ? notification.metadata
    : null

  return (
    <div
      className={`rounded-2xl border bg-white/90 p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-slate-900/70 ${severity.border}`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 items-start gap-3">
          <span className={`mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full ${severity.dot}`} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Icon className="h-3.5 w-3.5" />
                {typeLabels[notification.type] ?? 'Aviso'}
              </span>
              {notification.read ? (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  Lida
                </span>
              ) : (
                <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
                  Não lida
                </span>
              )}
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${severity.badge}`}>
                {notification.severity}
              </span>
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{notification.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Criada em {formatDateTime(notification.createdAt)}</span>
              {relativeTime ? <span>({relativeTime})</span> : null}
              {notification.readAt ? <span>Leitura em {formatDateTime(notification.readAt)}</span> : null}
            </div>
            {metadata ? (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100">
                  Ver detalhes
                </summary>
                <pre className="mt-2 overflow-auto rounded-lg bg-slate-950/5 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </details>
            ) : null}
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 md:w-auto md:flex-col md:items-stretch">
          {notification.read ? (
            <button
              type="button"
              onClick={() => onMarkUnread(notification)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Marcar como não lida
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onMarkRead(notification)}
              className="rounded-lg border border-violet-400 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-50 dark:border-violet-600 dark:text-violet-200 dark:hover:bg-violet-900/30"
            >
              Marcar como lida
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(notification)}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remover
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Notificacoes() {
  const demoMode = useMemo(() => localStorage.getItem('demoMode') === 'true', [])
  const [demoStore, setDemoStore] = useState(() => readDemoNotifications())
  const [filtro, setFiltro] = useState('unread')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState([])
  const [meta, setMeta] = useState({ total: 0, unreadCount: 0, totalPages: 1, page: 1, perPage })

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (demoMode) {
        const all = demoStore
        const unreadCount = all.filter((item) => !item.readAt).length
        const base = filtro === 'unread' ? all.filter((item) => !item.readAt) : filtro === 'read' ? all.filter((item) => item.readAt) : all
        const total = base.length
        const totalPages = Math.max(Math.ceil(total / perPage), 1)
        const currentPage = Math.min(page, totalPages)
        const start = (currentPage - 1) * perPage
        const sliced = base.slice(start, start + perPage).map((item) => ({ ...item, read: Boolean(item.readAt) }))
        setNotifications(sliced)
        setMeta({ total, unreadCount, totalPages, page: currentPage, perPage })
        if (currentPage !== page) {
          setPage(currentPage)
        }
      } else {
        const params = { status: filtro }
        if (page) params.page = page
        params.perPage = perPage
        const { data } = await api.notifications.listar(params)
        setNotifications((data?.notifications ?? []).map((item) => ({
          ...item,
          read: typeof item.read === 'boolean' ? item.read : Boolean(item.readAt),
        })))
        const metaPayload = data?.meta ?? {}
        setMeta({
          total: metaPayload.total ?? 0,
          unreadCount: metaPayload.unreadCount ?? 0,
          totalPages: metaPayload.totalPages ?? 1,
          page: metaPayload.page ?? page,
          perPage: metaPayload.perPage ?? perPage,
        })
      }
    } catch (err) {
      const message = err?.response?.data?.error || 'Não foi possível carregar as notificações.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [demoMode, demoStore, filtro, page, perPage])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    setPage(1)
  }, [filtro])

  useEffect(() => {
    if (!demoMode || typeof window === 'undefined') return
    try {
      localStorage.setItem('mm_demo_notifications', JSON.stringify(demoStore))
      announceRefresh()
    } catch (error) {
      console.warn('Falha ao persistir notificações demo:', error)
    }
  }, [demoMode, demoStore])

  const handleRefresh = () => {
    fetchNotifications()
  }

  const handleMarkAll = async () => {
    try {
      if (demoMode) {
        const now = new Date().toISOString()
        setDemoStore((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? now })))
        return
      }
      await api.notifications.marcarTodasComoLidas()
      await fetchNotifications()
      announceRefresh()
    } catch (err) {
      const message = err?.response?.data?.error || 'Não foi possível marcar todas como lidas.'
      setError(message)
    }
  }

  const handleMarkRead = async (notification) => {
    try {
      if (demoMode) {
        const now = new Date().toISOString()
        setDemoStore((current) => current.map((item) => (item.id === notification.id ? { ...item, readAt: now } : item)))
        return
      }
      await api.notifications.marcarComoLida(notification.id)
      await fetchNotifications()
      announceRefresh()
    } catch (err) {
      const message = err?.response?.data?.error || 'Não foi possível marcar como lida.'
      setError(message)
    }
  }

  const handleMarkUnread = async (notification) => {
    try {
      if (demoMode) {
        setDemoStore((current) => current.map((item) => (item.id === notification.id ? { ...item, readAt: null } : item)))
        return
      }
      await api.notifications.marcarComoNaoLida(notification.id)
      await fetchNotifications()
      announceRefresh()
    } catch (err) {
      const message = err?.response?.data?.error || 'Não foi possível marcar como não lida.'
      setError(message)
    }
  }

  const handleRemove = async (notification) => {
    try {
      if (demoMode) {
        setDemoStore((current) => current.filter((item) => item.id !== notification.id))
        return
      }
      await api.notifications.remover(notification.id)
      await fetchNotifications()
      announceRefresh()
    } catch (err) {
      const message = err?.response?.data?.error || 'Não foi possível remover a notificação.'
      setError(message)
    }
  }

  const showEmpty = !loading && notifications.length === 0
  const canGoBack = meta.page > 1
  const canGoForward = meta.page < meta.totalPages

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Notificações</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Acompanhe alertas automáticos e mensagens importantes do MoneyMapp.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCcw className="h-4 w-4" /> Atualizar
          </Button>
          <Button variant="primary" size="sm" onClick={handleMarkAll} disabled={loading || meta.unreadCount === 0}>
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const active = filtro === item.value
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFiltro(item.value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? 'border-violet-500 bg-violet-500 text-white shadow'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {item.label}
              {item.value === 'unread' && meta.unreadCount ? (
                <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/90 px-2 text-xs font-semibold text-violet-600 dark:bg-violet-900/30 dark:text-violet-100">
                  {meta.unreadCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <SkeletonList items={4} />
      ) : showEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
          <Bell className="h-10 w-10 text-slate-400" />
          <div>
            <p className="text-base font-medium text-slate-700 dark:text-slate-200">Tudo em ordem por aqui!</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Nenhuma notificação {filtro === 'read' ? 'lida' : filtro === 'unread' ? 'não lida' : 'registrada' } no momento.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificacaoCard
              key={notification.id}
              notification={{ ...notification, read: Boolean(notification.read ?? notification.readAt) }}
              onMarkRead={handleMarkRead}
              onMarkUnread={handleMarkUnread}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {!showEmpty ? (
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 md:flex-row">
          <div>
            Página {meta.page} de {meta.totalPages} • {meta.total} notificações
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => canGoBack && setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!canGoBack || loading}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => canGoForward && setPage((prev) => prev + 1)}
              disabled={!canGoForward || loading}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
            >
              Próxima
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
