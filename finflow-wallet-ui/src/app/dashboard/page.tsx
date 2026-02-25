"use client";

import { AppShell } from "@/components/app-shell";
import { useFinflowSession } from "@/context/finflow-session";
import { requestApi, toCurrency } from "@/lib/finflow-api";
import { useState } from "react";

type Wallet = { id: string; name: string; balance: number; currency: string };
type Tx = { id: string; description?: string; amount: number; currency?: string; type?: string };
type Card = { id: string; brand: string; last4: string };

export default function DashboardPage() {
  const { apiBase, session } = useFinflowSession();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [feedback, setFeedback] = useState("");

  const loadData = async () => {
    if (!session) {
      setFeedback("Önce login olmalısın.");
      return;
    }
    try {
      const [walletData, txData, cardData] = await Promise.all([
        requestApi<Wallet[]>(apiBase, `/api/v1/Wallets/user/${session.userId}`),
        requestApi<Tx[]>(apiBase, `/api/v1/Transactions/user/${session.userId}?limit=5`),
        requestApi<Card[]>(apiBase, `/api/v1/Cards/user/${session.userId}`)
      ]);
      setWallets(walletData);
      setTransactions(txData);
      setCards(cardData);
      setFeedback("Dashboard yenilendi.");
    } catch (error) {
      setFeedback((error as Error).message);
    }
  };

  const total = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <AppShell>
      <section className="overview-grid">
        <article className="card">
          <p className="muted">Toplam bakiye</p>
          <p className="metric-value">{toCurrency(total)}</p>
          <p className="trend">{wallets.length} wallet</p>
        </article>
        <article className="card">
          <p className="muted">Son işlemler</p>
          <p className="metric-value">{transactions.length}</p>
          <p className="trend">Transactions API</p>
        </article>
        <article className="card">
          <p className="muted">Kayıtlı kartlar</p>
          <p className="metric-value">{cards.length}</p>
          <p className="trend">Cards API</p>
        </article>
      </section>

      <section className="card">
        <h2 className="section-title">Platform snapshot</h2>
        <button className="primary-button" onClick={loadData} type="button">
          Verileri çek
        </button>
        {feedback ? <p className="muted">{feedback}</p> : null}
      </section>
    </AppShell>
  );
}
