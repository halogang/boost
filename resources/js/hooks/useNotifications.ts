import { useState, useCallback } from 'react';
import axios from 'axios';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  action_url: string | null;
  action_label: string | null;
  read: boolean;
  created_at: string;
}

interface UseNotificationsReturn {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  fetchRecent: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useNotifications(initialUnreadCount = 0): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loading, setLoading] = useState(false);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<{
        notifications: NotificationItem[];
        unread_count: number;
      }>('/notifications/recent');
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    const { data } = await axios.post<{ success: boolean; unread_count: number }>(
      `/notifications/${id}/read`
    );
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(data.unread_count);
  }, []);

  const markAllRead = useCallback(async () => {
    await axios.post('/notifications/mark-all-read');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const remove = useCallback(async (id: string) => {
    const { data } = await axios.delete<{ success: boolean; unread_count: number }>(
      `/notifications/${id}`
    );
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount(data.unread_count);
  }, []);

  return { notifications, unreadCount, loading, fetchRecent, markRead, markAllRead, remove };
}
