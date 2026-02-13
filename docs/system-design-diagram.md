# FinFlow System Design Diagram

This document maps the runtime architecture of **FinFlow** across client, API, application, infrastructure, and external providers.

## 1) High-Level Container Diagram

```mermaid
flowchart TB
    U[End User\nBrowser / Mobile] --> UI[Next.js 14 UI\nfinflow-ui]

    subgraph Docker Network (finflow-net)
      UI -->|HTTPS/JSON\nJWT + Cookies| API[FinFlow.API\nASP.NET Core 9]
      API --> APP[FinFlow.Application\nCQRS + MediatR + Validators]
      APP --> INF[FinFlow.Infrastructure\nRepositories + EF Core + Stripe Services]
      INF --> DB[(PostgreSQL 15\nfinflowdb)]
      PG[pgAdmin] --> DB
    end

    API <-->|Payment Intents / Checkout / Webhooks| STRIPE[Stripe API]
    API --> LOGS[Console/File Logs\n(+ Seq when configured)]
```

---

## 2) Backend Layered Design (Clean Architecture)

```mermaid
flowchart LR
    C[Controllers\nAuth/Wallets/Payments/Cards/Transactions]
    M[MediatR\nCommand & Query Dispatch]
    H[Handlers\nUse Cases]
    V[FluentValidation\nValidationBehavior]
    I[Interfaces\nIUserRepository, IWalletRepository, ...]
    R[Infrastructure Repositories\nEF Core implementations]
    D[(FinFlowDbContext\nPostgreSQL)]
    S[Services\nJwtTokenGenerator\nTokenService\nStripePaymentService]
    E[External Stripe]

    C --> M
    M --> V
    V --> H
    H --> I
    I --> R
    R --> D
    H --> S
    S --> E
```

---

## 3) Authentication & Token Flow

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant UI as Next.js UI
    participant API as AuthController
    participant Med as MediatR + Login/Refresh Handlers
    participant Repo as Auth/User Repository
    participant JWT as JwtTokenGenerator
    participant DB as PostgreSQL

    User->>UI: Submit email/password
    UI->>API: POST /api/v1/auth/login
    API->>Med: LoginUserCommand
    Med->>Repo: Validate user + load identity
    Repo->>DB: Query user + refresh token records
    DB-->>Repo: User data
    Repo-->>Med: Authenticated user
    Med->>JWT: Generate access token
    Med->>Repo: Persist/rotate refresh token
    Repo->>DB: Save refresh token
    Med-->>API: AuthenticationResult
    API-->>UI: Access token + HttpOnly refresh cookie

    Note over UI,API: When access token expires
    UI->>API: POST /api/v1/auth/refresh-token
    API->>Med: RefreshTokenCommand
    Med->>Repo: Validate + rotate refresh token
    Repo->>DB: Update refresh token state
    Med-->>API: New access + refresh tokens
    API-->>UI: New access token + new cookie
```

---

## 4) Wallet Funding via Stripe Webhook (Event-Driven)

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant UI as Next.js UI
    participant API as PaymentsController
    participant Stripe
    participant WH as Webhook Endpoint
    participant Med as DepositHandler
    participant Repo as Wallet/Transaction Repository
    participant DB as PostgreSQL

    User->>UI: Start deposit
    UI->>API: POST /payments/create-checkout-session
    API->>Stripe: Create Checkout Session (walletId, idempotencyKey metadata)
    Stripe-->>UI: Hosted Checkout URL
    User->>Stripe: Complete payment
    Stripe-->>WH: checkout.session.completed webhook
    WH->>Med: DepositCommand(walletId, amount, idempotencyKey)
    Med->>Repo: Update wallet balance + write transaction
    Repo->>DB: Atomic persistence via EF Core
    DB-->>Repo: Commit OK
    Repo-->>Med: Success
    Med-->>WH: Success
    WH-->>Stripe: 200 OK
```

---

## 5) Runtime Cross-Cutting Concerns

```mermaid
flowchart TB
    Req[Incoming HTTP Request]
    FWD[Forwarded Headers]
    EX[Global Exception Middleware\nstandard error payload]
    CORS[CORS Policy\nFRONTEND_URLS]
    RL[Rate Limiter Policies\nAuthSensitive / Payments / StripeWebhook]
    AUTH[JWT Authentication & Authorization]
    CTRL[API Controllers]
    LOG[Serilog\nConsole + File (+ Seq optional)]

    Req --> FWD --> EX --> CORS --> RL --> AUTH --> CTRL
    CTRL --> LOG
    EX --> LOG
```

---

## 6) Data Model (Core Domain)

```mermaid
erDiagram
    USER ||--o{ WALLET : owns
    USER ||--o{ PAYMENT_METHOD : stores
    USER ||--o{ REFRESH_TOKEN : receives
    USER ||--o{ RESET_PASSWORD_TOKEN : requests
    USER ||--o{ TRANSACTION : initiates

    WALLET ||--o{ TRANSACTION : records
    PAYMENT_METHOD ||--o{ TRANSACTION : funds

    USER {
      guid Id
      string Email
      string FullName
      string PasswordHash
      enum Role
      enum Status
    }

    WALLET {
      guid Id
      guid UserId
      decimal Balance
      string Currency
      string Name
    }

    TRANSACTION {
      guid Id
      guid UserId
      guid WalletId
      guid PaymentMethodId
      decimal Amount
      enum Type
      datetime CreatedAt
      string IdempotencyKey
    }
```

---

## 7) Deployment View

```mermaid
flowchart LR
    Dev[Developer / CI] -->|docker compose up --build| NET[Docker bridge network: finflow-net]

    subgraph NET
      UIc[finflow-ui container\n:3000]
      APIc[finflow-api container\n:5001->80]
      DBc[postgres container\n:5432]
      PGc[pgadmin container\n:5050]
    end

    UIc --> APIc
    APIc --> DBc
    PGc --> DBc
    APIc --> Stripe[(Stripe Cloud)]
```

