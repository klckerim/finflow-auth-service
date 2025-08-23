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
import { useLocale } from "@/context/locale-context";

export default function AboutPage() {
  const { t } = useLocale();

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
              {t("common.str_ReadMeExplanation")}
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-0">{t("common.str_Demo")}</Badge>
              <Badge className="bg-blue-500/10 text-blue-400 border-0">{t("common.str_ProductionReady")}</Badge>
              <Badge className="bg-violet-500/10 text-violet-400 border-0">{t("common.str_Stripe")}</Badge>
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
                    <h2 className="text-xl font-semibold">{t("common.str_What")}</h2>
                    <p className="mt-2 text-slate-600 max-w-2xl">
                      {t("common.str_DemoExplanation")}
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
                        <a href="#getting-started">{t("common.str_Started")}</a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-lg"
                      >
                        <a href="#tech-stack">{t("common.str_Tech")}</a>
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
                  {t("common.str_Mission")}
                </h3>
                <p className="mt-3 text-slate-600">
                  {t("common.str_MissionExplanation")}
                </p>

                <ul className="mt-4 space-y-2 text-slate-600">
                  <li>✔ {t("common.str_ListMission1")}</li>
                  <li>✔ {t("common.str_ListMission2")}</li>
                  <li>✔ {t("common.str_ListMission3")}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/4 border border-white/6 rounded-xl">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="w-5 h-5 text-sky-300" />
                  {t("common.str_KeyFeatures")}
                </h3>
                <div className="mt-3 text-slate-600 space-y-2">
                  <div>• {t("common.str_KeyFeature1")}</div>
                  <div>• {t("common.str_KeyFeature2")}</div>
                  <div>• {t("common.str_KeyFeature3")}</div>
                  <div>• {t("common.str_KeyFeature4")}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/4 border border-white/6 rounded-xl">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-300" />
                  {t("common.str_Architecture")}
                </h3>
                <p className="mt-3 text-slate-600">
                  {t("common.str_ArchitectureExplanation")}
                </p>
              </CardContent>
            </Card>

            <Card id="tech-stack" className="bg-white/5 border border-white/6 rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-sky-300"><Server className="w-5 h-5" /></span>
                  {t("common.str_TechStack")}
                </h3>

                <div className="mt-4 text-slate-600 space-y-2">
                  <div> {t("common.str_Backend")}: <span className="font-medium text-neutral-500">{t("common.str_BackendTech")}</span></div>
                  <div> {t("common.str_Database")}: <span className="font-medium text-neutral-500">{t("common.str_DatabaseTech")}</span></div>
                  <div> {t("common.str_Frontend")}: <span className="font-medium text-neutral-500">{t("common.str_FrontendTech")}</span></div>
                  <div> {t("common.str_Payments")}: <span className="font-medium text-neutral-500">{t("common.str_PaymentsTech")}</span></div>
                  <div> {t("common.str_Deployment")}: <span className="font-medium text-neutral-500">{t("common.str_DeploymentTech")}</span></div>
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
                  {t("dashboard.str_QuickStart")}
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
            {t("common.footer")}
          </motion.footer>
        </div>
      </div>
    </ProtectedRoute>

  );
}
