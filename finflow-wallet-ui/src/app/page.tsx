import Link from "next/link";

export default function HomePage() {
  return (
    <div className="auth-root">
      <article className="panel launch-panel">
        <p className="tiny muted">FinFlow Wallet UI — Independent Surface</p>
        <h1>Modern wallet cockpit built from backend domain flows.</h1>
        <p className="muted">
          Bu UI; Wallet, PaymentMethod, Transaction, Auth token yenileme ve Stripe ödeme operasyonlarına
          göre tasarlandı.
        </p>
        <div className="launch-links">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/dashboard">Open Command Center</Link>
        </div>
      </article>
    </div>
  );
}
