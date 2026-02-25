"use client";

import { AppShell } from "@/components/app-shell";
import { useFinflowSession } from "@/context/finflow-session";
import { requestApi } from "@/lib/finflow-api";
import { useState } from "react";

export default function SettingsPage() {
  const { apiBase, session, setSession } = useFinflowSession();
  const [token, setToken] = useState("");
  const [response, setResponse] = useState("");

  const call = async (path: string, method: "GET" | "POST", body?: unknown, headers?: Record<string, string>) => {
    try {
      const data = await requestApi<unknown>(apiBase, path, {
        method,
        body,
        token: session?.token,
        headers
      });
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse((error as Error).message);
    }
  };

  return (
    <AppShell>
      <section className="card stack">
        <h1 className="section-title">Auth endpoints</h1>
        <div className="inline-grid">
          <button className="ghost-button" onClick={() => call("/api/v1/Auth/me", "GET")} type="button">GET /Auth/me</button>
          <button className="ghost-button" onClick={() => call("/api/v1/Auth/refresh-token", "POST", {})} type="button">POST refresh-token</button>
          <button className="ghost-button" onClick={() => call("/api/v1/Auth/logout", "POST", {})} type="button">POST logout</button>
          <button className="ghost-button" onClick={() => call("/api/v1/Auth/forgot-password", "POST", { email: session?.email ?? "demo@finflow.com" })} type="button">POST forgot-password</button>
          <input className="input" onChange={(e) => setToken(e.target.value)} placeholder="reset token" value={token} />
          <button className="ghost-button" onClick={() => call(`/api/v1/Auth/validate-reset-token?token=${token}`, "GET")} type="button">GET validate token</button>
          <button className="ghost-button" onClick={() => call("/api/v1/Auth/reset-password", "POST", { token, password: "P@ssw0rd123", confirmPassword: "P@ssw0rd123" })} type="button">POST reset-password</button>
          <button className="primary-button" onClick={() => setSession(null)} type="button">Local session temizle</button>
        </div>
      </section>

      <section className="card stack">
        <h2 className="section-title">Payments endpoints</h2>
        <div className="inline-grid">
          <button className="ghost-button" onClick={() => call("/api/Payments/bill", "POST", { email: session?.email, billId: "INV-1001", amount: 10, walletId: null, cardId: null, currency: "EUR", paymentType: 0 })} type="button">POST bill</button>
          <button className="ghost-button" onClick={() => call("/api/Payments/create-session", "POST", { walletId: "", amount: 25, currency: "eur" })} type="button">POST create-session</button>
          <button className="ghost-button" onClick={() => call("/api/Payments/webhook", "POST", "{}", { "Stripe-Signature": "demo-signature" })} type="button">POST webhook (test)</button>
        </div>
      </section>

      <pre className="card code-block">{response || "Endpoint cevabı"}</pre>
    </AppShell>
  );
}
