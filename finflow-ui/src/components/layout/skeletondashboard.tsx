import { useLocale } from "@/context/locale-context";

export default function SkeletonDashboard() {
  const { t } = useLocale();
  return <div className="p-6 text-muted-foreground">{t("common.loading")}</div>;
}