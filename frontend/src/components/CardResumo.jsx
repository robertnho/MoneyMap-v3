import React from 'react'

export default function CardResumo({ titulo, valor, subtexto, cor = 'emerald' }) {
  const corTexto = cor === 'red' ? 'text-red-600' : cor === 'blue' ? 'text-blue-600' : 'text-emerald-600'
  return (
    <div className="card p-4">
      <div className="text-sm text-gray-600">{titulo}</div>
      <div className={`text-2xl font-bold ${corTexto}`}>{valor}</div>
      {subtexto && <div className="text-xs text-gray-500 mt-1">{subtexto}</div>}
    </div>
  )
}
