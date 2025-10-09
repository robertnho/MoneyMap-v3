import { useState, useRef } from 'react';
import { useAvatar } from '../../context/AvatarContext';
import AvatarImage from './AvatarImage';

/**
 * AvatarPicker - Componente para gerenciar o avatar do usuário
 * 
 * Permite:
 * - Enviar uma foto customizada (redimensionada para max 512px)
 * - Remover a foto customizada
 * - Escolher a cor do avatar padrão (quando não há foto)
 */
export default function AvatarPicker() {
  const { customDataUrl, setCustomDataUrl, clearCustom, color, setColor } = useAvatar();
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Cores sugeridas para o avatar padrão
  const suggestedColors = [
    '#0ea5e9', // sky-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#ef4444', // red-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
  ];

  /**
   * Redimensiona uma imagem para um Data URL
   * @param {File} file - Arquivo de imagem
   * @param {number} maxSize - Tamanho máximo do lado maior em pixels
   * @returns {Promise<string>} Data URL da imagem redimensionada
   */
  const resizeImage = (file, maxSize = 512) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Calcular novas dimensões mantendo aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          // Criar canvas e redimensionar
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Determinar formato e qualidade
          const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
          const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
          const quality = isJpeg ? 0.85 : 1.0;
          
          // Converter para Data URL
          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve(dataUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Não foi possível processar a imagem.'));
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        reject(new Error('Não foi possível ler o arquivo.'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  /**
   * Manipula o upload de uma nova foto
   */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Limpar erro anterior
    setError('');
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Escolha um arquivo de imagem.');
      return;
    }
    
    // Validar tamanho (máx 10MB antes do redimensionamento)
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem é muito grande. Escolha uma imagem menor que 10MB.');
      return;
    }
    
    try {
      setUploading(true);
      
      // Redimensionar e converter para Data URL
      const dataUrl = await resizeImage(file, 512);
      
      // Salvar no contexto (e localStorage)
      setCustomDataUrl(dataUrl);
      
      // Limpar o input para permitir reenvio do mesmo arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setError(err.message || 'Erro ao processar a imagem. Tente outra foto.');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Remove a foto customizada
   */
  const handleRemovePhoto = () => {
    clearCustom();
    setError('');
    
    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Abre o seletor de arquivos
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Atualiza a cor do avatar padrão
   */
  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Preview do avatar */}
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <AvatarImage 
            size={120} 
            className="ring-2 ring-gray-200 dark:ring-gray-700 shadow-lg" 
          />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            {/* Botão de enviar foto */}
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                       shadow-sm hover:shadow transition disabled:opacity-50 
                       disabled:cursor-not-allowed font-medium text-sm"
            >
              {uploading ? 'Enviando...' : customDataUrl ? 'Alterar foto' : 'Enviar foto'}
            </button>
            
            {/* Botão de remover foto (apenas quando há foto customizada) */}
            {customDataUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-600 
                         bg-white dark:bg-gray-800 text-red-600 dark:text-red-400
                         shadow-sm hover:shadow transition font-medium text-sm"
              >
                Remover foto
              </button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Envie uma imagem do seu dispositivo. A foto será redimensionada automaticamente.
          </p>
          
          {/* Mensagem de erro */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
      
      {/* Input oculto para upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Selecionar foto de perfil"
      />
      
      {/* Seletor de cor do avatar padrão */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="avatar-color" 
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Cor do avatar padrão
          </label>
          
          {customDataUrl && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              A cor só afeta o avatar padrão.
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Input de cor nativo */}
          <input
            id="avatar-color"
            type="color"
            value={color}
            onChange={handleColorChange}
            disabled={!!customDataUrl}
            className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                     cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title={customDataUrl ? 'Remova a foto para alterar a cor' : 'Escolher cor do avatar'}
          />
          
          {/* Cores sugeridas */}
          <div className="flex gap-2 flex-wrap">
            {suggestedColors.map((suggestedColor) => (
              <button
                key={suggestedColor}
                type="button"
                onClick={() => !customDataUrl && setColor(suggestedColor)}
                disabled={!!customDataUrl}
                className={`w-8 h-8 rounded-lg border-2 transition
                  ${color === suggestedColor 
                    ? 'border-gray-900 dark:border-white scale-110' 
                    : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }
                  ${customDataUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{ backgroundColor: suggestedColor }}
                title={customDataUrl ? 'Remova a foto para alterar a cor' : `Usar cor ${suggestedColor}`}
                aria-label={`Cor ${suggestedColor}`}
              />
            ))}
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {customDataUrl 
            ? 'Remova a foto customizada para alterar a cor do avatar padrão.'
            : 'Escolha uma cor para personalizar seu avatar padrão.'
          }
        </p>
      </div>
    </div>
  );
}
