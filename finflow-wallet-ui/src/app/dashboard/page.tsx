import { AppShell } from "@/components/app-shell";
import { OverviewCard } from "@/components/overview-card";
import { TransactionList } from "@/components/transaction-list";

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="overview-grid">
        <OverviewCard label="Available balance" trend="+4.2% this month" value="$24,890.45" />
        <OverviewCard label="Monthly spend" trend="-1.3% than last month" value="$1,342.11" />
        <OverviewCard label="Savings pocket" trend="Goal 78% completed" value="$8,940.00" />
      </section>
      <TransactionList />
    </AppShell>
  );
}
