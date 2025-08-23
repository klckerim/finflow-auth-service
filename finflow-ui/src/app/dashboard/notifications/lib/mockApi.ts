"use client";

import { useLocale } from "@/context/locale-context";

const { t } = useLocale();

export interface Notification {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: t("dashboard.welcomeTo"),
    description: t("common.str_WelcomeDescription"),
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: t("common.str_TransactionCompleted"),
    description: t("common.str_TransactionDescrption"),
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

export const getNotificationsByUser = async (): Promise<Notification[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_NOTIFICATIONS), 500));
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const notif = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (notif) notif.isRead = true;
    setTimeout(() => resolve(), 300);
  });
};
