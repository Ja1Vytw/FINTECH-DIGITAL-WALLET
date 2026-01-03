# Plataforma Fintech - Carteira Digital

Uma plataforma fintech completa para gerenciamento de carteira digital, com funcionalidades de transações, controle de saldo e dashboard financeiro.

## Índice

- [Stack Tecnológica](#stack-tecnológica)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar](#como-rodar)
- [Decisões Técnicas](#decisões-técnicas)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Contribuindo](#contribuindo)

## Stack Tecnológica

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (Autenticação JWT)
- **Spring Data JPA**
- **PostgreSQL 15**
- **Flyway** (Migrações de banco de dados)
- **Swagger/OpenAPI** (Documentação da API)

### Frontend
- **React 18** com **TypeScript**
- **Vite** (Ferramenta de build)
- **React Router** (Roteamento)
- **Tailwind CSS 4.1** (100% utility-first)
- **Axios** (Cliente HTTP)
- **Recharts** (Visualização de dados)
- **React Hook Form + Zod** (Validação de formulários)
- **React i18next** (Internacionalização - EN, PT-BR, PT-PT)
- **Vitest** (Framework de testes)

## Funcionalidades

### Autenticação e Gerenciamento de Usuários
- Cadastro de usuários com formulário completo (14 países suportados)
- Autenticação baseada em JWT
- Processo de cadastro multi-etapas (Dados Pessoais → Endereço → Segurança)
- Busca automática de CEP (Brasil)
- Formatação de documento, telefone e CEP por país

### Gerenciamento de Carteira
- Controle de saldo em tempo real
- Histórico de transações com filtros
- Categorização de receitas e despesas
- Criação de categorias personalizadas
- Validação de saldo (impede saldos negativos)

### Pagamentos (Simulados)
- Pagamentos **PIX** (sistema de pagamento instantâneo do Brasil)
- Transferências bancárias
- Pagamento de boletos
- Histórico de pagamentos

### Dashboard Financeiro
- Gráficos de receitas vs despesas
- Análise de gastos por categoria
- Tendências de transações ao longo do tempo
- Filtros por período (mês atual, mês anterior, intervalo personalizado)

### Experiência do Usuário
- Design responsivo **mobile-first**
- Conformidade de acessibilidade **WCAG 2.1 AA**
- **Suporte multi-idioma** (Inglês, Português do Brasil, Português de Portugal)
- Interface moderna inspirada no Nubank
- Animações e transições suaves
- Interface otimizada para toque

## Estrutura do Projeto

```
fintech-digital-wallet/
├── backend/                    # Aplicação Spring Boot
│   ├── src/main/java/com/fintech/wallet/
│   │   ├── domain/            # Entidades de domínio e regras de negócio
│   │   ├── application/       # Casos de uso e serviços de negócio
│   │   ├── infrastructure/    # Implementações técnicas
│   │   │   ├── persistence/   # Repositórios JPA
│   │   │   ├── security/      # Configuração JWT e segurança
│   │   │   └── mappers/       # Mapeadores Entity-DTO
│   │   └── interfaces/        # Controllers REST e DTOs
│   └── src/main/resources/
│       ├── db/migration/      # Migrações Flyway
│       └── application.yml
├── frontend/                   # Aplicação React + TypeScript
│   └── src/
│       ├── app/
│       │   ├── core/          # Serviços globais, autenticação, guards
│       │   ├── shared/        # Componentes reutilizáveis
│       │   ├── features/      # Módulos baseados em funcionalidades
│       │   │   ├── auth/      # Autenticação
│       │   │   ├── home/      # Página inicial
│       │   │   ├── payments/  # Processamento de pagamentos
│       │   │   ├── transactions/ # Gerenciamento de transações
│       │   │   ├── dashboard/ # Dashboard financeiro
│       │   │   └── wallet/     # Saldo da carteira
│       │   └── layouts/        # Layouts da aplicação
│       ├── i18n/              # Configuração de internacionalização
│       └── styles/            # Estilos globais e tokens
├── docker-compose.yml
└── README.md
```

## Como Rodar

### Pré-requisitos

- **Java 17+**
- **Node.js 18+**
- **Docker** e **Docker Compose** (para PostgreSQL)

### Configuração do Backend

1. **Iniciar PostgreSQL usando Docker:**
```bash
docker-compose up -d postgres
```

2. **Configurar variáveis de ambiente:**
Criar um arquivo `.env` na pasta `backend/` ou configurar no `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/wallet_db
    username: wallet_user
    password: wallet_pass
  jpa:
    hibernate:
      ddl-auto: validate
```

3. **Executar o backend:**
```bash
cd backend
./mvnw spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

**Swagger UI:** `http://localhost:8080/swagger-ui/index.html`

### Configuração do Frontend

1. **Instalar dependências:**
```bash
cd frontend
npm install
```

2. **Configurar variáveis de ambiente:**
Criar um arquivo `.env` na pasta `frontend/`:
```
VITE_API_URL=http://localhost:8080/api
```

3. **Executar em modo de desenvolvimento:**
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Executar Testes

**Backend:**
```bash
cd backend
./mvnw test
```

**Frontend:**
```bash
cd frontend
npm test
```

## Decisões Técnicas

### Arquitetura

- **Backend:** Arquitetura Limpa com separação clara entre domínio, aplicação, infraestrutura e interfaces
- **Frontend:** Arquitetura baseada em funcionalidades com separação entre core, shared e módulos de funcionalidades

### Princípios de Qualidade de Código

1. **Clareza sobre inteligência:** Código simples e legível
2. **Responsabilidade única:** Funções e componentes pequenos e focados
3. **Legibilidade sobre escrita:** Priorizar a legibilidade do código
4. **Tamanho de componente:** Máximo de 150 linhas por componente
5. **Tamanho de função:** Máximo de 20-30 linhas por função

### Segurança

- Autenticação baseada em token JWT
- Validação dupla (frontend + backend)
- Hash de senhas com BCrypt
- Configuração CORS
- Validação de entrada com Bean Validation
- Prevenção de SQL injection via JPA

### Acessibilidade

- HTML semântico
- Labels em todos os inputs
- Labels ARIA onde necessário
- Indicadores de foco visíveis
- Taxa de contraste mínima 4.5:1
- Suporte de navegação por teclado
- Compatibilidade com leitores de tela

### Regras de Negócio

- **Saldo não pode ser negativo:** Validação no `WalletService` antes de criar transações de débito
- **Transações válidas:** Amount > 0, Type obrigatório, validação de categoria
- **Autenticação obrigatória:** Todas as rotas (exceto auth) requerem token JWT válido

### Estilização

- **100% Tailwind CSS:** Abordagem utility-first
- **CSS customizado mínimo:** Apenas para animações complexas e pseudo-elementos
- **Design tokens:** Variáveis CSS para theming consistente
- **Design responsivo:** Abordagem mobile-first com breakpoints

## Documentação da API

A documentação da API está disponível via Swagger:

- **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON:** `http://localhost:8080/api-docs`

### Principais Endpoints

#### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Obter usuário atual (protegido)

#### Carteira
- `GET /api/wallet/balance` - Obter saldo da carteira (protegido)

#### Transações
- `POST /api/transactions` - Criar transação (protegido)
- `GET /api/transactions` - Listar transações com filtros (protegido)

#### Categorias
- `GET /api/categories` - Listar categorias (protegido)

#### Dashboard
- `GET /api/dashboard` - Obter dados do dashboard (protegido)

#### Pagamentos
- `POST /api/payments` - Criar pagamento (protegido)
- `GET /api/payments` - Listar pagamentos (protegido)

## Testes

### Backend
- Testes unitários para serviços críticos (`WalletService`, `TransactionService`)
- Testes de integração para controllers
- Banco de dados H2 em memória para testes

### Frontend
- Testes de componentes para componentes críticos (`TransactionForm`, `BalanceCard`)
- Testes de acessibilidade com `@axe-core/react`
- Testes de interação do usuário com `@testing-library/user-event`

## Contribuindo

1. Seguir o estilo de código e arquitetura estabelecidos
2. Escrever testes para novas funcionalidades
3. Garantir conformidade de acessibilidade (WCAG 2.1 AA)
4. Manter responsividade móvel
5. Atualizar documentação conforme necessário

## Licença

Este projeto é software proprietário.

