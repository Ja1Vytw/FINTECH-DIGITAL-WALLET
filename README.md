# Digital Wallet Platform

A comprehensive fintech platform for digital wallet management, featuring transaction handling, balance tracking, and financial dashboard capabilities.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Technical Decisions](#technical-decisions)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT authentication)
- **Spring Data JPA**
- **PostgreSQL 15**
- **Flyway** (Database migrations)
- **Swagger/OpenAPI** (API documentation)

### Frontend
- **React 18** with **TypeScript**
- **Vite** (Build tool)
- **React Router** (Routing)
- **Tailwind CSS 4.1** (100% utility-first styling)
- **Axios** (HTTP client)
- **Recharts** (Data visualisation)
- **React Hook Form + Zod** (Form validation)
- **React i18next** (Internationalisation - EN, PT-BR, PT-PT)
- **Vitest** (Testing framework)

## Features

### Authentication & User Management
- User registration with comprehensive form (14 countries supported)
- JWT-based authentication
- Multi-step registration process (Personal Data → Address → Security)
- Automatic postal code lookup (Brazil)
- Document, phone, and postal code formatting per country

### Wallet Management
- Real-time balance tracking
- Transaction history with filtering
- Income and expense categorisation
- Custom category creation
- Balance validation (prevents negative balances)

### Payments (Simulated)
- **PIX** payments (Brazil instant payment system)
- Bank transfers
- Bill payments (boleto)
- Payment history

### Financial Dashboard
- Income vs expense charts
- Category-based spending analysis
- Transaction trends over time
- Period filtering (current month, last month, custom range)

### User Experience
- **Mobile-first** responsive design
- **WCAG 2.1 AA** accessibility compliance
- **Multi-language support** (English, Brazilian Portuguese, European Portuguese)
- Nubank-inspired modern UI
- Smooth animations and transitions
- Touch-friendly interface

## Project Structure

```
fintech-digital-wallet/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/fintech/wallet/
│   │   ├── domain/            # Domain entities and business rules
│   │   ├── application/       # Use cases and business services
│   │   ├── infrastructure/    # Technical implementations
│   │   │   ├── persistence/   # JPA repositories
│   │   │   ├── security/      # JWT and security config
│   │   │   └── mappers/       # Entity-DTO mappers
│   │   └── interfaces/        # REST controllers and DTOs
│   └── src/main/resources/
│       ├── db/migration/      # Flyway migrations
│       └── application.yml
├── frontend/                   # React + TypeScript application
│   └── src/
│       ├── app/
│       │   ├── core/          # Global services, auth, guards
│       │   ├── shared/        # Reusable components
│       │   ├── features/      # Feature-based modules
│       │   │   ├── auth/      # Authentication
│       │   │   ├── home/      # Home page
│       │   │   ├── payments/  # Payment processing
│       │   │   ├── transactions/ # Transaction management
│       │   │   ├── dashboard/ # Financial dashboard
│       │   │   └── wallet/    # Wallet balance
│       │   └── layouts/        # Application layouts
│       ├── i18n/              # Internationalisation config
│       └── styles/            # Global styles and tokens
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- **Java 17+**
- **Node.js 18+**
- **Docker** and **Docker Compose** (for PostgreSQL)

### Backend Setup

1. **Start PostgreSQL using Docker:**
```bash
docker-compose up -d postgres
```

2. **Configure environment variables:**
Create a `.env` file in the `backend/` directory or configure in `application.yml`:
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

3. **Run the backend:**
```bash
cd backend
./mvnw spring-boot:run
```

The backend will be available at `http://localhost:8080`

**Swagger UI:** `http://localhost:8080/swagger-ui/index.html`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment variables:**
Create a `.env` file in the `frontend/` directory:
```
VITE_API_URL=http://localhost:8080/api
```

3. **Run in development mode:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Running Tests

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

## Technical Decisions

### Architecture

- **Backend:** Clean Architecture with clear separation between domain, application, infrastructure, and interfaces
- **Frontend:** Feature-based architecture with separation between core, shared, and feature modules

### Code Quality Principles

1. **Clarity over cleverness:** Simple, readable code
2. **Single responsibility:** Small, focused functions and components
3. **Readability over writability:** Prioritise code readability
4. **Component size:** Maximum 150 lines per component
5. **Function size:** Maximum 20-30 lines per function

### Security

- JWT token-based authentication
- Dual validation (frontend + backend)
- BCrypt password hashing
- CORS configuration
- Input validation with Bean Validation
- SQL injection prevention via JPA

### Accessibility

- Semantic HTML
- Labels on all inputs
- ARIA labels where necessary
- Visible focus indicators
- Minimum contrast ratio 4.5:1
- Keyboard navigation support
- Screen reader compatibility

### Business Rules

- **Balance cannot be negative:** Validation in `WalletService` before creating debit transactions
- **Valid transactions:** Amount > 0, Type required, category validation
- **Authentication required:** All routes (except auth) require valid JWT token

### Styling

- **100% Tailwind CSS:** Utility-first approach
- **Minimal custom CSS:** Only for complex animations and pseudo-elements
- **Design tokens:** CSS variables for consistent theming
- **Responsive design:** Mobile-first approach with breakpoints

## API Documentation

API documentation is available via Swagger:

- **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON:** `http://localhost:8080/api-docs`

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

#### Wallet
- `GET /api/wallet/balance` - Get wallet balance (protected)

#### Transactions
- `POST /api/transactions` - Create transaction (protected)
- `GET /api/transactions` - List transactions with filters (protected)

#### Categories
- `GET /api/categories` - List categories (protected)

#### Dashboard
- `GET /api/dashboard` - Get dashboard data (protected)

#### Payments
- `POST /api/payments` - Create payment (protected)
- `GET /api/payments` - List payments (protected)

## Testing

### Backend
- Unit tests for critical services (`WalletService`, `TransactionService`)
- Integration tests for controllers
- In-memory H2 database for testing

### Frontend
- Component tests for critical components (`TransactionForm`, `BalanceCard`)
- Accessibility testing with `@axe-core/react`
- User interaction testing with `@testing-library/user-event`

## Contributing

1. Follow the established code style and architecture
2. Write tests for new features
3. Ensure accessibility compliance (WCAG 2.1 AA)
4. Maintain mobile responsiveness
5. Update documentation as needed

## License

This project is proprietary software.
