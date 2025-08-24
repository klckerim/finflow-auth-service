"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/context/locale-context";

export function LocaleDropdown() {
    const { locale, setLocale } = useLocale();
    const { t } = useLocale();

    return (
        <Select value={locale} onValueChange={(val) => setLocale(val as "en" | "tr" | "de")}>
            <SelectTrigger className="w-32">
                <SelectValue placeholder={t("lang.select")}/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">🇺🇸 {t("lang.en")}</SelectItem>
                <SelectItem value="tr">🇹🇷 {t("lang.tr")}</SelectItem>
                <SelectItem value="de">🇩🇪 {t("lang.de")}</SelectItem>
            </SelectContent>
        </Select>
    );
}
