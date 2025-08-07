"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { parseApiResponseError, parseUnknownError } from "@/lib/api-error-handler";

const AddWalletPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [balance, setBalance] = useState("");

  const handleSubmit = async () => {
    if (!user) return alert("Please login first!");

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">🆕 Add New Wallet</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Wallet Name</Label>
              <Input
                id="name"
                placeholder="i.e. Daily Expenses"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRY">₺ Turkish Lira (TRY)</SelectItem>
                  <SelectItem value="USD">$ Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="balance">Initial Balance (optional)</Label>
              <Input
                id="balance"
                type="number"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name || !currency}>
              Create Wallet
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AddWalletPage;
