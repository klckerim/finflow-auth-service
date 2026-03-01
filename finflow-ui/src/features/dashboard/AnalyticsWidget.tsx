import { useMemo } from "react";
import { useLocale } from "@/context/locale-context";
import { useWalletStore } from "@/app/store/walletStore";
import { BarChart, TrendingUp, Wallet } from "lucide-react";

const AnalyticsWidget = () => {
  const { t } = useLocale();
  const wallets = useWalletStore((state) => state.wallets);
  const summary = useMemo(() => {
    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const topWallet = wallets.reduce(
      (current, wallet) => (wallet.balance > current.balance ? wallet : current),
      wallets[0] ?? { name: "", balance: 0, currency: "" }
    );
    const currency = wallets[0]?.currency ?? "";
    const sortedWallets = [...wallets].sort((a, b) => b.balance - a.balance).slice(0, 4);
    const maxBalance = sortedWallets[0]?.balance ?? 0;

    return {
      totalBalance,
      topWallet,
      currency,
      walletCount: wallets.length,
      chartItems: sortedWallets,
      maxBalance,
    };
  }, [wallets]);

  return (
    <div className="ff-card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("common.str_FinancialAnalysis")}</h2>
        <BarChart className="h-5 w-5 text-primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4 text-primary" />
            {t("common.str_TotalBalance")}
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {summary.totalBalance.toLocaleString()} {summary.currency}
          </div>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t("common.str_TopWallet")}
          </div>
          <div className="mt-2 text-lg font-semibold">
            {summary.topWallet.name || t("common.str_NoData")}
          </div>
          <p className="text-sm text-muted-foreground">
            {summary.topWallet.balance.toLocaleString()} {summary.topWallet.currency}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
          <div className="text-sm text-muted-foreground">{t("common.str_WalletCount")}</div>
          <div className="mt-2 text-2xl font-semibold">{summary.walletCount}</div>
          <p className="text-sm text-muted-foreground">{t("common.str_ActiveWallets")}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border/70 bg-muted/10 p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{t("common.str_WalletDistribution")}</span>
          <span>{t("common.str_Last30Days")}</span>
        </div>
        {summary.chartItems.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            {t("common.str_FinancialCharts")}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {summary.chartItems.map((wallet) => {
              const widthPercent = summary.maxBalance
                ? Math.max(8, Math.round((wallet.balance / summary.maxBalance) * 100))
                : 0;

              return (
                <div key={wallet.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{wallet.name}</span>
                    <span className="text-muted-foreground">
                      {wallet.balance.toLocaleString()} {wallet.currency}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsWidget;
