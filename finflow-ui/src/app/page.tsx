"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
              FinFlow Auth Service
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Finansal kimliğinizi güvenli, hızlı ve sezgisel yönetin.
            </h1>
            <p className="text-lg text-gray-300">
              Cüzdanlarınızı ve kartlarınızı tek panelde toplayın, akıllı
              bildirimlerle hareketlerinizi takip edin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-primary hover:bg-blue-700 rounded-full px-6">
                <Link href="/login">Hemen giriş yap</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-gray-600 text-gray-200 hover:bg-white/10"
              >
                <Link href="/register">Ücretsiz hesap oluştur</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <div>
                <p className="text-white font-semibold text-lg">%99.9</p>
                <p>Uptime güvencesi</p>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">5x</p>
                <p>Daha hızlı giriş</p>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">24/7</p>
                <p>Canlı destek</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8">
            <div className="space-y-6">
              <div className="rounded-2xl bg-white/10 p-6">
                <p className="text-sm text-gray-300">Toplam bakiye</p>
                <p className="text-3xl font-semibold mt-2">€18.420,55</p>
                <p className="text-xs text-emerald-400 mt-3">+8.4% bu ay</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-6">
                <p className="text-sm text-gray-300">Güvenli işlemler</p>
                <div className="mt-4 space-y-3">
                  {["Anlık bildirimler", "Çift faktör doğrulama", "Cihaz bazlı giriş"].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-gray-200">
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Akıllı cüzdan yönetimi",
              description: "Tüm hesaplarınızı tek panelde yönetin, limitlerinizi izleyin.",
            },
            {
              title: "Gerçek zamanlı analitik",
              description: "Özet paneller ve trend göstergeleriyle finansal sağlığınızı görün.",
            },
            {
              title: "Kişiselleştirilebilir bildirimler",
              description: "Önemli hareketlerde anlık bildirim alın, kontrolü elden bırakmayın.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
