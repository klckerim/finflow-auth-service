import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <section className="auth-layout">
        <article className="auth-side card">
          <p className="badge">Open account</p>
          <h1>Create a wallet account in minutes.</h1>
          <p className="muted">
            Kayıt süreci mobil uyumlu şekilde tasarlandı. Tüm cüzdan fonksiyonlarına tek panelden
            erişebilirsin.
          </p>
        </article>

        <form className="auth-card" action="#">
          <p className="badge">Create account</p>
          <h2>Open your wallet</h2>
          <label>
            Full name
            <input placeholder="Ada Yılmaz" type="text" />
          </label>
          <label>
            Email
            <input placeholder="you@mail.com" type="email" />
          </label>
          <label>
            Password
            <input placeholder="••••••••" type="password" />
          </label>
          <button className="primary-button" type="submit">
            Create account
          </button>
          <p className="muted small">
            Zaten hesabın var mı? <Link href="/login">Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
