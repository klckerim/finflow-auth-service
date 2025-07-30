"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background px-4">
      <div className="text-center space-y-8 max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          FinFlow’a Hoş Geldin
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Kişisel finansını yönetmenin en akıllı yolu. Dijital cüzdan oluştur, transfer işlemleri yap ve bütçeni yönet.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" variant="default">Giriş Yap</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">Kayıt Ol</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
