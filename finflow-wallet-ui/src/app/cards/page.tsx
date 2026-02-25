"use client";

import { AppShell } from "@/components/app-shell";
import { useFinflowSession } from "@/context/finflow-session";
import { requestApi } from "@/lib/finflow-api";
import { useState } from "react";

export default function CardsPage() {
  const { apiBase, session } = useFinflowSession();
  const [cardId, setCardId] = useState("");
  const [response, setResponse] = useState("");

  const call = async (path: string, method: "GET" | "POST", body?: unknown) => {
    try {
      const data = await requestApi<unknown>(apiBase, path, { method, body, token: session?.token });
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse((error as Error).message);
    }
  };

  return (
    <AppShell>
      <section className="card stack">
        <h1 className="section-title">Cards & setup session</h1>
        <div className="inline-grid">
          <button className="ghost-button" onClick={() => call(`/api/v1/Cards/user/${session?.userId}`, "GET")} type="button">GET cards by user</button>
          <input className="input" onChange={(e) => setCardId(e.target.value)} placeholder="cardId" value={cardId} />
          <button className="ghost-button" onClick={() => call(`/api/v1/Cards/${cardId}`, "GET")} type="button">GET card by id</button>
          <button className="primary-button" onClick={() => call("/api/Payments/create-setup-session", "POST", { userId: session?.userId, customerEmail: session?.email })} type="button">POST create-setup-session</button>
        </div>
      </section>
      <pre className="card code-block">{response || "Cards API cevabı"}</pre>
    </AppShell>
  );
}
