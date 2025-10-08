import React from 'react'

export default function CardResumo({ titulo, valor, subtexto, cor = 'emerald' }) {
  const map = {
    red: 'text-rose-600',
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
  }
  const corTexto = map[cor] || map.emerald

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="text-sm text-gray-600">{titulo}</div>
      <div className={`mt-1 text-2xl font-bold ${corTexto}`}>{valor}</div>
      {subtexto && <div className="mt-1 text-xs text-gray-500">{subtexto}</div>}
    </div>
  )
}
