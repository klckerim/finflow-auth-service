// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "sonner";
import MobileNav from "@/components/layout/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinFlow",
  description: "Modern and minimalist digital wallet solution",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.className}>
      <body suppressHydrationWarning>
        {/* <div className="min-h-screen bg-muted/30"> */}
        <AuthProvider>
          <Toaster position="top-center" />
          <div className="flex min-h-screen w-full bg-background text-foreground">
            <Sidebar />
            <MobileNav />
            <div className="flex-1 flex flex-col transition-all duration-300">
              <Navbar />
              <main className="flex-1 p-6 md:p-0 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
