import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="bento-grid">
        <article className="panel">
          <h2>Auth & Session</h2>
          <div className="kv-list">
            <p><span>Access token:</span> JWT</p>
            <p><span>Refresh token:</span> HttpOnly Cookie</p>
            <p><span>Password recovery:</span> Token + validation flow</p>
            <p><span>Rate limiting:</span> AuthSensitive policy</p>
          </div>
        </article>

        <article className="panel">
          <h2>Profile Signals</h2>
          <div className="kv-list">
            <p><span>Name:</span> Burak Y.</p>
            <p><span>Email:</span> burak@example.com</p>
            <p><span>Role:</span> User</p>
            <p><span>Status:</span> Active</p>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
