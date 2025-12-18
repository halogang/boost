import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface MenuItem {
  id: number;
  name: string;
  icon: string;
  route: string | null;
  permission: string | null;
  parent_id: number | null;
  order: number;
  active: boolean;
  children?: MenuItem[];
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menus: MenuItem[];
}

export default function MobileDrawer({ isOpen, onClose, menus }: MobileDrawerProps) {
  const { url } = usePage();
  const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

  const isActive = (route: string | null) => {
    if (!route) return false;
    return url.startsWith(`/${route}`);
  };

  const toggleSubmenu = (menuId: number) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const getIconSvg = (iconName: string) => {
    const icons: { [key: string]: string } = {
      home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'shopping-cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 9.4a2 2 0 002 2.6h11.6a2 2 0 002-2.6L18 13',
      box: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10',
      database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 12c0 2.21 3.582 4 8 4s8-1.79 8-4',
      'file-text': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      sliders: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      server: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
      eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      'log-out': 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    };
    return icons[iconName] || icons['home'];
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
              A
            </div>
            <div>
              <h2 className="font-bold text-lg">AquaGalon</h2>
              <p className="text-xs text-gray-400">Delivery System</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menus */}
        <nav className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
          {menus.map((menu) => (
            <div key={menu.id} className="mb-2">
              {menu.children && menu.children.length > 0 ? (
                // Menu with children (submenu group)
                <div>
                  <button
                    onClick={() => toggleSubmenu(menu.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition justify-between ${
                      menu.children.some((child) => isActive(child.route))
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={getIconSvg(menu.icon)}
                        />
                      </svg>
                      <span className="font-medium">{menu.name}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedMenus.includes(menu.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Submenus */}
                  {expandedMenus.includes(menu.id) && (
                    <ul className="ml-4 mt-2 space-y-1 border-l border-gray-700 pl-2">
                      {menu.children.map((child) => (
                        <li key={child.id}>
                          {child.route ? (
                            <Link
                              href={route(child.route)}
                              onClick={handleLinkClick}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                                isActive(child.route)
                                  ? 'bg-blue-600 text-white font-semibold'
                                  : 'hover:bg-gray-800'
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d={getIconSvg(child.icon)}
                                />
                              </svg>
                              {child.name}
                            </Link>
                          ) : (
                            <span className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-400">
                              {child.name}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : menu.route ? (
                // Regular menu with route
                <Link
                  href={route(menu.route)}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(menu.route)
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={getIconSvg(menu.icon)}
                    />
                  </svg>
                  <span className="font-medium">{menu.name}</span>
                </Link>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
