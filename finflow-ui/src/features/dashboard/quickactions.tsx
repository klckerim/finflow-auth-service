import { Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "@/context/locale-context";

const QuickActions = () => {
  const { t } = useLocale();

  const actions = [
    {
      icon: <Plus className="h-6 w-6" />,
      label: t("common.str_NewWallet"),
      path: "/dashboard/wallets/add"
    },
    {
      icon: <History className="h-6 w-6" />,
      label: t("common.str_LastTransactions"),
      path: "/dashboard/transactions"
    },
  ];

  return (
    <div className="ff-card">
      <h2 className="mb-4 text-xl font-semibold">{t("common.str_QuickActions")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action, index) => (
          <Link href={action.path} key={index}>
            <Button
              variant="outline"
              className="h-28 w-full flex-col gap-2 rounded-xl border-border/70 bg-background/70 hover:bg-accent/20"
            >
              <div>{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
