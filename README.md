
# 🌟 FinFlow – End-to-End Fintech Demo

![.NET](https://img.shields.io/badge/.NET-9-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Docker](https://img.shields.io/badge/Docker-20.10-lightblue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Stripe](https://img.shields.io/badge/Stripe-Payments-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-lightgrey)


**FinFlow** is a small, modern fintech playground — designed to demonstrate pragmatic architecture, reliable payments, and clear developer experience. Think of this README as the project's living guide.

---

## 🌐 Live Demo
Try the project live here: [FinFlow Live](https://finflow-swart.vercel.app)

Reach test data here: [Stripe Testing Guide](https://docs.stripe.com/testing)

⚠️ Use mock data only. Do not use real payment information.

---

## 🛠 Tech Stack
- 🖥️ **Backend:** .NET 9 Web API, Clean Architecture, MediatR, FluentValidation  
- 🌐 **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui  
- 🗄️ **Database:** PostgreSQL with EF Core (transactional)  
- 💳 **Payment:** Stripe integration (Checkout + Webhooks) 
- 🐳 **Deployment/Infra:** Docker, Docker Compose

---

## ⚡ Key Features
- User registration, login & JWT-based authentication with refresh tokens  
- Wallet creation & multi-wallet per user  
- Deposit, withdrawal, and transfer flows  
- Stripe Checkout integration with webhook-driven balance updates  
- Transaction history and basic analytics  
- Dockerized local development and deployment ready  

---

## 🚀 Showcase Flow
1. User creates wallet → balance initialized in PostgreSQL  
2. Deposit/Withdrawal → PostgreSQL transaction recorded + Stripe webhook handled  
3. Dashboard → Top wallets, recent transactions, and Stripe test payments demonstrated  

---

## 📂 Project Structure
- `FinFlow.API` → ASP.NET Core Web API (controllers, endpoints) 
- `FinFlow.Application` → Business logic (CQRS, services, handlers)  
- `FinFlow.Domain` → Core domain entities & rules  
- `FinFlow.Infrastructure` → EF Core, DbContext, Stripe integration 
- `finflow-ui` → Next.js 14 frontend dashboard 



---

## 💡 Learning Highlights
- Real-world fintech flows: secure payments, transactional integrity, webhook handling  
- Clean Architecture & CQRS patterns for maintainable, testable code  
- Dockerized development environment for reproducibility  
- Developer-friendly, portfolio-ready codebase  

---
## 📌 Installation & Local Development

Choose one of the following setups. Docker Compose is the fastest way to boot the full stack.

### ✅ Option A: Docker Compose (Full Stack)
This starts PostgreSQL, API, UI, and pgAdmin together.

```bash
docker compose up --build
```

**Services**
- API: http://localhost:5001
- UI: http://localhost:3000
- pgAdmin: http://localhost:5050

---

### ✅ Option B: Local Development (Docker-free)

#### 1) Start PostgreSQL
Use the same connection values used by the API:

```
Host=localhost
Port=5432
Database=finflowdb
Username=finflowuser
Password=finflowpass
```

If you prefer Docker for Postgres only:
```bash
docker run --name finflow-postgres \
  -e POSTGRES_USER=finflowuser \
  -e POSTGRES_PASSWORD=finflowpass \
  -e POSTGRES_DB=finflowdb \
  -p 5432:5432 \
  -d postgres:15
```

#### 2) Run the API (.NET 9)
From repo root:
```bash
dotnet restore
dotnet ef database update --project FinFlow.Infrastructure --startup-project FinFlow.API
dotnet run --project FinFlow.API
```

API will be available on: **http://localhost:5001**

#### 3) Run the UI (Next.js)
From `finflow-ui`:
```bash
cd finflow-ui
npm install
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001 npm run dev
```

UI will be available on: **http://localhost:3000**

---

### Environment Variables
Minimum configuration used by the API:
```bash
ConnectionStrings__DefaultConnection
Jwt__Key
Stripe__SecretKey
Stripe__WebhookSecret
```

### Stripe Payment (Local)
```bash
stripe listen --forward-to http://localhost:5001/api/payments/webhook
```
