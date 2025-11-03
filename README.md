# 🎉 Sistema de Gestão de Eventos v2.0

**SQL Server Local + Firebase Auth (Google)**

Sistema completo para gerenciar eventos, enviar convites com QR Code e controlar presença.

## 🏗️ Arquitetura

- **Frontend:** Next.js 14 + React + TypeScript + Tailwind CSS
- **Banco de Dados:** SQL Server (Local) com Prisma ORM
- **Autenticação:** Firebase Authentication (Google Sign-In)
- **Backend:** Next.js API Routes
- **Email:** Resend API

## ✨ Funcionalidades

- ✅ Login com Google (Firebase Auth)
- ✅ Cadastro de eventos e feiras
- ✅ Importação de convidados via Excel
- ✅ Geração automática de QR Codes
- ✅ Envio de emails com convites
- ✅ Scanner de QR Code (PWA)
- ✅ Dashboard com analytics
- ✅ Controle de presença

---

## 🚀 Instalação

### Pré-requisitos

1. **Node.js 18+** - https://nodejs.org/
2. **SQL Server** (você já tem: HOME\SQLEXPRESS)
3. **Conta Firebase** (vamos criar)

### Passo 1: Configurar o Banco de Dados

Sua connection string SQL Server:
```
Data Source=HOME\SQLEXPRESS;Integrated Security=True;Encrypt=True;TrustServerCertificate=True
```

O Prisma vai criar o banco `event_management` automaticamente!

### Passo 2: Clonar/Baixar o Projeto

Extraia a pasta `event-management-v2` no seu computador.

### Passo 3: Instalar Dependências

```bash
cd event-management-v2
npm install
```

### Passo 4: Configurar Firebase (SIGA ATENTAMENTE)

#### 4.1 - Criar Projeto Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em "Adicionar projeto"
3. Nome: **"gestao-eventos"**
4. Desabilite Google Analytics
5. Clique em "Criar projeto"

#### 4.2 - Habilitar Google Sign-In

1. Menu lateral > **"Authentication"**
2. Clique em **"Começar"**
3. Aba **"Sign-in method"**
4. Clique em **"Google"**
5. **Ative** o toggle
6. Email de suporte: seu email do Google
7. Clique em **"Salvar"**

#### 4.3 - Obter Credenciais Web

1. Ícone de engrenagem ⚙️ > **"Configurações do projeto"**
2. Seção **"Seus aplicativos"** > Clique no ícone Web `</>`
3. Apelido: **"web-app"**
4. NÃO marque Firebase Hosting
5. Clique em **"Registrar app"**
6. **COPIE** as configurações:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "gestao-eventos-xxx.firebaseapp.com",
  projectId: "gestao-eventos-xxx",
  storageBucket: "gestao-eventos-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123"
};
```

#### 4.4 - Gerar Service Account Key

1. Ainda em **"Configurações do projeto"**
2. Aba **"Contas de serviço"**
3. Clique em **"Gerar nova chave privada"**
4. Clique em **"Gerar chave"**
5. Um arquivo JSON será baixado → **GUARDE ELE!**

### Passo 5: Configurar .env.local

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite o `.env.local` e preencha:

```env
# SQL Server
DATABASE_URL="sqlserver://HOME\\SQLEXPRESS;database=event_management;integratedSecurity=true;trustServerCertificate=true;encrypt=true"

# Firebase Web (cole as credenciais do passo 4.3)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gestao-eventos-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gestao-eventos-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gestao-eventos-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123

# Firebase Admin (cole o conteúdo do JSON do passo 4.4 em UMA LINHA)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"gestao-eventos-xxx",...}'

# Email (opcional por enquanto)
RESEND_API_KEY=
EMAIL_FROM=noreply@seudominio.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**IMPORTANTE:** Para o `FIREBASE_SERVICE_ACCOUNT_KEY`, abra o arquivo JSON baixado e cole todo o conteúdo em uma única linha entre aspas simples.

### Passo 6: Criar o Banco de Dados

```bash
# Gera o Prisma Client
npm run prisma:generate

# Cria as tabelas no SQL Server
npm run db:push
```

Se der erro, certifique-se que o SQL Server está rodando!

### Passo 7: Executar o Projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

Você será redirecionado para `/login` e verá o botão "Entrar com Google"! 🎉

---

## 📁 Estrutura do Projeto

```
event-management-v2/
├── prisma/
│   └── schema.prisma          # Schema do banco
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   └── auth/
│   │   │       └── sync/     # Sincronizar usuário
│   │   ├── login/            # Página de login
│   │   └── page.tsx          # Redireciona para login
│   ├── hooks/
│   │   └── useAuth.ts        # Hook de autenticação
│   ├── lib/
│   │   ├── firebase-client.ts  # Firebase Client
│   │   ├── firebase-admin.ts   # Firebase Admin
│   │   ├── prisma.ts          # Prisma Client
│   │   ├── auth-middleware.ts # Middleware de auth
│   │   ├── qrcode.ts          # Funções QR Code
│   │   └── excel.ts           # Processamento Excel
│   └── types/                 # TypeScript types
├── .env.local                 # Variáveis de ambiente
├── package.json
└── README.md
```

---

## 🔐 Como Funciona a Autenticação

