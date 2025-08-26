"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/cards/card";
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  BadgeCheck,
  Snowflake,
  Lock,
  TrendingUp,
} from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useLocale } from "@/context/locale-context";
import { useEffect, useState } from "react";
import { getCardById, getTransactionsByCardId } from "@/shared/lib/api";
import { Card as CardType } from "@/shared/types/card";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import { toast } from "sonner";


const CardDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const [card, setCard] = useState<CardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastTransactions, setLastTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    getCardById(id as string)
      .then((data) => {
        setCard(data);
      })
      .catch(() => {
        toast.error(t("common.str_CardNotRetrieved"));
        router.push("/dashboard/cards");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        if (!card) return;
        const response = await getTransactionsByCardId(id as string, 10);
        setLastTransactions(response);
      } catch (err) {
        parseUnknownError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [card]);

  const cardBrandIcon = (brand?: string) => {
    const normalized = brand?.toLowerCase();
    switch (normalized) {
      case "visa":
        return <CreditCard className="text-orange-600" />;
      case "mastercard":
        return <CreditCard className="text-orange-500" />;
      case "amex":
        return <CreditCard className="text-green-500" />;
      default:
        return <CreditCard />;
    }
  };

  if (loading || !card) return <p className="text-center mt-6">{t("common.loading")}</p>;

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> {t("card.back")}
      </Button>

      {/* Digital Card Preview */}
      <motion.div className="relative w-full h-56 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <span className="font-bold tracking-wider">{card.brand}</span>
          {cardBrandIcon(card.brand)}
        </div>
        <div className="mt-12 text-2xl tracking-widest">
          **** **** **** {card.last4}
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <span className="block text-xs opacity-80">{t("card.holder")}</span>
            {card.cardHolderName}
          </div>
          <div>
            <span className="block text-xs opacity-80">{t("card.expires")}</span>
            {`${card.expMonth}/${card.expYear}`}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Info */}
        <Card className="lg:col-span-2 border border-muted bg-muted/20 dark:bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">{t("card.info")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("card.status")}:</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <BadgeCheck className="w-4 h-4" /> {card.isActive}
              </span>
            </div>

            <Separator />
            <div className="text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 inline mr-1" />
              {t("card.protected")}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-muted bg-muted/20 dark:bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">{t("card.quickActions")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start gap-2">
              <Snowflake className="w-4 h-4" /> {t("card.freezeCard")}
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Lock className="w-4 h-4" /> {t("card.disablePayments")}
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <TrendingUp className="w-4 h-4" /> {t("card.requestLimit")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border border-muted bg-muted/20 dark:bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">{t("card.recentTransactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          {lastTransactions?.length > 0 ? (
            <div className="space-y-3">
              {lastTransactions.map((tx: any) => (
                <div key={tx.id} className="flex justify-between items-center border-b border-muted pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className={`font-medium ${tx.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                    {tx.amount < 0 ? "-" : "+"}{tx.currency} {Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">{t("card.noRecentTransactions")}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}


export default CardDetailsPage;
