// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "sonner";
import MobileNav from "@/components/layout/mobile-nav";
import { LocaleProvider } from "@/context/locale-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinFlow",
  description: "Modern and minimalist digital wallet solution",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.className}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LocaleProvider>
            <Toaster position="top-center" />
            <div className="flex min-h-screen w-full bg-background text-foreground">
              <Sidebar />
              <MobileNav />
              <div className="flex min-h-screen flex-1 flex-col md:ml-64">
                <Navbar />
                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
              </div>
            </div>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
