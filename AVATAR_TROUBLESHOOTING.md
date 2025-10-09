# Troubleshooting Essencial

Todas as análises detalhadas de falhas e as instruções de diagnóstico estão consolidadas na seção “🛠️ Troubleshooting Essencial” de `AVATAR_SYSTEM_README.md`.

Use este arquivo como um atalho rápido.

---

## 🧭 Navegue direto ao ponto

- [Problemas mais comuns e soluções](./AVATAR_SYSTEM_README.md#-troubleshooting-essencial)
- [Snippets de debug para o console](./AVATAR_SYSTEM_README.md#ferramentas-de-debug-rápido)
- [Checklist de testes manuais](./AVATAR_SYSTEM_README.md#-testes-manuais-recomendados)

---

## ⚠️ Antes de abrir um bug

1. Confirme que `<AvatarProvider>` está ativo e que o componente que usa `useAvatar()` está dentro dele.
2. Verifique se `localStorage` está habilitado e com espaço disponível.
3. Reproduza o cenário em outra guia/navegador e anote mensagens do console.

Esses passos já cobrem a maioria dos chamados. Em caso de dúvida, consulte o guia unificado e siga o checklist completo.

---

**Atualizado em:** 9 de outubro de 2025
