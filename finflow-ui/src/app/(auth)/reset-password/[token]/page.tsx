"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/cards/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { parseApiResponseError, parseUnknownError } from "@/shared/lib/api-error-handler";
import { useLocale } from "@/context/locale-context";
import { toast } from "sonner";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 5);
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLocale();

  const token = params?.token as string;

  const [valid, setValid] = useState<boolean | null>(null);
  const [emailMasked, setEmailMasked] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const score = useMemo(() => strength(password), [password]);

  useEffect(() => {
    if (!token) {
      setValid(false);
      setIsChecking(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/validate-reset-token?token=${encodeURIComponent(token)}`
        );

        if (!res.ok) {
          const msg = await parseApiResponseError(res);
          throw new Error(t(msg.errorCode, msg.paramValue));
        }

        const data = await res.json();
        setValid(data.valid);
        setEmailMasked(data.emailMasked);
      } catch (error) {
        setValid(false);
        const errorMessage = error instanceof Error ? error.message : t("internal_server_error");
        toast.error(errorMessage);
      } finally {
        setIsChecking(false);
      }
    })();
  }, [token, t]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      });

      if (!res.ok) {
        const msg = await parseApiResponseError(res);
        throw new Error(t(msg.errorCode, msg.paramValue));
      }

      toast.success(t("warningsMessages.passwordReset"));
      router.push("/login");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("internal_server_error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // İlk yükleme sırasında loading state göster
  if (isChecking) {
    return (
      <main className="flex items-center justify-center min-h-[70vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("common.loading")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("common.str_CheckingResetLink")}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (valid === false) {
    return (
      <main className="flex items-center justify-center min-h-[70vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("common.str_InvalidResetLink")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/forgot-password")}>
              {t("common.str_RequestNewLink")}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("common.str_SetPassword")}</CardTitle>
          {emailMasked && (
            <p className="text-sm text-muted-foreground">{emailMasked}</p>
          )}
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="pw">{t("common.str_NewPassword")}</Label>
              <Input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t("common.str_EnterPassword")}
              />
              <div className="mt-2">
                <Progress value={(score / 5) * 100} />
                <p className="text-xs text-muted-foreground mt-1">
                  {t("common.str_PasswordRequirements")}
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="cpw">{t("common.str_ConfirmPassword")}</Label>
              <Input
                id="cpw"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder={t("common.str_EnterPasswordAgain")}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || valid !== true}
            >
              {loading ? t("common.saving") : t("common.str_ResetPassword")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}