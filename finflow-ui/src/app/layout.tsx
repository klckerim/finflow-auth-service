import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Sidebar } from "lucide-react";
import { AuthProvider } from "@/context/auth-context";


export const metadata: Metadata = {
  title: "FinFlow",
  description: "Your Digital Wallet"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-background text-foreground min-h-screen">
        <AuthProvider>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 ml-64 bg-muted min-h-screen overflow-auto">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}