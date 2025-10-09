# MoneyMapp — Split Front/Back

Este pacote contém dois apps separados:

- `backend/` — API Node/Express/Prisma (porta 3000)
- `frontend/` — Vite/React/Tailwind (porta 5173)

## 1) Rodar o backend
```bash
cd backend
cp .env.example .env    # edite DATABASE_URL e JWT_SECRET
npm install
npm run prisma:generate
npm run db:push         # ou suas migrations
npm run dev             # http://localhost:3000
```

## 2) Rodar o frontend (dev)
```bash
cd frontend
cp .env.example .env    # VITE_API_URL -> URL do backend
npm install
npm run dev             # http://localhost:5173
```

> Em produção, você pode rodar `npm run build` no frontend e apontar
> `STATIC_DIR` no backend para a pasta `frontend/dist` para servir o SPA pela API.

## CORS
Backend já vem com `cors()` habilitado para aceitar chamadas do frontend dev.

## Documentação complementar
- [Guia unificado do sistema de avatar](./AVATAR_SYSTEM_README.md)
