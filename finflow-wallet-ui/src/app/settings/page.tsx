import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="split-grid">
        <article className="card">
          <h1 className="section-title">Profile & security</h1>
          <div className="settings-list">
            <div className="settings-item"><span>Email verification</span><span>Enabled</span></div>
            <div className="settings-item"><span>Two-factor auth</span><span>Enabled</span></div>
            <div className="settings-item"><span>Biometric login</span><span>Mobile only</span></div>
          </div>
        </article>

        <article className="card">
          <h2 className="section-title">Preferences</h2>
          <div className="action-grid">
            <button className="ghost-button" type="button">Theme: Midnight</button>
            <button className="ghost-button" type="button">Language: TR</button>
            <button className="ghost-button" type="button">Notifications</button>
            <button className="ghost-button" type="button">Connected banks</button>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
