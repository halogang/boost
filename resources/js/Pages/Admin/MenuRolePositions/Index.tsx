import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';

interface Menu {
  id: number;
  name: string;
  icon: string | null;
  route: string | null;
  parent_id: number | null;
  order: number;
  active: boolean;
  positions: {
    desktop_sidebar: boolean;
    mobile_drawer: boolean;
    mobile_bottom: boolean;
  };
}

interface RoleData {
  id: number;
  name: string;
  menus: Menu[];
}

interface PageProps {
  roles: RoleData[];
}

type PositionType = 'desktop_sidebar' | 'mobile_drawer' | 'mobile_bottom';

const POSITION_LABELS: Record<PositionType, { label: string; description: string; maxItems?: number }> = {
  desktop_sidebar: {
    label: 'Desktop Sidebar',
    description: 'Menu yang tampil di sidebar desktop',
  },
  mobile_drawer: {
    label: 'Mobile Drawer',
    description: 'Menu yang tampil di drawer mobile (untuk menghindari penumpukan di bottom)',
  },
  mobile_bottom: {
    label: 'Mobile Bottom',
    description: 'Menu yang tampil di bottom navigation mobile (maksimal 5 menu untuk UX yang baik)',
    maxItems: 5,
  },
};

export default function Index({ roles: initialRoles = [] }: PageProps) {
  const [activeRoleId, setActiveRoleId] = useState<number | null>(initialRoles[0]?.id || null);
  const [activePosition, setActivePosition] = useState<PositionType>('desktop_sidebar');
  const [localRoles, setLocalRoles] = useState<RoleData[]>(initialRoles);

  const activeRole = localRoles.find(r => r.id === activeRoleId);

  const handleMenuToggle = (menuId: number, position: PositionType, checked: boolean) => {
    if (!activeRole) return;

    const updatedMenus = activeRole.menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          positions: {
            ...menu.positions,
            [position]: checked,
          },
        };
      }
      return menu;
    });

    // Update local state immediately
    setLocalRoles(prevRoles => {
      return prevRoles.map(role => {
        if (role.id === activeRole.id) {
          return {
            ...role,
            menus: updatedMenus,
          };
        }
        return role;
      });
    });

    // Save to backend
    router.post(
      route('menu-role-positions.update', activeRole.id),
      { menus: updatedMenus.map(m => ({ id: m.id, positions: m.positions })) },
      {
        preserveScroll: true,
      }
    );
  };

  const getMenusForPosition = (position: PositionType): Menu[] => {
    if (!activeRole) return [];
    // Show menus that are selected (both active and inactive)
    return activeRole.menus.filter(menu => menu.positions[position]).sort((a, b) => a.order - b.order);
  };

  const countMenusForPosition = (position: PositionType, role?: RoleData): number => {
    const roleToCount = role || activeRole;
    if (!roleToCount) return 0;
    // Count all menus (both active and inactive) that are selected for this position
    return roleToCount.menus.filter(m => m.positions[position]).length;
  };

  // Show all menus (active and inactive) - inactive menus will have badge "Segera"
  const availableMenus = activeRole?.menus.sort((a, b) => a.order - b.order) || [];
  const selectedMenusForPosition = getMenusForPosition(activePosition);
  const positionInfo = POSITION_LABELS[activePosition];

  return (
    <AdminLayout title="Kelola Menu per Role">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Kelola Menu per Role"
            description="Atur menu yang ditampilkan untuk setiap role di sidebar, drawer, dan bottom navigation"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Role Selection - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pilih Role</h3>
              </div>
              <div className="p-2">
                {localRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setActiveRoleId(role.id);
                      setActivePosition('desktop_sidebar'); // Reset to first position when changing role
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                      activeRoleId === role.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{role.name}</div>
                    <div className={`text-xs mt-1 ${activeRoleId === role.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      {countMenusForPosition('desktop_sidebar', role)} sidebar, {countMenusForPosition('mobile_drawer', role)} drawer, {countMenusForPosition('mobile_bottom', role)} bottom
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Position Selection & Menu Management */}
          <div className="lg:col-span-3">
            {activeRole ? (
              <div className="space-y-6">
                {/* Position Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-1 p-2">
                      {(Object.keys(POSITION_LABELS) as PositionType[]).map((position) => {
                        const info = POSITION_LABELS[position];
                        const count = countMenusForPosition(position);
                        const isMaxedOut = info.maxItems && count >= info.maxItems;
                        
                        return (
                          <button
                            key={position}
                            onClick={() => setActivePosition(position)}
                            className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-colors relative ${
                              activePosition === position
                                ? 'bg-primary text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{info.label}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                activePosition === position
                                  ? 'bg-white/20 text-white'
                                  : isMaxedOut
                                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                              }`}>
                                {count}{info.maxItems ? `/${info.maxItems}` : ''}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Position Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {positionInfo.label} - {activeRole.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{positionInfo.description}</p>
                      {positionInfo.maxItems && (
                        <div className={`mt-2 text-sm ${
                          countMenusForPosition(activePosition) > positionInfo.maxItems
                            ? 'text-orange-600 dark:text-orange-400 font-semibold'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {countMenusForPosition(activePosition) > positionInfo.maxItems && (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Warning: {countMenusForPosition(activePosition)} menu dipilih, disarankan maksimal {positionInfo.maxItems} menu.
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected Menus */}
                    {selectedMenusForPosition.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Menu yang Ditampilkan ({selectedMenusForPosition.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedMenusForPosition.map((menu) => (
                            <div
                              key={menu.id}
                              className={`flex items-center justify-between p-3 border rounded-lg ${
                                menu.active
                                  ? 'bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/40'
                                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {menu.icon && (
                                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                                    menu.active
                                      ? 'bg-primary/20'
                                      : 'bg-gray-100 dark:bg-gray-700'
                                  }`}>
                                    <svg className={`w-4 h-4 ${menu.active ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                  </div>
                                )}
                                <span className={`font-medium ${menu.active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                  {menu.name}
                                </span>
                                {!menu.active && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                                    Segera
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleMenuToggle(menu.id, activePosition, false)}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                title="Hapus menu"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Menus to Add */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Pilih Menu untuk Ditambahkan
                      </h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {availableMenus.map((menu) => {
                          const isSelected = menu.positions[activePosition];
                          const selectedIds = selectedMenusForPosition.map(m => m.id);
                          const isMaxedOut = !!(positionInfo.maxItems && selectedIds.length >= positionInfo.maxItems && !isSelected);
                          const isInactiveMenu = !menu.active;

                          return (
                            <div
                              key={menu.id}
                              className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                                isSelected
                                  ? isInactiveMenu
                                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-75'
                                    : 'border-primary bg-primary/5 dark:bg-primary/10'
                                  : isMaxedOut
                                  ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed'
                                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer'
                              }`}
                              onClick={() => {
                                if (!isMaxedOut) {
                                  handleMenuToggle(menu.id, activePosition, !isSelected);
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (!isMaxedOut) {
                                    handleMenuToggle(menu.id, activePosition, !isSelected);
                                  }
                                }}
                                disabled={isMaxedOut}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              {menu.icon && (
                                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                  </svg>
                                </div>
                              )}
                              <span className={`flex-1 font-medium ${
                                isSelected
                                  ? isInactiveMenu
                                    ? 'text-gray-500 dark:text-gray-400'
                                    : 'text-primary dark:text-primary-foreground'
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {menu.name}
                              </span>
                              {!menu.active && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                                  Segera
                                </span>
                              )}
                              {isMaxedOut && (
                                <span className="text-xs text-orange-600 dark:text-orange-400">Maksimal {positionInfo.maxItems} menu</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">Pilih role untuk mulai mengelola menu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
