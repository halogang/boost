import React, { ReactNode, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import MobileDrawer from '@/Components/MobileDrawer';

interface Props {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: Props) {
  const { auth, navigation } = usePage<any>().props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
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
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            {/* Left: Hamburger (Mobile) + Title */}
            <div className="flex items-center gap-4">
              {/* Hamburger Menu Button (Mobile Only) */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
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

              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {title || 'Admin Panel'}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                  Kelola pengaturan sistem dan data master
                </p>
              </div>
            </div>

            {/* Right: Notification + User Profile */}
            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-gray-600"
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
              </button>

              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm md:text-base">
                {auth.user?.name.charAt(0).toUpperCase()}
              </div>

              <div className="hidden md:block">
                <p className="font-semibold text-gray-900">{auth.user?.name}</p>
                <div className="flex gap-2 mt-1">
                  {auth.user?.roles &&
                  Array.isArray(auth.user.roles) &&
                  auth.user.roles.length > 0 ? (
                    auth.user.roles.map((role: any) => (
                      <span
                        key={typeof role === 'string' ? role : role.id}
                        className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium"
                      >
                        {typeof role === 'string' ? role : role.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">User</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
