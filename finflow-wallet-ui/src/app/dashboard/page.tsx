import { CircleDollarSign, ReceiptText, Repeat2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { OverviewCard } from "@/components/overview-card";
import { TransactionList } from "@/components/transaction-list";

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="metrics-grid">
        <OverviewCard
          icon={CircleDollarSign}
          title="Total Wallet Balance"
          value="$42,190.88"
          meta="Aggregated from all WalletDto records"
        />
        <OverviewCard
          icon={Repeat2}
          title="Transfers (24h)"
          value="128"
          meta="TransferIn + TransferOut activity"
        />
        <OverviewCard
          icon={ReceiptText}
          title="Bill Payments"
          value="$1,040.19"
          meta="PayBillCommand processed this week"
        />
        <OverviewCard
          icon={ShieldCheck}
          title="Security Status"
          value="Protected"
          meta="Rate limit + token rotation active"
        />
      </section>

      <section className="bento-grid">
        <article className="panel">
          <h2>Operational Shortcuts</h2>
          <div className="button-grid">
            <button className="subtle" type="button">Create Wallet</button>
            <button className="subtle" type="button">Deposit (Idempotent)</button>
            <button className="subtle" type="button">Transfer Between Wallets</button>
            <button className="subtle" type="button">Pay Utility Bill</button>
          </div>
        </article>

        <article className="panel accent-panel">
          <p className="tiny">Realtime Signal</p>
          <h2>Stripe checkout webhook stream stable</h2>
          <p className="muted">No failed signature validation in last 6 hours.</p>
        </article>
      </section>

      <TransactionList />
    </AppShell>
  );
}
