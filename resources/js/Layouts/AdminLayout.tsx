import React, { ReactNode, useEffect, useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import MobileDrawer from '@/Layouts/MobileDrawer';
import ThemeToggle from '@/Components/ThemeToggle';
import { initTheme } from '@/utils/theme';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/Button';
import NotificationDropdown from '@/Components/Notifications/NotificationDropdown';
import { PageProps } from '@/types';

interface Props {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: Props) {
  const { auth, navigation, notifications } = usePage<PageProps>().props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    initTheme();
  }, []);

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        menus={navigation?.drawer || []}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/5 sticky top-0 z-40">
          <div className="relative flex items-center justify-between px-4 md:px-8 py-4">
            {/* Left: Hamburger (Mobile) + Title/Cabang (Desktop) */}
            <div className="flex items-center gap-4">
              {/* Hamburger Menu Button (Mobile Only) */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Desktop: Show Cabang (hardcode) */}
              <div className="hidden md:block">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Cabang
                </h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Kelola pengaturan sistem dan data master
                </p>
              </div>
            </div>

            {/* Mobile: Logo di tengah (absolute positioning) */}
            <div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
              <img
                src="/AJIB-DARKAH-INDONESIA.png"
                alt="Ajib Darkah Indonesia"
                className="h-10 w-auto"
              />
            </div>

            {/* Right: Theme Toggle + Notification + User Profile */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              <NotificationDropdown initialUnreadCount={notifications?.unread_count ?? 0} />

              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition cursor-pointer"
              >
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm md:text-base">
                  {auth.user?.name.charAt(0).toUpperCase()}
                </div>

                <div className="hidden md:block text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">{auth.user?.name}</p>
                  <div className="flex gap-2 mt-1">
                    {auth.user?.roles &&
                    Array.isArray(auth.user.roles) &&
                    auth.user.roles.length > 0 ? (
                      auth.user.roles.map((role) => {
                        const key = typeof role === 'string' ? role : role.id;
                        const label = typeof role === 'string' ? role : role.name;
                        return (
                          <span
                            key={key}
                            className="inline-block text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded font-medium"
                          >
                            {label}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">User</span>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0 bg-gray-50 dark:bg-gray-900">
          <div className="p-3 md:p-4 lg:p-8 max-w-full overflow-x-hidden">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Profile Modal */}
      <Modal show={showProfileModal} onClose={() => setShowProfileModal(false)} maxWidth="md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-2xl">
              {auth.user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {auth.user?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {auth.user?.email}
              </p>
              <div className="flex gap-2 mt-2">
                {auth.user?.roles &&
                Array.isArray(auth.user.roles) &&
                auth.user.roles.length > 0 ? (
                  auth.user.roles.map((role) => {
                    const key = typeof role === 'string' ? role : role.id;
                    const label = typeof role === 'string' ? role : role.name;
                    return (
                      <span
                        key={key}
                        className="inline-block text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-1 rounded font-medium"
                      >
                        {label}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">User</span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 mb-6">
            <Link
              href="/settings/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              onClick={() => setShowProfileModal(false)}
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Profil Saya</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowProfileModal(false)}
              className="flex-1"
            >
              Tutup
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-1"
            >
              Keluar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
