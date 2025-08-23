
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
    title: "Welcome to FinFlow!",
    description: "Thanks for joining FinFlow. Start by adding a new wallet.",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Transaction Completed",
    description: "Your last transfer of $100 was successful.",
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
