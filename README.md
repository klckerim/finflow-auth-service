
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

Reach test data here: [Stripe Testing](https://docs.stripe.com/testing)

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
- `FinFlow.API` – Backend API controllers and models  
- `FinFlow.Application` – CQRS commands, queries, handlers, services  
- `FinFlow.Domain` – Entities & domain logic  
- `FinFlow.Infrastructure` – EF Core DbContext, Repositories, Stripe integration  
- `FinFlow.Web` – Optional Next.js frontend dashboard  

---

## 💡 Learning Highlights
- Real-world fintech flows: secure payments, transactional integrity, webhook handling  
- Clean Architecture & CQRS patterns for maintainable, testable code  
- Dockerized development environment for reproducibility  
- Developer-friendly, portfolio-ready codebase  

---

## 📌 Quick Start (Development)


### Backend
```bash
dotnet restore
dotnet build
dotnet run --project FinFlow.API
```

### Frontend
```bash
npm install
npm run dev
```

### Docker (Local)
```bash
docker-compose up --build
```

### Environment Variables
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


