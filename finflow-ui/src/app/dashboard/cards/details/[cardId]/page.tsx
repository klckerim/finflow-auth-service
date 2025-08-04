"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BadgeCheck, CreditCard, Calendar, ShieldCheck, ArrowLeft } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function CardDetailsPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" />
        Geri Dön
      </Button>

      <Card className="rounded-2xl shadow-lg border border-border bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight text-primary flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            FinFlow Sanal Kart
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Kart Numarası:</span>
            <span className="font-medium tracking-wider">**** **** **** 5678</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Son Kullanma Tarihi:</span>
            <span className="font-medium flex items-center gap-1"><Calendar className="w-4 h-4" /> 12/27</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Güvenlik Kodu:</span>
            <span className="font-medium">•••</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Kart Sahibi:</span>
            <span className="font-medium">Kerim Kılıç</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Durum:</span>
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <BadgeCheck className="w-4 h-4" /> Aktif
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Limit:</span>
            <span className="font-medium text-blue-600">₺5.000,00</span>
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 inline mr-1" />
            Bu kart, gelişmiş şifreleme ile korunmaktadır.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
