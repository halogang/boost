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

export default function Sidebar() {
  const { props, url } = usePage<any>();
  const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

  // Get sidebar menus from Inertia share
  const menus = props.navigation?.sidebar || [];

  const isActive = (route: string | null) => {
    if (!route) return false;
    return url.startsWith(`/${route}`);
  };

  const toggleSubmenu = (menuId: number) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const getIconSvg = (iconName: string) => {
    const icons: { [key: string]: string } = {
      'home': 'M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0V5m7 4l7-4',
      'shopping-cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m10 0l2-8',
      'box': 'M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10',
      'users': 'M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z',
      'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M12 15a3 3 0 100-6 3 3 0 000 6z',
      'lock': 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      'database': 'M4 7v10c0 1.1 3.6 2 8 2s8-.9 8-2V7M4 7c0 1.1 3.6 2 8 2s8-.9 8-2m0 5c0 1.1-3.6 2-8 2s-8-.9-8-2',
      'sliders': 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-2a2 2 0 11-4 0 2 2 0 014 0z',
    };
    return icons[iconName] || icons['home'];
  };

  return (
    <aside className="hidden md:flex w-64 bg-gray-900 text-white min-h-screen flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
            A
          </div>
          <div>
            <h2 className="font-bold text-lg">AquaGalon</h2>
            <p className="text-xs text-gray-400">Delivery System</p>
          </div>
        </div>
      </div>

      {/* Menus */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menus.map((menu: MenuItem) => (
          <div key={menu.id}>
            {menu.children && menu.children.length > 0 ? (
              // Menu with children (submenu group)
              <div className="mb-4">
                <button
                  onClick={() => toggleSubmenu(menu.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition justify-between ${
                    menu.children.some(child => isActive(child.route))
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(menu.icon || 'home')} />
                    </svg>
                    <span>{menu.name}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      expandedMenus.includes(menu.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Submenus */}
                {expandedMenus.includes(menu.id) && (
                  <ul className="ml-4 mt-2 space-y-1 border-l border-gray-700 pl-2">
                    {menu.children.map((child: MenuItem) => (
                      <li key={child.id}>
                        {child.route ? (
                          <Link
                            href={route(child.route)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                              isActive(child.route)
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'hover:bg-gray-800'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(child.icon || 'home')} />
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
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition mb-2 ${
                  isActive(menu.route)
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(menu.icon || 'home')} />
                </svg>
                {menu.name}
              </Link>
            ) : null}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}
