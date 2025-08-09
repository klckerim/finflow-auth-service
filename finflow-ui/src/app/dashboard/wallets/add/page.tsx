"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { parseApiResponseError, parseUnknownError } from "@/lib/api-error-handler";
import { motion } from "framer-motion";
import { Wallet, Info, PiggyBank } from "lucide-react";

const AddWalletPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return alert("Please login first!");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          name,
          currency,
          balance: balance ? parseFloat(balance) : 0
        }),
      });

      if (!response.ok) {
        const msg = await parseApiResponseError(response);
        throw new Error(msg);
      }

      router.push("/dashboard/wallets");
    } catch (error: any) {
      parseUnknownError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <motion.div
        className="flex justify-center items-center min-h-[80vh] px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-lg shadow-lg border border-muted bg-muted/10 dark:bg-muted/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" /> Create a New Wallet
            </CardTitle>
            <CardDescription>
              Organize your finances by creating a wallet for different needs — 
              like <span className="italic">Daily Expenses</span>, 
              <span className="italic"> Vacation Savings</span> or <span className="italic">Crypto Investments</span>.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Wallet Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Wallet Name</Label>
              <Input
                id="name"
                placeholder="Ex: Summer Trip to Italy"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info size={12} /> Choose a name that helps you recognize the purpose instantly.
              </p>
            </div>

            {/* Currency */}
            <div className="space-y-1">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRY">₺ Turkish Lira (TRY)</SelectItem>
                  <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select the main currency for this wallet.</p>
            </div>

            {/* Initial Balance */}
            <div className="space-y-1">
              <Label htmlFor="balance">Initial Balance (optional)</Label>
              <Input
                id="balance"
                type="number"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <PiggyBank size={12} /> You can start with zero and add money later.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => router.back()} className="w-1/2">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!name || !currency || loading} 
              className="w-1/2"
            >
              {loading ? "Creating..." : "Create Wallet"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </ProtectedRoute>
  );
};

export default AddWalletPage;
