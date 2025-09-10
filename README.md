# 🏋️‍♂️ GymStarter - Sistema de Gestão de Academia

Sistema completo de gestão para academias desenvolvido com Next.js 15, TypeScript, Prisma e PostgreSQL. Oferece funcionalidades modernas para alunos, administradores e profissionais da academia.

![GymStarter](https://img.shields.io/badge/GymStarter-v1.1.0-red)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.15-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.4-blue)

## 📋 Índice

- [🚀 Funcionalidades](#-funcionalidades)
- [🤖 Assistente Virtual Inteligente](#-assistente-virtual-inteligente)
- [🛠️ Tecnologias](#️-tecnologias)
- [📦 Instalação](#-instalação)
- [⚙️ Configuração](#️-configuração)
- [🔧 Scripts Disponíveis](#-scripts-disponíveis)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🎨 Componentes](#-componentes)
- [🔐 Autenticação](#-autenticação)
- [📊 Dashboard Administrativo](#-dashboard-administrativo)
- [📱 Responsividade](#-responsividade)
- [🔒 Segurança](#-segurança)
- [🚀 Deploy](#-deploy)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

## 🚀 Funcionalidades

### 👤 Para Alunos
- ✅ **Cadastro e Login** com e-mail/senha ou Google OAuth
- ✅ **Dashboard pessoal** com informações da conta
- ✅ **Agendamento de aulas experimentais**
- ✅ **Check-in via QR Code**
- ✅ **Visualização de planos disponíveis**
- ✅ **Sistema de indicações**

### 👨‍💼 Para Administradores
- ✅ **Dashboard completo** com métricas em tempo real
- ✅ **Gerenciamento de usuários** (alunos e funcionários)
- ✅ **Controle de agendamentos** e aulas
- ✅ **Sistema de depoimentos** gerenciável
- ✅ **Gestão de planos** e preços
- ✅ **Relatórios e estatísticas**
- ✅ **Configurações da academia**

### 🏢 Para a Academia
- ✅ **Site institucional** responsivo
- ✅ **Sistema de contato** integrado
- ✅ **Integração Google Maps**
- ✅ **WhatsApp Business** integrado
- ✅ **SEO otimizado**
- ✅ **Assistente Virtual Inteligente** com IA
- ✅ **Agendamento automático** via chat
- ✅ **Suporte 24/7** com detecção inteligente

## 🤖 Assistente Virtual Inteligente

### Funcionalidades do Chatbot
- 🎯 **Interpretação Inteligente de Linguagem Natural**
  - Reconhece frases como: "Quero agendar musculação para amanhã às 14h"
  - Identifica automaticamente: nome, data, horário e tipo de aula
  - Suporte a expressões relativas: "amanhã", "próximo sábado", "manhã"

- 📅 **Agendamento Automático**
  - Integração direta com API de agendamentos
  - Validação de disponibilidade em tempo real
  - Confirmação imediata com mensagem personalizada
  - Tratamento de conflitos de horário

- 💬 **Experiência Conversacional Avançada**
  - Respostas contextuais baseadas no histórico
  - Detecção automática de intenção de agendamento
  - Suporte a múltiplos idiomas (foco em português brasileiro)
  - Personalização baseada no perfil do usuário

- 🚨 **Tratamento de Erros e Recuperação**
  - Detecção de travamentos com timeout inteligente
  - Botão de reload para recuperação de sessão
  - Mensagens de erro amigáveis
  - Fallback automático para WhatsApp quando necessário

- 📱 **Interface Responsiva e Acessível**
  - Design otimizado para mobile e desktop
  - Animações suaves de expandir/colapsar
  - Suporte completo a navegação por teclado
  - Alto contraste e legibilidade

- 🔄 **Integração com WhatsApp**
  - Ícone oficial do WhatsApp (SVG nativo)
  - Mensagens contextuais personalizadas
  - Redirecionamento automático baseado na conversa
  - Detecção inteligente de tópicos complexos

### Exemplos de Uso
```bash
# Agendamento inteligente
Usuário: "Quero agendar musculação para amanhã às 14h, meu nome é João Silva"
Assistente: "🎉 Perfeito, João Silva! Agendei sua aula de Musculação para o dia 10/09 às 14:00"

# Detecção de horário ocupado
Usuário: "Agende uma aula para sábado de manhã"
Assistente: "Ops! O horário 09:00 no dia 14/09 já está ocupado. Que tal outro horário?"

# Suporte a matrículas
Usuário: "Quero me matricular na academia"
Assistente: [Mostra botão do WhatsApp com contexto personalizado]
```

### Configuração do Assistente
```env
# Variáveis obrigatórias
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_ASSISTANT_ENABLED="true"

# Configurações opcionais
NEXT_PUBLIC_ASSISTANT_DELAY="5000"
NEXT_PUBLIC_ASSISTANT_WELCOME_MESSAGE="Olá! Como posso ajudar?"
```

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI acessíveis
- **Lucide React** - Ícones modernos

### Backend
- **Next.js API Routes** - API RESTful
- **Prisma ORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **bcryptjs** - Hash de senhas
- **JWT** - Autenticação stateless

### Autenticação
- **Google OAuth 2.0** - Login social
- **Sessões seguras** - Cookies HTTPOnly
- **Proteção CSRF** - State parameter

### IA e Automação
- **OpenAI GPT** - Motor de IA para assistente virtual
- **Processamento de Linguagem Natural** - Interpretação inteligente de frases
- **Algoritmos de Detecção** - Reconhecimento de intenção e contexto

### Outros
- **QRCode.js** - Geração de QR Codes
- **Resend** - Serviço de e-mail
- **Vercel** - Plataforma de deploy
- **WhatsApp Business API** - Integração com WhatsApp

## 📦 Instalação

### Pré-requisitos
- **Node.js** 18.17 ou superior
- **PostgreSQL** 16.0 ou superior
- **Git** para controle de versão

### Passos de Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/gym-starter.git
   cd gym-starter
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o banco de dados:**
   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env.local

   # Configure as variáveis de ambiente
   nano .env.local
   ```

4. **Configure o banco de dados:**
   ```bash
   # Execute as migrações
   npx prisma migrate dev

   # Gere o cliente Prisma
   npx prisma generate
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# ==========================================
# BANCO DE DADOS
# ==========================================
DATABASE_URL="postgresql://username:password@localhost:5432/gymstarter"

# ==========================================
# 🤖 ASSISTENTE VIRTUAL (OBRIGATÓRIO)
# ==========================================
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_ASSISTANT_ENABLED="true"
NEXT_PUBLIC_ASSISTANT_DELAY="5000"
NEXT_PUBLIC_ASSISTANT_WELCOME_MESSAGE="Olá! Como posso ajudar você hoje?"

# ==========================================
# 🔐 AUTENTICAÇÃO
# ==========================================
NEXTAUTH_SECRET="sua-chave-secreta-super-segura"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# ==========================================
# 📱 CONFIGURAÇÃO DO APP
# ==========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ACADEMY_NAME="Black Red Academia"
NEXT_PUBLIC_ACADEMY_PHONE="5511999999999"

# ==========================================
# 📧 EMAIL (OPCIONAL)
# ==========================================
EMAIL_FROM="noreply@gymstarter.com.br"
EMAIL_SMTP_HOST="smtp.gmail.com"
EMAIL_SMTP_PORT="587"
EMAIL_SMTP_USER="seu-email@gmail.com"
EMAIL_SMTP_PASS="sua-senha-app"
```

### Configuração do Assistente Virtual

#### 1. **Chave da OpenAI (Obrigatória)**
```bash
# Obtenha sua chave em: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-proj-..."
```

#### 2. **Configurações do Chat**
```env
# Habilitar/desabilitar assistente
NEXT_PUBLIC_ASSISTANT_ENABLED="true"

# Delay antes de mostrar (milissegundos)
NEXT_PUBLIC_ASSISTANT_DELAY="5000"

# Mensagem de boas-vindas personalizada
NEXT_PUBLIC_ASSISTANT_WELCOME_MESSAGE="Olá! Sou o assistente da Black Red Academia!"
```

#### 3. **Configurações da Academia**
```env
# Informações que aparecem no chat
NEXT_PUBLIC_ACADEMY_NAME="Black Red Academia"
NEXT_PUBLIC_ACADEMY_PHONE="5511999999999"
NEXT_PUBLIC_ACADEMY_EMAIL="contato@blackredacademia.com.br"
```

### Configuração do Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative a API do Google+ (se necessário)
4. Configure OAuth 2.0:
   - Tipo: Aplicativo da Web
   - URIs autorizadas:
     - Desenvolvimento: `http://localhost:3000/api/auth/google/callback`
     - Produção: `https://seudominio.com/api/auth/google/callback`

5. Copie as credenciais para o `.env.local`

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting
npm run type-check   # Verifica tipos TypeScript

# Banco de dados
npx prisma studio    # Interface gráfica do banco
npx prisma migrate dev --name nome-da-migracao  # Criar migração
npx prisma generate  # Gerar cliente Prisma
npx prisma db push   # Sincronizar schema

# Testes
npm run test         # Executar testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Relatório de cobertura
```

## 📁 Estrutura do Projeto

```
gym-starter/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rotas de autenticação
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticação
│   │   ├── users/                # Gestão de usuários
│   │   ├── appointments/         # Agendamentos
│   │   ├── testimonials/         # Depoimentos
│   │   └── ...
│   ├── dashboard/                # Dashboard admin
│   ├── student/                  # Área do aluno
│   ├── login/                    # Login admin
│   ├── register/                 # Cadastro
│   └── page.tsx                  # Homepage
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base shadcn/ui
│   ├── chat-flutuante.tsx        # 🤖 Assistente virtual inteligente
│   ├── appointment-modal.tsx     # Modal de agendamento
│   ├── plan-selection-modal.tsx  # Modal de seleção de plano
│   └── ...
├── contexts/                     # Contextos React
│   └── auth-context.tsx          # Contexto de autenticação
├── hooks/                        # Custom hooks
├── lib/                          # Utilitários
│   ├── auth.ts                   # Funções de autenticação
│   ├── prisma.ts                 # Cliente Prisma
│   ├── email.ts                  # Serviço de e-mail
│   └── utils.ts                  # Funções utilitárias
├── prisma/                       # Schema do banco
│   ├── schema.prisma             # Definição do banco
│   └── migrations/               # Migrações
├── public/                       # Arquivos estáticos
├── styles/                       # Estilos globais
└── types/                        # Tipos TypeScript
```

## 🎨 Componentes

### Componentes Principais
- **ChatFlutuante** - Assistente virtual inteligente com IA
- **AppointmentModal** - Modal para agendamento de aulas
- **PlanSelectionModal** - Modal para seleção de planos
- **CheckInModal** - Modal para check-in via QR Code
- **AuthGuard** - Proteção de rotas autenticadas

### Componentes UI
- **shadcn/ui** - Biblioteca de componentes acessíveis
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones

## 🔐 Autenticação

### Estratégias Suportadas
- ✅ **Login/Senha tradicional**
- ✅ **Google OAuth 2.0**
- ✅ **Sessões seguras** com cookies HTTPOnly
- ✅ **Proteção CSRF** via state parameter

### Níveis de Acesso
- **USER** - Aluno da academia
- **ADMIN** - Administrador do sistema

### Rotas Protegidas
- `/dashboard/*` - Apenas administradores
- `/student/*` - Apenas alunos autenticados
- `/api/admin/*` - Apenas administradores

## 📊 Dashboard Administrativo

### Funcionalidades
- 📈 **Métricas em tempo real**
- 👥 **Gestão completa de usuários**
- 📅 **Controle de agendamentos**
- 💬 **Sistema de depoimentos**
- 💰 **Gestão de planos**
- 📊 **Relatórios e estatísticas**

### Seções Principais
- **Dashboard** - Visão geral com métricas
- **Usuários** - Gerenciamento de alunos e funcionários
- **Agendamentos** - Controle de aulas e horários
- **Depoimentos** - Gerenciamento de feedback
- **Planos** - Configuração de preços e benefícios

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Estratégias
- ✅ **Mobile-first** approach
- ✅ **Componentes responsivos**
- ✅ **Grid flexível** com Tailwind CSS
- ✅ **Imagens otimizadas**
- ✅ **Fonte escalável**

## 🔒 Segurança

### Medidas Implementadas
- ✅ **HTTPS obrigatório** em produção
- ✅ **Sanitização de entrada**
- ✅ **Proteção contra SQL injection** (Prisma ORM)
- ✅ **Proteção contra XSS** (Next.js)
- ✅ **Rate limiting** nas APIs
- ✅ **Logs de auditoria**
- ✅ **Validação de dados** em tempo real

### Autenticação Segura
- ✅ **Hash de senhas** com bcrypt
- ✅ **JWT tokens** para sessões
- ✅ **Cookies seguros** com flags apropriadas
- ✅ **Proteção CSRF** em formulários

## 🚀 Deploy

### ✅ **Status: PRONTO PARA DEPLOY NA VERCEL**

O projeto foi completamente otimizado e testado para deploy na Vercel. Todas as correções críticas foram implementadas.

#### **🔧 Correções Implementadas**

##### **1. Configuração Next.js Otimizada**
```javascript
// next.config.mjs
const nextConfig = {
  eslint: { ignoreDuringBuilds: false },      // ✅ Verificações ativas
  typescript: { ignoreBuildErrors: false },   // ✅ Verificações ativas
  images: { unoptimized: false }               // ✅ Otimização ativa
}
```

##### **2. Package.json Otimizado**
```json
{
  "scripts": {
    "build": "next build",              // ✅ Build limpo
    "postbuild": "prisma generate"      // ✅ Prisma executado após build
  }
}
```
**✅ Removidas dependências desnecessárias:**
- `@remix-run/react`, `@sveltejs/kit`, `svelte`, `vue`, `vue-router`

##### **3. Prisma Otimizado para Serverless**
```typescript
// lib/prisma.ts
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: { db: { url: process.env.DATABASE_URL } }
})
```

##### **4. APIs Compatíveis com Next.js 15**
```typescript
// ✅ Correção aplicada em todas as rotas dinâmicas
{ params }: { params: Promise<{ id: string }> }  // ANTES: { params: { id: string } }
```

##### **5. Arquivo vercel.json Configurado**
```json
{
  "functions": { "app/api/**/*.ts": { "maxDuration": 10 } },
  "regions": ["gru1"],
  "buildCommand": "npm run build",
  "framework": "nextjs"
}
```

### 📋 **Passos para Deploy na Vercel**

#### **1. Preparar Repositório**
```bash
# Commit das correções
git add .
git commit -m "fix: correções para deploy na Vercel - Next.js 15 compatibilidade"
git push origin main
```

#### **2. Configurar Projeto na Vercel**
1. **Importe o repositório** no painel da Vercel
2. **Configure as variáveis de ambiente:**
   ```
   DATABASE_URL=postgresql://neondb_owner:password@ep-region.aws.neon.tech/neondb?sslmode=require
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   ```

#### **3. Configurações da Vercel**
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install`
- **Node.js Version**: 18.x ou superior

#### **4. Banco de Dados**
- **Recomendado**: Neon.tech ou Supabase
- **Região**: South America (São Paulo)
- **Configuração**: Connection pooling ativado

### 📊 **Resultado do Build**
```
✅ Compiled successfully
✅ Linting and checking validity of types
✅ Generating static pages (33/33)
✅ Prisma Client generated
✅ Bundle size: 102kB (otimizado)
```

### ⚠️ **Considerações Importantes**

#### **Variáveis de Ambiente Críticas**
```env
# Produção - OBRIGATÓRIAS
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
OPENAI_API_KEY="your-production-openai-key"
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"

# Configurações do Assistente Virtual
NEXT_PUBLIC_ASSISTANT_ENABLED="true"
NEXT_PUBLIC_ASSISTANT_DELAY="5000"
NEXT_PUBLIC_ACADEMY_NAME="Black Red Academia"
NEXT_PUBLIC_ACADEMY_PHONE="5511999999999"

# Opcionais
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_SMTP_HOST="smtp.gmail.com"
EMAIL_SMTP_PORT="587"
EMAIL_SMTP_USER="your-email@gmail.com"
EMAIL_SMTP_PASS="your-app-password"
```

#### **Possíveis Warnings (Não-Crítics)**
- Alguns warnings sobre uso de `<img>` em vez de `<Image />`
- Podem ser corrigidos futuramente para otimização adicional

### 🌐 **URLs de Produção**
Após deploy, configure:
- **Google OAuth Redirect URIs**:
  - `https://your-app.vercel.app/api/auth/google/callback`
- **App URL** em configurações da academia
- **Webhook URLs** se aplicável

### 📈 **Monitoramento**
- **Vercel Analytics** - Já integrado
- **Logs de erro** - Disponíveis no painel da Vercel
- **Performance** - Monitore Core Web Vitals

### 🔄 **Atualizações Futuras**
```bash
# Para atualizar em produção
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Vercel fará deploy automático
```

### 📞 **Suporte para Deploy**
- **Documentação Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Comunidade**: [vercel.community](https://vercel.community)

---

**🎉 O projeto está 100% pronto para deploy na Vercel!**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código
- ✅ **ESLint** configurado
- ✅ **Prettier** para formatação
- ✅ **TypeScript** obrigatório
- ✅ **Conventional Commits**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico:
- 📧 **Email**: suporte@gymstarter.com.br
- 💬 **WhatsApp**: +55 11 99999-9999
- 📖 **Documentação**: [docs.gymstarter.com.br](https://docs.gymstarter.com.br)

## 📈 Últimas Atualizações (v1.1.0)

### 🤖 **Assistente Virtual Inteligente**
- ✅ **Chatbot com IA integrada** usando OpenAI GPT
- ✅ **Interpretação inteligente de linguagem natural**
- ✅ **Agendamento automático** via chat
- ✅ **Integração com WhatsApp** inteligente
- ✅ **Tratamento de erros** e recuperação automática
- ✅ **Interface responsiva** e acessível
- ✅ **Detecção contextual** de intenção
- ✅ **Mensagens personalizadas** baseadas na conversa

### 🔧 **Melhorias Técnicas**
- ✅ **Modal persistente** que não fecha completamente
- ✅ **Animações suaves** de expandir/colapsar
- ✅ **Tratamento de crash** com botão de reload
- ✅ **Ícone oficial do WhatsApp** (SVG nativo)
- ✅ **Responsividade mobile-first**
- ✅ **Acessibilidade WCAG** completa
- ✅ **Timeout inteligente** para detectar travamentos
- ✅ **Logs detalhados** para análise

### 📱 **Experiência do Usuário**
- ✅ **Detecção automática** de tópicos complexos
- ✅ **Redirecionamento inteligente** para WhatsApp
- ✅ **Mensagens contextuais** personalizadas
- ✅ **Validação em tempo real** de agendamentos
- ✅ **Feedback visual** imediato
- ✅ **Navegação por teclado** completa

### 🔒 **Segurança e Performance**
- ✅ **Rate limiting** nas APIs
- ✅ **Sanitização de entrada** inteligente
- ✅ **Logs de auditoria** para interações
- ✅ **Cache otimizado** para respostas
- ✅ **Bundle size** reduzido

## 🙏 Agradecimentos

- **Next.js** - Framework incrível
- **shadcn/ui** - Componentes acessíveis
- **Prisma** - ORM excepcional
- **Tailwind CSS** - Framework CSS produtivo
- **OpenAI** - Tecnologia de IA revolucionária
- **Comunidade Open Source** - Por tornar tudo isso possível

---

<div align="center">
  <p>Feito com ❤️ pela equipe GymStarter</p>
  <p>
    <a href="#gymstarter---sistema-de-gestão-de-academia">
      Voltar ao topo
    </a>
  </p>
</div>