import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinFlow Wallet UI",
  description: "Yeni wallet deneyimi için başlangıç UI iskeleti"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
