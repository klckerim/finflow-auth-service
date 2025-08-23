
export interface Notification {
  id: string;
  titleKey: string;
  descriptionKey: string;
  isRead: boolean;
  createdAt: string;
}


const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    titleKey: "notifications.welcome.title",
    descriptionKey: "notifications.welcome.desc",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    titleKey: "notifications.transaction.title",
    descriptionKey: "notifications.transaction.desc",
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
