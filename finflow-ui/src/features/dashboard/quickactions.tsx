// components/QuickActions.tsx
/**
 * Quick actions component - Displays 3-4 frequently used actions as icons.
 */
import { Plus, Send, CreditCard, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const QuickActions = () => {
  const actions = [
    { 
      icon: <Plus className="h-6 w-6" />, 
      label: "New Wallet", 
      path: "/dashboard/wallets/add" 
    },
    { 
      icon: <History className="h-6 w-6" />, 
      label: "Last Transactions", 
      path: "/dashboard/transactions" 
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link href={action.path} key={index}>
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-28 w-full p-4 hover:bg-accent transition-colors"
            >
              <div className="mb-2">{action.icon}</div>
              <span className="text-sm">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;