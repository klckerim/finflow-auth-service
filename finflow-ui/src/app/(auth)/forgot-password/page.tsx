"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { parseApiResponseError, parseUnknownError } from "@/shared/lib/api-error-handler";
import { useLocale } from "@/context/locale-context";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      // gelen token ile frontend'te reset-password sayfasına yönlendir
      router.push(`/reset-password?token=${data.token}`)
    } else {
      const msg = await parseApiResponseError(res);
      parseUnknownError(new Error(t(msg.errorCode, msg.paramValue)));
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-8 sm:pt-12">
      <div className="max-w-md w-full p-4 border rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("dashboard.forgotPassword")}</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">{t("dashboard.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {t("dashboard.sendResetLink")}
          </Button>
        </form>
      </div>
    </div>

  )
}
