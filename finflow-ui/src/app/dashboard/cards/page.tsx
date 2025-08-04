"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function CardsPage() {
  const router = useRouter();

  const handleViewDetails = (cardId: number) => {
    router.push(`/dashboard/cards/details/${cardId}`); // Route dinamikse id ile gönderiyoruz
  };
  const addNewCard = () => {
    router.push(`/dashboard/cards/new`);
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Kartlarım</h1>
          <p className="text-muted-foreground">
            Kayıtlı kart bilgilerini burada yönetebilirsin.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => addNewCard()}>
          <Plus size={18} />
          Yeni Kart Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((cardId) => (
          <Card
            key={cardId}
            className="hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Visa Classic</CardTitle>
              <CreditCard size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                **** **** **** 567{cardId}
              </div>
              <div className="text-sm mt-1">Son Kullanma: 12/2{cardId}</div>
              <div className="text-sm mt-1">Kart Sahibi: Kerim K.</div>

              <Button variant="ghost" className="mt-4 w-full text-primary" onClick={() => handleViewDetails(cardId)}>
                Detayları Gör
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
