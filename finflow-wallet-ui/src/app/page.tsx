import Link from "next/link";

export default function HomePage() {
  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <p className="badge">FinFlow Wallet Platform</p>
        <h1>Kreatif, modern ve tam API bağlı wallet deneyimi</h1>
        <p className="muted">
          FinFlow.API, Domain, Application ve Infrastructure katmanlarındaki uçlar için canlı istek
          panelleri hazırlandı. Login olduktan sonra cüzdan, işlem, kart ve ödeme akışlarını
          uçtan uca yönetebilirsin.
        </p>
        <div className="quick-links">
          <Link href="/login">Giriş yap</Link>
          <Link href="/register">Kayıt ol</Link>
          <Link href="/dashboard">API dashboard</Link>
        </div>
      </div>
    </div>
  );
}
