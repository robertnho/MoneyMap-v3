# Guia Rápido de Customização

Todo o conteúdo detalhado de personalização agora mora em `AVATAR_SYSTEM_README.md`, seção “🎨 Customização Guiada”. Este arquivo resume os ajustes mais comuns e aponta para os blocos relevantes.

---

## 🔧 Ajustes Imediatos

| Quero… | Onde mexer | Referência |
|--------|------------|------------|
| Trocar a cor padrão do SVG | `frontend/src/context/AvatarContext.jsx` (`DEFAULT_COLOR`) | [Alterar cor padrão](./AVATAR_SYSTEM_README.md#alterar-cor-padrão) |
| Ampliar a paleta sugerida | `frontend/src/components/Avatar/AvatarPicker.jsx` (`suggestedColors`) | [Expandir paleta sugerida](./AVATAR_SYSTEM_README.md#expandir-paleta-sugerida) |
| Reduzir tamanho final da imagem | Função `resizeImage` em `AvatarPicker.jsx` | [Ajustar tamanho/qualidade do resize](./AVATAR_SYSTEM_README.md#ajustar-tamanhoqualidade-do-resize) |
| Mudar o SVG padrão | `DefaultAvatarSVG.jsx` | [Trocar o SVG padrão](./AVATAR_SYSTEM_README.md#trocar-o-svg-padrão) |
| Criar avatar com badge/status | Criar `AvatarWithStatus.jsx` | [Criar novas variações de avatar](./AVATAR_SYSTEM_README.md#criar-novas-variações-de-avatar) |

---

## 💡 Ideias Avançadas (opcionais)

- Crop de imagem com `react-easy-crop`.
- Drag & drop no `AvatarPicker`.
- Upload para backend e sincronização entre dispositivos.
- Galeria de avatares pré-definidos.
- Filtros CSS (grayscale, sepia, etc.).

Todos os passos e snippets para essas features estão na subseção “Roadmap Opcional” do guia unificado.

---

## 📝 Checklist antes de customizar

- Faça backup/commit antes de alterar `AvatarContext.jsx` e `AvatarPicker.jsx`.
- Mantenha o `localStorage` limpo para validar as mudanças.
- Após ajustes, rode o roteiro de testes básicos indicado no guia principal.

---

**Atualizado em:** 9 de outubro de 2025
