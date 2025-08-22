"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Server,
  Layers,
  Terminal,
  GitFork,
  Mail,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/features/cards/card";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

export default function AboutPage() {
  return (
    <ProtectedRoute>
      {/* <div className="min-h-screen flex items-center justify-center bg-background p-6"> */}

      <div className="min-h-screen flex items-center justify-center bg-background  p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="inline-flex items-center gap-3">
                <Rocket className="w-8 h-8 text-emerald-400" />
                FinFlow
              </span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-slate-600 text-lg">
              A small, modern fintech playground — designed to demonstrate pragmatic
              architecture, reliable payments, and clear developer experience.
              Think of this page as the project's living README.
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-0">Fintech • Demo</Badge>
              <Badge className="bg-blue-500/10 text-blue-400 border-0">Production-ready</Badge>
              <Badge className="bg-violet-500/10 text-violet-400 border-0">Stripe integrated</Badge>
            </div>
          </motion.header>

          {/* Top summary card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white/5 border border-white/6 rounded-2xl shadow-lg overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">What is FinFlow?</h2>
                    <p className="mt-2 text-slate-600 max-w-2xl">
                      FinFlow is a focused wallet & payments demo combining a .NET backend,
                      Postgres storage, and a Next.js frontend. It showcases real-world
                      patterns: payment webhooks, transactional integrity, testing with Stripe,
                      and a developer-friendly codebase suitable for portfolio/demo use.
                    </p>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-lg"
                      >
                        <a href="#getting-started">Get Started</a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-lg"
                      >
                        <a href="#tech-stack">Tech</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Grid: mission, features, architecture, roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="w-full max-w-2xl p-8 dark:bg-zinc-900 dark:border-gray-700 rounded-3xl shadow-xl">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-300" />
                  Mission
                </h3>
                <p className="mt-3 text-slate-600">
                  Simplify everyday money flows. Provide a lightweight, secure wallet
                  experience where users can top up via Stripe, track transactions,
                  and run simple financial workflows. Prioritize clarity, correctness,
                  and developer ergonomics.
                </p>

                <ul className="mt-4 space-y-2 text-slate-600">
                  <li>✔ Deterministic transaction processing</li>
                  <li>✔ Minimal, testable domain model</li>
                  <li>✔ Clear separation of concerns (API / Application / Infra)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/4 border border-white/6 rounded-xl">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="w-5 h-5 text-sky-300" />
                  Key Features
                </h3>
                <div className="mt-3 text-slate-600 space-y-2">
                  <div>• Wallet creation & multi-wallet per user</div>
                  <div>• Stripe Checkout & webhook-driven balance updates</div>
                  <div>• Transaction history and basic analytics</div>
                  <div>• Dockerized deployment & environment-aware configuration</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/4 border border-white/6 rounded-xl">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-300" />
                  Architecture (high level)
                </h3>
                <p className="mt-3 text-slate-600">
                  Clean Architecture inspired layout: API layer (ASP.NET), Application
                  services (commands/handlers), Domain entities, Infrastructure (EF Core,
                  repositories). Frontend built with Next.js + Tailwind + shadcn/ui.
                </p>
              </CardContent>
            </Card>

            <Card id="tech-stack" className="bg-white/5 border border-white/6 rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-sky-300"><Server className="w-5 h-5" /></span>
                  Tech Stack
                </h3>

                <div className="mt-4 text-slate-600 space-y-2">
                  <div>Backend: <span className="font-medium text-neutral-500">.NET 9 Web API</span></div>
                  <div>Database: <span className="font-medium text-neutral-500">PostgreSQL + EF Core</span></div>
                  <div>Frontend: <span className="font-medium text-neutral-500">Next.js 14 + Tailwind</span></div>
                  <div>Payments: <span className="font-medium text-neutral-500">Stripe (Checkout + webhooks)</span></div>
                  <div>Deployment: <span className="font-medium text-neutral-500">Docker / Railway / Vercel</span></div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Quick start */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

            <Card id="getting-started" className="bg-white/5 border border-white/6 rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-500" />
                  Quick Start (dev)
                </h3>

                <pre className="mt-3 bg-black/80 rounded p-3 text-sm text-emerald-500 overflow-auto">
                  {`# Backend
dotnet restore
dotnet build
dotnet run --project FinFlow.API

# Frontend
npm install
npm run dev

# Docker (local)
docker-compose up --build
`}
                </pre>

                <pre className="mt-3 bg-black/80 rounded p-3 text-sm text-emerald-500 overflow-auto">
                  {`# Environment variables

ConnectionStrings__DefaultConnection
Jwt__Key
Stripe__SecretKey
Stripe__WebhookSecret
`}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-10 text-center text-sm text-slate-400"
          >
            Built with care • FinFlow © 2025 — Designed for demos & learning
          </motion.footer>
        </div>
      </div>
    </ProtectedRoute>

  );
}
