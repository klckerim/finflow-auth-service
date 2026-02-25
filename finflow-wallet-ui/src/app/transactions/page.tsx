import { AppShell } from "@/components/app-shell";
import { TransactionList } from "@/components/transaction-list";

export default function TransactionsPage() {
  return (
    <AppShell>
      <section className="card">
        <h1 className="section-title">Transaction Center</h1>
        <p className="muted">Filtreler, tarih aralığı ve kategori kırılımları bu alan üzerinde genişletilecek.</p>
      </section>
      <TransactionList />
    </AppShell>
  );
}
