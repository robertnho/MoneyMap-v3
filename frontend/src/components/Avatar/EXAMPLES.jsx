/**
 * EXEMPLOS DE USO - Sistema de Avatar
 * 
 * Este arquivo demonstra como usar os componentes do sistema de avatar
 * em diferentes contextos da aplicação.
 */

// ============================================
// EXEMPLO 1: Usar o avatar em qualquer lugar
// ============================================

import AvatarImage from './components/Avatar/AvatarImage'

function MeuComponente() {
  return (
    <div>
      {/* Avatar pequeno (padrão 40px) */}
      <AvatarImage />
      
      {/* Avatar médio */}
      <AvatarImage size={64} />
      
      {/* Avatar grande com classes customizadas */}
      <AvatarImage 
        size={120} 
        className="ring-4 ring-blue-500 shadow-xl" 
      />
    </div>
  )
}

// ============================================
// EXEMPLO 2: Gerenciar avatar em configurações
// ============================================

import AvatarPicker from './components/Avatar/AvatarPicker'

function MinhasPagina() {
  return (
    <div>
      <h1>Meu Perfil</h1>
      
      {/* Componente completo de gerenciamento */}
      <AvatarPicker />
    </div>
  )
}

// ============================================
// EXEMPLO 3: Usar o contexto diretamente
// ============================================

import { useAvatar } from './context/AvatarContext'

function ComponenteCustomizado() {
  const { customDataUrl, color, setColor, clearCustom } = useAvatar()
  
  return (
    <div>
      {/* Verificar se tem foto customizada */}
      {customDataUrl ? (
        <div>
          <img src={customDataUrl} alt="Avatar" />
          <button onClick={clearCustom}>Remover</button>
        </div>
      ) : (
        <div>
          <p>Cor atual: {color}</p>
          <button onClick={() => setColor('#ff0000')}>
            Mudar para vermelho
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================
// EXEMPLO 4: Avatar padrão standalone
// ============================================

import DefaultAvatarSVG from './components/Avatar/DefaultAvatarSVG'

function AvatarPreview() {
  return (
    <div className="w-24 h-24">
      {/* SVG com cor customizada */}
      <DefaultAvatarSVG 
        color="#8b5cf6" 
        className="w-full h-full" 
      />
    </div>
  )
}

// ============================================
// EXEMPLO 5: Dropdown de perfil
// ============================================

import { useState } from 'react'
import AvatarImage from './components/Avatar/AvatarImage'

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      {/* Avatar clicável */}
      <button onClick={() => setIsOpen(!isOpen)}>
        <AvatarImage 
          size={40} 
          className="ring-2 ring-gray-200 hover:ring-emerald-500 transition cursor-pointer" 
        />
      </button>
      
      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
          <a href="/perfil" className="block px-4 py-2 hover:bg-gray-50">
            Meu Perfil
          </a>
          <a href="/configuracoes" className="block px-4 py-2 hover:bg-gray-50">
            Configurações
          </a>
        </div>
      )}
    </div>
  )
}

// ============================================
// EXEMPLO 6: Lista de usuários com avatares
// ============================================

function UserList({ users }) {
  return (
    <div className="space-y-2">
      {users.map(user => (
        <div key={user.id} className="flex items-center gap-3">
          {/* Cada usuário teria seu próprio avatar */}
          {/* No futuro, você pode criar um componente UserAvatar */}
          {/* que busca do servidor baseado no user.id */}
          <AvatarImage size={48} />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// EXEMPLO 7: Card de perfil
// ============================================

import { useAuth } from './context/AuthContext'
import AvatarImage from './components/Avatar/AvatarImage'

function ProfileCard() {
  const { usuario } = useAuth()
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center">
        {/* Avatar grande */}
        <AvatarImage 
          size={120} 
          className="ring-4 ring-emerald-100 shadow-lg mb-4" 
        />
        
        <h2 className="text-xl font-bold">{usuario?.name}</h2>
        <p className="text-gray-500">{usuario?.email}</p>
        
        <button className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg">
          Editar Perfil
        </button>
      </div>
    </div>
  )
}

// ============================================
// EXEMPLO 8: Comentário com avatar
// ============================================

function Comment({ author, text, timestamp }) {
  return (
    <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
      <AvatarImage 
        size={40} 
        className="ring-1 ring-gray-200 flex-shrink-0" 
      />
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{author}</span>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        <p className="text-gray-700">{text}</p>
      </div>
    </div>
  )
}

// ============================================
// EXEMPLO 9: Integração com formulário
// ============================================

function ProfileForm() {
  const { usuario } = useAuth()
  const { customDataUrl } = useAvatar()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Você pode enviar o avatar junto com outros dados
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      avatar: customDataUrl, // Data URL ou null
    }
    
    // await api.post('/profile', formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <AvatarPicker />
      
      <input name="name" defaultValue={usuario?.name} />
      <input name="email" defaultValue={usuario?.email} />
      
      <button type="submit">Salvar</button>
    </form>
  )
}

// ============================================
// EXEMPLO 10: Verificar se avatar foi carregado
// ============================================

import { useAvatar } from './context/AvatarContext'

function MyComponent() {
  const { loaded, customDataUrl, color } = useAvatar()
  
  // Esperar o carregamento inicial
  if (!loaded) {
    return <div>Carregando...</div>
  }
  
  // Agora você tem certeza que os dados foram carregados do localStorage
  return (
    <div>
      {customDataUrl ? (
        <p>Usuário tem foto customizada</p>
      ) : (
        <p>Usando avatar padrão com cor {color}</p>
      )}
    </div>
  )
}

export {
  MeuComponente,
  MinhasPagina,
  ComponenteCustomizado,
  AvatarPreview,
  ProfileDropdown,
  UserList,
  ProfileCard,
  Comment,
  ProfileForm,
  MyComponent
}
