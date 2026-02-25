import { Banknote, PiggyBank, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { OverviewCard } from "@/components/overview-card";
import { TransactionList } from "@/components/transaction-list";

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="overview-grid">
        <OverviewCard icon={Banknote} label="Available balance" trend="+4.2% this month" value="$24,890.45" />
        <OverviewCard icon={TrendingUp} label="Monthly spend" trend="-1.3% than last month" value="$1,342.11" />
        <OverviewCard icon={PiggyBank} label="Savings pocket" trend="Goal 78% completed" value="$8,940.00" />
      </section>

      <section className="split-grid">
        <article className="card">
          <h2 className="section-title">Spending health</h2>
          <div className="health-grid">
            <div>
              <p className="muted">Essentials</p>
              <p className="metric-value compact">$620</p>
            </div>
            <div>
              <p className="muted">Leisure</p>
              <p className="metric-value compact">$410</p>
            </div>
            <div>
              <p className="muted">Bills</p>
              <p className="metric-value compact">$312</p>
            </div>
          </div>
        </article>

        <article className="card">
          <h2 className="section-title">Quick actions</h2>
          <div className="action-grid">
            <button className="ghost-button" type="button">Send money</button>
            <button className="ghost-button" type="button">Pay bill</button>
            <button className="ghost-button" type="button">Top up wallet</button>
            <button className="ghost-button" type="button">Card controls</button>
          </div>
        </article>
      </section>

      <TransactionList />
    </AppShell>
  );
}
