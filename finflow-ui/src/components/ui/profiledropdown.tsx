"use client"

/**
 * User profile dropdown menu in navbar.
 * Contains settings, language, theme, and logout options.
 */
import { useState } from "react";
import {
    User,
    Settings,
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
    DropdownMenuTrigger } from "./dropdown-menu";

const ProfileDropdown = () => {
    const [language, setLanguage] = useState("TR");
    const { user , logout} = useAuth();

    const toggleLanguage = () => {
        setLanguage(language === "TR" ? "EN" : "TR");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user?.fullName || "Hesabım"}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem>
                    <History className="mr-2 h-4 w-4" />
                    <span>İşlemlerim</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Bildirimler</span>
                        </div>
                        <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
                            1
                        </span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Ayarlar</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={toggleLanguage}>
                    <Globe className="mr-2 h-4 w-4" />
                    <span>Dil: {language}</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Info className="mr-2 h-4 w-4" />
                    <span>Hakkında</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileDropdown;
