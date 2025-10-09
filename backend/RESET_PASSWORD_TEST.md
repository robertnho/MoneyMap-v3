# 🔐 Teste da Funcionalidade de Redefinição de Senha

## 📋 Resumo

O sistema agora permite que usuários redefinam suas senhas através de dois endpoints:

1. **POST /auth/forgot-password** - Solicita token de redefinição
2. **POST /auth/reset-password** - Redefine a senha usando o token

---

## 🧪 Como Testar

### 1️⃣ Solicitar Token de Redefinição

**Endpoint:** `POST http://localhost:3000/auth/forgot-password`

**Body (JSON):**
```json
{
  "email": "seu@email.com"
}
```

**Resposta (200 OK):**
```json
{
  "message": "Se o e-mail existir em nossa base, um token de redefinição foi gerado.",
  "token": "abc123..." // Apenas em desenvolvimento (NODE_ENV=development)
}
```

**⚠️ IMPORTANTE:** O token será exibido no **console do servidor** com esta aparência:

```
======================================================================
🔐 TOKEN DE REDEFINIÇÃO DE SENHA
======================================================================
📧 E-mail: seu@email.com
🔑 Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
⏰ Expira em: 07/10/2025, 15:45:30
⏳ Válido por: 15 minutos
======================================================================
```

---

### 2️⃣ Redefinir Senha com Token

**Endpoint:** `POST http://localhost:3000/auth/reset-password`

**Body (JSON):**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "newPassword": "minhaNovaSenha123"
}
```

**Resposta (200 OK):**
```json
{
  "message": "Senha redefinida com sucesso! Você já pode fazer login com a nova senha."
}
```

**Possíveis Erros:**

- **400 Bad Request** - Token inválido ou expirado
  ```json
  {
    "error": "Token inválido ou expirado. Solicite um novo token de redefinição."
  }
  ```

- **422 Unprocessable Entity** - Dados inválidos
  ```json
  {
    "error": "Dados inválidos. Token e nova senha são obrigatórios."
  }
  ```

---

## 🧑‍💻 Testando via Frontend

1. Acesse a página de login: `http://localhost:5173/login`
2. Clique em **"Esqueceu a senha? Redefina aqui"**
3. Digite seu e-mail e clique em **"Solicitar Token"**
4. Copie o token que apareceu no console do servidor
5. Cole o token no modal seguinte
6. Digite sua nova senha (mínimo 8 caracteres)
7. Clique em **"Redefinir Senha"**
8. Faça login com a nova senha

---

## 🔒 Segurança Implementada

✅ **Token seguro** - Gerado com `crypto.randomBytes(32)` (64 caracteres hexadecimais)
✅ **Expiração** - Token válido por apenas 15 minutos
✅ **Hash de senha** - Nova senha armazenada com bcrypt
✅ **Limpeza** - Token removido após uso bem-sucedido
✅ **Privacidade** - API não revela se o e-mail existe ou não
✅ **Unicidade** - Token único por usuário (campo com constraint UNIQUE)

---

## 🎯 Estrutura do Banco

Campos adicionados à tabela `User`:

```prisma
model User {
  id                 Int       @id @default(autoincrement())
  name               String
  email              String    @unique
  passwordHash       String
  avatarUrl          String?
  resetToken         String?   @unique  // ← NOVO
  resetTokenExpires  DateTime?          // ← NOVO
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

---

## 📦 Próximos Passos (Opcional - Produção)

Para implementar em produção com envio de e-mail real:

1. Instale uma biblioteca de e-mail (ex: `nodemailer`, `sendgrid`, `resend`)
2. Configure as credenciais SMTP no `.env`
3. Substitua o `console.log` em `/forgot-password` por envio de e-mail
4. Remova o retorno do token na resposta (manter apenas em dev)

---

## ✅ Status

🟢 **Banco de dados atualizado**
🟢 **Rotas implementadas**
🟢 **Frontend integrado**
🟢 **Validações e segurança aplicadas**
🟢 **Pronto para testes!**

---

Desenvolvido para **MoneyMap v3** 💰📊
