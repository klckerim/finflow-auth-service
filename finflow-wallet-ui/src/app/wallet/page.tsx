import { AppShell } from "@/components/app-shell";

const walletVaults = [
  { name: "Main EUR Vault", currency: "EUR", balance: "€12,440.00", state: "Active" },
  { name: "USD Spending", currency: "USD", balance: "$5,210.48", state: "Active" },
  { name: "Travel Reserve", currency: "USD", balance: "$2,903.10", state: "Scheduled rules" }
];

export default function WalletPage() {
  return (
    <AppShell>
      <section className="panel">
        <h2>Wallet Vaults</h2>
        <p className="muted">Create / update / delete wallet entities and monitor balances by currency.</p>
      </section>

      <section className="vault-grid">
        {walletVaults.map((vault) => (
          <article className="panel" key={vault.name}>
            <p className="tiny muted">{vault.currency}</p>
            <h3>{vault.name}</h3>
            <p className="metric-value">{vault.balance}</p>
            <p className="tiny muted">{vault.state}</p>
            <button className="subtle" type="button">Open wallet details</button>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
