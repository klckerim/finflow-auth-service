"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { Card as CardUI, CardHeader, CardTitle, CardContent } from "@/features/cards/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/context/locale-context";
import { useAuth } from "@/context/auth-context";
import { startCardSetup } from "@/shared/lib/create-session";
import { getCardsByUserId } from "@/shared/lib/api";
import { Card as CardType } from "@/shared/types/card";


export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading } = useAuth();

  const { t } = useLocale();

  useEffect(() => {
    async function fetchCards() {
      if (user) {
        try {
          setLoading(true);
          const data = await getCardsByUserId(user.userId);
          setCards(data);
        } catch (error) {
          console.error("Failed to fetch cards", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchCards();
  }, [user]);

  const cardBrandIcon = (brand?: string) => {
    const normalized = brand?.toLowerCase(); // safe
    switch (normalized) {
      case "visa":
        return <CreditCard className="text-blue-600" />;
      case "mastercard":
        return <CreditCard className="text-orange-500" />;
      case "amex":
        return <CreditCard className="text-green-500" />;
      default:
        return <CreditCard />;
    }
  };

  return (
    <ProtectedRoute>
      <motion.div
        className="px-4 md:px-8 pt-6 pb-32 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">💳 {t("card.myCards")}</h1>
          <Button variant="outline" onClick={() => startCardSetup(user?.userId as string)}>
            <Plus size={18} className="mr-2" />
            {t("card.addNewCard")}
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">{t("common.loading")}</p>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-6 mt-12">
            <img src="/icons/credit-card.svg" alt="No Cards" className="w-48 h-48 sm:w-64 sm:h-64 opacity-80" />
            <h2 className="text-2xl font-semibold">{t("card.noCards")}</h2>
            <Button size="lg" onClick={() => startCardSetup(user?.userId as string)}>
              🚀 {t("card.addFirstCard")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <CardUI
                key={card.id}
                className="group hover:shadow-lg transition-all duration-300 border border-muted bg-gradient-to-br from-muted/30 via-muted/10 to-muted/30 dark:from-muted/20 dark:via-muted/5 dark:to-muted/20"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    {cardBrandIcon(card.brand)}
                    {card.brand} {card.isDefault && <Badge variant="secondary">{t("card.default")}</Badge>}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-sm text-muted-foreground tracking-widest">
                    **** **** **** {card.last4}
                  </div>
                  <div className="text-sm mt-1">{t("card.owner")}: {card.cardHolderName}</div>
                  <div className="text-sm">{t("card.expiry")}: {`${card.expMonth}/${card.expYear}`}</div>

                  <div className="flex justify-end mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => router.push(`/dashboard/cards/details/${card.id}`)}
                    >
                      {t("card.details")} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </CardUI>
            ))}
          </div>
        )}
      </motion.div>
    </ProtectedRoute>
  );
}
