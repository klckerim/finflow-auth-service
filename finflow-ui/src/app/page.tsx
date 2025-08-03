"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <section className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          FinFlow'a Hoş Geldin {user ? `, ${user.name}` : ""}
        </h1>
        <p className="text-lg text-muted-foreground">
          Gelir-gider takibi, bütçe planlaması ve finansal farkındalık tek bir yerde.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center text-lg font-medium">📊 Finansal Durumunu Görselleştir</Card>
        <Card className="p-6 text-center text-lg font-medium">💸 Harcama Limitleri Belirle</Card>
        <Card className="p-6 text-center text-lg font-medium">🧠 Akıllı Tavsiyeler Al</Card>
      </section>

      <section className="flex flex-wrap justify-center gap-4">
        {user ? (
          <>
            <Button onClick={() => router.push("/dashboard")}>📂 Dashboard</Button>
            <Button variant="outline" onClick={logout}>🚪 Çıkış Yap</Button>
          </>
        ) : (
          <>
            <Button onClick={() => router.push("/register")}>🚀 Kayıt Ol</Button>
            <Button variant="outline" onClick={() => router.push("/login")}>🔐 Giriş Yap</Button>
          </>
        )}
      </section>

      {!user && (
        <section className="mt-12 text-center text-muted-foreground text-sm">
          Hesabınla kontrol sende. Başlamak için ücretsiz kayıt olabilirsin.
        </section>
      )}
    </div>
  );
}
