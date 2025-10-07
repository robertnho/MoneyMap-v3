import React from 'react'

export default function Input({ rotulo, erro, tipo = 'text', placeholder, valor, onChange, ...props }) {
  return (
    <div className="w-full">
      {rotulo && <label className="block text-sm mb-1 text-gray-700">{rotulo}</label>}
      <input
        type={tipo}
        className={`w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 ${erro ? 'border-red-400' : 'border-gray-300'}`}
        placeholder={placeholder}
        value={valor}
        onChange={onChange}
        {...props}
      />
      {erro && <div className="text-xs text-red-600 mt-1">{erro}</div>}
    </div>
  )
}
