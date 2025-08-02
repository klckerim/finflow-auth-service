// app/wallets/page.tsx
/**
 * Wallets page - Shows user's digital wallets.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

const WalletsPage = () => {
  const wallets = [
    { id: 1, name: "Ana Cüzdan", balance: "₺8,450.75", currency: "TRY" },
    { id: 2, name: "Dolar Cüzdanı", balance: "$1,200.50", currency: "USD" },
    { id: 3, name: "Euro Cüzdanı", balance: "€850.30", currency: "EUR" },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Cüzdanlarım</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{wallet.name}</CardTitle>
                  <Badge variant="secondary">{wallet.currency}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{wallet.balance}</p>
                <div className="flex space-x-2 mt-4">
                  <button className="text-sm text-primary hover:underline">
                    Transfer
                  </button>
                  <button className="text-sm text-primary hover:underline">
                    Detay
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WalletsPage;