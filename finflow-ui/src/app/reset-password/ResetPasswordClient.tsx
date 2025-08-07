"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { parseApiResponseError, parseUnknownError } from "@/lib/api-error-handler"

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error("Token not found.")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setLoading(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password, confirmPassword }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      toast.success("Your password has been successfully reset.")
      router.push("/login")
    } else {
      const msg = await parseApiResponseError(res);
      parseUnknownError(new Error(msg));
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-8 sm:pt-12">
      <div className="max-w-md w-full p-4 border rounded-xl shadow-md">
        <Card className="w-full max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4">Set a New Password</h2>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">New Password (Again)</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}
