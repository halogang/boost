<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\MenuRolePosition;
use App\Models\User;
use Illuminate\Support\Collection;

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
}
