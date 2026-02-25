import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="card">
        <h1 className="section-title">Settings & profile</h1>
        <p className="muted">
          Profil, güvenlik, bildirim, tema tercihleri ve bağlı banka hesaplarının merkezi kontrol
          paneli bu sayfada olacak.
        </p>
      </section>
    </AppShell>
  );
}
