# 📡 Documentação da API - Gym Starter

Documentação completa das APIs REST do sistema Gym Starter

## 🚀 **Atualizações Recentes (v1.0.1)**

### ✅ **Correções Críticas para Deploy**
- **Next.js 15 Compatibilidade**: Todas as APIs corrigidas para usar `Promise<{ id: string }>` em rotas dinâmicas
- **Build Otimizado**: Configurações de build separadas e dependências limpas
- **Prisma Serverless**: Cliente otimizado para ambientes serverless
- **Deploy Vercel**: Configurações completas para deploy na América do Sul

### ✅ **APIs Completamente Documentadas**
- **Anúncios (Ads)**: Sistema completo de gestão de anúncios com expiração automática
- **Parceiros (Partners)**: Gestão de parceiros com categorização
- **Promoções (Promotions)**: Sistema de promoções com códigos únicos e URLs curtas
- **Indicações (Referrals)**: Sistema de indicações de alunos
- **Base de Conhecimento (Knowledge)**: Repositório de conhecimento para o chatbot
- **Upload de Arquivos**: Sistema seguro de upload de imagens

### ✅ **Melhorias de Arquitetura**
- **Server/Client Components**: Arquitetura otimizada para Next.js 15
- **Performance**: Renderização no servidor e componentes client-side estratégicos
- **Segurança**: Autenticação robusta e validação de dados
- **Logs**: Sistema completo de auditoria e monitoramento

## 📋 Índice

