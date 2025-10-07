import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function GraficoBarra({ dados = [], chaveX = 'mes', chavesSeries = [{ key: 'receitas', nome: 'Receitas', cor: '#10b981' }, { key: 'despesas', nome: 'Despesas', cor: '#ef4444' }] }) {
  return (
    <div className="card p-4 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={chaveX} />
          <YAxis />
          <Tooltip />
          <Legend />
          {chavesSeries.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.nome} fill={s.cor} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
