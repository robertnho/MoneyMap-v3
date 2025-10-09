import { useAvatar } from '../../context/AvatarContext';
import DefaultAvatarSVG from './DefaultAvatarSVG';

/**
 * AvatarImage - Componente que exibe o avatar do usuário
 * 
 * Se houver uma foto customizada, exibe a foto.
 * Caso contrário, exibe o avatar padrão SVG com a cor escolhida.
 * 
 * @param {number} size - Tamanho do avatar em pixels (padrão: 40)
 * @param {string} className - Classes Tailwind adicionais
 */
export default function AvatarImage({ size = 40, className = '' }) {
  const { customDataUrl, color, loaded } = useAvatar();

  // Aguarda o carregamento inicial do localStorage
  if (!loaded) {
    return (
      <div
        className={`rounded-full bg-gray-200 animate-pulse ${className}`}
        style={{ width: size, height: size }}
        aria-label="Carregando avatar"
      />
    );
  }

  // Se houver foto customizada, renderiza a imagem
  if (customDataUrl) {
    return (
      <img
        src={customDataUrl}
        alt="Foto de perfil"
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Caso contrário, renderiza o avatar padrão SVG
  return (
    <div
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <DefaultAvatarSVG color={color} className="w-full h-full" />
    </div>
  );
}
