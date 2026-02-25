import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="auth-page">
      <section className="auth-layout">
        <article className="auth-side card">
          <p className="badge">Secure wallet access</p>
          <h1>Log in and manage your money in one place.</h1>
          <p className="muted">
            Mobil ve masaüstünde hız, güvenlik ve netlik sağlayan yeni FinFlow deneyimine hoş geldin.
          </p>
        </article>

        <form className="auth-card" action="#">
          <p className="badge">Welcome back</p>
          <h2>Log in to FinFlow Wallet</h2>
          <label>
            Email
            <input placeholder="you@mail.com" type="email" />
          </label>
          <label>
            Password
            <input placeholder="••••••••" type="password" />
          </label>
          <button className="primary-button" type="submit">
            Log in
          </button>
          <p className="muted small">
            Hesabın yok mu? <Link href="/register">Register</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
