"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
       const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      //https://localhost:5000/api/auth/login

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      let data;

      if (res.ok) {
        data = await res.json();
      } else {
        const text = await res.text(); // hata mesajı varsa yakala
        console.error("Request failed:", res.status, text);
        throw new Error(`Request failed with status ${res.status}`);
      }
      

      localStorage.setItem("token", data.token);
      router.push("/dashboard"); // Giriş sonrası yönlendirme

    } catch (err) {
      setError(err instanceof Error ? err.message : "Sunucu hatası");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-3"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <Button onClick={handleLogin} className="w-full">
        Login
      </Button>

            <div className="flex justify-between mt-4 text-sm text-blue-600">
        <Link href="/register" className="hover:underline">
          Create an account
        </Link>
        <Link href="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
      </div>


    </div>
  );
}
