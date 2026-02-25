import Link from "next/link";

export default function HomePage() {
  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <p className="badge">FinFlow New UI</p>
        <h1>Yeni wallet uygulaması responsive altyapı ile hazır</h1>
        <p className="muted">
          Eski <strong>finflow-ui</strong> yapısına dokunmadan yepyeni bir tasarım diliyle ve mobile-first
          düzenle ikinci bir UI başlatıldı.
        </p>
        <div className="quick-links">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
