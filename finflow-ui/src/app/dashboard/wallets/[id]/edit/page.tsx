"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/features/cards/card";
import { toast } from "sonner";
import { Wallet } from "@/shared/types/wallet";
import { getWalletById, updateWalletById } from "@/shared/lib/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocale } from "@/context/locale-context";

const EditWalletPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLocale();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    isActive: true
  });

  useEffect(() => {
    if (!id) return;

    getWalletById(id as string)
      .then((data) => {
        if (!data) {
          toast.error(t("warningsMessages.walletNotFound"));
          router.push("/dashboard/wallets");
          return;
        }
        setWallet(data);
        setFormData({
          name: data.name,
          isActive: data.isActive
        });
      })
      .catch(() => {
        toast.error(t("warningsMessages.walletNotFound"));
        router.push("/dashboard/wallets");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!wallet) return;
    try {
      setUpdating(true);
      const payload = {
        ...formData
      };
      await updateWalletById(wallet.id, payload);
      toast.success(t("warningsMessages.walletUpdated"));
      router.push(`/dashboard/wallets/${wallet.id}/details`);
    } catch (error) {
      toast.error(t("warningsMessages.walletNotUpdated"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" /> {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            ✏️  {t("common.str_EditWallet")} – {wallet?.name}
          </CardTitle>
          <CardDescription>
            {t("common.str_WalletUpdateDetails")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("common.str_WalletName")}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("common.str_WalletNamePlaceholder")}
            />
          </div>


          <Button onClick={handleSubmit} disabled={updating} className="w-full">
            {updating && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {t("common.str_UpdateWallet")}
          </Button>
        </CardContent>
      </Card>

      {/* Kullanıcıya Rehber Panel */}
      <Card className="bg-muted/30 border-muted">
        <CardHeader>
          <CardTitle>💡 {t("common.tips")}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• {t("tips.str1")}</p>
          <p>• {t("tips.str2")}</p>
          <p>• {t("tips.str3")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditWalletPage;
