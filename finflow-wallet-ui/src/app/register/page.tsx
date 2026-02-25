"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestApi } from "@/lib/finflow-api";
import { useFinflowSession } from "@/context/finflow-session";

export default function RegisterPage() {
  const { apiBase } = useFinflowSession();
  const [fullName, setFullName] = useState("Ada Yılmaz");
  const [username, setUsername] = useState("adayilmaz");
  const [email, setEmail] = useState("ada@mail.com");
  const [password, setPassword] = useState("P@ssw0rd123");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const data = await requestApi<{ userId: string }>(apiBase, "/api/v1/Auth/register", {
        method: "POST",
        body: { fullName, username, email, password }
      });
      setFeedback(`Kayıt başarılı: ${data.userId}`);
    } catch (error) {
      setFeedback((error as Error).message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="badge">Register API</p>
        <h1>Yeni kullanıcı oluştur</h1>
        <label>
          Full name
          <input onChange={(e) => setFullName(e.target.value)} type="text" value={fullName} />
        </label>
        <label>
          Username
          <input onChange={(e) => setUsername(e.target.value)} type="text" value={username} />
        </label>
        <label>
          Email
          <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} />
        </label>
        <label>
          Password
          <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} />
        </label>
        <button className="primary-button" type="submit">
          POST /api/v1/Auth/register
        </button>
        {feedback ? <p className="muted small">{feedback}</p> : null}
        <p className="muted small">
          Zaten hesabın var mı? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
