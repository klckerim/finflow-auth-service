// components/AnalyticsWidget.tsx
/**
 * Analytics widget placeholder - For future dashboard charts.
 */
import { useLocale } from "@/context/locale-context";
import { BarChart } from "lucide-react";

const AnalyticsWidget = () => {
  const { t } = useLocale();

  return (
    <div className="mt-8 border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t("common.str_FinancialAnalysis")}</h2>
        <BarChart className="h-5 w-5 text-primary" />
      </div>
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">
          {t("common.str_FinancialCharts")}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsWidget;