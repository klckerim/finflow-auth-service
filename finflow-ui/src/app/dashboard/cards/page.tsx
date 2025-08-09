"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { Card as CardUI, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, ArrowRight, Eye } from "lucide-react";
import { motion } from "framer-motion";

// Örnek veri tipi
type CardType = {
  id: number;
  type: "Visa" | "Mastercard" | "Amex";
  last4: string;
  holder: string;
  expiry: string;
  balance: number;
  currency: string;
};

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Burada API'den kart verisi çekilebilir.
    // Demo amaçlı statik veri
    setTimeout(() => {
      setCards([
        { id: 1, type: "Visa", last4: "1234", holder: "Kerim K.", expiry: "12/27", balance: 1250.75, currency: "USD" },
        { id: 2, type: "Mastercard", last4: "9876", holder: "Kerim K.", expiry: "05/26", balance: 8420.5, currency: "EUR" },
        { id: 3, type: "Amex", last4: "4567", holder: "Kerim K.", expiry: "11/28", balance: 65400, currency: "TRY" }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const cardBrandIcon = (type: string) => {
    switch (type) {
      case "Visa":
        return <CreditCard className="text-blue-600" />;
      case "Mastercard":
        return <CreditCard className="text-orange-500" />;
      case "Amex":
        return <CreditCard className="text-green-500" />;
      default:
        return <CreditCard />;
    }
  };

  const handleAddCard = () => {
    router.push("/dashboard/cards/new");
  };

  const handleDetails = (id: number) => {
    router.push(`/dashboard/cards/details/${id}`);
  };

  return (
    <ProtectedRoute>
      <motion.div
        className="px-4 md:px-8 pt-6 pb-32 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">💳 My Cards</h1>
          {cards.length > 0 && (
            <Button variant="outline" onClick={handleAddCard}>
              <Plus size={18} className="mr-2" />
              Add New Card
            </Button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center text-muted-foreground">Loading cards...</p>
        ) : cards.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center gap-6 mt-12">
            <img src="/credit-card.svg" alt="No Cards" className="w-48 h-48 sm:w-64 sm:h-64" />
            <h2 className="text-2xl font-semibold">No cards yet</h2>
            <p className="text-muted-foreground max-w-md">
              Add your first card to start managing your expenses easily.
            </p>
            <Button size="lg" onClick={handleAddCard}>
              🚀 Add Your First Card
            </Button>
          </div>
        ) : (
          // Cards Grid
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <CardUI
                key={card.id}
                className="group hover:shadow-lg transition-all duration-300 border border-muted bg-gradient-to-br from-muted/30 via-muted/10 to-muted/30 dark:from-muted/20 dark:via-muted/5 dark:to-muted/20"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    {cardBrandIcon(card.type)}
                    {card.type}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">{card.currency}</Badge>
                </CardHeader>

                <CardContent>
                  <div className="text-sm text-muted-foreground tracking-widest">
                    **** **** **** {card.last4}
                  </div>
                  <div className="text-sm mt-1">Owner: {card.holder}</div>
                  <div className="text-sm">Expiry: {card.expiry}</div>

                  <div className="text-2xl font-bold mt-4">
                    {card.balance.toLocaleString("en-US", { style: "currency", currency: card.currency })}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => handleDetails(card.id)}
                    >
                      View Details <ArrowRight className="w-4 h-4 ml-1" />
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
