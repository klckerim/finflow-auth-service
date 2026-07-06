# FinFlow – End-to-End Fintech Case Study

![.NET](https://img.shields.io/badge/.NET-9-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Docker](https://img.shields.io/badge/Docker-20.10-lightblue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Stripe](https://img.shields.io/badge/Stripe-Payments-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-lightgrey)

**FinFlow** is a fintech playground that showcases clean architecture, reliable payments, and a clear developer experience.

---

## Live Demo
- **App:** https://finflow-swart.vercel.app
- **Stripe test data:** https://docs.stripe.com/testing

⚠️ Use mock data only. Do not use real payment information.

---

## Tech Stack
- **Backend:** .NET 9 Web API, Clean Architecture, MediatR, FluentValidation
- **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL with EF Core
- **Payments:** Stripe (Checkout + Webhooks)
- **Infra:** Docker, Docker Compose

---

## Key Features
- User registration, login, JWT auth, refresh tokens
- Wallet creation & multi-wallet per user
- Deposit, withdrawal, transfer flows
- Stripe Checkout + webhook-driven balance updates
- Transaction history and basic analytics
- AI-powered transaction categorization and a tool-calling AI financial assistant (Claude API — see [AI Features](#ai-features))
- Fully dockerized local stack

---

## Project Structure
- `FinFlow.API` → ASP.NET Core Web API (controllers, endpoints)
- `FinFlow.Application` → Business logic (CQRS, services, handlers)
- `FinFlow.Domain` → Core domain entities & rules
- `FinFlow.Infrastructure` → EF Core, DbContext, Stripe integration
- `finflow-ui` → Next.js 14 frontend dashboard

---

## Quick Start (Docker Compose)
This is the fastest way to run the full stack locally.

```bash
docker compose up --build
```

**Services**
- API: http://localhost:5001 (container listens on port 80)
- UI: http://localhost:3000
- pgAdmin: http://localhost:5050

**Default credentials & config**
- Postgres: `finflowuser` / `finflowpass` (DB: `finflowdb`, port `5432`)
- pgAdmin: `admin@finflow.com` / `adminpass`
- Stripe keys in `docker-compose.yml` are placeholders (`sk_test_change_me`, `whsec_change_me`, `pk_test_change_me`). Replace them to test real webhook/checkout flows.

> ℹ️ If you only run the UI in Docker, you do **not** need `npm install` on your host.

---

## Local Development (No Docker)

### 1) Start PostgreSQL
Use the same connection values expected by the API:

```
Host=localhost
Port=5432
Database=finflowdb
Username=finflowuser
Password=finflowpass
```

If you want Postgres via Docker only:

```bash
docker run --name finflow-postgres \
  -e POSTGRES_USER=finflowuser \
  -e POSTGRES_PASSWORD=finflowpass \
  -e POSTGRES_DB=finflowdb \
  -p 5432:5432 \
  -d postgres:15
```

### 2) Run the API (.NET 9)
From repo root:

```bash
dotnet restore
dotnet ef database update --project FinFlow.Infrastructure --startup-project FinFlow.API
dotnet run --project FinFlow.API
```

API: **http://localhost:5001**

### 3) Run the UI (Next.js)
From `finflow-ui`:

```bash
cd finflow-ui
npm install
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001 npm run dev
```

UI: **http://localhost:3000**

---

## Environment Variables
Minimum configuration used by the API:

```bash
ConnectionStrings__DefaultConnection
Jwt__Key
Jwt__Issuer
Jwt__Audience
FRONTEND_URLS
Stripe__SecretKey
Stripe__WebhookSecret
Stripe__SuccessUrl
Stripe__CancelUrl
Anthropic__ApiKey
Seq__Url
```

**Notes**
- `FRONTEND_URLS` is a comma-separated list of allowed origins (CORS).
- `Seq__Url` is optional in development, required in production.
- `Stripe__SuccessUrl` and `Stripe__CancelUrl` should point to UI routes that handle checkout outcomes.

---

## Stripe Webhook (Local)
Forward Stripe webhooks to your API:

```bash
stripe listen --forward-to http://localhost:5001/api/payments/webhook
```

---

## AI Features

FinFlow uses the Anthropic Claude API (`/v1/messages`) for two features, both integrated with tool/function calling rather than free-text parsing:

- **AI transaction categorization** — bill payments (wallet or card) are classified into a spending category (`Groceries`, `Dining`, `Transport`, `Bills`, `Shopping`, `Entertainment`, `Income`, `Transfer`, `Other`) by forcing a single `categorize_transaction` tool call whose input schema restricts the result to those values (structured output, no parsing of free text). Deposits and transfers are categorized deterministically (`Income` / `Transfer`) without an LLM call, since their descriptions are system-generated and carry no signal. Categorization is best-effort: on any failure (missing key, timeout, bad response) it falls back to `Other` and never blocks the underlying money movement. Use `POST /api/v1/transactions/user/{userId}/categorize` to backfill categories on existing/seed transactions.
- **AI Financial Assistant** — `POST /api/v1/assistant/ask` (JWT-protected) answers natural-language questions (e.g. "how much did I spend last month?") by letting Claude call `get_wallets` / `get_recent_transactions` tools that are dispatched to the existing MediatR queries. The `userId` used by those tools always comes from the authenticated JWT, never from the request body or anything the model outputs, so the assistant can only ever see the caller's own data.

**Required environment variables** (see `Anthropic` section in `appsettings.json` / `docker-compose.yml`):

```bash
Anthropic__ApiKey            # required to actually call Claude; falls back gracefully if unset
Anthropic__CategorizationModel   # default: claude-haiku-4-5-20251001
Anthropic__AssistantModel        # default: claude-sonnet-5
```

Without a real `Anthropic__ApiKey`, both features fail closed (categorization returns `Other`, the assistant returns an explanatory message) instead of crashing the app — the same pattern already used for the Stripe key.

---

## Database Migrations (Production)
Run migrations **outside** API startup (CI/CD or a one-off job).

**CI/CD step**
```bash
dotnet ef database update --project FinFlow.Infrastructure --startup-project FinFlow.API
```

**One-off Docker job**
```bash
docker run --rm \
  -e ConnectionStrings__DefaultConnection="$CONNECTION_STRING" \
  -e Jwt__Key="$JWT_KEY" \
  -e Stripe__SecretKey="$STRIPE_SECRET_KEY" \
  -e Stripe__WebhookSecret="$STRIPE_WEBHOOK_SECRET" \
  -e Seq__Url="$SEQ_URL" \
  finflow-api:latest \
  dotnet ef database update --project FinFlow.Infrastructure --startup-project FinFlow.API
```

---

## 🔎 Helpful Endpoints
- Swagger UI: http://localhost:5001/swagger
- pgAdmin (Docker): http://localhost:5050
