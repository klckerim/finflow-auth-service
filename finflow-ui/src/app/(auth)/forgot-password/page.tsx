"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/cards/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseApiResponseError } from "@/shared/lib/api-error-handler";
import { useLocale } from "@/context/locale-context";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocale();

  const demo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetUrl(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const msg = await parseApiResponseError(res);
        throw new Error(t(msg.errorCode, msg.paramValue));
      }

      const data = await res.json();

      if (demo && data.resetUrl) {
        setResetUrl(data.resetUrl as string);
      } else {
        toast.message(t("warningsMessages.passwordResetLinkSent"));
        router.push("/login");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("internal_server_error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("common.str_ForgotPassword")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="email">{t("dashboard.email")}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("common.str_EnterEmail")}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("common.sending") : t("dashboard.sendResetLink")}
            </Button>
          </form>

          {resetUrl && (
            <div className="mt-6 p-3 border rounded-lg bg-muted/30">
              <p className="text-sm mb-2 font-medium">{t("common.str_DemoMode")}:</p>
              <p className="text-sm break-all">{resetUrl}</p>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => router.push(resetUrl)}>{t("common.str_OpenResetPage")} </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}