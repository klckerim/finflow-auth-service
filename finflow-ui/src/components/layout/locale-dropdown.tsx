"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/context/locale-context";

export function LocaleDropdown() {
    const { locale, setLocale } = useLocale();

    return (
        <Select value={locale} onValueChange={(val) => setLocale(val as "en" | "tr")}>
            <SelectTrigger className="w-32">
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="tr">🇹🇷 Turkish</SelectItem>
                <SelectItem value="de">🇩🇪 German</SelectItem>
            </SelectContent>
        </Select>
    );
}
