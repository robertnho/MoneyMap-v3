# Índice do Sistema de Avatar (MoneyMap-v3)

Todo o conteúdo detalhado foi reunido em `AVATAR_SYSTEM_README.md`. Use este arquivo como um mapa para chegar rapidamente às seções certas.

---

## 🗂️ Seções e Links

| Tema | Link | Quando usar |
|------|------|-------------|
| Visão geral e principais componentes | [`Visão Geral`](./AVATAR_SYSTEM_README.md#-visão-geral) | Primeiro contato com o sistema de avatar. |
| Fluxo de dados fim a fim | [`Fluxo em Alto Nível`](./AVATAR_SYSTEM_README.md#-fluxo-em-alto-nível) | Entender como os estados circulam entre contexto, componentes e storage. |
| Guia de integração no app | [`Como Usar no Projeto`](./AVATAR_SYSTEM_README.md#%EF%B8%8F-como-usar-no-projeto) | Seguir o passo a passo para habilitar o avatar na UI. |
| Personalizações suportadas | [`Customização Guiada`](./AVATAR_SYSTEM_README.md#-customização-guiada) | Alterar cores, tamanho, SVG e criar novos wrappers. |
| Diagnóstico de erros | [`Troubleshooting Essencial`](./AVATAR_SYSTEM_README.md#%EF%B8%8F-troubleshooting-essencial) | Resolver problemas comuns e inspecionar o `localStorage`. |
| Testes manuais sugeridos | [`Testes Manuais Recomendados`](./AVATAR_SYSTEM_README.md#-testes-manuais-recomendados) | Validar o fluxo após integrar. |
| Roadmap de evolução | [`Roadmap Opcional`](./AVATAR_SYSTEM_README.md#-roadmap-opcional) | Ideias de melhorias futuras (crop, drag & drop, backend, etc.). |

---

## 📁 Arquivos relevantes no repositório

```
frontend/src/
├── context/
│   └── AvatarContext.jsx
└── components/
    └── Avatar/
        ├── AvatarImage.jsx
        ├── AvatarPicker.jsx
        ├── DefaultAvatarSVG.jsx
        ├── EXAMPLES.jsx
        └── TESTS.jsx
```

> **Dica:** abra `EXAMPLES.jsx` para copiar snippets prontos de uso e `TESTS.jsx` para seguir o roteiro de QA.

---

## ✅ Próximos passos recomendados

1. Execute as integrações descritas no guia unificado.
2. Revise a seção de customização antes de alterar estilos ou limites de upload.
3. Tenha a seção de troubleshooting por perto ao testar em navegadores diferentes.

---

**Atualizado em:** 9 de outubro de 2025
