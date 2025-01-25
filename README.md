# NestJS Authentication Boilerplate

A production-ready authentication service built with NestJS, implementing Clean Architecture, CQRS, and enterprise-level security practices.

## 🌟 Key Features

### Architecture & Design
- **Clean Architecture** with strict separation of concerns
- **CQRS Pattern** for better scalability and maintainability
- **Domain-Driven Design** principles
- **Facade Pattern** for simplified module interfaces
- **Repository Pattern** for data access abstraction

### Authentication & Security
- **JWT Authentication** with token versioning for secure logout
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** for brute force protection
- **Request Validation** using class-validator
- **CORS Protection** with configurable origins
- **Security Headers** using Helmet

### Database & Caching
- **PostgreSQL** with Prisma ORM
  - Type-safe database access
  - Automatic migrations
  - Connection pooling
- **Redis Caching**
  - Automatic cache invalidation
  - Configurable TTL
  - Cache prefixing

### Performance & Reliability
- **Fastify** as HTTP provider
- **Pino Logger** for structured logging
- **Health Checks** for monitoring
- **Graceful Shutdown** handling
- **Error Boundary** implementation

## 🏗️ Architecture Overview

### Domain Layer (`src/modules/*/domain`)
- Entities and Value Objects
- Repository Interfaces
- Domain Events
- Business Rules

### Application Layer (`src/modules/*/application`)
- Use Cases (Commands/Queries)
- DTOs and Validators
- Facades
- Event Handlers

### Infrastructure Layer (`src/modules/*/infrastructure`)
- Repository Implementations
- External Service Adapters
- Database Configurations
- Cache Implementations

### Interface Layer (`src/modules/*/interface`)
- Controllers
- Middleware
- Request/Response DTOs
- API Documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Redis 6+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nestjs-auth-boilerplate.git
cd nestjs-auth-boilerplate
```

2. Install dependencies:
```bash
yarn install
```

3. Environment setup:
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Database setup:
```bash
# Run migrations
yarn prisma migrate dev

# Generate Prisma client
yarn prisma generate
```

5. Start the application:
```bash
# Development
yarn start:dev

# Production
yarn build
yarn start:prod
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```
#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
yarn test

# With coverage
yarn test:cov
```

### E2E Tests
```bash
# Run e2e tests
yarn test:e2e
```

### Load Tests
```bash
# Run k6 load tests
yarn test:load
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.