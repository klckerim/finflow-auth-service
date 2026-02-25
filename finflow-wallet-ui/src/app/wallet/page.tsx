import { AppShell } from "@/components/app-shell";

const pockets = [
  { title: "Daily Wallet", amount: "$1,420.20" },
  { title: "Travel Pocket", amount: "$2,100.00" },
  { title: "Emergency", amount: "$5,419.80" }
];

export default function WalletPage() {
  return (
    <AppShell>
      <section className="card">
        <h1 className="section-title">Wallet Overview</h1>
        <p className="muted">Cüzdan ceplerini mobil ve desktopta tek ekrandan yönetebilirsin.</p>
      </section>

      <section className="overview-grid">
        {pockets.map((pocket) => (
          <article className="card" key={pocket.title}>
            <p className="muted">{pocket.title}</p>
            <p className="metric-value">{pocket.amount}</p>
            <button className="ghost-button" type="button">Manage pocket</button>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
