import React from 'react'

export default function Tabela({ colunas = [], dados = [], onEditar, onExcluir }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-100 text-gray-700">
            {colunas.map((c) => (
              <th key={c.acesso} className="px-3 py-2 font-medium">{c.titulo}</th>
            ))}
            {(onEditar || onExcluir) && <th className="px-3 py-2 font-medium">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {dados.length === 0 && (
            <tr>
              <td className="px-3 py-3 text-gray-500" colSpan={colunas.length + 1}>Nenhum registro encontrado.</td>
            </tr>
          )}
          {dados.map((linha) => (
            <tr key={linha.id} className="border-b last:border-0">
              {colunas.map((c) => (
                <td key={c.acesso} className="px-3 py-2">
                  {c.render ? c.render(linha) : linha[c.acesso]}
                </td>
              ))}
              {(onEditar || onExcluir) && (
                <td className="px-3 py-2 space-x-2">
                  {onEditar && <button className="text-blue-600 hover:underline" onClick={() => onEditar(linha)}>Editar</button>}
                  {onExcluir && <button className="text-red-600 hover:underline" onClick={() => onExcluir(linha)}>Excluir</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
