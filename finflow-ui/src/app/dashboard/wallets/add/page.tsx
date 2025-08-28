"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/features/cards/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { parseApiResponseError, parseUnknownError } from "@/shared/lib/api-error-handler";
import { motion } from "framer-motion";
import { Wallet, Info } from "lucide-react";
import { useLocale } from "@/context/locale-context";

const AddWalletPage = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useLocale();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);

  // Auth kontrolü
  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);


  const handleSubmit = async () => {
    if (!user) return alert("Please login first!");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/wallets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          name,
          currency,
          balance: 0
        }),
      });

      if (!response.ok) {
        const msg = await parseApiResponseError(response);
        throw new Error(t(msg.errorCode, msg.paramValue));
      }

      router.push("/dashboard/wallets");
    } catch (error: any) {
      parseUnknownError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <motion.div
        className="flex justify-center items-center min-h-[80vh] px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-lg shadow-lg border border-muted bg-muted/10 dark:bg-muted/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" /> {t("dashboard.createNewWallet")}
            </CardTitle>
            <CardDescription>
              <span className="italic">{t("common.str_OrganizeWallet")}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Wallet Name */}
            <div className="space-y-1">
              <Label htmlFor="name">{t("common.str_WalletName")}</Label>
              <Input
                id="name"
                placeholder={t("common.str_WalletNamePlaceholder2")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info size={12} /> {t("common.str_ChooseName")}
              </p>
            </div>

            {/* Currency */}
            <div className="space-y-1">
              <Label htmlFor="currency">{t("common.currency")}</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder={t("common.str_CurrencyPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRY">₺ {t("currencyTypes.TRY")}</SelectItem>
                  <SelectItem value="USD">$ {t("currencyTypes.USD")}</SelectItem>
                  <SelectItem value="EUR">€ {t("currencyTypes.EUR")}</SelectItem>
                  <SelectItem value="GBP">£ {t("currencyTypes.GBP")}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{t("common.str_SelectCurrency")}</p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => router.back()} className="w-1/2">
              {t("dashboard.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name || !currency || loading}
              className="w-1/2"
            >
              {loading ? t("common.creating") : t("dashboard.createWallet")}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </ProtectedRoute>
  );
};

export default AddWalletPage;
