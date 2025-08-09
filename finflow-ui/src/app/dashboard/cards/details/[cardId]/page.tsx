"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  ShieldCheck,
  BadgeCheck,
  Snowflake,
  Lock,
  TrendingUp,
} from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function CardDetailsPage() {
  const router = useRouter();

  // Demo data
  const cardData = {
    type: "Visa",
    holder: "Kerim K.",
    last4: "5678",
    expiry: "12/27",
    limit: 5000,
    balance: 1725.45,
    currency: "TRY",
    status: "Active",
    transactions: [
      { id: 1, title: "Amazon", amount: -250.75, date: "2025-08-01" },
      { id: 2, title: "Spotify", amount: -59.99, date: "2025-07-29" },
      { id: 3, title: "Refund - Trendyol", amount: +120.0, date: "2025-07-25" },
    ],
  };

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>


      {/* Digital Card Preview */}
      <motion.div
        className="relative w-full h-56 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg"
        initial={{ rotateY: 15, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start">
          <span className="font-bold tracking-wider">{cardData.type}</span>
          <CreditCard className="w-8 h-8" />
        </div>
        <div className="mt-12 text-2xl tracking-widest">
          **** **** **** {cardData.last4}
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <span className="block text-xs opacity-80">Card Holder</span>
            {cardData.holder}
          </div>
          <div>
            <span className="block text-xs opacity-80">Expires</span>
            {cardData.expiry}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Info */}
        <Card className="lg:col-span-2 border border-muted bg-muted/20 dark:bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Card Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <BadgeCheck className="w-4 h-4" /> {cardData.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Limit:</span>
              <span className="font-medium text-blue-600">
                ₺{cardData.limit.toLocaleString("tr-TR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Balance:</span>
              <span className="font-medium">
                ₺{cardData.balance.toLocaleString("tr-TR")}
              </span>
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 inline mr-1" />
              Protected by advanced encryption & fraud monitoring.
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-muted bg-muted/20 dark:bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start gap-2">
              <Snowflake className="w-4 h-4" /> Freeze Card
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Lock className="w-4 h-4" /> Disable Online Payments
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <TrendingUp className="w-4 h-4" /> Request Limit Increase
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border border-muted bg-muted/20 dark:bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {cardData.transactions.length > 0 ? (
            <div className="space-y-3">
              {cardData.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center border-b border-muted pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span
                    className={`font-medium ${
                      tx.amount < 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {tx.amount < 0 ? "-" : "+"}
                    ₺{Math.abs(tx.amount).toLocaleString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No recent transactions.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
