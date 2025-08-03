// app/page.tsx (HomePage)
"use client";


import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();



  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold">FinFlow'a Hoş Geldin</h1>
      <p className="text-lg text-muted-foreground">
        Gelir-gider takibi, bütçe planlaması ve daha fazlası.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">📊 Finansal Durumunu Görselleştir</Card>
        <Card className="p-4">💸 Harcama Limitleri Belirle</Card>
        <Card className="p-4">🧠 Akıllı Tavsiyeler Al</Card>
      </div>

      {user ? (
        <>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Dashboard</Button>
          <Button variant="outline" onClick={logout}>Çıkış Yap</Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => router.push("/register")}>Kayıt Ol</Button>
          <Button variant="outline" onClick={() => router.push("/login")}>Giriş Yap</Button>
        </>
      )}

    </div>
  );
}
