# Configuração Google OAuth - Black Red Gym

Este documento explica como configurar o login com Google OAuth no sistema Black Red Gym.

## 📋 Pré-requisitos

- Conta Google
- Projeto Next.js configurado
- Variáveis de ambiente configuradas

## 🔧 Passo 1: Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ (se necessário)

## 🔧 Passo 2: Configurar OAuth 2.0

1. No menu lateral, vá para **APIs e Serviços > Credenciais**
2. Clique em **+ CRIAR CREDENCIAIS > ID do cliente OAuth 2.0**
3. Configure:
   - **Tipo de aplicativo**: Aplicativo da Web
   - **Nome**: Black Red Gym
   - **URIs de redirecionamento autorizadas**:
     - Para desenvolvimento: `http://localhost:3000/api/auth/google/callback`
     - Para produção: `https://seudominio.com/api/auth/google/callback`

4. Anote o **ID do cliente** e **Chave secreta do cliente**

## 🔧 Passo 3: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Configure as variáveis no `.env.local`:
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="sua-client-secret"

   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

## 🔧 Passo 4: Testar a Configuração

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse as páginas de login/cadastro:
   - Login: `http://localhost:3000/student/login`
   - Cadastro: `http://localhost:3000/register`

3. Clique no botão "Continuar com Google" ou "Cadastrar com Google"

## 🔧 Passo 5: Configuração para Produção

1. Atualize as variáveis de ambiente:
   ```env
   NEXT_PUBLIC_APP_URL="https://seudominio.com"
   ```

2. Adicione o domínio de produção nas **URIs de redirecionamento autorizadas** no Google Cloud Console

3. Configure as credenciais de produção no Google Cloud Console

## 🛠️ Solução de Problemas

### Erro: "redirect_uri_mismatch"
- Verifique se a URI de redirecionamento no Google Cloud Console corresponde exatamente à URL da aplicação
- Para desenvolvimento: `http://localhost:3000/api/auth/google/callback`
- Para produção: `https://seudominio.com/api/auth/google/callback`

### Erro: "invalid_client"
- Verifique se o `GOOGLE_CLIENT_ID` está correto
- Certifique-se de que a API do Google+ está ativada

### Erro: "access_denied"
- O usuário cancelou a autorização
- Tente novamente

### Erro: "server_error"
- Verifique se o `GOOGLE_CLIENT_SECRET` está correto
- Verifique os logs do servidor para mais detalhes

## 📝 Funcionalidades Implementadas

✅ **Login com Google**: Permite login usando conta Google
✅ **Cadastro com Google**: Permite cadastro usando conta Google
✅ **Fallback para senha**: Mantém opção de login/cadastro tradicional
✅ **Redirecionamento automático**: Redireciona para dashboard correto baseado no tipo de usuário
✅ **Tratamento de erros**: Mensagens de erro claras para diferentes cenários

## 🔒 Segurança

- ✅ **HTTPS obrigatório** em produção
- ✅ **Validação de tokens** OAuth
- ✅ **Proteção CSRF** via state parameter
- ✅ **Cookies seguros** com httpOnly
- ✅ **Validação de usuários** existentes

## 📞 Suporte

Para problemas com a configuração do Google OAuth, consulte:
- [Documentação Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)