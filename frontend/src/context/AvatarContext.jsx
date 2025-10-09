import { createContext, useContext, useState, useEffect } from 'react';

const AvatarContext = createContext();

// Chaves para localStorage
const STORAGE_KEYS = {
  CUSTOM: 'mm_avatar_custom',
  COLOR: 'mm_avatar_color'
};

// Cor padrão inicial
const DEFAULT_COLOR = '#0ea5e9';

export function AvatarProvider({ children }) {
  // Estado para a foto customizada (Data URL)
  const [customDataUrl, setCustomDataUrlState] = useState(null);
  
  // Estado para a cor do avatar padrão
  const [color, setColorState] = useState(DEFAULT_COLOR);
  
  // Estado para controlar se já carregou do localStorage
  const [loaded, setLoaded] = useState(false);

  // Carregar do localStorage ao montar o componente
  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM);
      const savedColor = localStorage.getItem(STORAGE_KEYS.COLOR);
      
      if (savedCustom) {
        setCustomDataUrlState(savedCustom);
      }
      
      if (savedColor) {
        setColorState(savedColor);
      }
    } catch (error) {
      console.error('Erro ao carregar avatar do localStorage:', error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Função para atualizar a foto customizada
  const setCustomDataUrl = (dataUrl) => {
    try {
      if (dataUrl) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM, dataUrl);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM);
      }
      setCustomDataUrlState(dataUrl);
    } catch (error) {
      console.error('Erro ao salvar foto customizada:', error);
      throw new Error('Não foi possível salvar a foto. A imagem pode ser muito grande.');
    }
  };

  // Função para remover a foto customizada
  const clearCustom = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM);
      setCustomDataUrlState(null);
    } catch (error) {
      console.error('Erro ao remover foto customizada:', error);
    }
  };

  // Função para atualizar a cor do avatar padrão
  const setColor = (newColor) => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLOR, newColor);
      setColorState(newColor);
    } catch (error) {
      console.error('Erro ao salvar cor do avatar:', error);
    }
  };

  const value = {
    customDataUrl,
    setCustomDataUrl,
    clearCustom,
    color,
    setColor,
    loaded
  };

  return (
    <AvatarContext.Provider value={value}>
      {children}
    </AvatarContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAvatar() {
  const context = useContext(AvatarContext);
  
  if (!context) {
    throw new Error('useAvatar deve ser usado dentro de um AvatarProvider');
  }
  
  return context;
}
