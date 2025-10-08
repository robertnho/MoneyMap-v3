import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const moneyFmt = (v) => `R$ ${Number(v).toLocaleString('pt-BR')}`

export default function GraficoBarra({
  dados = [],
  chaveX = 'mes',
  chavesSeries = [
    { key: 'receitas', nome: 'Receitas', cor: '#10b981' },
    { key: 'despesas', nome: 'Despesas', cor: '#ef4444' },
  ],
}) {
  return (
    <div className="h-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={chaveX} />
          <YAxis />
          <Tooltip formatter={(v) => [moneyFmt(v), '']} />
          <Legend />
          {chavesSeries.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.nome} fill={s.cor} radius={[6,6,0,0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
