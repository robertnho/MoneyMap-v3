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

## Deploy no Render

1. Crie o banco MySQL (AlwaysData, PlanetScale, etc.) e capture a `DATABASE_URL` completa (`mysql://usuario:senha@host:3306/banco`).
2. Faça fork deste repositório ou conecte-o direto ao Render e confirme que o arquivo `render.yaml` esteja na raiz.
3. Ao criar o serviço web no Render escolha **Use render.yaml**, selecione a branch `main` e confirme o plano desejado.
4. Defina as variáveis de ambiente marcadas com `sync: false` no Render (consulte `backend/.env.example` para referência). O Render preencherá automaticamente `PORT`.
5. Durante o deploy o Render executará `npm ci`, `npm run prisma:generate` e `npx prisma migrate deploy` dentro do *Build Command*. O *Start Command* apenas chama `npm run start`, então o app sobe imediatamente e aplica as migrations durante o build. Após a primeira subida, rode um *Manual Deploy* com o comando `npm run seed` (Deploys → Manual Deploy → Custom Command) caso queira os dados de demonstração.

> O healthcheck padrão do serviço aponta para `/health`. Se desejar habilitar logs de corpo de requisições em produção, ajuste `LOG_BODY` para `true` (não recomendado em ambientes públicos).

### Endpoints de saúde

- `GET /health` — liveness simples (não acessa o banco) para aponte no Render.
- `GET /readyz` — readiness que valida a conexão com o banco; retorna **200** quando o MySQL responde e **503** caso contrário.

## CORS
Backend já vem com `cors()` habilitado para aceitar chamadas do frontend dev.

## Importação de CSV
- Endpoint protegido `POST /transacoes/import` aceita `multipart/form-data` com o arquivo em `file` (máximo 1000 linhas) e campos opcionais `accountId`, `status`, `defaultTipo` (`auto`/`receita`/`despesa`) e `defaultCategoria`.
- O serviço tenta identificar automaticamente descrição, valor, data, tipo, categoria, status, conta e observação a partir do cabeçalho (aceita vírgula, ponto e vírgula ou tab como separador).
- Caso uma linha não possa ser importada, ela é listada no array `errors`; linhas com ajustes de sinal, contas desconhecidas ou outras correções aparecem em `warnings`.
- A resposta retorna contadores `processed`, `imported`, `ignored`, `duplicates` e `adjustedSigns` para facilitar o acompanhamento.

## Transações recorrentes
- Modelo `RecurringTransaction` controla lançamentos automáticos com frequência diária, semanal, mensal ou anual, incluindo intervalo, data inicial/final, limite de execuções e ajuste opcional de dia.
- Endpoints REST sob `/transacoes/recorrentes` permitem listar, criar, atualizar, desativar, executar individualmente (`/:id/executar`) ou processar todas as recorrências vencidas (`/processar`).
- O frontend oferece gerenciamento completo na tela de transações: cadastro/edição via modal, resumo dos agendamentos, execução manual e gatilho para processar pendências.

## Notificações
- Nova tabela `Notification` guarda alertas com tipo (`system`, `transaction`, `recurring`, `budget`, `goal`, `reminder`), severidade (`info`, `success`, `warning`, `error`), metadata JSON opcional e controles de leitura.
- Endpoints autenticados em `/notifications` permitem listar com filtros de leitura, criar avisos manuais, marcar todas como lidas e alternar o status individual (`/mark-all-read`, `/:id/read`, `/:id/unread`).
- A execução de recorrências gera notificações automáticas com resumo de lançamentos, próxima data agendada e metadados dos lançamentos criados.
- O frontend conta com página dedicada em **Notificações** para ler, filtrar, marcar como lidas/não lidas, remover e visualizar detalhes, inclusive em modo demonstração.

## Transferências entre contas
- Endpoint autenticado `POST /transacoes/transfer` registra saídas e entradas sincronizadas entre contas do mesmo usuário, reutilizando categorias definidas e validando contas arquivadas ou iguais.
- A tela **Transferências** permite selecionar contas de origem/destino, preencher metadados (categoria, status, observação) e acompanhar o recibo da movimentação recém-criada.
- Listas de contas e categorias são carregadas dinamicamente, ocultando contas arquivadas por padrão e oferecendo rótulos sugeridos para facilitar o preenchimento.
