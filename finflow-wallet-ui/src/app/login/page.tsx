import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="auth-root">
      <section className="auth-split">
        <article className="panel auth-promo">
          <p className="tiny muted">FinFlow.API connected concept</p>
          <h1>Sign in to secure your wallet operations.</h1>
          <p className="muted">
            Transfer, deposit, bill payment ve card işlemlerini tek bir modern operasyon panelinden yönet.
          </p>
        </article>

        <form action="#" className="panel auth-form">
          <h2>Login</h2>
          <label>
            Email
            <input placeholder="operator@finflow.com" type="email" />
          </label>
          <label>
            Password
            <input placeholder="••••••••" type="password" />
          </label>
          <button className="cta" type="submit">Continue</button>
          <p className="tiny muted">
            No account? <Link href="/register">Create one</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
