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
import { formatDate } from "@/shared/lib/utils";
import { useAuth } from "@/context/auth-context";


const CardDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const [card, setCard] = useState<CardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastTransactions, setLastTransactions] = useState<any[]>([]);
  const { user, isLoading } = useAuth();

  // Auth kontrolü
  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);


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

        <CardContent className="p-4 sm:p-6 pt-0">
          {lastTransactions.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground">
              {t("common.str_NoTransaction")}
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto w-full rounded-lg border shadow-sm dark:border-border">
                <table className="w-full text-sm text-foreground dark:text-foreground">
                  <thead className="bg-gray-50 dark:bg-zinc-700">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t("common.description")}</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t("common.type")}</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t("common.date")}</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t("common.amount")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                    {lastTransactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        <td className="px-3 py-2 truncate max-w-[200px]">{tx.description}</td>
                        <td className="px-3 py-2">{t(tx.type)}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{formatDate(tx.createdAt)}</td>
                        <td className="px-3 py-2 font-medium text-right whitespace-nowrap">
                          {tx.amount} {card?.currency || "USD"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-2">
                {lastTransactions.map((tx, idx) => (
                  <div key={idx} className="p-3 rounded-lg border shadow-sm bg-white dark:bg-zinc-800 dark:border-border">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-md">{t(tx.type)}</span>
                      <span className="text-xs font-semibold">
                        {tx.amount} {card?.currency || "USD"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{tx.description}</div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-400">{formatDate(tx.createdAt)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}


export default CardDetailsPage;
