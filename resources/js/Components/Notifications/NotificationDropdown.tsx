import React, { useEffect, useRef, useState } from 'react';
import { useNotifications, NotificationItem } from '@/hooks/useNotifications';

const TYPE_STYLES: Record<NotificationItem['type'], { border: string; icon: string; iconBg: string }> = {
  info:    { border: 'border-l-blue-500',  icon: 'ℹ',  iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' },
  success: { border: 'border-l-green-500', icon: '✓',  iconBg: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' },
  warning: { border: 'border-l-yellow-500',icon: '⚠',  iconBg: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400' },
  danger:  { border: 'border-l-red-500',   icon: '✕',  iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' },
};

interface Props {
  initialUnreadCount?: number;
}

export default function NotificationDropdown({ initialUnreadCount = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, loading, fetchRecent, markRead, markAllRead, remove } =
    useNotifications(initialUnreadCount);

  // Fetch when opening
  useEffect(() => {
    if (open) {
      fetchRecent();
    }
  }, [open, fetchRecent]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (n: NotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!n.read) await markRead(n.id);
    if (n.action_url) window.location.href = n.action_url;
  };

  const handleRemove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await remove(id);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 relative"
        aria-label="Notifikasi"
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">Notifikasi</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs text-primary hover:underline"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/50">
            {loading && (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Memuat...
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="py-10 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm">Tidak ada notifikasi baru</p>
              </div>
            )}

            {!loading && notifications.map((n) => {
              const style = TYPE_STYLES[n.type];
              return (
                <div
                  key={n.id}
                  onClick={(e) => handleMarkRead(n, e)}
                  className={`flex items-start gap-3 px-4 py-3 border-l-4 ${style.border} cursor-pointer transition-colors ${
                    n.read
                      ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      : 'bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                  }`}
                >
                  {/* Type icon */}
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${style.iconBg}`}>
                    {style.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{n.created_at}</span>
                      {n.action_url && n.action_label && (
                        <span className="text-xs text-primary font-medium hover:underline">{n.action_label}</span>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleRemove(n.id, e)}
                    className="mt-0.5 text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors flex-shrink-0"
                    aria-label="Hapus notifikasi"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
