"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestApi } from "@/lib/finflow-api";
import { useFinflowSession } from "@/context/finflow-session";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { apiBase, setSession } = useFinflowSession();
  const router = useRouter();
  const [email, setEmail] = useState("demo@finflow.com");
  const [password, setPassword] = useState("P@ssw0rd123");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const data = await requestApi<{
        userId: string;
        email: string;
        fullName: string;
        role: string;
        token: string;
      }>(apiBase, "/api/v1/Auth/login", {
        method: "POST",
        body: { email, password }
      });

      setSession({ token: data.token, userId: data.userId, email: data.email, fullName: data.fullName, role: data.role });
      setFeedback("Giriş başarılı.");
      router.push("/dashboard");
    } catch (error) {
      setFeedback((error as Error).message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="badge">Auth API</p>
        <h1>FinFlow hesabına giriş yap</h1>
        <label>
          Email
          <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} />
        </label>
        <label>
          Password
          <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} />
        </label>
        <button className="primary-button" type="submit">
          Login /api/v1/Auth/login
        </button>
        {feedback ? <p className="muted small">{feedback}</p> : null}
        <p className="muted small">
          Hesabın yok mu? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
