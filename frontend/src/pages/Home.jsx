import React from "react"
import { useNavigate } from "react-router-dom"
import { PiggyBank } from "lucide-react"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <header style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #3b82f6, #9333ea)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <PiggyBank color="white" size={24} />
              </div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>MoneyMapp</h1>
            </div>
            <button 
              onClick={() => navigate("/login")}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Fazer Login
            </button>
          </div>
        </header>

        <main style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 20px' }}>
            MoneyMapp TCC
          </h2>
          <p style={{ fontSize: '24px', color: '#6b7280', margin: '0 0 30px' }}>
            A plataforma de educação financeira que transforma sua vida
          </p>
          <p style={{ fontSize: '18px', color: '#6b7280', margin: '0 0 40px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Controle suas finanças, defina metas e aprenda a investir com uma experiência 
            simples, moderna e intuitiva.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate("/login")}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Fazer Login
            </button>
            <button 
              onClick={() => navigate("/registrar")}
              style={{
                background: 'transparent',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Criar Conta
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
