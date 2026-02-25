import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="auth-root">
      <section className="auth-split">
        <article className="panel auth-promo">
          <p className="tiny muted">RegisterUserCommand flow</p>
          <h1>Open a new digital wallet workspace.</h1>
          <p className="muted">
            Kayıt sonrası wallet oluşturma, kart bağlama ve token yönetimi adımları seni bekliyor.
          </p>
        </article>

        <form action="#" className="panel auth-form">
          <h2>Register</h2>
          <label>
            Full name
            <input placeholder="Ada Yılmaz" type="text" />
          </label>
          <label>
            Email
            <input placeholder="ada@finflow.com" type="email" />
          </label>
          <label>
            Password
            <input placeholder="••••••••" type="password" />
          </label>
          <button className="cta" type="submit">Create Account</button>
          <p className="tiny muted">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
