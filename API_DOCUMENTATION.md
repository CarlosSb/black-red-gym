# 📡 Documentação da API - Black Red Gym

Documentação completa das APIs REST do sistema Black Red Gym.

## 📋 Índice

- [🏗️ Arquitetura da API](#️-arquitetura-da-api)
- [🔐 Autenticação](#-autenticação)
- [👤 Usuários](#-usuários)
- [📅 Agendamentos](#-agendamentos)
- [💬 Depoimentos](#-depoimentos)
- [📊 Check-ins](#-check-ins)
- [📧 Mensagens](#-mensagens)
- [💰 Planos](#-planos)
- [⚙️ Configurações](#️-configurações)
- [📝 Códigos de Referência](#-códigos-de-referência)

## 🏗️ Arquitetura da API

### Base URL
```
http://localhost:3000/api
```

### ✅ **Status: APIs Otimizadas para Produção**

As APIs foram completamente otimizadas para deploy na Vercel com Next.js 15:

#### **🔧 Melhorias Implementadas**

##### **Compatibilidade Next.js 15**
```typescript
// ✅ ANTES (Next.js 13/14)
{ params }: { params: { id: string } }

// ✅ DEPOIS (Next.js 15)
{ params }: { params: Promise<{ id: string }> }
```

**Rotas corrigidas:**
- ✅ `/api/appointments/[id]` - PATCH, DELETE
- ✅ `/api/messages/[id]` - PUT, DELETE
- ✅ `/api/plans/[id]` - PUT, DELETE
- ✅ `/api/testimonials/[id]` - PATCH, DELETE
- ✅ `/api/users/[id]` - PATCH, PUT, DELETE

##### **Configuração Vercel**
```json
{
  "functions": {
    "app/api/**/*.ts": { "maxDuration": 10 }
  },
  "regions": ["gru1"],
  "framework": "nextjs"
}
```

##### **Prisma Otimizado**
```typescript
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: { db: { url: process.env.DATABASE_URL } }
})
```

#### **📊 Performance em Produção**
- **Cold starts**: Otimizados para Vercel
- **Timeouts**: 10 segundos por função
- **Região**: América do Sul (São Paulo)
- **Bundle**: 102kB otimizado

### Formato de Resposta
```json
{
  "success": true,
  "data": "...",
  "message": "Operação realizada com sucesso",
  "total": 10
}
```

### Códigos de Status
- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `401` - Não autorizado
- `403` - Proibido
- `404` - Não encontrado
- `409` - Conflito
- `500` - Erro interno

## 🔐 Autenticação

### Login Tradicional
```http
POST /api/auth/login
```

**Corpo da requisição:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "role": "USER"
  }
}
```

### Login com Google
```http
GET /api/auth/google?action=login
```

**Parâmetros de query:**
- `action`: `login` ou `register`

**Fluxo:**
1. Redireciona para Google OAuth
2. Retorna para `/api/auth/google/callback`
3. Define cookie de sessão
4. Redireciona para dashboard apropriado

### Cadastro
```http
POST /api/auth/register
```

**Corpo da requisição:**
```json
{
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

## 👤 Usuários

### Listar Usuários (Admin)
```http
GET /api/users
```

**Parâmetros de query:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `search`: Termo de busca
- `status`: `ACTIVE`, `INACTIVE`, `PENDING`

**Resposta:**
```json
{
  "success": true,
  "users": [...],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

### Obter Usuário por ID
```http
GET /api/users/[id]
```

### Atualizar Usuário
```http
PATCH /api/users/[id]
```

**Corpo da requisição:**
```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "status": "ACTIVE"
}
```

### Excluir Usuário
```http
DELETE /api/users/[id]
```

## 📅 Agendamentos

### Listar Agendamentos
```http
GET /api/appointments
```

**Parâmetros de query:**
- `status`: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`
- `date`: Data específica (YYYY-MM-DD)
- `limit`: Número máximo de resultados

### Criar Agendamento
```http
POST /api/appointments
```

**Corpo da requisição:**
```json
{
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "email": "joao@email.com",
  "classType": "Musculação",
  "scheduledDate": "2024-12-25",
  "scheduledTime": "10:00",
  "notes": "Observações adicionais"
}
```

### Atualizar Agendamento
```http
PATCH /api/appointments/[id]
```

### Cancelar Agendamento
```http
DELETE /api/appointments/[id]
```

## 💬 Depoimentos

### Listar Depoimentos (Público)
```http
GET /api/testimonials
```

### Criar Depoimento (Admin)
```http
POST /api/testimonials
```

**Corpo da requisição:**
```json
{
  "name": "João Silva",
  "content": "Excelente academia!",
  "rating": 5,
  "image": "JS"
}
```

### Atualizar Depoimento
```http
PATCH /api/testimonials/[id]
```

**Corpo da requisição:**
```json
{
  "isActive": false
}
```

### Excluir Depoimento
```http
DELETE /api/testimonials/[id]
```

## 📊 Check-ins

### Registrar Check-in
```http
POST /api/checkin
```

**Corpo da requisição:**
```json
{
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "codeId": "codigo-qr-id"
}
```

### Listar Check-ins
```http
GET /api/checkin
```

**Parâmetros de query:**
- `date`: Data específica
- `limit`: Número máximo de resultados

### Validar Código QR
```http
POST /api/checkin/validate
```

**Corpo da requisição:**
```json
{
  "code": "ABC123"
}
```

## 📧 Mensagens

### Enviar Mensagem
```http
POST /api/messages
```

**Corpo da requisição:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "subject": "Assunto da mensagem",
  "message": "Conteúdo da mensagem",
  "priority": "MEDIUM"
}
```

### Listar Mensagens (Admin)
```http
GET /api/messages
```

### Marcar como Lida
```http
PATCH /api/messages/[id]
```

**Corpo da requisição:**
```json
{
  "status": "READ",
  "response": "Resposta do administrador"
}
```

## 💰 Planos

### Listar Planos
```http
GET /api/plans
```

### Criar Plano (Admin)
```http
POST /api/plans
```

**Corpo da requisição:**
```json
{
  "name": "Plano Premium",
  "price": 149.99,
  "description": "Plano completo",
  "features": ["Musculação", "Aulas em grupo", "Personal"],
  "popular": true
}
```

### Atualizar Plano
```http
PATCH /api/plans/[id]
```

### Excluir Plano
```http
DELETE /api/plans/[id]
```

## ⚙️ Configurações

### Obter Configurações
```http
GET /api/settings
```

### Atualizar Configurações (Admin)
```http
PATCH /api/settings
```

**Corpo da requisição:**
```json
{
  "name": "Black Red Academia",
  "description": "A melhor academia da cidade",
  "phone": "(11) 99999-9999",
  "email": "contato@blackred.com.br",
  "address": "Rua das Academias, 123",
  "hours": {
    "weekdays": { "open": "06:00", "close": "22:00" },
    "saturday": { "open": "08:00", "close": "18:00" },
    "sunday": { "open": "09:00", "close": "14:00" }
  }
}
```

## 📝 Códigos de Referência

### Gerar Código QR
```http
POST /api/qr/generate
```

**Corpo da requisição:**
```json
{
  "validDate": "2024-12-31"
}
```

### Obter Imagem QR
```http
GET /api/qr/image?code=ABC123
```

## 🔒 Autenticação de API

### Cookies de Sessão
As APIs administrativas requerem autenticação via cookies:

```
blackred_auth=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Verificação de Admin
APIs que requerem privilégios de administrador verificam:
- Presença do cookie de sessão
- Validade do token
- Role do usuário (`ADMIN`)

## 📊 Limites e Paginação

### Paginação
```http
GET /api/users?page=2&limit=20
```

### Limites de Taxa
- **APIs públicas**: 100 requisições/minuto
- **APIs autenticadas**: 500 requisições/minuto
- **APIs admin**: 1000 requisições/minuto

## 🛠️ Tratamento de Erros

### Estrutura de Erro
```json
{
  "success": false,
  "error": "Mensagem de erro descritiva",
  "code": "ERROR_CODE"
}
```

### Códigos de Erro Comuns
- `VALIDATION_ERROR` - Dados inválidos
- `AUTHENTICATION_ERROR` - Não autenticado
- `AUTHORIZATION_ERROR` - Sem permissões
- `NOT_FOUND_ERROR` - Recurso não encontrado
- `CONFLICT_ERROR` - Conflito de dados
- `SERVER_ERROR` - Erro interno

## 🔧 Testes

### Usando cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@blackred.com.br","password":"admin123"}'

# Listar usuários (com cookie)
curl -X GET http://localhost:3000/api/users \
  -H "Cookie: blackred_auth=TOKEN_AQUI"
```

### Usando Postman
1. Importe a coleção: `docs/postman_collection.json`
2. Configure variáveis de ambiente
3. Execute as requisições

## 📝 Logs e Monitoramento

### Logs de API
- Requisições bem-sucedidas: nível INFO
- Erros de validação: nível WARN
- Erros de servidor: nível ERROR

### Monitoramento
- **Uptime**: Verificação automática a cada 5 minutos
- **Performance**: Métricas de resposta das APIs
- **Erros**: Alertas automáticos para erros 5xx

---

<div align="center">
  <p>📡 <strong>API Black Red Gym</strong> - v1.0.0</p>
  <p>
    <a href="#-documentação-da-api---black-red-gym">
      Voltar ao topo
    </a>
  </p>
</div>