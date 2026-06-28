import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (title: string, message: string, type?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const response = await api.get("/notifications");
      if (Array.isArray(response.data)) {
        const mapped: NotificationItem[] = response.data.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
          isRead: n.isRead || false,
          type: n.notificationType || "INFO",
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.warn("Failed to fetch notifications from backend, using robust mock fallback:", err);
      // Fallback baseline seeding
      setNotifications([
        {
          id: "1",
          title: "Badge Earned: Eagle Eye Reporter",
          message: "You have been awarded the Reporter Badge for active neighborhood issue submissions!",
          timestamp: "10m ago",
          isRead: false,
          type: "BADGE_EARNED",
        },
        {
          id: "2",
          title: "Daily Spotter Completed",
          message: "Daily Challenge Completed: You have successfully filed a report and earned +20 XP!",
          timestamp: "2h ago",
          isRead: false,
          type: "CHALLENGE_COMPLETED",
        },
        {
          id: "3",
          title: "Assigned To Authority Queue",
          message: "Issue #1042 regarding Potholes on 12th Cross has been routed to Roads Department.",
          timestamp: "5h ago",
          isRead: true,
          type: "ISSUE_ASSIGNED",
        }
      ]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = (title: string, message: string, type: string = "INFO") => {
    const newItem: NotificationItem = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: "Just now",
      isRead: false,
      type,
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const markAsRead = async (id: string) => {
    // Optimistic local update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    try {
      await api.put(`/notifications/read?id=${id}`);
    } catch (err) {
      console.warn("Could not synchronize read status to backend", err);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await api.put("/notifications/read-all");
    } catch (err) {
      console.warn("Could not synchronize read-all to backend", err);
    }
  };

  const clearNotification = async (id: string) => {
    // Optimistic local delete
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      console.warn("Could not delete notification on backend", err);
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
