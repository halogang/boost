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

export default function MobileBottomNav() {
  const { props, url } = usePage<any>();

  // Get bottom nav menus from Inertia share
  const menus = props.navigation?.bottom || [];

  const isActive = (route: string | null) => {
    if (!route) return false;
    return url.startsWith(`/${route}`);
  };

  const getIconSvg = (iconName: string) => {
    const icons: { [key: string]: string } = {
      'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'shopping-cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 9.4a2 2 0 002 2.6h11.6a2 2 0 002-2.6L18 13',
      'box': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10',
      'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'lock': 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      'database': 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 12c0 2.21 3.582 4 8 4s8-1.79 8-4',
      'sliders': 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    };
    return icons[iconName] || icons['home'];
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around">
        {menus.map((menu: MenuItem) => {
          const active = isActive(menu.route);
          
          return (
            <Link
              key={menu.id}
              href={menu.route ? route(menu.route) : '#'}
              className={`flex flex-col items-center justify-center py-3 px-4 flex-1 transition-colors ${
                active
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg 
                className={`w-6 h-6 ${active ? 'scale-110' : ''} transition-transform`}
                fill={active ? 'currentColor' : 'none'}
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={active ? 0 : 2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d={getIconSvg(menu.icon || 'home')} 
                />
              </svg>
              <span className={`text-xs mt-1 font-medium ${active ? 'font-semibold' : ''}`}>
                {menu.name}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
