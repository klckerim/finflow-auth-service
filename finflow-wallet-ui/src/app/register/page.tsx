import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <form className="auth-card" action="#">
        <p className="badge">Create account</p>
        <h1>Open your wallet in minutes</h1>
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
    </div>
  );
}
