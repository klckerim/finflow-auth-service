import { AppShell } from "@/components/app-shell";
import { TransactionList } from "@/components/transaction-list";

export default function TransactionsPage() {
  return (
    <AppShell>
      <TransactionList />
    </AppShell>
  );
}
