"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Globe,
    SunMoon,
    History,
    Info,
    LogOut,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger 
} from "./dropdown-menu";
import { useLocale } from "@/context/locale-context";

const ProfileDropdown = () => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState(1);
    const { locale, setLocale } = useLocale();
    const [theme, setTheme] = useState("light");

    // Dil değiştir
    const toggleLanguage = () => {
        const newLocale = locale === "tr" ? "en" : "tr";
        setLocale(newLocale);
    };

    // Tema değiştir
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" >
                {/* Kullanıcı Bilgisi */}
                <DropdownMenuItem className="flex items-center" onClick={() => router.push("/dashboard/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{user?.fullName || "My Account"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Notifications */}
                <DropdownMenuItem onClick={() => router.push("/dashboard/notifications")}>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Notifications</span>
                        </div>
                        {notifications > 0 && (
                            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
                                {notifications}
                            </span>
                        )}
                    </div>
                </DropdownMenuItem>

                

                {/* Language */}
                <DropdownMenuItem onClick={toggleLanguage}>
                    <Globe className="mr-2 h-4 w-4" />
                    <span>Language: {locale.toUpperCase()}</span>
                </DropdownMenuItem>

                {/* Theme */}
                <DropdownMenuItem onClick={toggleTheme}>
                    <SunMoon className="mr-2 h-4 w-4" />
                    <span>Theme: {theme === "light" ? "Light" : "Dark"}</span>
                </DropdownMenuItem>

                {/* About */}
                <DropdownMenuItem onClick={() => router.push("/about")}>
                    <Info className="mr-2 h-4 w-4" />
                    <span>About</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileDropdown;
