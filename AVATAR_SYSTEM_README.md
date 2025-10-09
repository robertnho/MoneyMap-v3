# Sistema de Avatar — Guia Unificado (MoneyMap-v3)

Este documento reúne toda a documentação do sistema de avatar do MoneyMap-v3 em um único lugar. Ele substitui os arquivos `AVATAR_SUMMARY.md`, `AVATAR_INDEX.md`, `AVATAR_CUSTOMIZATION.md` e `AVATAR_TROUBLESHOOTING.md`, que agora funcionam apenas como atalhos para seções específicas deste guia.

---

## 🚀 Visão Geral

O sistema de avatar do MoneyMap-v3 oferece uma experiência completa de personalização para o usuário final, mantendo a implementação totalmente no frontend:

- Upload de foto local com redimensionamento automático (máx. 512px e limite de 10MB).
- Persistência via `localStorage` (`mm_avatar_custom` e `mm_avatar_color`).
- Avatar padrão em SVG com paleta de cores personalizável.
- Botões de reset e feedback visual durante todo o fluxo.
- Interface acessível e compatível com dark mode.

### Foto rápida do ecossistema

| Componente | Localização | Descrição |
|------------|-------------|-----------|
| `AvatarContext.jsx` | `frontend/src/context/AvatarContext.jsx` | Provider/Hooks para controlar imagem e cor, sincronizando com `localStorage`. |
| `AvatarImage.jsx` | `frontend/src/components/Avatar/AvatarImage.jsx` | Decide entre foto customizada (`<img>`) ou SVG padrão. |
| `DefaultAvatarSVG.jsx` | `frontend/src/components/Avatar/DefaultAvatarSVG.jsx` | SVG leve que usa `currentColor`; mantém estilo consistente com Tailwind. |
| `AvatarPicker.jsx` | `frontend/src/components/Avatar/AvatarPicker.jsx` | UI completa para upload, remoção e escolha de cor. |
| `EXAMPLES.jsx` | `frontend/src/components/Avatar/EXAMPLES.jsx` | Snippets prontos para uso em componentes e páginas. |
| `TESTS.jsx` | `frontend/src/components/Avatar/TESTS.jsx` | Checklist de testes manuais para QA. |

Integrações recomendadas (ainda não aplicadas nos sources padrão):

- `frontend/src/main.jsx`: envolver `<App />` com `<AvatarProvider>`.
- `frontend/src/components/Navbar.jsx`: importar `AvatarImage` para substituir o círculo com iniciais.
- `frontend/src/pages/Configuracoes.jsx`: renderizar `AvatarPicker` na seção “Perfil”.

Integrações principais:

- `frontend/src/main.jsx`: envolve a aplicação com `<AvatarProvider>`.
- `frontend/src/components/Navbar.jsx`: exibe o avatar compacto (36px).
- `frontend/src/pages/Configuracoes.jsx`: disponibiliza o `AvatarPicker` ao usuário.

---

## 🧭 Fluxo em Alto Nível

1. **Bootstrap** — `AvatarProvider` carrega `mm_avatar_custom` e `mm_avatar_color` do `localStorage` e expõe via `useAvatar()`.
2. **Visualização** — `AvatarImage` usa os dados do contexto para renderizar foto (quando existe) ou o SVG padrão colorido.
3. **Personalização** — `AvatarPicker` permite enviar foto, limpar estado ou alterar a cor do SVG.
4. **Persistência** — qualquer mudança é salva no contexto **e** no `localStorage`, garantindo recuperação instantânea após refresh.

Edge cases já tratados:

- Validação de tipo (`image/*`).
- Limite de 10MB antes do resize.
- Tratamento de erros no `FileReader`/Canvas.
- Reset de inputs e mensagens de erro amigáveis.

---

## ▶️ Como Usar no Projeto

1. Em `frontend/src/main.jsx`, importe o provider e envolva a aplicação:
  ```jsx
  import { AvatarProvider } from './context/AvatarContext.jsx';

  <AvatarProvider>
    <App />
  </AvatarProvider>
  ```
2. Em componentes dentro de `frontend/src/components/`, importe e use `AvatarImage`:
  ```jsx
  import AvatarImage from './Avatar/AvatarImage.jsx';

  <AvatarImage size={36} className="ring-2 ring-emerald-500" />
  ```
3. Em páginas como `frontend/src/pages/Configuracoes.jsx`, exponha o `AvatarPicker`:
  ```jsx
  import AvatarPicker from '../components/Avatar/AvatarPicker.jsx';

  <AvatarPicker />
  ```
4. Rode o frontend para experimentar (`npm run dev` dentro de `frontend/`).

### Checklist de smoke test (manual)

- [ ] Primeiro acesso mostra o SVG padrão em azul (`#0ea5e9`).
- [ ] Alterar a cor atualiza imediatamente o avatar (Navbar + Configurações) e persiste após refresh.
- [ ] Upload de imagem redimensiona, substitui o avatar e desabilita o seletor de cor.
- [ ] Remover foto restaura o SVG mantendo a última cor escolhida.
- [ ] Upload de arquivo inválido exibe mensagem “Escolha um arquivo de imagem.”

---

## 🎨 Customização Guiada

