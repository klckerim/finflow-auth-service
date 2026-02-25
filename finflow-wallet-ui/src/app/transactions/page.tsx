import { AppShell } from "@/components/app-shell";
import { TransactionList } from "@/components/transaction-list";

export default function TransactionsPage() {
  return (
    <AppShell>
      <section className="panel">
        <h2>Transaction Explorer</h2>
        <p className="muted">
          Filter by UserId, WalletId or CardId (API supports all three ledger perspectives).
        </p>
      </section>

      <section className="bento-grid">
        <article className="panel">
          <h3>Type Breakdown</h3>
          <ul className="bullet-list">
            <li>Deposit</li>
            <li>Withdraw</li>
            <li>Payment / BillPayment</li>
            <li>TransferIn / TransferOut</li>
          </ul>
        </article>

        <article className="panel">
          <h3>Audit Notes</h3>
          <p className="tiny muted">
            Idempotency-Key headers prevent duplicate deposits/transfers under retry conditions.
          </p>
        </article>
      </section>

      <TransactionList />
    </AppShell>
  );
}
