import React from 'react'
import Botao from './Botao'

export default function Modal({ aberto, titulo, children, textoConfirmar = 'Salvar', onFechar, onConfirmar, carregando }) {
  if (!aberto) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onFechar} />
      <div className="relative z-10 bg-white rounded shadow-xl w-full max-w-md mx-4">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold">{titulo}</h3>
        </div>
        <div className="px-4 py-3">
          {children}
        </div>
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <Botao variante="ghost" onClick={onFechar}>Cancelar</Botao>
          <Botao onClick={onConfirmar} carregando={carregando}>{textoConfirmar}</Botao>
        </div>
      </div>
    </div>
  )
}