As modificações abaixo são opcionais e respeitam a estrutura atual do projeto.

### Alterar cor padrão

Arquivo: `frontend/src/context/AvatarContext.jsx`

```jsx
const DEFAULT_COLOR = '#0ea5e9';
// Ex.: alterar para '#8b5cf6' (violet-500)
```

### Expandir paleta sugerida

Arquivo: `frontend/src/components/Avatar/AvatarPicker.jsx`

```jsx
const suggestedColors = [
  '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#ef4444', '#6366f1', '#14b8a6',
  '#f97316', '#84cc16', '#06b6d4', '#a855f7',
];
```

### Ajustar tamanho/qualidade do resize

No mesmo arquivo (`AvatarPicker.jsx`):

```jsx
const dataUrl = await resizeImage(file, 256); // reduz tamanho final
const quality = isJpeg ? 0.7 : 1.0;          // comprime mais o JPEG
```

### Trocar o SVG padrão

Arquivo: `frontend/src/components/Avatar/DefaultAvatarSVG.jsx`

Substitua o conteúdo do componente por outro layout (iniciais, gradiente, etc.) mantendo a prop `color` aplicada — isso garante integração com o contexto.

### Criar novas variações de avatar

Sugestão de novo componente:

```jsx
// frontend/src/components/Avatar/AvatarWithStatus.jsx
import AvatarImage from './AvatarImage';

export default function AvatarWithStatus({ status = 'online', ...rest }) {
  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
  };

  return (
    <div className="relative inline-block">
      <AvatarImage {...rest} />
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[status]}`}
        aria-label={`Status: ${status}`}
      />
    </div>
  );
}
```

---

## 🛠️ Troubleshooting Essencial

| Sintoma | Causa Provável | Solução |
|---------|----------------|---------|
| Avatar não renderiza | `AvatarProvider` ausente ou `useAvatar()` fora do provider | Verifique `frontend/src/main.jsx` e garanta `<AvatarProvider>` envolvendo a árvore. |
| Foto some após refresh | `localStorage` bloqueado, quota estourada ou chave incorreta | Teste `localStorage` no console, limpe dados antigos e confira o uso de `mm_avatar_custom`. |
| Erro “Escolha um arquivo de imagem” em fotos válidas | MIME type incorreto | Acrescente validação por extensão no `AvatarPicker` ou converta o arquivo. |
| Upload lento | Imagem original muito grande | Reduza `maxSize`/`quality` no `resizeImage()` e informe o usuário sobre limites. |
| Avatar some no dark mode | Classes sem variante `dark:` | Garanta que os elementos principais tenham `dark:ring-gray-700`, `dark:text-…`, etc. |

### Ferramentas de debug rápido

```js
// Console do navegador
localStorage.getItem('mm_avatar_custom');
localStorage.getItem('mm_avatar_color');

localStorage.removeItem('mm_avatar_custom'); // reset manual
localStorage.removeItem('mm_avatar_color');
```

Para medir uso de armazenamento:

```js
(function localStorageSizeKB() {
  let total = 0;
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      total += (localStorage[key].length + key.length);
    }
  }
  return `${(total / 1024).toFixed(2)} KB`;
})();
```

---

## 📋 Testes Manuais Recomendados

1. **Primeiro acesso** — limpar `localStorage`, abrir o app e confirmar avatar padrão.
2. **Alteração de cor** — usar paleta sugerida e o color picker nativo.
3. **Upload** — testar JPEG, PNG e WebP; validar mensagem de erro com arquivo `.txt`.
4. **Persistência** — recarregar o navegador após alterações.
5. **Remoção** — confirmar retorno ao SVG e reabilitação do seletor de cor.
6. **Acessibilidade** — navegar apenas com teclado no `AvatarPicker` e verificar `alt`/`aria-label` nos elementos.

`frontend/src/components/Avatar/TESTS.jsx` traz um roteiro detalhado (12 cenários) para QA.

---

## 🔮 Roadmap Opcional

| Feature | Benefício | Ponto de partida |
|---------|-----------|-------------------|
| Crop de imagem (`react-easy-crop`) | Controle fino sobre enquadramento | Novo componente `ImageCropper.jsx` e integração antes de `setCustomDataUrl`. |
| Drag & Drop | UX aprimorada | Eventos `onDragOver`, `onDrop` no container principal do `AvatarPicker`. |
| Upload para backend | Sincronização entre dispositivos | Criar endpoint `/user/avatar`, enviar `dataUrl` via `api.post`, guardar URL retornada. |
| Presets ilustrados | Onboarding instantâneo | Componente `AvatarGallery.jsx` com ícones SVG em `public/avatars`. |
| Filtros CSS | Estilo rápido sem alterar imagem original | Aplicar classes como `filter grayscale` diretamente no `AvatarImage`. |

---

## 📎 Referências Cruzadas

- Documentação do projeto: `README.md`
- API frontend: `frontend/src/services/api.js`
- Contexto de tema (para integração futura com avatar): `frontend/src/contexts/ThemeContext.jsx`

---

**Última atualização:** 9 de outubro de 2025  
**Responsável:** Equipe MoneyMap-v3

Se encontrar lacunas ou tiver sugestões, abra uma issue ou PR no repositório.
