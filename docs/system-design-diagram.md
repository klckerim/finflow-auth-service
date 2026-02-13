# FinFlow Detaylı Sistem Tasarım Diyagramı

Bu doküman, FinFlow projesinin uçtan uca mimarisini (istemci, API katmanları, veri katmanı, dış servisler ve temel iş akışları) tek yerde gösterir.

## Görsel Diyagram (SVG)

Aşağıdaki görsel, sistemin yüksek seviyeli bileşenlerini ve backend iç akışını tek diyagramda birleştirir:

![FinFlow detaylı sistem tasarım diyagramı](./system-design-diagram.svg)

---

## 1) Konteyner / Sistem Bağlamı Diyagramı

```mermaid
flowchart LR
    U[Son Kullanıcı] -->|HTTPS| UI[finflow-ui\nNext.js 14]
    UI -->|REST + JWT| API[FinFlow.API\nASP.NET Core Web API]
    API -->|EF Core / Npgsql| DB[(PostgreSQL 15\nfinflowdb)]
    API -->|Ödeme oturumu + webhook doğrulama| STRIPE[Stripe API]
    API -->|Yapılandırılmış loglar| SEQ[Seq \(opsiyonel\)]
    DEV[Developer/Ops] -->|DB yönetimi| PGADMIN[pgAdmin]
    PGADMIN --> DB

    subgraph Docker Compose Ağı (finflow-net)
        UI
        API
        DB
        PGADMIN
    end
```

## 2) Backend İç Katmanlar (Clean Architecture + CQRS)

```mermaid
flowchart TB
    C[Controllers\nAuth/Wallets/Transactions/Cards/Payments] --> M[MediatR]
    M --> V[ValidationBehavior\nFluentValidation]
    V --> H[Command/Query Handlers\nApplication Layer]

    H --> SVC[Application Services\nTokenService]
    H --> PORTS[Interfaces\nIUserRepository / IWalletRepository /\nITransactionRepository / IAuthRepository /\nIPaymentMethodRepository / IStripePaymentService]

    PORTS --> REPO[Infrastructure Repositories]
    REPO --> DBC[FinFlowDbContext]
    DBC --> PG[(PostgreSQL)]

    H --> JWTGEN[JwtTokenGenerator]
    JWTGEN --> JWT[Access Token + Refresh Token]

    C --> MID[Middleware Pipeline\nExceptionMiddleware, CORS,\nRate Limiter, AuthN/AuthZ]
```

## 3) Kimlik Doğrulama ve Token Yaşam Döngüsü

```mermaid
sequenceDiagram
    participant Client as UI/Client
    participant Auth as AuthController
    participant Med as MediatR
    participant Handler as LoginUserHandler
    participant Repo as User/Auth Repository
    participant Token as JwtTokenGenerator + TokenService
    participant DB as PostgreSQL

    Client->>Auth: POST /api/v1/auth/login
    Auth->>Med: LoginUserCommand
    Med->>Handler: Handle(command)
    Handler->>Repo: Kullanıcı + şifre doğrulama
    Repo->>DB: SELECT user + refresh token verisi
    DB-->>Repo: user row
    Repo-->>Handler: domain user
    Handler->>Token: Access + Refresh token üret
    Token-->>Handler: token seti
    Handler-->>Auth: AuthenticationResult
    Auth-->>Client: 200 OK + JWT + HttpOnly refresh cookie

    Client->>Auth: POST /api/v1/auth/refresh-token
    Auth->>Med: RefreshTokenCommand
    Med->>Repo: refresh token doğrula/yenile
    Repo->>DB: token güncelle
    Auth-->>Client: yeni access token + yeni refresh cookie
```

## 4) Ödeme ve Bakiye Güncelleme (Stripe Webhook)

```mermaid
sequenceDiagram
    participant Client as UI
    participant API as PaymentsController
    participant Stripe as Stripe Checkout
    participant Webhook as /api/payments/webhook
    participant Med as MediatR
    participant Deposit as DepositCommandHandler
    participant DB as PostgreSQL

    Client->>API: POST /api/payments/create-session
    API->>Stripe: Checkout Session Create
    Stripe-->>Client: hosted checkout URL/sessionId

    Stripe->>Webhook: checkout.session.completed
    Webhook->>Med: DepositCommand(walletId, amount, idempotencyKey)
    Med->>Deposit: Handle deposit
    Deposit->>DB: Wallet balance + Transaction insert
    DB-->>Deposit: Commit
    Deposit-->>Webhook: success
    Webhook-->>Stripe: 200 OK
```

## 5) Operasyonel ve Güvenlik Notları

- API girişinde JWT Bearer doğrulaması vardır; CORS yalnızca `FRONTEND_URLS` ile sınırlandırılır.
- Kritik endpoint gruplarında oran sınırlama (AuthSensitive / Payments / StripeWebhook) uygulanır.
- Tüm istekler exception middleware ve Serilog ile gözlemlenebilir hale getirilir.
- API versiyonlama (`v1`) ve Swagger/OpenAPI üzerinden sözleşme görünürlüğü sağlanır.
