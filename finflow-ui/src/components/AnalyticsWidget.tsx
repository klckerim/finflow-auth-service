// components/AnalyticsWidget.tsx
/**
 * Analytics widget placeholder - For future dashboard charts.
 */
import { BarChart } from "lucide-react";

const AnalyticsWidget = () => {
  return (
    <div className="mt-8 border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Finansal Analiz</h2>
        <BarChart className="h-5 w-5 text-primary" />
      </div>
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">
          İleride finansal grafikler burada gösterilecek
        </p>
      </div>
    </div>
  );
};

export default AnalyticsWidget;