"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleRegister = async () => {
    setError("");
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      //https://localhost:5000/api/users/register

      console.log("Gönderilen Form:", form);
      
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data;
          
      if (res.ok) {
        data = await res.json();
      } else {
        const text = await res.text(); // hata mesajı varsa yakala
        console.error("Request failed:", res.status, text);
        throw new Error(`Request failed with status ${res.status}`);
      }
      
      router.push("/login"); // Başarılı kayıt sonrası giriş ekranına yönlendirme
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sunucu hatası");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>

      <Input
        name="name"
        placeholder="Ad Soyad"
        value={form.name}
        onChange={handleChange}
        className="mb-3"
      />
      <Input
        name="email"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
        className="mb-3"
      />
      <Input
        name="password"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="mb-3"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <Button onClick={handleRegister} className="w-full">
        Kayıt Ol
      </Button>
    </div>
  );
}