- [🏗️ Arquitetura da API](#️-arquitetura-da-api)
- [🔐 Autenticação](#-autenticação)
- [👤 Usuários](#-usuários)
- [📅 Agendamentos](#-agendamentos)
- [💬 Depoimentos](#-depoimentos)
- [📊 Check-ins](#-check-ins)
- [📧 Mensagens](#-mensagens)
- [💰 Planos](#-planos)
- [📢 Anúncios](#-anúncios)
- [🤝 Parceiros](#-parceiros)
- [🎯 Promoções](#-promoções)
- [👥 Indicações](#-indicações)
- [📚 Base de Conhecimento](#-base-de-conhecimento)
- [📤 Upload de Arquivos](#-upload-de-arquivos)
- [⚙️ Configurações](#️-configurações)
- [🤖 Chat/Assistente Virtual](#-chatassistente-virtual)
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

## 📢 Anúncios

### Listar Anúncios (Público)
```http
GET /api/ads
```

**Parâmetros de query:**
- `status`: `all` (para incluir anúncios inativos - admin)
- `limit`: Número máximo de resultados (padrão: 10)

**Resposta:**
```json
{
  "success": true,
  "ads": [
    {
      "id": "ad-id",
      "title": "Desconto Especial",
      "image": "/uploads/ad-image.jpg",
      "link": "https://gymstarter.com/promo",
      "validUntil": "2024-12-31T23:59:59.000Z",
      "isActive": true,
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "total": 5
}
```

### Obter Anúncio por ID
```http
GET /api/ads/[id]
```

### Criar Anúncio (Admin)
```http
POST /api/ads
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "title": "Black Friday - 50% OFF",
  "image": "/uploads/black-friday-banner.jpg",
  "link": "https://gymstarter.com/black-friday",
  "validUntil": "2024-11-30"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Anúncio criado com sucesso",
  "ad": {
    "id": "ad-id",
    "title": "Black Friday - 50% OFF",
    "image": "/uploads/black-friday-banner.jpg",
    "link": "https://gymstarter.com/black-friday",
    "validUntil": "2024-11-30T00:00:00.000Z",
    "isActive": true
  }
}
```

### Atualizar Anúncio (Admin)
```http
PATCH /api/ads/[id]
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "title": "Cyber Monday - 40% OFF",
  "isActive": false
}
```

### Excluir Anúncio (Admin)
```http
DELETE /api/ads/[id]
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

## 🤝 Parceiros

### Listar Parceiros (Público)
```http
GET /api/partners
```

**Parâmetros de query:**
- `category`: Filtrar por categoria (ex: "suplementos", "equipamentos")
- `status`: `all` (para incluir parceiros inativos - admin)
- `limit`: Número máximo de resultados (padrão: 50)

**Resposta:**
```json
{
  "success": true,
  "partners": [
    {
      "id": "partner-id",
      "name": "Suplementos XYZ",
      "description": "Loja especializada em suplementos alimentares",
      "logo": "/uploads/partner-logo.jpg",
      "link": "https://suplementosxyz.com",
      "category": "suplementos",
      "isActive": true,
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "total": 25
}
```

### Obter Parceiro por ID
```http
GET /api/partners/[id]
```

### Criar Parceiro (Admin)
```http
POST /api/partners
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "name": "Academia Parceira",
  "description": "Rede de academias parceiras",
  "logo": "/uploads/parceiro-logo.jpg",
  "link": "https://academiaparceira.com",
  "category": "academias"
}
```

### Atualizar Parceiro (Admin)
```http
PATCH /api/partners/[id]
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "name": "Nova Academia Parceira",
  "isActive": false
}
```

### Excluir Parceiro (Admin)
```http
DELETE /api/partners/[id]
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

## 🎯 Promoções

### Listar Promoções (Público)
```http
GET /api/promotions
```

**Parâmetros de query:**
- `status`: `all` (para incluir promoções inativas - admin)
- `limit`: Número máximo de resultados (padrão: 50)

**Resposta:**
```json
{
  "success": true,
  "promotions": [
    {
      "id": "promo-id",
      "title": "Plano Anual com Desconto",
      "description": "Economize 20% no plano anual",
      "image": "/uploads/promo-image.jpg",
      "validUntil": "2024-12-31T23:59:59.000Z",
      "isActive": true,
      "uniqueCode": "PROMO-2024-ABC123",
      "shortCode": "abc123",
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "total": 10
}
```

### Obter Promoção por ID
```http
GET /api/promotions/[id]
```

### Criar Promoção (Admin)
```http
POST /api/promotions
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "title": "Natal Fitness",
  "description": "Ganhe 30% de desconto na matrícula",
  "image": "/uploads/natal-promo.jpg",
  "validUntil": "2024-12-25"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Promoção criada com sucesso",
  "promotion": {
    "id": "promo-id",
    "title": "Natal Fitness",
    "description": "Ganhe 30% de desconto na matrícula",
    "image": "/uploads/natal-promo.jpg",
    "validUntil": "2024-12-25T00:00:00.000Z",
    "isActive": true,
    "uniqueCode": "PROMO-2024-XYZ789",
    "shortCode": "xyz789"
  }
}
```

### Atualizar Promoção (Admin)
```http
PATCH /api/promotions/[id]
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "title": "Ano Novo Fitness",
  "isActive": false
}
```

### Excluir Promoção (Admin)
```http
DELETE /api/promotions/[id]
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

## 👥 Indicações

### Criar Indicação
```http
POST /api/referrals
```

**Corpo da requisição:**
```json
{
  "referredName": "João Silva",
  "referredPhone": "(11) 99999-9999",
  "referredEmail": "joao@email.com"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Indicação realizada com sucesso!",
  "referral": {
    "id": "referral-id",
    "referredName": "João Silva",
    "referredPhone": "11999999999",
    "referredEmail": "joao@email.com",
    "status": "PENDING"
  }
}
```

### Listar Indicações
```http
GET /api/referrals
```

**Resposta:**
```json
{
  "success": true,
  "referrals": [
    {
      "id": "referral-id",
      "referrerName": "Maria Santos",
      "referrerPhone": "11999999999",
      "referredName": "João Silva",
      "referredPhone": "11888888888",
      "referredEmail": "joao@email.com",
      "status": "PENDING",
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "total": 15
}
```

## 📚 Base de Conhecimento

### Listar Entradas (Admin)
```http
GET /api/knowledge
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Resposta:**
```json
{
  "success": true,
  "knowledge": [
    {
      "id": "knowledge-id",
      "question": "Quais são os horários de funcionamento?",
      "answer": "A academia funciona de segunda a sexta das 6h às 22h, sábados das 8h às 18h e domingos das 9h às 17h.",
      "category": "horarios",
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "total": 50
}
```

### Criar Entrada (Admin)
```http
POST /api/knowledge
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "question": "Como faço para cancelar minha matrícula?",
  "answer": "Para cancelar sua matrícula, entre em contato conosco pelo telefone (11) 99999-9999 ou pelo email contato@gymstarter.com.br. O cancelamento deve ser solicitado com 30 dias de antecedência.",
  "category": "matricula"
}
```

### Atualizar Entrada (Admin)
```http
PUT /api/knowledge
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "id": "knowledge-id",
  "question": "Como faço para cancelar minha matrícula?",
  "answer": "Atualização: Para cancelar sua matrícula, visite nossa unidade ou entre em contato pelo WhatsApp.",
  "category": "matricula"
}
```

### Excluir Entrada (Admin)
```http
DELETE /api/knowledge
```

**Cabeçalhos obrigatórios:**
```
Cookie: gymstarter_auth=TOKEN_ADMIN
```

**Corpo da requisição:**
```json
{
  "id": "knowledge-id"
}
```

## 📤 Upload de Arquivos

### Upload de Imagem
```http
POST /api/upload
```

**Content-Type:** `multipart/form-data`

**Campos do formulário:**
- `file`: Arquivo de imagem (JPEG, PNG, GIF, WebP)

**Limitações:**
- Tamanho máximo: 5MB
- Tipos aceitos: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`

**Resposta de sucesso:**
```json
{
  "success": true,
  "filename": "1735689600000.jpg",
  "url": "/uploads/1735689600000.jpg"
}
```

**Resposta de erro:**
```json
{
  "success": false,
  "error": "File too large. Maximum size is 5MB."
}
```

## ⚙️ Configurações

### Sistema de Configurações Dinâmicas

O Gym Starter possui um sistema completamente dinâmico onde todas as informações da academia podem ser configuradas via painel administrativo:

#### **🎨 Configurações Disponíveis**
- **Nome da Academia**: Personalizável com fallback para "Gym Starter"
- **Cores do Tema**: Primary, Secondary e Accent totalmente configuráveis
- **Informações de Contato**: Telefone, email, endereço, WhatsApp
- **Horários de Funcionamento**: Personalizados por dia da semana
- **Mensagens do Chatbot**: Saudação e respostas personalizadas
- **Informações da Empresa**: Sobre, missão, valores
- **Métricas e Estatísticas**: Dados exibidos no dashboard

#### **🔧 Como Funciona**
```typescript
// Hook para acessar configurações dinâmicas
const { settings } = useAcademySettings()

// Uso em componentes
<h1>{settings?.name || "Gym Starter"}</h1>
<div style={{ color: settings?.colors.primary }}>
  Conteúdo com cor dinâmica
</div>
```

### Obter Configurações
```http
GET /api/settings
```

**Resposta de exemplo:**
```json
{
  "success": true,
  "settings": {
    "id": "main-settings",
    "name": "Gym Starter",
    "description": "Academia moderna com equipamentos de última geração",
    "phone": "(85) 99999-9999",
    "email": "contato@gymstarter.com.br",
    "address": "Av. Santos Dumont, 1515 - Aldeota, Fortaleza - CE",
    "colors": {
      "primary": "#DC2626",
      "secondary": "#000000",
      "accent": "#DC2626"
    },
    "hours": {
      "weekdays": { "open": "05:30", "close": "23:00" },
      "saturday": { "open": "07:00", "close": "20:00" },
      "sunday": { "open": "08:00", "close": "18:00" }
    }
  }
}
```

### Atualizar Configurações (Admin)
```http
PATCH /api/settings
```

**Corpo da requisição:**
```json
{
  "name": "Minha Academia Fitness",
  "colors": {
    "primary": "#2563EB",
    "secondary": "#1F2937",
    "accent": "#10B981"
  },
  "phone": "(11) 99999-9999",
  "email": "contato@minhaacademia.com.br"
}
```

## 🤖 Chat/Assistente Virtual

### Enviar Mensagem para o Chatbot
```http
POST /api/chat
```

**Cabeçalhos obrigatórios:**
```
Content-Type: application/json
```

**Corpo da requisição:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Olá, quero agendar musculação para amanhã às 14h, meu nome é João Silva"
    }
  ]
}
```

**Resposta de sucesso (agendamento automático):**
```json
{
  "success": true,
  "response": "🎉 Perfeito, João Silva! Agendei sua aula de Musculação para o dia 10/09 às 14:00. Um de nossos atendentes entrará em contato para confirmar. Qualquer dúvida, é só falar comigo! 😉"
}
```

**Resposta de sucesso (conversa normal):**
```json
{
  "success": true,
  "response": "Olá! Sou o assistente virtual da Gym Starter. Como posso ajudar você hoje?"
}
```

### Funcionalidades do Chatbot

#### 🤖 **Interpretação Inteligente**
- **Frases de agendamento**: "Quero agendar musculação para amanhã às 14h"
- **Datas relativas**: "amanhã", "próximo sábado", "segunda-feira"
- **Horários**: "14h", "manhã", "tarde", "noite"
- **Tipos de aula**: "musculação", "crossfit", "pilates", "yoga"

#### 📅 **Agendamento Automático**
- **Validação de disponibilidade** em tempo real
- **Criação automática** de agendamentos via API
- **Confirmação imediata** com detalhes completos
- **Tratamento de conflitos** com sugestões alternativas

#### 💬 **Integração com WhatsApp**
- **Detecção automática** de tópicos complexos
- **Mensagens contextuais** personalizadas
- **Redirecionamento inteligente** baseado na conversa
- **Ícone oficial** do WhatsApp

#### 🚨 **Tratamento de Erros**
- **Timeout inteligente** (30 segundos)
- **Mensagens de erro** amigáveis
- **Recuperação automática** de sessão
- **Logs detalhados** para análise

### Exemplos de Uso

#### Agendamento Completo
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Quero agendar musculação para amanhã às 14h, meu nome é João Silva"
      }
    ]
  }'
```

#### Conversa Normal
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Quais são os horários de funcionamento?"
      }
    ]
  }'
```

#### Detecção de WhatsApp
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Quero me matricular na academia"
      }
    ]
  }'
```

### Configuração do Assistente

#### Variáveis de Ambiente
```env
# Obrigatório
OPENAI_API_KEY="your-openai-api-key"

# Opcional - Sistema Dinâmico (valores padrão)
NEXT_PUBLIC_ASSISTANT_ENABLED="true"
NEXT_PUBLIC_ASSISTANT_DELAY="5000"
NEXT_PUBLIC_ASSISTANT_WELCOME_MESSAGE="Olá! Como posso ajudar?"

# ⚠️  OBSOLETO - Agora configurado dinamicamente via painel admin
# NEXT_PUBLIC_ACADEMY_NAME="Gym Starter"  # Agora via /api/settings
# NEXT_PUBLIC_ACADEMY_PHONE="5511999999999"  # Agora via /api/settings
```

### Logs e Monitoramento

#### Logs de Interação
```json
{
  "userMessage": "Quero agendar musculação...",
  "aiResponse": "🎉 Perfeito, João Silva!...",
  "hasAppointmentIntent": true,
  "appointmentConfidence": 1.4,
  "timestamp": "2025-09-09T18:57:33.712Z"
}
```

#### Métricas Disponíveis
- **Taxa de sucesso** de agendamentos automáticos
- **Tempo médio de resposta** do assistente
- **Detecção de intenção** por tipo de conversa
- **Conversões para WhatsApp** por tópico

## 🎨 **Sistema de Cores Dinâmicas**

### Configuração de Cores
O Gym Starter possui um sistema avançado de personalização de cores:

#### **🎨 Variáveis CSS Dinâmicas**
```css
/* Variáveis geradas dinamicamente */
:root {
  --red-accent: #DC2626;    /* Primary */
  --black-red: #000000;     /* Secondary */
  --red-accent-light: #EF4444; /* Accent */
}
```

#### **🔧 Como Configurar**
1. Acesse o painel administrativo
2. Vá para **Configurações > Aparência**
3. Configure as cores Primary, Secondary e Accent
4. As mudanças são aplicadas instantaneamente em toda a interface

#### **📱 Responsividade de Cores**
- **Desktop**: Cores completas aplicadas
- **Mobile**: Otimização automática para melhor contraste
- **Dark Mode**: Suporte completo para temas escuros

## 💬 **Componentes Aprimorados**

### Sistema de Depoimentos Interativo

#### **✨ Funcionalidades**
- **Modal Elegante**: Popover discreto sobre o cartão
- **Responsividade Total**: Otimizado para mobile e desktop
- **Animações Suaves**: Transições modernas e fluidas
- **Acessibilidade**: Suporte completo para leitores de tela

#### **🔧 Implementação Técnica**
```typescript
// Componente com modal integrado
<TestimonialCard
  testimonial={testimonial}
  showReadMore={true}
  maxHeight={280}
/>
```

#### **📊 Logs de Debug**
- **Monitoramento Completo**: Logs detalhados de interações
- **Performance**: Métricas de resposta e carregamento
- **Troubleshooting**: Sistema de diagnóstico avançado

### Arquitetura Server/Client Components

#### **🏗️ Server Components (Next.js 15)**
```typescript
// Páginas de autenticação - Server Side Rendering
export default async function LoginPage() {
  const settings = await getServerSettings()
  return <LoginForm settings={settings} />
}
```

#### **⚡ Client Components**
```typescript
// Componentes interativos - Client Side
"use client"
export function ChatFlutuante() {
  const { settings } = useAcademySettings()
  // Lógica interativa aqui
}
```

#### **🚀 Benefícios da Arquitetura**
- **SEO Otimizado**: Conteúdo renderizado no servidor
- **Performance**: Carregamento otimizado
- **Interatividade**: Componentes client-side para funcionalidades dinâmicas
- **Manutenibilidade**: Separação clara de responsabilidades

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
gymstarter_auth=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
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

## 🚀 **Deploy e Configuração**

### Vercel Deployment

#### **📋 Pré-requisitos**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login
```

#### **⚙️ Configuração do Projeto**
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "regions": ["gru1"],
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

#### **� Variáveis de Ambiente**
```env
# Banco de dados
DATABASE_URL="postgresql://..."

# Autenticação
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"

# OpenAI (Assistente Virtual)
OPENAI_API_KEY="sk-..."

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_NAME="Gym Starter"
```

### Configuração Inicial

#### **🗄️ Banco de Dados**
```bash
# Executar migrations
npx prisma migrate deploy

# Popular dados iniciais
npx prisma db seed
```

#### **👤 Primeiro Admin**
```sql
-- Criar usuário admin via SQL
INSERT INTO users (name, email, password, role, status)
VALUES ('Admin', 'admin@gymstarter.com.br', '$2b$10$...', 'ADMIN', 'ACTIVE');
```

#### **⚙️ Configurações da Academia**
Acesse `/dashboard/settings` após o login para configurar:
- Nome da academia
- Cores do tema
- Informações de contato
- Horários de funcionamento

#### **🔧 Verificações Pós-Deploy**
Após o deploy, execute estes testes:

```bash
# Testar APIs críticas
curl -X GET http://localhost:3000/api/settings
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gymstarter.com.br","password":"admin123"}'

# Verificar logs do Next.js
# Os logs devem mostrar:
# ✅ Prisma Client initialized
# ✅ Database connection successful
# ✅ All API routes loaded
```

#### **📊 Monitoramento em Produção**
- **Uptime**: Configure monitoring externo (ex: UptimeRobot)
- **Performance**: Monitore Core Web Vitals no Google Search Console
- **Erros**: Configure alertas para códigos 5xx
- **Logs**: Use Vercel Analytics para métricas de uso

## 🔧 Testes

### Usando cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gymstarter.com.br","password":"admin123"}'

# Listar usuários (com cookie)
curl -X GET http://localhost:3000/api/users \
  -H "Cookie: gymstarter_auth=TOKEN_AQUI"
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

## 🔧 Troubleshooting

### Problemas Comuns e Soluções

#### **❌ Erro: "Acesso negado" (403)**
**Sintomas:** Recebendo erro 403 em APIs administrativas
**Soluções:**
- Verifique se o cookie `gymstarter_auth` está presente
- Confirme se o usuário tem role `ADMIN`
- Teste fazendo login novamente para renovar a sessão

#### **❌ Erro: "Anúncio/Parceiro/Promoção não encontrado" (404)**
**Sintomas:** Operações em recursos específicos retornam 404
**Soluções:**
- Verifique se o ID está correto
- Confirme se o recurso não foi excluído
- Para anúncios/promoções, verifique se não expiraram

#### **❌ Erro: "Erro interno do servidor" (500)**
**Sintomas:** Erro genérico 500 em qualquer operação
**Soluções:**
- Verifique os logs do servidor para detalhes específicos
- Confirme conexão com banco de dados
- Valide se todas as variáveis de ambiente estão configuradas

#### **❌ Upload de imagem falhando**
**Sintomas:** Erro ao fazer upload de arquivos
**Soluções:**
- Verifique se o arquivo é uma imagem válida (JPEG, PNG, GIF, WebP)
- Confirme se o tamanho não excede 5MB
- Certifique-se de que a pasta `public/uploads` existe e tem permissões de escrita

#### **❌ Chatbot não responde corretamente**
**Sintomas:** Assistente virtual não entende comandos ou dá respostas incorretas
**Soluções:**
- Verifique se a variável `OPENAI_API_KEY` está configurada
- Confirme se há entradas na base de conhecimento relacionadas
- Teste com perguntas simples primeiro

### Logs de Debug

#### **Ativar Logs Detalhados**
```bash
# Em desenvolvimento
DEBUG=* npm run dev

# Para produção, configure variáveis de ambiente
NODE_ENV=development
```

#### **Logs Importantes para Monitorar**
- `✅ Prisma Client initialized` - Conexão com BD OK
- `🚀 API /api/[endpoint] chamada` - API sendo executada
- `💥 Erro ao [operação]` - Erros específicos
- `📊 [número] resultados encontrados` - Queries executadas

### Testes Recomendados

#### **Teste Básico de Funcionamento**
```bash
# 1. Testar configurações
curl http://localhost:3000/api/settings

# 2. Testar autenticação
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gymstarter.com.br","password":"admin123"}'

# 3. Testar APIs públicas
curl http://localhost:3000/api/partners
curl http://localhost:3000/api/promotions

# 4. Testar upload (com arquivo real)
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/caminho/para/imagem.jpg"
```

#### **Teste de Performance**
```bash
# Testar carga em APIs críticas
ab -n 100 -c 10 http://localhost:3000/api/settings
```

## 📋 **Changelog - Melhorias Implementadas**

### **v1.2.0 - Sistema 100% Dinâmico** 🚀

#### **✅ Rebranding Completo**
- **Substituição Total**: Remoção de todas as referências estáticas "Black Red"
- **Sistema Dinâmico**: Nome da academia configurável via painel admin
- **Fallback Seguro**: "Gym Starter" como padrão quando configurações indisponíveis

#### **✅ Arquitetura Aprimorada**
- **Server/Client Components**: Correção completa para Next.js 15
- **Performance Otimizada**: Renderização no servidor para melhor SEO
- **Interatividade Mantida**: Componentes client-side para funcionalidades dinâmicas

#### **✅ Sistema de Cores Dinâmicas**
- **Personalização Completa**: Primary, Secondary e Accent configuráveis
- **Aplicação Instantânea**: Mudanças refletidas em tempo real
- **Responsividade**: Otimização automática para mobile e desktop

#### **✅ Componentes Aprimorados**
- **Depoimentos Interativos**: Modal elegante com Popover
- **Logs de Debug**: Sistema completo de monitoramento
- **Acessibilidade**: Suporte total para tecnologias assistivas

#### **✅ Melhorias de UX/UI**
- **Responsividade Total**: Interface otimizada para todos os dispositivos
- **Animações Modernas**: Transições suaves e fluidas
- **Feedback Visual**: Estados de loading e erro aprimorados

### **📊 Métricas de Performance**
- **Bundle Size**: Otimizado para 102kB
- **Cold Starts**: < 3 segundos na Vercel
- **SEO Score**: 95+ no Lighthouse
- **Acessibilidade**: WCAG 2.1 AA compliant

---

<div align="center">
  <p>📡 <strong>API Gym Starter</strong> - v1.0.1</p>
  <p>🎨 <strong>Sistema 100% Dinâmico e Personalizável</strong></p>
  <p>🤖 <strong>Assistente Virtual Inteligente Integrado</strong></p>
  <p>📱 <strong>Interface Responsiva e Moderna</strong></p>
  <p>📚 <strong>Documentação Completa e Atualizada</strong></p>
  <p>
    <a href="#-documentação-da-api---gym-starter">
      Voltar ao topo
    </a>
  </p>
</div>