import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="auth-page">
      <form className="auth-card" action="#">
        <p className="badge">Welcome back</p>
        <h1>Log in to FinFlow Wallet</h1>
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
    </div>
  );
}
