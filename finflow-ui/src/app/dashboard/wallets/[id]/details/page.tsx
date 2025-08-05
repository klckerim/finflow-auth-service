"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wallet } from "@/types/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit3, Trash2, LucideTimer, Copy, Send, Download } from "lucide-react";
import { toast } from "sonner";
import { getWalletById } from "@/lib/api";

const WalletDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getWalletById(id as string)
      .then((data) => setWallet(data))
      .catch(() => {
        toast.error("Cüzdan bilgisi alınamadı.");
        router.push("/dashboard/wallets");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(wallet?.id || "");
    toast.success("Cüzdan ID kopyalandı");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!wallet) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Üst Butonlar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Geri
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2" onClick={() => router.push(`/dashboard/wallets/${wallet.id}/edit`)}>
            <Edit3 className="w-4 h-4" /> Düzenle
          </Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="w-4 h-4" /> Sil
          </Button>
        </div>
      </div>

      {/* Ana Bilgiler */}
      <Card className="shadow-sm bg-muted/40 border border-border">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            💼 {wallet.name}
            <Badge variant="outline" className="text-xs">{wallet.currency}</Badge>
          </CardTitle>
          <CardDescription>Cüzdan hakkında detaylı bilgiler</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-muted-foreground">
          <div className="text-4xl font-bold text-foreground">
            Bakiye: ₺{wallet.balance.toLocaleString()}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <LucideTimer className="w-4 h-4" />
              Oluşturulma: {new Date(wallet.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              ID: <span className="font-mono text-xs break-all">{wallet.id}</span>
              <Copy   className="w-4 h-4 text-blue-500 hover:text-blue-700 cursor-pointer" onClick={handleCopyId} />
            </div>
            <div>Durum: <Badge variant="default">{wallet.isActive}</Badge></div>
          </div>
        </CardContent>
      </Card>

      {/* Hızlı İşlemler */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>Cüzdanla hızlıca işlem yap</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="default" className="gap-2">
            <Send className="w-4 h-4" /> Para Gönder
          </Button>
          <Button variant="secondary" className="gap-2">
            <Download className="w-4 h-4" /> Para Çek
          </Button>
        </CardContent>
      </Card>

      {/* Özet Bilgiler */}
      <Card>
        <CardHeader>
          <CardTitle>İstatistik</CardTitle>
          <CardDescription>Cüzdan hareketleri özet</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {/* Transactions todo   */}
          <div>
            <p className="text-muted-foreground text-sm">Son İşlem</p>
            <p className="text-lg font-semibold">0</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Toplam Giriş</p>
            <p className="text-lg font-semibold">0</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Toplam Çıkış</p>
            <p className="text-lg font-semibold">0</p>
          </div>
        </CardContent>
      </Card>

      {/* Geçmiş İşlemler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Transferler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">

        </CardContent>
      </Card>
    </div>
  );
};

export default WalletDetailPage;
