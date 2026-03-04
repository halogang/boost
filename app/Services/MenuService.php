<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\MenuPosition;
use App\Models\MenuRolePosition;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class MenuService
{
    /**
     * Get menus filtered by device, position, and user permissions
     *
     * @param string $device 'desktop' or 'mobile'
     * @param string $position 'sidebar', 'bottom', or 'drawer'
     * @param User|null $user
     * @return Collection
     */
    public function getMenus(string $device, string $position, ?User $user = null): Collection
    {
        $userRoleIds = $user ? $user->roles->pluck('id')->toArray() : [];
        
        if (empty($userRoleIds)) {
            // No roles, return empty collection
            return collect();
        }
        
        // Get all menu role positions for user's roles for this device/position
        $rolePositionMenuIds = MenuRolePosition::whereIn('role_id', $userRoleIds)
            ->where('device', $device)
            ->where('position', $position)
            ->pluck('menu_id')
            ->unique()
            ->toArray();
        
        // Check if ANY of user's roles has ANY configuration for this device (any position)
        // This indicates user has accessed the configuration page and submitted the form
        $hasAnyConfigurationForDevice = MenuRolePosition::whereIn('role_id', $userRoleIds)
            ->where('device', $device)
            ->exists();
        
        if ($hasAnyConfigurationForDevice) {
            // User has configured for this device (has accessed the config page and submitted)
            // Use role-specific positions - only show menus that are explicitly assigned
            // If rolePositionMenuIds is empty, user has configured but selected no menus - return empty
            if (empty($rolePositionMenuIds)) {
                // User explicitly unselected all menus for this position, so show nothing
                return collect();
            }
            
            // Show only selected menus (both active and inactive can be selected)
            $query = Menu::with(['children.children.roles', 'children.roles', 'roles'])
                ->mainMenus()
                ->whereIn('id', $rolePositionMenuIds)
                ->orderBy('order');
        } else {
            // No configuration at all for this device - use default behavior (global positions)
            // All users (including super admin) follow the same logic
            $query = Menu::with(['children.children.roles', 'children.roles', 'roles'])
                ->mainMenus()
                ->forPosition($device, $position)
                ->orderBy('order');
        }

        $menus = $query->get();

        // Filter menus based on permissions (super admin will pass because they have all permissions)
        return $menus->filter(function ($menu) use ($user) {
            return $this->canAccessMenu($menu, $user);
        })->map(function ($menu) use ($user) {
            // Load and filter children based on permissions
            // For all users (including super admin): filter children based on permissions
            // Super admin will pass permission check because they have all permissions
            // Load children from database (not from relation, because relation might not be loaded)
            $allChildren = Menu::where('parent_id', $menu->id)
                ->orderBy('order')
                ->get();
            
            $filteredChildren = $allChildren->filter(function ($child) use ($user) {
                return $this->canAccessMenu($child, $user);
            })->map(function ($child) use ($user) {
                // Load and filter nested children (grandchildren) based on permissions
                $nestedChildren = Menu::where('parent_id', $child->id)
                    ->orderBy('order')
                    ->get()
                    ->filter(function ($nestedChild) use ($user) {
                        return $this->canAccessMenu($nestedChild, $user);
                    });
                $child->setRelation('children', $nestedChildren);
                return $child;
            });
            $menu->setRelation('children', $filteredChildren);
            return $menu;
        })->values();
    }

    /**
     * Check if user can access a menu based on permission
     * Note: Inactive menus are still shown but will be styled differently in frontend
     *
     * @param Menu $menu
     * @param User|null $user
     * @return bool
     */
    protected function canAccessMenu(Menu $menu, ?User $user): bool
    {
        // Show all menus (active and inactive) - inactive menus will be styled differently in frontend
        // If menu has no permission requirement, it's public
        if (empty($menu->permission)) {
            return true;
        }

        // If no user is provided, menu is not accessible
        if (!$user) {
            return false;
        }

        // Check if user has the required permission
        // Super admin will pass because they have all permissions (checked via permission system)
        return $user->can($menu->permission);
    }

    /**
     * Get sidebar menus for desktop
     */
    public function getDesktopSidebar(?User $user = null): array
    {
        return $this->getMenus('desktop', 'sidebar', $user)
            ->map(function ($menu) {
                return $this->formatMenuForFrontend($menu);
            })
            ->values()
            ->toArray();
    }

    /**
     * Get bottom navigation menus for mobile
     */
    public function getMobileBottom(?User $user = null): array
    {
        return $this->getMenus('mobile', 'bottom', $user)
            ->map(function ($menu) {
                return $this->formatMenuForFrontend($menu);
            })
            ->values()
            ->toArray();
    }

    /**
     * Get drawer menus for mobile
     */
    public function getMobileDrawer(?User $user = null): array
    {
        return $this->getMenus('mobile', 'drawer', $user)
            ->map(function ($menu) {
                return $this->formatMenuForFrontend($menu);
            })
            ->values()
            ->toArray();
    }

    /**
     * Format menu model to array for frontend
     */
    protected function formatMenuForFrontend($menu): array
    {
        return [
            'id' => $menu->id,
            'name' => $menu->name,
            'icon' => $menu->icon,
            'route' => $menu->route,
            'permission' => $menu->permission,
            'parent_id' => $menu->parent_id,
            'order' => $menu->order,
            'active' => $menu->active,
            'children' => $menu->children ? $menu->children->map(function ($child) {
                return $this->formatMenuForFrontend($child);
            })->values()->toArray() : [],
        ];
    }

    /**
     * Build menu tree structure for frontend
     *
     * @param Collection $menus
     * @return array
     */
    public function buildMenuTree(Collection $menus): array
    {
        return $menus->map(function ($menu) {
            return [
                'id' => $menu->id,
                'name' => $menu->name,
                'key' => $menu->key,
                'icon' => $menu->icon,
                'route' => $menu->route,
                'children' => $this->buildMenuTree($menu->children ?? collect()),
            ];
        })->toArray();
    }

    // =========================================================================
    // ADMIN CRUD
    // =========================================================================

    /**
     * Get all menus (flat list) for admin DataTable.
     */
    public function getAllMenusForAdmin(): Collection
    {
        return Menu::with(['parent', 'positions', 'roles'])
            ->orderBy('parent_id')
            ->orderBy('order')
            ->get();
    }

    /**
     * Get data needed to render the Create form.
     */
    public function getCreateFormData(): array
    {
        return [
            'parents' => Menu::whereNull('parent_id')->get(['id', 'name']),
            'roles'   => Role::orderBy('name')->get(['id', 'name']),
        ];
    }

    /**
     * Get data needed to render the Edit form.
     */
    public function getEditFormData(Menu $menu): array
    {
        $menu->load(['positions', 'roles']);

        $positions = [
            'desktop_sidebar' => $menu->positions->where('device', 'desktop')->where('position', 'sidebar')->isNotEmpty(),
            'mobile_drawer'   => $menu->positions->where('device', 'mobile')->where('position', 'drawer')->isNotEmpty(),
            'mobile_bottom'   => $menu->positions->where('device', 'mobile')->where('position', 'bottom')->isNotEmpty(),
        ];

        return [
            'menu'          => $menu,
            'parents'       => Menu::where('id', '!=', $menu->id)->whereNull('parent_id')->get(['id', 'name']),
            'roles'         => Role::orderBy('name')->get(['id', 'name']),
            'positions'     => $positions,
            'selectedRoles' => $menu->roles->pluck('id')->toArray(),
        ];
    }

    /**
     * Create a new menu with roles and positions.
     */
    public function createMenu(array $data): Menu
    {
        return DB::transaction(function () use ($data) {
            $menu = Menu::create([
                'name'       => $data['name'],
                'icon'       => $data['icon'] ?? null,
                'route'      => $data['route'] ?? null,
                'permission' => $data['permission'] ?? null,
                'parent_id'  => $data['parent_id'] ?? null,
                'order'      => $data['order'] ?? 0,
                'active'     => $data['active'] ?? true,
            ]);

            if (!empty($data['roles'])) {
                $menu->roles()->sync($data['roles']);
            }

            $this->syncMenuPositions($menu, $data['positions'] ?? []);

            return $menu;
        });
    }

    /**
     * Update an existing menu.
     */
    public function updateMenu(Menu $menu, array $data): Menu
    {
        return DB::transaction(function () use ($menu, $data) {
            $menu->update([
                'name'       => $data['name'],
                'icon'       => $data['icon'] ?? null,
                'route'      => $data['route'] ?? null,
                'permission' => $data['permission'] ?? null,
                'parent_id'  => $data['parent_id'] ?? null,
                'order'      => $data['order'] ?? 0,
                'active'     => $data['active'] ?? true,
            ]);

            $menu->roles()->sync($data['roles'] ?? []);
            $this->syncMenuPositions($menu, $data['positions'] ?? []);

            return $menu;
        });
    }

    /**
     * Delete a menu.
     */
    public function deleteMenu(Menu $menu): void
    {
        $menu->delete();
    }

    /**
     * Toggle the active status of a menu.
     */
    public function toggleActive(Menu $menu): Menu
    {
        $menu->update(['active' => !$menu->active]);
        return $menu;
    }

    /**
     * Get menus for the sidebar API (used by /api/menus endpoint).
     */
    public function getMenusForApi(User $user): Collection
    {
        $userRoleIds  = $user->roles->pluck('id')->toArray();
        $isSuperAdmin = $user->hasRole('super admin');

        return Menu::with(['children.children.roles', 'children.roles', 'roles'])
            ->mainMenus()
            ->orderBy('order')
            ->get()
            ->filter(function ($menu) use ($user, $userRoleIds, $isSuperAdmin) {
                if (!$isSuperAdmin) {
                    $menuRoleIds = $menu->roles->pluck('id')->toArray();
                    if (!empty($menuRoleIds) && empty(array_intersect($userRoleIds, $menuRoleIds))) {
                        return false;
                    }
                }

                if ($menu->permission && !$user->hasPermissionTo($menu->permission)) {
                    return false;
                }

                if ($isSuperAdmin) {
                    $allChildren = Menu::with(['children.roles'])
                        ->where('parent_id', $menu->id)
                        ->orderBy('order')
                        ->get()
                        ->map(function ($child) {
                            $nested = Menu::where('parent_id', $child->id)->orderBy('order')->get();
                            $child->setRelation('children', $nested);
                            return $child;
                        });
                    $menu->setRelation('children', $allChildren);
                } else {
                    $menu->setRelation('children', $menu->children->filter(function ($child) use ($user, $userRoleIds) {
                        $childRoleIds = $child->roles->pluck('id')->toArray();
                        if (!empty($childRoleIds) && empty(array_intersect($userRoleIds, $childRoleIds))) {
                            return false;
                        }
                        if ($child->active && $child->permission && !$user->hasPermissionTo($child->permission)) {
                            return false;
                        }
                        $nested = Menu::where('parent_id', $child->id)->orderBy('order')->get()
                            ->filter(function ($n) use ($user, $userRoleIds) {
                                $nRoleIds = $n->roles->pluck('id')->toArray();
                                if (!empty($nRoleIds) && empty(array_intersect($userRoleIds, $nRoleIds))) {
                                    return false;
                                }
                                if ($n->active && $n->permission && !$user->hasPermissionTo($n->permission)) {
                                    return false;
                                }
                                return true;
                            });
                        $child->setRelation('children', $nested);
                        return true;
                    }));
                }

                return true;
            })
            ->values();
    }

    // =========================================================================
    // PRIVATE HELPERS
    // =========================================================================

    /**
     * Sync menu positions (desktop_sidebar, mobile_drawer, mobile_bottom).
     */
    private function syncMenuPositions(Menu $menu, array $positions): void
    {
        $menu->positions()->delete();

        if (!empty($positions['desktop_sidebar'])) {
            MenuPosition::create(['menu_id' => $menu->id, 'device' => 'desktop', 'position' => 'sidebar']);
        }
        if (!empty($positions['mobile_drawer'])) {
            MenuPosition::create(['menu_id' => $menu->id, 'device' => 'mobile', 'position' => 'drawer']);
        }
        if (!empty($positions['mobile_bottom'])) {
            MenuPosition::create(['menu_id' => $menu->id, 'device' => 'mobile', 'position' => 'bottom']);
        }
    }
}
