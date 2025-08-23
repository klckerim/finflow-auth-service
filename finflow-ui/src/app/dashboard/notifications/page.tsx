"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/features/cards/card";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { getNotificationsByUser, markNotificationAsRead, Notification } from "./lib/mockApi";
import { useLocale } from "@/context/locale-context";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLocale();

    useEffect(() => {
        getNotificationsByUser()
            .then((data) => setNotifications(data))
            .finally(() => setLoading(false));
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    };

    if (loading) return <p className="text-center mt-8">{t("common.loading")}</p>;

    if (notifications.length === 0) return <p className="text-center mt-8">{t("common.str_NoNotifications")}</p>;

    return (
        <motion.div
            className="px-4 md:px-8 pt-6 pb-32 max-w-4xl mx-auto space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {notifications.map((notif) => (
                <Card key={notif.id} className="p-4 flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                            <Bell className="w-4 h-4" /> {notif.title}
                        </CardTitle>
                        <CardContent className="text-xs sm:text-sm text-muted-foreground">
                            {notif.description}
                        </CardContent>
                    </div>
                    {!notif.isRead && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(notif.id)}>
                            <Check className="w-3 h-3" /> {t("common.str_MarkAsRead")}
                        </Button>
                    )}
                </Card>
            ))}
        </motion.div>
    );
};

export default NotificationsPage;
