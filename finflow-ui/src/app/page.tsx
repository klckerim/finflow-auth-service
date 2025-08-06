"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getGreeting } from "@/components/ui/label";
import {
  TrendingUp,
  PiggyBank,
  CalendarCheck,
  Lightbulb,
  Sun,
  Moon,
  CreditCard,
  Wallet,
} from "lucide-react";
import dynamic from "next/dynamic";

const ExpensesPieChart = dynamic(() => import("@/components/charts/expenses-pie-chart"));
const MonthlyTrendLineChart = dynamic(() => import("@/components/charts/monthly-trend-line-chart"));

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const greeting = getGreeting();
  const [quote, setQuote] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const dummyData = [
    { name: "Kira", value: 1200 },
    { name: "Market", value: 800 },
    { name: "Ulaşım", value: 400 },
  ];
  const mockMonthlyTrendData = [
    { month: "Jan", income: 1200, expense: 200 },
    { month: "Feb", income: 1000, expense: 200 },
    { month: "Mar", income: 1400, expense: 200 },
    { month: "Apr", income: 900, expense: 200 },
  ];

  useEffect(() => {
    const quotes = [
      "Bugünün planı, yarının başarısıdır.",
      "Paranı yönet, geleceğini şekillendir.",
      "Küçük adımlar, büyük farklar yaratır.",
      "Finansal özgürlük bir alışkanlıktır.",
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 transition-colors duration-500">
      <section className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          FinFlow'a Hoş Geldin{user ? `, ${user.fullName}` : ""}
        </h1>
        <p className="text-2xl text-primary">{greeting}</p>
        <p className="text-lg text-muted-foreground">
          Cüzdanlarını yönet, kartlarını takip et ve finansal hedeflerine ulaş.
        </p>
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <span className="flex items-center"><Sun className="mr-2" /> Aydınlık Moda Geç</span>
          ) : (
            <span className="flex items-center"><Moon className="mr-2" /> Karanlık Moda Geç</span>
          )}
        </Button>
      </section>

      {user && (
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bakiye</CardTitle>
              <PiggyBank className="text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">₺12.345,00</p>
              <p className="text-sm text-muted-foreground">Tüm cüzdanlardan toplam</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kart Sayısı</CardTitle>
              <CreditCard className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">4</p>
              <p className="text-sm text-muted-foreground">Kayıtlı tüm kartların</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Son İşlem</CardTitle>
              <CalendarCheck className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">₺200 - Market</p>
              <p className="text-sm text-muted-foreground">2 gün önce</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Aylık Hedef</CardTitle>
              <TrendingUp className="text-purple-500" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={65} />
              <p className="text-sm text-muted-foreground">₺6.500 / ₺10.000</p>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center text-lg font-medium hover:shadow-xl transition">
          🧾 Cüzdan ve Kartlarını Kolayca Yönet
        </Card>
        <Card className="p-6 text-center text-lg font-medium hover:shadow-xl transition">
          📈 Finansal Durumunu Anında Gör
        </Card>
        <Card className="p-6 text-center text-lg font-medium hover:shadow-xl transition">
          🧠 Akıllı Tavsiyelerle Harcamalarını Optimize Et
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>En Çok Harcama Yaptığın Kategoriler</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesPieChart data={dummyData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aylık Gelir/Gider Trendin</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendLineChart data={mockMonthlyTrendData} />
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Market</span>
              <span>-₺200</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Restoran</span>
              <span>-₺150</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Benzin</span>
              <span>-₺300</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kişiselleştirilmiş Tavsiyeler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><Lightbulb className="inline mr-2 text-yellow-500" /> Gıda harcamalarını %10 azaltmayı deneyebilirsin.</p>
            <p><Lightbulb className="inline mr-2 text-yellow-500" /> Hedefine ulaşmak için haftalık ₺400 kenara koy.</p>
            <p><Lightbulb className="inline mr-2 text-yellow-500" /> Bu ay ulaşım giderlerin ortalamanın üzerinde.</p>
          </CardContent>
        </Card>
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

      <section className="text-center mt-8">
        <p className="italic text-muted-foreground text-sm">"{quote}"</p>
      </section>

      {!user && (
        <section className="mt-12 text-center text-muted-foreground text-sm">
          Finansal farkındalığını artırmak için şimdi ücretsiz kayıt olabilirsin.
        </section>
      )}
    </div>
  );
}
