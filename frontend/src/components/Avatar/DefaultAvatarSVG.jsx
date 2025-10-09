/**
 * DefaultAvatarSVG - Avatar padrão em SVG
 * 
 * Renderiza um ícone de usuário simples com cor personalizável.
 * Usa currentColor para herdar a cor do elemento pai.
 */
export default function DefaultAvatarSVG({ color = '#0ea5e9', className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
      aria-label="Avatar padrão"
    >
      {/* Círculo de fundo */}
      <circle cx="50" cy="50" r="50" fill="currentColor" opacity="0.1" />
      
      {/* Cabeça */}
      <circle cx="50" cy="35" r="18" fill="currentColor" opacity="0.8" />
      
      {/* Corpo/Tronco */}
      <path
        d="M 20 85 Q 20 60, 50 60 Q 80 60, 80 85 L 80 100 L 20 100 Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}