1. Usuário clica em "Entrar com Google"
2. Firebase abre popup de autenticação do Google
3. Usuário seleciona conta e autoriza
4. Firebase retorna token JWT
5. Frontend envia token para `/api/auth/sync`
6. Backend valida token e cria/atualiza usuário no SQL Server
7. Usuário é redirecionado para `/dashboard`

---

## 🗄️ Estrutura do Banco

### Tabelas criadas:

- **users** - Usuários do sistema
- **events** - Eventos e feiras
- **invites** - Convites com QR Codes
- **attendances** - Registro de presenças

### Visualizar banco:

```bash
npm run prisma:studio
```

Abre interface web em http://localhost:5555

---

## ♻️ Refatoração Recente (Concluída!)

### Separação de Responsabilidades
O projeto foi completamente refatorado seguindo o padrão **Option A**:

- **Custom Hooks** (`src/hooks/`): Toda lógica TypeScript (state, side effects, API calls)
- **Componentes UI** (`src/components/`): Apresentação pura (JSX/TSX)
- **Páginas** (`src/app/`): Orquestração de hooks e componentes

### Resultados da Refatoração

| Página | Antes | Depois | Redução |
|--------|-------|--------|---------|
| Check-in | ~450 linhas | ~160 linhas | **64%** ↓ |
| Dashboard | ~356 linhas | ~65 linhas | **82%** ↓ |
| Eventos | ~527 linhas | ~140 linhas | **73%** ↓ |
| Detalhes | ~775 linhas | ~480 linhas | **38%** ↓ |
| Scanner | ~236 linhas | ~55 linhas | **77%** ↓ |
| Login | ~78 linhas | ~20 linhas | **74%** ↓ |

### Hooks Criados
- ✅ `useAuth.ts` - Autenticação Firebase
- ✅ `useQRScanner.ts` - Scanner QR Code com OpenCV
- ✅ `useDashboard.ts` - Dashboard e estatísticas
- ✅ `useEvents.ts` - Listagem e filtros de eventos
- ✅ `useEventDetails.ts` - Detalhes e gerenciamento de evento
- ✅ `useScanner.ts` - Seleção de evento para check-in
- ✅ `useLogin.ts` - Fluxo de login

### Componentes Criados
- ✅ `checkin/` - 3 componentes (ScannerVideo, CheckinResult, CheckinInstructions)
- ✅ `dashboard/` - 5 componentes (Header, Welcome, Stats, QuickActions, SystemStatus)
- ✅ `events/` - 6 componentes (Header, Filters, Card, EmptyState, Pagination, QuickStats)
- ✅ `event-details/` - 3 componentes (Header, InfoCard, StatsCards)
- ✅ `scanner/` - 4 componentes (Header, EventsList, EmptyState, Instructions)
- ✅ `login/` - 4 componentes (LoadingState, Header, GoogleButton, Footer)

## 🎯 Status do Projeto

### ✅ Fases Concluídas

#### Fase 1: Dashboard ✓
- ✅ Layout do dashboard
- ✅ Listar eventos do usuário
- ✅ Cards com estatísticas

#### Fase 2: CRUD de Eventos ✓
- ✅ Formulário criar evento
- ✅ Listar eventos
- ✅ Editar evento
- ✅ Excluir evento
- ✅ Filtros e paginação
- ✅ Busca de eventos

#### Fase 3: Gestão de Convidados ✓
- ✅ Upload Excel
- ✅ Preview dados
- ✅ Importação em lote
- ✅ Gerar QR Codes
- ✅ Adicionar convite manual

#### Fase 4: Envio de Emails ✓
- ✅ Template HTML
- ✅ Envio individual
- ✅ Envio em lote
- ✅ Status de envio

#### Fase 5: Scanner e Check-in ✓
- ✅ Interface scanner
- ✅ Leitura QR Code (OpenCV + Python)
- ✅ Registro de presença
- ✅ Feedback visual
- ✅ Scanner contínuo

#### Fase 6: Analytics ✓
- ✅ Dashboard com estatísticas
- ✅ Taxa de presença
- ✅ Convites enviados
- ✅ Total de check-ins

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Erro ao conectar SQL Server
- Verifique se SQL Server está rodando
- Teste a connection string no SQL Server Management Studio
- Verifique o nome da instância: HOME\SQLEXPRESS

### Erro: "Firebase config not found"
- Verifique se o `.env.local` existe
- Certifique-se que todas as variáveis NEXT_PUBLIC_ estão preenchidas
- Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro: "Token inválido"
- Verifique se o FIREBASE_SERVICE_ACCOUNT_KEY está correto
- O JSON deve estar em uma única linha
- Não pode ter quebras de linha

---

## 📞 Suporte

- Documentação Firebase: https://firebase.google.com/docs
- Documentação Prisma: https://www.prisma.io/docs
- Documentação Next.js: https://nextjs.org/docs

---

## ✅ Checklist de Configuração

- [ ] Node.js instalado
- [ ] SQL Server rodando
- [ ] Projeto Firebase criado
- [ ] Google Sign-In habilitado
- [ ] Credenciais web copiadas
- [ ] Service Account Key baixado
- [ ] .env.local configurado
- [ ] `npm install` executado
- [ ] `npm run prisma:generate` executado
- [ ] `npm run db:push` executado
- [ ] `npm run dev` funcionando
- [ ] Login com Google testado

---

**Pronto! Sistema funcionando!** 🚀

Quando terminar a configuração, me avise para criarmos o Dashboard!
