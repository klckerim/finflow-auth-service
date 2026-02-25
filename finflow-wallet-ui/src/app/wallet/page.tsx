import { AppShell } from "@/components/app-shell";

export default function WalletPage() {
  return (
    <AppShell>
      <section className="card">
        <h1 className="section-title">Wallet Overview</h1>
        <p className="muted">
          Çoklu cüzdan hesapları, bakiye dağılımı, para transferi ve bütçe cepleri burada
          yapılandırılacak.
        </p>
      </section>
    </AppShell>
  );
}
