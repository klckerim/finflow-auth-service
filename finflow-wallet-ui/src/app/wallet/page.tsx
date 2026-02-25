"use client";

import { AppShell } from "@/components/app-shell";
import { useFinflowSession } from "@/context/finflow-session";
import { requestApi } from "@/lib/finflow-api";
import { FormEvent, useState } from "react";

export default function WalletPage() {
  const { apiBase, session } = useFinflowSession();
  const [walletId, setWalletId] = useState("");
  const [payload, setPayload] = useState('{"userId":"","currency":"EUR","name":"Main","balance":0}');
  const [response, setResponse] = useState("");

  const call = async (path: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: unknown) => {
    try {
      const data = await requestApi<unknown>(apiBase, path, {
        method,
        body,
        token: session?.token
      });
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse((error as Error).message);
    }
  };

  const submitJson = async (event: FormEvent, path: string, method: "POST" | "PUT") => {
    event.preventDefault();
    await call(path, method, JSON.parse(payload));
  };

  return (
    <AppShell>
      <section className="card stack">
        <h1 className="section-title">Wallet endpoints</h1>
        <div className="inline-grid">
          <button className="ghost-button" onClick={() => call(`/api/v1/Wallets/user/${session?.userId}`, "GET")} type="button">GET user wallets</button>
          <input className="input" onChange={(e) => setWalletId(e.target.value)} placeholder="walletId" value={walletId} />
          <button className="ghost-button" onClick={() => call(`/api/v1/Wallets/${walletId}`, "GET")} type="button">GET by id</button>
          <button className="ghost-button" onClick={() => call(`/api/v1/Wallets/${walletId}`, "DELETE")} type="button">DELETE</button>
          <button className="ghost-button" onClick={() => call(`/api/v1/Wallets/${walletId}/deposit`, "POST", 100)} type="button">POST deposit</button>
          <button className="ghost-button" onClick={() => call(`/api/v1/Wallets/${walletId}/transfer`, "POST", { fromWalletId: walletId, toWalletId: walletId, amount: 1 })} type="button">POST transfer</button>
        </div>
      </section>

      <section className="card stack">
        <h2 className="section-title">Create / Update JSON</h2>
        <textarea className="input text-area" onChange={(e) => setPayload(e.target.value)} value={payload} />
        <div className="inline-grid">
          <form onSubmit={(e) => submitJson(e, "/api/v1/Wallets", "POST")}>
            <button className="primary-button" type="submit">POST /Wallets</button>
          </form>
          <form onSubmit={(e) => submitJson(e, `/api/v1/Wallets/${walletId}`, "PUT")}>
            <button className="primary-button" type="submit">PUT /Wallets/{`{id}`}</button>
          </form>
        </div>
      </section>

      <pre className="card code-block">{response || "API response burada görünecek"}</pre>
    </AppShell>
  );
}
