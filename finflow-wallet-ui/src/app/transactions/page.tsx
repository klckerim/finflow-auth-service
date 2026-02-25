"use client";

import { AppShell } from "@/components/app-shell";
import { useFinflowSession } from "@/context/finflow-session";
import { requestApi, shortDate, toCurrency } from "@/lib/finflow-api";
import { useState } from "react";

type Tx = { id: string; amount: number; currency?: string; type?: string; createdAt: string; description?: string };

export default function TransactionsPage() {
  const { apiBase, session } = useFinflowSession();
  const [resourceId, setResourceId] = useState("");
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [feedback, setFeedback] = useState("");

  const get = async (path: string) => {
    try {
      const data = await requestApi<Tx[]>(apiBase, path, { token: session?.token });
      setTransactions(data);
      setFeedback(`${data.length} kayıt çekildi.`);
    } catch (error) {
      setFeedback((error as Error).message);
    }
  };

  return (
    <AppShell>
      <section className="card stack">
        <h1 className="section-title">Transactions endpoints</h1>
        <div className="inline-grid">
          <button className="ghost-button" onClick={() => get(`/api/v1/Transactions/user/${session?.userId}?limit=20`)} type="button">GET by user</button>
          <input className="input" onChange={(e) => setResourceId(e.target.value)} placeholder="walletId veya cardId" value={resourceId} />
          <button className="ghost-button" onClick={() => get(`/api/v1/Transactions/wallet/${resourceId}?limit=20`)} type="button">GET by wallet</button>
          <button className="ghost-button" onClick={() => get(`/api/v1/Transactions/card/${resourceId}?limit=20`)} type="button">GET by card</button>
        </div>
        {feedback ? <p className="muted">{feedback}</p> : null}
      </section>

      <section className="card transaction-list">
        {transactions.map((item) => (
          <article className="transaction-item" key={item.id}>
            <div>
              <p>{item.description ?? item.type ?? "Transaction"}</p>
              <p className="muted small">{shortDate(item.createdAt)}</p>
            </div>
            <strong>{toCurrency(item.amount, item.currency ?? "EUR")}</strong>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
