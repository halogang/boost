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
  
  // Initialize expanded menus from localStorage
  const [expandedMenus, setExpandedMenus] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_expanded_menus');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  // Get sidebar menus from Inertia share
  const menus = props.navigation?.sidebar || [];
  console.log("{menus}");
  console.log({menus});

  const isActive = (routeName: string | null) => {
    if (!routeName) return false;
    try {
      // Try to use route helper to get the actual path
      const routePath = route(routeName).replace(window.location.origin, '');
      return url === routePath || url.startsWith(routePath + '/');
    } catch (e) {
      // Fallback: try to match by converting route name to path
      // e.g., "users.index" -> "/users" or "settings.profile" -> "/settings/profile"
      const pathFromRoute = routeName.replace(/\./g, '/').replace(/\.index$/, '');
      const normalizedPath = pathFromRoute.startsWith('/') ? pathFromRoute : `/${pathFromRoute}`;
      return url === normalizedPath || url.startsWith(normalizedPath + '/');
    }
  };

  // Helper to check if any child route is active (recursive)
  const hasActiveChild = (children: MenuItem[] | undefined): boolean => {
    if (!children || children.length === 0) return false;
    return children.some(child => {
      if (isActive(child.route)) return true;
      if (child.children && child.children.length > 0) {
        return hasActiveChild(child.children);
      }
      return false;
    });
  };

  const toggleSubmenu = (menuId: number) => {
    setExpandedMenus(prev => {
      const newExpanded = prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebar_expanded_menus', JSON.stringify(newExpanded));
      }
      
      return newExpanded;
    });
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
      'truck': 'M9 12a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM9 12h14m-14 0v8a2 2 0 002 2h10a2 2 0 002-2v-8M9 12V4a2 2 0 012-2h6a2 2 0 012 2v8',
      'shopping-bag': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      'dollar-sign': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'user-circle': 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'shield': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'server': 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
      'user': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      'log-out': 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
      'bell': 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      'list': 'M4 6h16M4 12h16M4 18h16',
    };
    return icons[iconName] || icons['home'];
  };

  return (
    <aside className="hidden md:flex w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-950 dark:to-black text-white min-h-screen flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img
            src="/AJIB-DARKAH-INDONESIA.png"
            alt="Ajib Darkah Indonesia"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h2 className="font-bold text-lg">Ajib Darkah</h2>
            <p className="text-xs text-gray-400">Delivery System</p>
          </div>
        </div>
      </div>

      {/* Menus */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {menus.map((menu: MenuItem) => (
          <div key={menu.id}>
            {menu.children && menu.children.length > 0 ? (
              // Menu with children (submenu group)
              <div className="mb-4">
                <button
                  onClick={() => menu.active && toggleSubmenu(menu.id)}
                  className={`w-full flex items-center gap-3 py-2.5 transition-all duration-200 justify-between relative ${
                    !menu.active
                      ? 'opacity-50 cursor-not-allowed text-gray-500 px-4'
                      : hasActiveChild(menu.children)
                      ? 'bg-primary text-white px-4'
                      : 'hover:bg-gray-800/70 px-4'
                  }`}
                  disabled={!menu.active}
                >
                  {menu.active && hasActiveChild(menu.children) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
                  )}
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(menu.icon || 'home')} />
                    </svg>
                    <span>{menu.name}</span>
                    {!menu.active && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium ml-auto">Segera</span>
                    )}
                  </div>
                  {menu.active && (
                    <svg
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${
                        expandedMenus.includes(menu.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                </button>

                {/* Submenus */}
                {expandedMenus.includes(menu.id) && (
                  <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-700/50 pl-3 py-1">
                    {menu.children.map((child: MenuItem) => (
                      <li key={child.id}>
                        {/* Check if child has children (nested submenu) */}
                        {child.children && child.children.length > 0 ? (
                          <div>
                            <button
                              onClick={() => child.active && toggleSubmenu(child.id)}
                              className={`w-full flex items-center gap-3 py-2 text-sm transition justify-between relative ${
                                !child.active
                                  ? 'opacity-50 cursor-not-allowed text-gray-500 px-4'
                                  : child.children && child.children.some(grandChild => isActive(grandChild.route))
                                  ? 'bg-primary text-white px-4'
                                  : 'hover:bg-gray-800 text-gray-300 px-4'
                              }`}
                              disabled={!child.active}
                            >
                              {child.active && child.children && child.children.some(grandChild => isActive(grandChild.route)) && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                              )}
                              <div className="flex items-center gap-3">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(child.icon || 'home')} />
                                </svg>
                                <span>{child.name}</span>
                                {!child.active && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium ml-auto">Segera</span>
                                )}
                              </div>
                              {child.active && (
                                <svg
                                  className={`w-3 h-3 transition-transform flex-shrink-0 ${
                                    expandedMenus.includes(child.id) ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              )}
                            </button>
                            {/* Nested children (level 3) */}
                            {expandedMenus.includes(child.id) && child.children && (
                              <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-700/50 pl-3 py-1">
                                {child.children.map((grandChild: MenuItem) => (
                                  <li key={grandChild.id}>
                                    {grandChild.route && grandChild.active ? (
                                      <Link
                                        href={route(grandChild.route)}
                                        className={`flex items-center gap-3 py-2 text-xs transition-all duration-200 relative ${
                                          isActive(grandChild.route)
                                            ? 'bg-primary text-white font-semibold px-3'
                                            : 'hover:bg-gray-800/70 text-gray-400 px-3'
                                        }`}
                                      >
                                        {isActive(grandChild.route) && (
                                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                                        )}
                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(grandChild.icon || 'home')} />
                                        </svg>
                                        {grandChild.name}
                                      </Link>
                                    ) : (
                                      <span className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
                                        !grandChild.active ? 'text-gray-500 opacity-50 cursor-not-allowed' : 'text-gray-400'
                                      }`}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(grandChild.icon || 'home')} />
                                        </svg>
                                        {grandChild.name}
                                        {!grandChild.active && (
                                          <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium ml-auto">Segera</span>
                                        )}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          // Regular child (no nested children)
                          <>
                            {child.route && child.active ? (
                              <Link
                                href={route(child.route)}
                                className={`flex items-center gap-3 py-2 text-sm transition-all duration-200 relative ${
                                  isActive(child.route)
                                    ? 'bg-primary text-white font-semibold px-4'
                                    : 'hover:bg-gray-800/70 px-4'
                                }`}
                              >
                                {isActive(child.route) && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                                )}
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(child.icon || 'home')} />
                                </svg>
                                {child.name}
                              </Link>
                            ) : (
                              <span className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                                !child.active ? 'text-gray-500 opacity-50 cursor-not-allowed' : 'text-gray-400'
                              }`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(child.icon || 'home')} />
                                </svg>
                                {child.name}
                                {!child.active && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium ml-auto">Segera</span>
                                )}
                              </span>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : menu.route && menu.active ? (
              // Regular menu with route (active)
              <Link
                href={route(menu.route)}
                className={`flex items-center gap-3 py-2.5 transition-all duration-200 mb-2 relative ${
                  isActive(menu.route)
                    ? 'bg-primary text-white font-semibold px-4'
                    : 'hover:bg-gray-800/70 px-4'
                }`}
              >
                {isActive(menu.route) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                )}
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(menu.icon || 'home')} />
                </svg>
                {menu.name}
              </Link>
            ) : menu.route && !menu.active ? (
              // Regular menu with route (inactive/disabled)
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg mb-2 opacity-50 cursor-not-allowed text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(menu.icon || 'home')} />
                </svg>
                {menu.name}
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium ml-auto">Segera</span>
              </div>
            ) : null}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700/50 mt-auto bg-gray-900/50 backdrop-blur-sm">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 hover:shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}
